import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [filieres, setFilieres] = useState([])
  const [enseignants, setEnseignants] = useState([])
  const [nom, setNom] = useState('')
  const [niveau, setNiveau] = useState('')
  const [capacite, setCapacite] = useState('')
  const [filiere, setFiliere] = useState('')
  const [enseignantResponsable, setEnseignantResponsable] = useState('')

  const fetchAll = async () => {
    const [c, f, ens] = await Promise.all([
      fetchAllPaginated(api, 'classes/'),
      fetchAllPaginated(api, 'filieres/'),
      fetchAllPaginated(api, 'utilisateurs/?role=enseignant'),
    ])
    setClasses(c.results)
    setFilieres(f.results)
    setEnseignants(ens.results)
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const payload = {
      nom,
      niveau,
      capacite,
      filiere,
      enseignant_responsable: enseignantResponsable ? Number(enseignantResponsable) : null,
    }
    await api.post('classes/', payload)
    setNom(''); setNiveau(''); setCapacite(''); setFiliere(''); setEnseignantResponsable('')
    fetchAll()
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Classes</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter une classe</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom (ex: L3 Info A)" className="border rounded-lg px-4 py-2" required />
            <input value={niveau} onChange={e => setNiveau(e.target.value)} placeholder="Niveau (ex: Licence 3)" className="border rounded-lg px-4 py-2" required />
            <input value={capacite} onChange={e => setCapacite(e.target.value)} placeholder="Capacité" type="number" className="border rounded-lg px-4 py-2" required />
            <select value={filiere} onChange={e => setFiliere(e.target.value)} className="border rounded-lg px-4 py-2" required>
              <option value="">Choisir une filière</option>
              {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
            <select value={enseignantResponsable} onChange={e => setEnseignantResponsable(e.target.value)} className="border rounded-lg px-4 py-2 col-span-2">
              <option value="">Enseignant responsable (optionnel)</option>
              {enseignants.map((ens) => (
                <option key={ens.id} value={ens.id}>{ens.first_name} {ens.last_name} ({ens.username})</option>
              ))}
            </select>
            <button type="submit" className="col-span-2 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Ajouter</button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nom</th>
                <th className="px-6 py-4 text-left">Niveau</th>
                <th className="px-6 py-4 text-left">Capacité</th>
                <th className="px-6 py-4 text-left">Filière</th>
                <th className="px-6 py-4 text-left">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 font-medium">{c.nom}</td>
                  <td className="px-6 py-4">{c.niveau}</td>
                  <td className="px-6 py-4">{c.capacite}</td>
                  <td className="px-6 py-4">{c.filiere_nom}</td>
                  <td className="px-6 py-4 text-gray-600">{c.enseignant_responsable_nom || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}