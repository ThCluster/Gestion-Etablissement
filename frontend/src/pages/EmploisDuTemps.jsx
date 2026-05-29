import Sidebar from '../components/Sidebar'
import { IconSchedule } from '../components/Icons'

export default function EmploisDuTemps() {
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const heures = ['08h00 - 10h00', '10h00 - 12h00', '12h00 - 14h00', '14h00 - 16h00', '16h00 - 18h00']

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 flex flex-col h-screen overflow-hidden">
        <header className="mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <IconSchedule />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight font-outfit">Emplois du temps</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-0.5">Calendrier des cours</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative">
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] rounded-[2.5rem] flex flex-col items-center justify-center z-10 p-10 text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-100">
                <IconSchedule />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2">Module en cours de développement</h2>
             <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                L'éditeur d'emploi du temps interactif avec gestion automatique des conflits de salles et d'enseignants arrive très prochainement.
             </p>
             <div className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-200">
                Bientôt disponible
             </div>
          </div>

          {/* Grille factice en arrière-plan pour faire joli */}
          <div className="grid grid-cols-7 gap-4 opacity-10 select-none">
             <div className="font-bold text-xs text-slate-400 uppercase py-2">Heure</div>
             {jours.map(j => <div key={j} className="font-bold text-xs text-slate-400 uppercase py-2 text-center">{j}</div>)}

             {heures.map(h => (
               <>
                 <div key={h} className="text-[10px] font-bold text-slate-500 py-6 border-t border-slate-100">{h}</div>
                 {jours.map(j => (
                   <div key={j} className="bg-slate-50 border border-slate-100 rounded-xl p-3 border-t border-slate-100 flex flex-col justify-between">
                     <span className="font-bold text-slate-700 text-[10px]">Matière</span>
                     <span className="text-[8px] text-slate-400">Salle 102</span>
                   </div>
                 ))}
               </>
             ))}
          </div>
        </div>
      </main>
    </div>
  )
}
