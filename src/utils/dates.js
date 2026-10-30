// Date helpers shared by the timeline and the project pop-up. Dates are "YYYY-MM".

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "YYYY-MM" → months since year 0. */
export const toMonthIndex = (date) => {
  const [year, month] = date.split('-').map(Number)
  return year * 12 + (month - 1)
}

export const currentMonthIndex = (now = new Date()) => now.getFullYear() * 12 + now.getMonth()

/** Month index → "Feb 2024". */
export const formatMonth = (index) => `${MONTHS[index % 12]} ${Math.floor(index / 12)}`

/** Months → "4 mos", "1 yr", "1 yr 10 mos". */
export const formatDuration = (months) => {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`)
  if (rest) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`)
  return parts.join(' ') || '< 1 mo'
}

export const isValidMonth = (date) => /^\d{4}-(0[1-9]|1[0-2])$/.test(date ?? '')
