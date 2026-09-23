// Plain helpers shared by the site's brief form, the emails and the server
// (no React here), so the rules are the same everywhere.
import { contact } from '../content/contact.js'

const { nodes, fields, options, letter } = contact

// Field keys in the order they appear in the letter.
export const order = letter.flat().filter(p => typeof p === 'object').map(p => p.field)

export const blankValues = () => Object.fromEntries(Object.keys(fields).map(k => [k, '']))

const checks = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  website: v => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v),
}
export const isValid = (key, v) => !v.trim() || !checks[key] || checks[key](v.trim())

// { field: 'missing' | 'invalid' } for every answer that isn't right yet.
export function fieldErrors(values) {
  const errors = {}
  for (const key of order) {
    if (fields[key].required && !values[key].trim()) errors[key] = 'missing'
    else if (!isValid(key, values[key])) errors[key] = 'invalid'
  }
  return errors
}

// How complete one row of the brief is: 'done' | 'pending' | 'optional' | 'invalid'
export function nodeState(node, values, errors = {}) {
  if (node.fields.some(k => errors[k])) return 'invalid'
  const required = node.fields.filter(k => fields[k].required)
  if (!required.length) return node.fields.some(k => values[k].trim()) ? 'done' : 'optional'
  const complete = required.every(k => values[k].trim()) && node.fields.every(k => isValid(k, values[k]))
  return complete ? 'done' : 'pending'
}

export const statesFor = (values, errors = {}) => Object.fromEntries(nodes.map(n => [n.id, nodeState(n, values, errors)]))

// Server side: keep only known fields, trim them, cap their length, and make sure
// choices are one of the real options. Returns clean values plus any errors.
const LIMITS = { message: 5000 }
export function cleanBrief(input) {
  const values = blankValues()
  for (const key of Object.keys(fields)) {
    const raw = typeof input?.[key] === 'string' ? input[key] : ''
    values[key] = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, LIMITS[key] ?? 300)
  }
  const errors = fieldErrors(values)
  for (const [key, f] of Object.entries(fields)) {
    if (f.type === 'choice' && values[key] && !options[f.options].some(o => o.value === values[key])) errors[key] = 'invalid'
  }
  return { values, errors }
}

// How one answer reads in the brief: choices use their short wording.
export function display(key, values) {
  const v = values[key]?.trim()
  if (!v) return ''
  const f = fields[key]
  return f.type === 'choice' ? options[f.options].find(o => o.value === v)?.short ?? v : v
}

// How one answer reads inside a sentence: choices use their phrase ("a launch video").
export function phrase(key, values) {
  const v = values[key]?.trim()
  if (!v) return ''
  const f = fields[key]
  return f.type === 'choice' ? options[f.options].find(o => o.value === v)?.phrase ?? v : v
}

// The rows of the brief, in order: [{ id, label, value }]
export const briefRows = values =>
  nodes.map(n => ({ id: n.id, label: n.short, value: n.fields.map(k => display(k, values)).filter(Boolean).join(', ') }))
