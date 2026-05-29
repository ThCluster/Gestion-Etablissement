import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'
import { IconUsers, IconSearch, IconNotes, IconCalendar } from '../components/Icons'

export default function Eleves() {
  const [eleves, setEleves] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const initialSearch = params.get('search')
      if (initialSearch) setSearchTerm(initialSearch)

      const { results } = await fetchAllPaginated(api, 'utilisateurs/?role=eleve')
      setEleves(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const filteredEleves = eleves.filter(e => 
    e.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.classe_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const genererBulletin = async (id, username) => {
    try {
      const res = await api.get(`rapport/bulletin/${id}/`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `bulletin_${username}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header avec recherche globale */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10">
           <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96 group focus-within:border-blue-400 focus-within:bg-white transition-all">
              <span className="text-slate-400 group-focus-within:text-blue-500"><IconSearch /></span>
              <input 
                type="text" 
                placeholder="Chercher par nom, matricule ou classe..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3">
              <div className="text-right">
                 <p className="text-xs font-black text-slate-800 tracking-tight">Liste des Élèves</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredEleves.length} Inscrits</p>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-10">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Élève</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matricule</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classe / Parent</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Moyenne</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Absences</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paiement</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredEleves.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                             {e.photo ? (
                               <img src={e.photo} alt="" className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-slate-400 font-black text-xs">{e.first_name[0]}{e.last_name[0]}</span>
                             )}
                          </div>
                          <div>
                             <p className="font-bold text-slate-800 text-sm">{e.first_name} {e.last_name}</p>
                             <p className="text-[10px] text-slate-400 font-medium">{e.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">{e.matricule || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-700">{e.classe_nom}</p>
                       <p className="text-[10px] text-slate-400 font-medium italic">Par: {e.parent_nom || 'Non défini'}</p>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${e.moyenne >= 10 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <span className={`font-black text-sm ${e.moyenne >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>{e.moyenne || '0.00'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-sm font-bold text-slate-600">{e.absences_count} j</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter ${e.statut_paiement === 'regle' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {e.statut_paiement === 'regle' ? 'Réglé' : 'Retard'}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <Link to={`/notes?search=${e.first_name}`} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all" title="Notes">
                             <IconNotes />
                          </Link>
                          <Link to={`/absences?search=${e.first_name}`} className="p-2 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-xl transition-all" title="Absences">
                             <IconCalendar />
                          </Link>
                          <button onClick={() => genererBulletin(e.id, e.username)} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all" title="Bulletin PDF">
                             📄
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEleves.length === 0 && !loading && (
              <div className="p-20 text-center">
                 <p className="text-slate-400 font-bold italic">Aucun élève ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}