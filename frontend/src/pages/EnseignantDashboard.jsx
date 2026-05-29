import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { IconSchool, IconBook, IconNotes, IconUsers, IconCalendar } from '../components/Icons'

export default function EnseignantDashboard() {
  const [stats, setStats] = useState({ classes: [], matieres: 0, totalEleves: 0 })
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClasses, resMatieres, resEleves] = await Promise.all([
          api.get('classes/'), // L'API filtre déjà pour l'enseignant
          api.get('matieres/'),
          api.get('utilisateurs/?role=eleve'),
        ])
        setStats({
          classes: resClasses.data.results || [],
          matieres: resMatieres.data.count,
          totalEleves: resEleves.data.count,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Espace Pédagogique</h1>
            <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Bonjour, Prof. {user.last_name}</p>
          </div>
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Effectif Total</p>
            <p className="text-xl font-black">{stats.totalEleves} Élèves</p>
          </div>
        </div>

        {/* Mes Classes Interactives */}
        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
           <span className="text-indigo-500"><IconSchool /></span> Vos Classes Responsables
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.classes.map(classe => (
            <div key={classe.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
               <h3 className="text-2xl font-black text-slate-800 mb-1">{classe.nom}</h3>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{classe.filiere_nom}</p>
               
               <div className="flex gap-3">
                  <Link 
                    to={`/eleves?search=${classe.nom}`}
                    className="bg-slate-100 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                  >
                    Voir Élèves
                  </Link>
                  <Link 
                    to={`/notes?search=${classe.nom}`}
                    className="bg-slate-100 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                  >
                    Gérer Notes
                  </Link>
               </div>
            </div>
          ))}
          {stats.classes.length === 0 && !loading && (
            <p className="text-slate-400 italic">Aucune classe affectée pour le moment.</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6">Actions Pédagogiques</h2>
            <div className="grid grid-cols-2 gap-4">
               <Link to="/notes" className="p-6 bg-slate-50 rounded-2xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all flex flex-col items-center">
                  <div className="text-indigo-600 mb-2"><IconNotes /></div>
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-600">Saisir des Notes</span>
               </Link>
               <Link to="/absences" className="p-6 bg-slate-50 rounded-2xl hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all flex flex-col items-center">
                  <div className="text-orange-600 mb-2"><IconCalendar /></div>
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-600">Appel Journalier</span>
               </Link>
            </div>
          </div>

          <div className="bg-[#0F172A] p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
             <h2 className="text-xl font-black mb-4">Note d'information</h2>
             <p className="text-slate-400 text-sm leading-relaxed">
               Les conseils de classe débuteront la semaine prochaine. Merci de vous assurer que toutes les notes du trimestre sont bien saisies avant vendredi 18h.
             </p>
             <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">DIR</div>
                <p className="text-xs font-bold text-slate-300">Direction de l'Établissement</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
