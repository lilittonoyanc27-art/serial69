import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Play, SkipForward, RotateCcw, Volume2, MessageSquare, Languages, Sparkles } from 'lucide-react';

interface DialogueLine {
  character?: string;
  armenian: string;
  spanish: string;
}

const SCRIPT: DialogueLine[] = [
  {
    armenian: "(Իզաբելը մոտենում է Ֆրանսիսկոյին այնքան մոտ, որ նա զգում է Իզաբելի օծանելիքի և թարմ ուրցի խառնուրդը:)",
    spanish: "(Isabel se acerca a Francisco tan cerca que él siente la mezcla del perfume de Isabel y el tomillo fresco.)"
  },
  {
    character: "Isabel",
    armenian: "(աչքերից կայծեր արձակելով)",
    spanish: "(echando chispas por los ojos)"
  },
  {
    character: "Isabel",
    armenian: "— ¡Traidor! (Դավաճա՛ն:)",
    spanish: "— ¡Traidor! (Դավաճա՛ն:)"
  },
  {
    character: "Isabel",
    armenian: "Ուրեմն դու Մարիային տվել ես թեյնիկը, իսկ ինձ՝ միայն տերևը՞",
    spanish: "Entonces le diste la tetera a María, ¿y a mí solo la hoja?"
  },
  {
    character: "Isabel",
    armenian: "Դու գիտե՞ս, թե ես քանի տարի եմ փորձել այդ տերևով թեյ եփել առանց թեյնիկի:",
    spanish: "¿Sabes cuántos años he intentado preparar té con esa hoja sin tetera?"
  },
  {
    character: "Isabel",
    armenian: "Ես ստիպված էի օգտագործել իտալական սուրճի մեքենան, Ֆրանսիսկո՛:",
    spanish: "Tuve que usar una cafetera italiana, ¡Francisco!"
  },
  {
    character: "María",
    armenian: "(մեդալիոնը սեղմելով կրծքին)",
    spanish: "(apretando el medallón contra su pecho)"
  },
  {
    character: "María",
    armenian: "— ¡No le escuches! (Մի՛ լսիր նրան:)",
    spanish: "— ¡No le escuches! (Մի՛ լսիր նրան:)"
  },
  {
    character: "María",
    armenian: "Ֆրանսիսկո, դու ինձ ասել ես, որ այս թեյնիկը քո տատիկի օժիտն է:",
    spanish: "Francisco, me dijiste que esta tetera era la dote de tu abuela."
  },
  {
    character: "María",
    armenian: "Իսկ հիմա պարզվում է, որ սա Իզաբելի տերևի «երկրորդ կեսն» է՞:",
    spanish: "¿Y ahora resulta que es la “segunda mitad” de la hoja de Isabel?"
  },
  {
    character: "Francisco",
    armenian: "(հուսահատված փորձում է հավաքել գաթայի փշրանքները հատակից)",
    spanish: "(intentando desesperadamente recoger las migas de gata del suelo)"
  },
  {
    character: "Francisco",
    armenian: "— Լսե՛ք, ամեն ինչ այդքան պարզ չէ:",
    spanish: "— Escuchen, no todo es tan simple."
  },
  {
    character: "Francisco",
    armenian: "1982 թվականին, երբ ես Երևանում էի, մի ծերունի Կասկադում ինձ ասաց.",
    spanish: "En 1982, cuando estaba en Ereván, un anciano en el Cascada me dijo:"
  },
  {
    character: "Francisco",
    armenian: "«Ով տիրում է թեյնիկին՝ տիրում է խոհանոցին, բայց ով տիրում է տերևին՝ տիրում է հոգուն»:",
    spanish: "“Quien posee la tetera, posee la cocina; pero quien posee la hoja, posee el alma”."
  },
  {
    character: "Francisco",
    armenian: "Ես պարզապես ուզում էի հավասարակշռություն պահպանել:",
    spanish: "Yo solo quería mantener el equilibrio."
  },
  {
    character: "Giuseppe",
    armenian: "(հանկարծ սկսում է բարձր ծիծաղել և հանում է իր գրպանից մի երրորդ առարկա)",
    spanish: "(de repente empieza a reírse a carcajadas y saca un tercer objeto de su bolsillo)"
  },
  {
    character: "Giuseppe",
    armenian: "— Դուք բոլորդ հիմար եք:",
    spanish: "— Todos ustedes son tontos."
  },
  {
    character: "Giuseppe",
    armenian: "Թեյնիկը և տերևը ոչինչ են առանց...",
    spanish: "La tetera y la hoja no son nada sin…"
  },
  {
    character: "Giuseppe",
    armenian: "ՇԱՔԱՐԱՄԱՆԻ:",
    spanish: "¡LA AZUCARERA!"
  },
  {
    armenian: "(Բոլորը քարանում են: Ջուզեպպեի ձեռքում փայլում է մի փոքրիկ արծաթե շաքարաման:)",
    spanish: "(Todos se quedan paralizados. En la mano de Giuseppe brilla una pequeña azucarera de plata.)"
  },
  {
    character: "Pablo",
    armenian: "— ¡No puede ser!",
    spanish: "— ¡No puede ser!"
  },
  {
    character: "Pablo",
    armenian: "Ջուզեպպե, դա նույնպե՞ս «Էրեբունի» գործարանի արտադրանք է:",
    spanish: "Giuseppe, ¿eso también es un producto de la fábrica “Erebuni”?"
  },
  {
    character: "Giuseppe",
    armenian: "— Ավելին: Սա Սևանի ափին գտնված գանձ է:",
    spanish: "— Más aún: es un tesoro encontrado en la orilla del Sevan."
  },
  {
    character: "Giuseppe",
    armenian: "Եթե մենք միացնենք երեքը, թեյը կդառնա շատ քաղցր",
    spanish: "Si unimos los tres, el té se volverá muy dulce."
  },
  {
    character: "Isabel",
    armenian: "(դադարում է բղավել և սկսում է մտածել)",
    spanish: "(deja de gritar y empieza a pensar)"
  },
  {
    character: "Isabel",
    armenian: "— Իսկ որտե՞ղ է ուրցը, Ֆրանսիսկո:",
    spanish: "— ¿Y dónde está el tomillo, Francisco?"
  },
  {
    character: "Isabel",
    armenian: "Առանց իսկական ուրցի այդ ամբողջ մետաղը պարզապես ջարդոն է:",
    spanish: "Sin tomillo real, todo ese metal es simplemente chatarra."
  },
  {
    character: "Francisco",
    armenian: "(դանդաղ բարձրանում է, հայացքը ուղղում պատուհանից դուրս՝ դեպի Մադրիդի տանիքները)",
    spanish: "(se levanta lentamente y dirige la mirada por la ventana hacia los tejados de Madrid)"
  },
  {
    character: "Francisco",
    armenian: "— Ուրցը... ուրցը գտնվում է մի վայրում, որտեղ ոչ ոք չի համարձակվի փնտրել:",
    spanish: "— El tomillo… el tomillo está en un lugar donde nadie se atreverá a buscar."
  },
  {
    character: "María",
    armenian: "— ¡Vámonos! (Գնացի՛նք:)",
    spanish: "— ¡Vámonos! (Գնացի՛նք:)"
  },
  {
    character: "María",
    armenian: "Մենք պետք է գտնենք այդ տուփը:",
    spanish: "Tenemos que encontrar esa caja."
  },
  {
    armenian: "(Հանկարծ միջանցքից լսվում է բարձրակրունկ կոշիկների ձայն: Դուռը բացվում է և ներս է մտնում մի խորհրդավոր կին՝ սև ակնոցներով:)",
    spanish: "(De repente se oyen pasos de tacones desde el pasillo. La puerta se abre y entra una mujer misteriosa con gafas negras.)"
  },
  {
    character: "Mujer misteriosa",
    armenian: "— Ոչ մի տեղ էլ չեք գնա: Ուրցը արդեն ինձ մոտ է:",
    spanish: "— No irán a ninguna parte. El tomillo ya está conmigo."
  },
  {
    character: "Todos",
    armenian: "— ¡¡¡CONTINUARÁ...!!! (ՇԱՐՈՒՆԱԿԵԼԻ...)",
    spanish: "— ¡¡¡CONTINUARÁ...!!! (ՇԱՐՈՒՆԱԿԵԼԻ...)"
  }
];

export default function SpanishTelenovela() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [lang, setLang] = useState<'hy' | 'es'>('hy');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying && step < SCRIPT.length - 1) {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (step === SCRIPT.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step]);

  const currentLine = SCRIPT[step];

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-red-500/30 overflow-hidden flex flex-col">
      {/* Cinematic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900/10 blur-[150px] rounded-full" />
      </div>

      {/* Header / TV Frame Top */}
      <header className="relative z-20 p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight">📺 Սերիալ / Serie</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-black animate-pulse">On Air: La Tetera de Erebuni</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(l => l === 'hy' ? 'es' : 'hy')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-medium"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === 'hy' ? 'Հայերեն' : 'Español'}
          </button>
          <button 
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`p-2 rounded-full transition-colors ${showSubtitles ? 'bg-red-600 text-white' : 'bg-white/5 text-white/40'}`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main TV Screen Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group"
          >
            {/* Fake Video Content / Character Visualizer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            
            {/* Character Name Overlay */}
            {currentLine.character && (
              <div className="absolute top-8 left-8 z-10">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-px w-8 bg-red-600" />
                  <span className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
                    {currentLine.character}
                  </span>
                </motion.div>
              </div>
            )}

            {/* Subtitles Area */}
            {showSubtitles && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-24 text-center z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className={`font-serif leading-tight drop-shadow-lg ${!currentLine.character ? 'text-xl md:text-3xl italic text-white/70' : 'text-2xl md:text-5xl font-medium'}`}>
                    {lang === 'hy' ? currentLine.armenian : currentLine.spanish}
                  </p>
                  <p className={`font-light italic ${!currentLine.character ? 'text-sm md:text-lg text-white/30' : 'text-sm md:text-xl text-white/40'}`}>
                    {lang === 'hy' ? currentLine.spanish : currentLine.armenian}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Static Noise Overlay (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>
        </AnimatePresence>

        {/* Script History */}
        <div className="mt-8 w-full max-w-5xl h-32 overflow-y-auto pr-4 custom-scrollbar" ref={scrollRef}>
          <div className="space-y-2 opacity-40">
            {SCRIPT.slice(0, step).map((line, i) => (
              <div key={i} className="text-xs flex gap-4 border-l border-white/10 pl-4 py-1">
                {line.character && <span className="font-bold text-red-500 w-20 shrink-0 uppercase tracking-tighter">{line.character}:</span>}
                <span className={!line.character ? 'italic text-white/60' : ''}>{lang === 'hy' ? line.armenian : line.spanish}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Control Bar */}
      <footer className="relative z-20 p-8 bg-black/60 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/40 hover:bg-red-500 transition-all active:scale-95 group"
          >
            {isPlaying ? (
              <div className="flex gap-1.5">
                <div className="w-1.5 h-6 bg-white rounded-full animate-pulse" />
                <div className="w-1.5 h-6 bg-white rounded-full animate-pulse delay-75" />
              </div>
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={() => setStep(Math.min(SCRIPT.length - 1, step + 1))}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 max-w-md w-full px-8">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-red-600"
              initial={false}
              animate={{ width: `${((step + 1) / SCRIPT.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/40">
          <Volume2 className="w-5 h-5" />
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-black uppercase tracking-widest">Drama Mode</span>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
