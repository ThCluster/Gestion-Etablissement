/**
 * Récupère toutes les pages d'une liste paginée DRF (results + next).
 * @param {import('axios').AxiosInstance} client instance axios (ex. api)
 * @param {string} path chemin relatif, ex. '/notes/' ou '/comptes/?role=eleve'
 * @returns {Promise<{ results: unknown[], count: number }>}
 */
export async function fetchAllPaginated(client, path) {
  const first = await client.get(path)
  let results = [...(first.data.results ?? [])]
  let next = first.data.next
  const count = first.data.count ?? results.length

  while (next) {
    const res = await client.get(next)
    results = results.concat(res.data.results ?? [])
    next = res.data.next
  }

  return { results, count }
}
