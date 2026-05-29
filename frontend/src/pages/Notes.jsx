import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [matieres, setMatieres] = useState([])
  const [eleves, setEleves] = useState([])
  const [form, setForm] = useState({ utilisateur: '', matiere: '', note: '', note_max: 20, date_evaluation: '', commentaire: '' })

  const [searchTerm, setSearchTerm] = useState('')

  const fetchAll = async () => {
    const params = new URLSearchParams(window.location.search)
    const initialSearch = params.get('search')
    if (initialSearch) setSearchTerm(initialSearch)

    const [n, m, e] = await Promise.all([
      fetchAllPaginated(api, 'notes/'),
      fetchAllPaginated(api, 'matieres/'),
      fetchAllPaginated(api, 'utilisateurs/?role=eleve'),
    ])
    setNotes(n.results)
    setMatieres(m.results)
    setEleves(e.results)
  }

  useEffect(() => { fetchAll() }, [])

  const filteredNotes = notes.filter(n => 
    n.utilisateur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.matiere_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('notes/', form)
    fetchAll()
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notes</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter une note</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-3 gap-4">
            <select value={form.utilisateur} onChange={e => setForm({...form, utilisateur: e.target.value})} className="border rounded-lg px-4 py-2" required>
              <option value="">Choisir un élève</option>
              {eleves.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </select>
            <select value={form.matiere} onChange={e => setForm({...form, matiere: e.target.value})} className="border rounded-lg px-4 py-2" required>
              <option value="">Choisir une matière</option>
              {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
            <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Note" type="number" step="0.01" className="border rounded-lg px-4 py-2" required />
            <input value={form.date_evaluation} onChange={e => setForm({...form, date_evaluation: e.target.value})} type="date" className="border rounded-lg px-4 py-2" required />
            <input value={form.commentaire} onChange={e => setForm({...form, commentaire: e.target.value})} placeholder="Commentaire" className="border rounded-lg px-4 py-2" />
            <button type="submit" className="bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Ajouter</button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-gray-800">Liste des Notes</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Rechercher un élève ou une matière..." 
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
                <th className="px-6 py-4 text-left">Matière</th>
                <th className="px-6 py-4 text-left">Note</th>
                <th className="px-6 py-4 text-left text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((n, i) => (
                <tr key={n.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4">{n.utilisateur_nom}</td>
                  <td className="px-6 py-4">{n.matiere_nom}</td>
                  <td className="px-6 py-4 font-bold text-blue-900">{n.note}/{n.note_max}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{n.date_evaluation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}