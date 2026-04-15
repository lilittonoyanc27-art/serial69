import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle2, XCircle, Info, Home, ShoppingBag, Film, TreePine, Palmtree, Utensils, GraduationCap, Briefcase } from 'lucide-react';

interface Question {
  id: number;
  spanish: string;
  armenian: string;
  options: string[];
  correct: string;
  icon: React.ReactNode;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    spanish: "Voy al cine",
    armenian: "Գնում եմ կինո",
    options: ["al cine", "a la cine", "a cine"],
    correct: "al cine",
    icon: <Film className="w-8 h-8" />
  },
  {
    id: 2,
    spanish: "Voy a la tienda",
    armenian: "Գնում եմ խանութ",
    options: ["al tienda", "a la tienda", "a tienda"],
    correct: "a la tienda",
    icon: <ShoppingBag className="w-8 h-8" />
  },
  {
    id: 3,
    spanish: "Voy al parque",
    armenian: "Գնում եմ զբոսայգի",
    options: ["al parque", "a la parque", "a parque"],
    correct: "al parque",
    icon: <TreePine className="w-8 h-8" />
  },
  {
    id: 4,
    spanish: "Voy a la playa",
    armenian: "Գնում եմ լողափ",
    options: ["al playa", "a la playa", "a playa"],
    correct: "a la playa",
    icon: <Palmtree className="w-8 h-8" />
  },
  {
    id: 5,
    spanish: "Voy al restaurante",
    armenian: "Գնում եմ ռեստորան",
    options: ["al restaurante", "a la restaurante", "a restaurante"],
    correct: "al restaurante",
    icon: <Utensils className="w-8 h-8" />
  },
  {
    id: 6,
    spanish: "Voy a la escuela",
    armenian: "Գնում եմ դպրոց",
    options: ["al escuela", "a la escuela", "a escuela"],
    correct: "a la escuela",
    icon: <GraduationCap className="w-8 h-8" />
  },
  {
    id: 7,
    spanish: "Voy al trabajo",
    armenian: "Գնում եմ աշխատանքի",
    options: ["al trabajo", "a la trabajo", "a trabajo"],
    correct: "al trabajo",
    icon: <Briefcase className="w-8 h-8" />
  },
  {
    id: 8,
    spanish: "Voy a casa",
    armenian: "Գնում եմ տուն",
    options: ["al casa", "a la casa", "a casa"],
    correct: "a casa",
    icon: <Home className="w-8 h-8" />
  }
];

export default function SpanishVoyAdventure() {
  const [view, setView] = useState<'intro' | 'theory' | 'play' | 'finish'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIdx];

  const handleOptionSelect = (option: string) => {
    if (feedback) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        setView('finish');
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setView('intro');
    setFeedback(null);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-sans p-4 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl text-center border border-black/5"
          >
            <div className="w-20 h-20 bg-[#5A5A40] rounded-full flex items-center justify-center mx-auto mb-6 text-white">
              <MapPin className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-serif font-light mb-4">Voy a...</h1>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Սովորենք օգտագործել <span className="text-[#5A5A40] font-bold">Voy</span> (Գնում եմ) բայը տարբեր վայրերի հետ:
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setView('theory')}
                className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4a4a35] transition-colors flex items-center justify-center gap-2"
              >
                Սկսել տեսությունից <Info className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('play')}
                className="w-full py-4 border border-[#5A5A40] text-[#5A5A40] rounded-full font-medium hover:bg-[#5A5A40] hover:text-white transition-all"
              >
                Անցնել խաղին
              </button>
            </div>
          </motion.div>
        )}

        {view === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-lg w-full bg-white rounded-[32px] p-8 shadow-xl border border-black/5"
          >
            <h2 className="text-3xl font-serif mb-6 text-center">Ինչպես օգտագործել "Voy"</h2>
            <div className="space-y-6 text-lg">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="font-bold text-orange-800 mb-1">Voy = Գնում եմ</p>
                <p className="text-sm text-orange-700">Ir (գնալ) բայի առաջին դեմքն է:</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <p className="font-bold">Voy a la + իգական վայր</p>
                    <p className="text-sm text-neutral-500 italic">Օրինակ՝ Voy a la tienda (Գնում եմ խանութ)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <p className="font-bold">Voy al + արական վայր</p>
                    <p className="text-sm text-neutral-500 italic">al = a + el</p>
                    <p className="text-sm text-neutral-500 italic">Օրինակ՝ Voy al cine (Գնում եմ կինո)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <p className="font-bold">Voy a casa</p>
                    <p className="text-sm text-neutral-500 italic">Բացառություն՝ "տուն" բառի հետ հոդ չենք դնում:</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView('play')}
                className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4a4a35] transition-colors mt-4"
              >
                Հասկացա, սկսենք!
              </button>
            </div>
          </motion.div>
        )}

        {view === 'play' && (
          <motion.div
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                Հարց {currentIdx + 1} / {QUESTIONS.length}
              </div>
              <div className="text-sm font-bold text-[#5A5A40]">
                Միավորներ: {score}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 relative overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 h-1 bg-neutral-100 w-full">
                <motion.div
                  className="h-full bg-[#5A5A40]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center mb-6 text-[#5A5A40]">
                  {currentQuestion.icon}
                </div>
                <h3 className="text-3xl font-serif mb-2">{currentQuestion.armenian}</h3>
                <div className="flex items-center gap-3 text-2xl text-neutral-400 mb-8">
                  <span>Voy</span>
                  <div className="w-32 h-10 border-b-2 border-dashed border-neutral-300 flex items-center justify-center text-[#5A5A40] font-bold">
                    {selectedOption || "____"}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 w-full">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      disabled={!!feedback}
                      onClick={() => handleOptionSelect(option)}
                      className={`py-4 px-6 rounded-2xl text-lg font-medium transition-all flex items-center justify-between border-2 ${
                        selectedOption === option
                          ? feedback === 'correct'
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-neutral-50 border-transparent hover:border-neutral-200 text-neutral-600'
                      }`}
                    >
                      <span>{option}</span>
                      {selectedOption === option && (
                        feedback === 'correct' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-sm ${
                      feedback === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    <div className={`p-6 rounded-full ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg`}>
                      {feedback === 'correct' ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                    </div>
                    <p className={`mt-4 text-2xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback === 'correct' ? 'Ճիշտ է!' : 'Սխալ է'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {view === 'finish' && (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl text-center border border-black/5"
          >
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-4xl font-serif mb-2">Ապրե՛ս:</h2>
            <p className="text-neutral-500 mb-8">
              Դուք ճիշտ պատասխանեցիք {score}-ին {QUESTIONS.length}-ից:
            </p>
            <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left space-y-2">
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Հիշեցում</p>
              <p className="text-lg">
                <span className="font-bold text-[#5A5A40]">al</span> = a + el (արական)<br/>
                <span className="font-bold text-[#5A5A40]">a la</span> = իգական<br/>
                <span className="font-bold text-[#5A5A40]">a casa</span> = բացառություն
              </p>
            </div>
            <button
              onClick={resetGame}
              className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4a4a35] transition-colors flex items-center justify-center gap-2"
            >
              Կրկնել <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
