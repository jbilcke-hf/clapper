export function normalizeName(name: string) {
  const normalizedName = `${name || ""}`.trim().toLowerCase()

  return normalizedName
}

