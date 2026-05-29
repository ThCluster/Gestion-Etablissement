import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'

export default function Paiements() {
  const [paiements, setPaiements] = useState([])
  const [eleves, setEleves] = useState([])
  const [form, setForm] = useState({ utilisateur: '', type_paiement: 'scolarite', montant: '', statut: 'en_attente', reference: '', date_paiement: '' })

  const fetchAll = async () => {
    const [p, e] = await Promise.all([
      fetchAllPaginated(api, 'paiements/'),
      fetchAllPaginated(api, 'utilisateurs/?role=eleve'),
    ])
    setPaiements(p.results)
    setEleves(e.results)
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('paiements/', form)
    fetchAll()
  }
  const genererRecu = async (id, reference) => {
    try {
      const res = await api.get(`rapport/recu/${id}/`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `recu_${reference}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Paiements</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter un paiement</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-3 gap-4">
            <select value={form.utilisateur} onChange={e => setForm({...form, utilisateur: e.target.value})} className="border rounded-lg px-4 py-2" required>
              <option value="">Choisir un élève</option>
              {eleves.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </select>
            <select value={form.type_paiement} onChange={e => setForm({...form, type_paiement: e.target.value})} className="border rounded-lg px-4 py-2">
              <option value="scolarite">Scolarité</option>
              <option value="inscription">Inscription</option>
              <option value="cantine">Cantine</option>
              <option value="transport">Transport</option>
            </select>
            <input value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} placeholder="Montant" type="number" className="border rounded-lg px-4 py-2" required />
            <input value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} placeholder="Référence (ex: PAY-002)" className="border rounded-lg px-4 py-2" required />
            <input value={form.date_paiement} onChange={e => setForm({...form, date_paiement: e.target.value})} type="date" className="border rounded-lg px-4 py-2" required />
            <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})} className="border rounded-lg px-4 py-2">
              <option value="en_attente">En attente</option>
              <option value="paye">Payé</option>
              <option value="annule">Annulé</option>
            </select>
            <button type="submit" className="col-span-3 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Ajouter</button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Élève</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Montant</th>
                <th className="px-6 py-4 text-left">Référence</th>
                <th className="px-6 py-4 text-left">Statut</th>
                <th className="px-6 py-4 text-left">Reçu</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4">{p.utilisateur_nom}</td>
                  <td className="px-6 py-4">{p.type_display}</td>
                  <td className="px-6 py-4 font-bold">{p.montant} FCFA</td>
                  <td className="px-6 py-4">{p.reference}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.statut === 'paye' ? 'bg-green-100 text-green-700' : p.statut === 'annule' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.statut_display}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  <button type="button" onClick={() => genererRecu(p.id, p.reference)} className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600">Reçu</button>
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