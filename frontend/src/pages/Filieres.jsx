import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'

export default function Filieres() {
  const [filieres, setFilieres] = useState([])
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')

  const fetchFilieres = async () => {
    const { results } = await fetchAllPaginated(api, 'filieres/')
    setFilieres(results)
  }

  useEffect(() => { fetchFilieres() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('filieres/', { nom, description })
    setNom('')
    setDescription('')
    fetchFilieres()
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Filières</h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter une filière</h2>
          <form onSubmit={handleCreate} className="flex gap-4">
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de la filière"
              className="border rounded-lg px-4 py-2 flex-1"
              required
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border rounded-lg px-4 py-2 flex-1"
            />
            <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
              Ajouter
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Nom</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filieres.map((f, i) => (
                <tr key={f.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4">{f.id}</td>
                  <td className="px-6 py-4 font-medium">{f.nom}</td>
                  <td className="px-6 py-4 text-gray-500">{f.description || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${f.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {f.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}