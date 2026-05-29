import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'

async function downloadPdf(path, filename) {
  const res = await api.get(path, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export default function MonEspace() {
  const [notes, setNotes] = useState([])
  const [absences, setAbsences] = useState([])
  const [paiements, setPaiements] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [n, a, p] = await Promise.all([
          fetchAllPaginated(api, 'notes/'),
          fetchAllPaginated(api, 'absences/'),
          fetchAllPaginated(api, 'paiements/'),
        ])
        setNotes(n.results)
        setAbsences(a.results)
        setPaiements(p.results)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const [searchTerm, setSearchTerm] = useState('')

  const filteredNotes = notes.filter(n => 
    n.matiere_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const moyenne = notes.length > 0 
    ? (notes.reduce((acc, curr) => acc + Number(curr.note), 0) / notes.length).toFixed(2)
    : '—'
  
  const tauxPresence = absences.length === 0 ? 100 : Math.max(0, 100 - (absences.length * 5))
  const totalPaye = paiements.filter(p => p.statut === 'paye').reduce((acc, curr) => acc + Number(curr.montant), 0)

  const genererBulletin = async () => {
    if (!user?.id) return
    try {
      await downloadPdf(`rapport/bulletin/${user.id}/`, `bulletin_${user.username || user.id}.pdf`)
    } catch (err) { console.error(err) }
  }

  const genererCertificat = async () => {
    if (!user?.id) return
    try {
      await downloadPdf(`rapport/certificat/${user.id}/`, `certificat_${user.username || user.id}.pdf`)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="gradient-blue text-white px-8 py-6 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🎓</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Mon Espace Réussite</h1>
            <p className="text-blue-100 text-sm font-medium opacity-80">{user.first_name} {user.last_name} — {user.role}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={genererBulletin} className="glass hover:bg-white/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            📄 Bulletin PDF
          </button>
          <button onClick={handleLogout} className="bg-red-500/80 hover:bg-red-500 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Moyenne Générale</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-5xl font-black ${Number(moyenne) >= 10 ? 'text-blue-600' : 'text-rose-500'}`}>{moyenne}</span>
              <span className="text-slate-300 font-bold">/ 20</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Assiduité</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-emerald-500">{tauxPresence}%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Scolarité Payée</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-800">{totalPaye.toLocaleString()}</span>
              <span className="text-slate-400 text-sm font-bold ml-1">FCFA</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800">📝 Mes Notes</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filtrer par matière..." 
                  className="pl-4 pr-4 py-1.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 w-40"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="p-0">
              {filteredNotes.length === 0 ? <p className="p-8 text-slate-400">Aucune note trouvée</p> : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black">
                    <tr><th className="px-8 py-3">Matière</th><th className="px-8 py-3">Score</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredNotes.map(n => (
                      <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-bold text-slate-700">{n.matiere_nom}</td>
                        <td className="px-8 py-4"><span className="font-black text-blue-600">{n.note}</span>/20</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800">📅 Absences</h2>
            </div>
            <div className="p-0">
              {absences.length === 0 ? <p className="p-8 text-slate-400">Aucune absence</p> : (
                <div className="divide-y divide-gray-50">
                  {absences.map(a => (
                    <div key={a.id} className="px-8 py-4 flex justify-between items-center">
                      <span className="font-bold text-slate-700">{a.date}</span>
                      <span className="text-[10px] font-black uppercase bg-rose-50 text-rose-600 px-3 py-1 rounded-lg">{a.statut}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}