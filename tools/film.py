"""Make the three files the site needs for one film, from a finished export.

    python tools/film.py "path/to/G Wagon.mp4" g-wagon --shape tall --preview 3

writes, in public/media/films/:
    g-wagon.mp4          the full film, with sound (plays in the player and on case study pages)
    g-wagon-preview.mp4  a 7-second silent loop from --preview seconds in (plays on its card)
    g-wagon.jpg          a still for before either loads (--poster picks the second, within the preview)

--shape is how the film is framed: wide (16:9), square or tall (9:16, phone edits). Films are
resized to that shape with square pixels, so an export that is stored square but meant to
play tall (as Premiere sometimes writes them) comes out properly tall.

Then add the film to src/content/projects.js.

Needs ffmpeg: on your PATH, set in the FFMPEG environment variable, passed as
--ffmpeg path/to/ffmpeg, or via `pip install imageio-ffmpeg`.
"""
import argparse
import os
import shutil
import subprocess
import sys

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'media', 'films')
SIZES = {  # full film, preview
    'wide': ('1920:1080', '1280:720'),
    'square': ('1080:1080', '960:960'),
    'tall': ('1080:1920', '720:1280'),
}
# Phone edits are full of grain and fast cuts; a cap keeps them near Instagram's own bitrate
# and well under Cloudflare's 25 MB limit per file.
CAPS = {'tall': ['-maxrate', '3.2M', '-bufsize', '6.4M']}


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


def run(ffmpeg, *args):
    subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', *args, '-y'], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('source')
    ap.add_argument('slug', help='file name for the site, e.g. g-wagon')
    ap.add_argument('--shape', choices=SIZES, required=True)
    ap.add_argument('--preview', type=float, default=0, help='second the preview loop starts from')
    ap.add_argument('--poster', type=float, default=0, help='second within the preview to take the still from')
    ap.add_argument('--ffmpeg')
    a = ap.parse_args()

    ffmpeg = find_ffmpeg(a.ffmpeg)
    full, preview = SIZES[a.shape]
    os.makedirs(OUT, exist_ok=True)
    film, loop, still = (os.path.join(OUT, a.slug + end) for end in ('.mp4', '-preview.mp4', '.jpg'))

    run(ffmpeg, '-i', a.source, '-vf', f'scale={full},setsar=1', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
        *CAPS.get(a.shape, []), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart', film)
    run(ffmpeg, '-ss', str(a.preview), '-i', a.source, '-t', '7', '-an', '-vf', f'scale={preview},setsar=1,fps=30',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', loop)
    run(ffmpeg, '-ss', str(a.poster), '-i', loop, '-frames:v', '1', '-q:v', '3', still)

    for f in (film, loop, still):
        print(f'{os.path.relpath(f)}  {os.path.getsize(f) / 1048576:.1f} MB')


if __name__ == '__main__':
    main()
