"""Turn a song into sound-wave levels for the site (no audio is kept).

    python tools/levels.py path/to/song.mp3 public/media/levels/song.lvl

It measures how loud each part of the sound spectrum is, 30 times a second, from the
deepest bass to the highest shimmer (16 bands), and saves just those numbers. The
Sonic Vision sound wave replays them on a loop, so the bars move exactly like the song
while nothing actually plays.

Needs Python with numpy, plus ffmpeg: either on your PATH, set in the FFMPEG
environment variable, passed as --ffmpeg path/to/ffmpeg, or via `pip install imageio-ffmpeg`.

File format (.lvl): b'LVL1', frames per second (1 byte), bands (1 byte),
frame count (4 bytes, little-endian), then one byte (0–255) per band per frame.
"""
import argparse
import os
import shutil
import struct
import subprocess
import sys

import numpy as np

RATE = 22050   # plenty for level analysis
FPS = 30
BANDS = 16
LOW, HIGH = 45, 11000  # Hz: from the bass up to the shimmer


def find_ffmpeg(given):
    if given:
        return given
    if os.environ.get('FFMPEG'):
        return os.environ['FFMPEG']
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        pass
    found = shutil.which('ffmpeg')
    if found:
        return found
    sys.exit('Could not find ffmpeg. Install it, set FFMPEG, pass --ffmpeg, or `pip install imageio-ffmpeg`.')


def decode(path, ffmpeg):
    """The song as mono samples, via ffmpeg (works for mp3, m4a, wav, flac, video files…)."""
    out = subprocess.run(
        [ffmpeg, '-v', 'error', '-i', path, '-vn', '-ac', '1', '-ar', str(RATE), '-f', 'f32le', '-'],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(out, dtype=np.float32)


def analyse(samples):
    hop = RATE // FPS
    size = 2048
    window = np.hanning(size).astype(np.float32)
    padded = np.concatenate([np.zeros(size // 2, np.float32), samples, np.zeros(size, np.float32)])
    frames = max(1, (len(samples)) // hop)
    freqs = np.fft.rfftfreq(size, 1 / RATE)
    edges = np.geomspace(LOW, HIGH, BANDS + 1)
    bins = [np.where((freqs >= edges[i]) & (freqs < edges[i + 1]))[0] for i in range(BANDS)]
    # Make sure the narrow bass bands always have at least one frequency bin.
    bins = [b if len(b) else np.array([np.argmin(np.abs(freqs - edges[i]))]) for i, b in enumerate(bins)]

    levels = np.zeros((frames, BANDS), np.float32)
    for f in range(frames):
        chunk = padded[f * hop: f * hop + size]
        if len(chunk) < size:
            chunk = np.pad(chunk, (0, size - len(chunk)))
        spectrum = np.abs(np.fft.rfft(chunk * window))
        levels[f] = [np.sqrt(np.mean(spectrum[b] ** 2)) for b in bins]

    # Loudness on a log scale (how we hear it), then each band scaled against its own
    # loudest moments across the whole song, so quiet parts stay quiet and drops hit hard.
    levels = np.log1p(levels * 20)
    floor = np.percentile(levels, 12, axis=0)
    peak = np.percentile(levels, 98, axis=0)
    levels = np.clip((levels - floor) / np.maximum(peak - floor, 1e-6), 0, 1) ** 0.85
    return levels


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('song')
    ap.add_argument('out')
    ap.add_argument('--ffmpeg')
    args = ap.parse_args()

    samples = decode(args.song, find_ffmpeg(args.ffmpeg))
    if not len(samples):
        sys.exit('No audio found in that file.')
    levels = analyse(samples)
    data = (levels * 255).round().astype(np.uint8)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, 'wb') as fh:
        fh.write(b'LVL1' + struct.pack('<BBI', FPS, BANDS, len(data)) + data.tobytes())
    seconds = len(data) / FPS
    print(f'{args.out}: {seconds // 60:.0f}:{seconds % 60:04.1f} of levels, {BANDS} bands at {FPS} fps, '
          f'{os.path.getsize(args.out) / 1024:.0f} KB')


if __name__ == '__main__':
    main()
