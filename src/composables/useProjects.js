// Project data: one JSON per project in assets/JSONs/projects/ (files starting with "_" are skipped).
import { experience } from '../assets/JSONs/experience.json'
import { isValidMonth } from '../utils/dates.js'

const files = import.meta.glob('../assets/JSONs/projects/[!_]*.json', { eager: true, import: 'default' })

export const projects = Object.values(files)

const byId = new Map(projects.map((p) => [p.id, p]))

export const projectById = (id) => byId.get(id)

export const experienceById = (id) => experience.find((e) => e.id === id) ?? null

/** Projects of one experience, oldest first. */
export const projectsOfExperience = (experienceId) =>
  projects
    .filter((p) => p.experienceId === experienceId)
    .sort((a, b) => (a.start ?? '').localeCompare(b.start ?? ''))

function validate() {
  const seen = new Set()
  const experienceIds = new Set(experience.map((e) => e.id))
  for (const [file, p] of Object.entries(files)) {
    const name = file.split('/').pop()
    if (!p.id) console.warn(`[projects] ${name}: missing "id"`)
    if (!p.title) console.warn(`[projects] ${name}: missing "title"`)
    if (seen.has(p.id)) console.warn(`[projects] ${name}: duplicate id "${p.id}"`)
    seen.add(p.id)
    if (p.experienceId && !experienceIds.has(p.experienceId)) {
      console.warn(`[projects] ${name}: unknown experienceId "${p.experienceId}"`)
    }
    for (const key of ['start', 'end']) {
      if (p[key] && !isValidMonth(p[key])) console.warn(`[projects] ${name}: bad ${key} date "${p[key]}"`)
    }
  }
}

if (import.meta.env.DEV) validate()
