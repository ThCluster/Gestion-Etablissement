import Sidebar from '../components/Sidebar'
import { IconReport } from '../components/Icons'

export default function Rapports() {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 flex flex-col h-screen overflow-hidden">
        <header className="mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <IconReport />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight font-outfit">Rapports & Stats</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-0.5">Analyses globales de l'école</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative">
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] rounded-[2.5rem] flex flex-col items-center justify-center z-10 p-10 text-center">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-100">
                <IconReport />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2">Statistiques avancées en préparation</h2>
             <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                Le module de génération de graphiques interactifs de réussite, de statistiques financières et d'absentéisme est en cours de finalisation.
             </p>
             <div className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200">
                Lancement imminent
             </div>
          </div>

          {/* Graphique et stats factices en arrière-plan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-10 select-none">
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Taux de réussite</span>
                <span className="text-3xl font-black text-slate-700">89.4%</span>
             </div>
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenus Mensuels</span>
                <span className="text-3xl font-black text-slate-700">4,250,000 FCFA</span>
             </div>
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Taux de présence</span>
                <span className="text-3xl font-black text-slate-700">94.2%</span>
             </div>

             <div className="col-span-3 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 h-64 flex items-end justify-between gap-4">
                <div className="w-12 bg-slate-200 rounded-t-xl h-[40%]"></div>
                <div className="w-12 bg-slate-200 rounded-t-xl h-[65%]"></div>
                <div className="w-12 bg-slate-200 rounded-t-xl h-[50%]"></div>
                <div className="w-12 bg-slate-200 rounded-t-xl h-[85%]"></div>
                <div className="w-12 bg-slate-200 rounded-t-xl h-[70%]"></div>
                <div className="w-12 bg-slate-200 rounded-t-xl h-[95%]"></div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
