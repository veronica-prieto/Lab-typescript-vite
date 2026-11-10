export type Student = {
  id: number
  name: string
  scores: number[]
}

export function safeParse(json: string): unknown {
  try {
    return JSON.parse(json)
  } catch {
    return undefined
  }
}

export function isStudent(x: unknown): x is Student {
  if (typeof x !== 'object' || x === null) return false

  const obj = x as Record<string, unknown>

  return (
    typeof obj.id === 'number' &&
    Number.isFinite(obj.id) &&
    typeof obj.name === 'string' &&
    obj.name.trim() !== '' &&
    Array.isArray(obj.scores) &&
    obj.scores.length > 0 &&
    obj.scores.every((s) => typeof s === 'number' && Number.isFinite(s))
  )
}

export function average(nums: number[]): number {
  if (nums.length === 0) return 0
  const total = nums.reduce((acc, n) => acc + n, 0)
  return total / nums.length
}
