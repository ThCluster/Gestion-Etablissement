import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'
import { IconTeacher, IconSearch, IconBook, IconNotes } from '../components/Icons'

export default function Professeurs() {
  const [profs, setProfs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const { results } = await fetchAllPaginated(api, 'utilisateurs/?role=enseignant')
      setProfs(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const filteredProfs = profs.filter(p => 
    p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telephone?.includes(searchTerm)
  )

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10">
           <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96 group focus-within:border-blue-400 focus-within:bg-white transition-all">
              <span className="text-slate-400 group-focus-within:text-blue-500"><IconSearch /></span>
              <input 
                type="text" 
                placeholder="Chercher un professeur ou un numéro..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="text-right">
              <p className="text-xs font-black text-slate-800 tracking-tight">Corps Enseignant</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredProfs.length} Professeurs</p>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-10">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enseignant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matières</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classes</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProfs.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-xs border-2 border-white shadow-sm">
                             {p.first_name[0]}{p.last_name[0]}
                          </div>
                          <div>
                             <p className="font-bold text-slate-800 text-sm">{p.first_name} {p.last_name}</p>
                             <p className="text-[10px] text-slate-400 font-medium">{p.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-wrap gap-1">
                          {p.matieres_prof?.map((m, i) => (
                             <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{m}</span>
                          ))}
                          {(!p.matieres_prof || p.matieres_prof.length === 0) && <span className="text-slate-300 italic text-[10px]">Aucune</span>}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-wrap gap-1">
                          {p.classes_prof?.map((c, i) => (
                             <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{c}</span>
                          ))}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       {p.classes_prof?.length > 0 ? (
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter">Principal</span>
                       ) : (
                          <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter">Standard</span>
                       )}
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">
                       {p.telephone || '—'}
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-xl transition-all">⚙️</button>
                          <button className="p-2 hover:bg-rose-50 text-rose-400 rounded-xl transition-all">🗑️</button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
