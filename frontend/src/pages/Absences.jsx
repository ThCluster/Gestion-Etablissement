import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'

export default function Absences() {
  const [absences, setAbsences] = useState([])
  const [eleves, setEleves] = useState([])
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({ utilisateur: '', classe: '', date: '', statut: 'absent', motif: '' })

  const [searchTerm, setSearchTerm] = useState('')

  const fetchAll = async () => {
    const params = new URLSearchParams(window.location.search)
    const initialSearch = params.get('search')
    if (initialSearch) setSearchTerm(initialSearch)

    const [a, e, c] = await Promise.all([
      fetchAllPaginated(api, 'absences/'),
      fetchAllPaginated(api, 'utilisateurs/?role=eleve'),
      fetchAllPaginated(api, 'classes/'),
    ])
    setAbsences(a.results)
    setEleves(e.results)
    setClasses(c.results)
  }

  useEffect(() => { fetchAll() }, [])

  const filteredAbsences = absences.filter(a => 
    a.utilisateur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.classe_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('absences/', form)
    fetchAll()
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Absences</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter une absence</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-3 gap-4">
            <select value={form.utilisateur} onChange={e => setForm({...form, utilisateur: e.target.value})} className="border rounded-lg px-4 py-2" required>
              <option value="">Choisir un élève</option>
              {eleves.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </select>
            <select value={form.classe} onChange={e => setForm({...form, classe: e.target.value})} className="border rounded-lg px-4 py-2" required>
              <option value="">Choisir une classe</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} type="date" className="border rounded-lg px-4 py-2" required />
            <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})} className="border rounded-lg px-4 py-2">
              <option value="absent">Absent</option>
              <option value="retard">En retard</option>
              <option value="excuse">Excusé</option>
              <option value="present">Présent</option>
            </select>
            <input value={form.motif} onChange={e => setForm({...form, motif: e.target.value})} placeholder="Motif" className="border rounded-lg px-4 py-2" />
            <button type="submit" className="bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Ajouter</button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-gray-800">Liste des Absences</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Chercher élève ou classe..." 
                className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Élève</th>
                <th className="px-6 py-4 text-left">Classe</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Statut</th>
                <th className="px-6 py-4 text-left">Motif</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsences.map((a, i) => (
                <tr key={a.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4">{a.utilisateur_nom}</td>
                  <td className="px-6 py-4">{a.classe_nom}</td>
                  <td className="px-6 py-4">{a.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.statut === 'absent' ? 'bg-red-100 text-red-700' : a.statut === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4">{a.motif || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}