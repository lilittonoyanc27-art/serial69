import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  RotateCcw, 
  User, 
  Sword, 
  Shield, 
  ChevronRight, 
  Star,
  Zap,
  HelpCircle,
  History
} from 'lucide-react';

// --- Types ---
type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type Color = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: Color;
  id: string;
}

interface Square {
  row: number;
  col: number;
}

interface Question {
  q: string;
  options: string[];
  correct: string;
  translation: string;
}

// --- Constants & Data ---
const QUESTIONS: Question[] = [
  { q: "¿____ estás?", options: ["Donde", "Adonde", "De donde"], correct: "Donde", translation: "Որտե՞ղ ես:" },
  { q: "¿____ vas?", options: ["Donde", "Adonde", "De donde"], correct: "Adonde", translation: "Ու՞ր ես գնում:" },
  { q: "¿____ eres?", options: ["Donde", "Adonde", "De donde"], correct: "De donde", translation: "Որտեղի՞ց ես:" },
  { q: "¿____ vives?", options: ["Donde", "Adonde", "De donde"], correct: "Donde", translation: "Որտե՞ղ էս ապրում:" },
  { q: "¿____ vienes?", options: ["Donde", "Adonde", "De donde"], correct: "De donde", translation: "Որտեղի՞ց ես գալիս:" },
  { q: "¿____ caminamos?", options: ["Donde", "Adonde", "De donde"], correct: "Adonde", translation: "Ու՞ր ենք քայլում:" },
  { q: "¿____ está el libro?", options: ["Donde", "Adonde", "De donde"], correct: "Donde", translation: "Որտե՞ղ է գիրքը:" },
  { q: "¿____ viajas?", options: ["Donde", "Adonde", "De donde"], correct: "Adonde", translation: "Ու՞ր ես ճամփորդում:" },
  { q: "¿____ es este vino?", options: ["Donde", "Adonde", "De donde"], correct: "De donde", translation: "Որտեղի՞ց է այս գինին:" },
  { q: "¿____ trabajas?", options: ["Donde", "Adonde", "De donde"], correct: "Donde", translation: "Որտե՞ղ ես աշխատում:" },
];

const INITIAL_PIECES: (Piece | null)[][] = [
  [
    { type: 'rook', color: 'black', id: 'br1' }, { type: 'knight', color: 'black', id: 'bn1' }, { type: 'bishop', color: 'black', id: 'bb1' }, { type: 'queen', color: 'black', id: 'bq' },
    { type: 'king', color: 'black', id: 'bk' }, { type: 'bishop', color: 'black', id: 'bb2' }, { type: 'knight', color: 'black', id: 'bn2' }, { type: 'rook', color: 'black', id: 'br2' }
  ],
  Array(8).fill(null).map((_, i) => ({ type: 'pawn', color: 'black', id: `bp${i}` })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map((_, i) => ({ type: 'pawn', color: 'white', id: `wp${i}` })),
  [
    { type: 'rook', color: 'white', id: 'wr1' }, { type: 'knight', color: 'white', id: 'wn1' }, { type: 'bishop', color: 'white', id: 'wb1' }, { type: 'queen', color: 'white', id: 'wq' },
    { type: 'king', color: 'white', id: 'wk' }, { type: 'bishop', color: 'white', id: 'wb2' }, { type: 'knight', color: 'white', id: 'wn2' }, { type: 'rook', color: 'white', id: 'wr2' }
  ],
];

const PIECE_ICONS: Record<PieceType, string> = {
  pawn: '♟',
  rook: '♜',
  knight: '♞',
  bishop: '♝',
  queen: '♛',
  king: '♚'
};

export default function SpanishChessAdventure() {
  const [board, setBoard] = useState<(Piece | null)[][]>(INITIAL_PIECES);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [turn, setTurn] = useState<Color>('white');
  const [view, setView] = useState<'intro' | 'play' | 'question' | 'finish'>('intro');
  const [pendingMove, setPendingMove] = useState<{ from: Square, to: Square } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [winner, setWinner] = useState<Color | null>(null);
  const [captured, setCaptured] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [inCheck, setInCheck] = useState<Color | null>(null);

  // --- Path Checking Logic ---
  const isPathClear = (from: Square, to: Square): boolean => {
    const rowStep = to.row === from.row ? 0 : (to.row > from.row ? 1 : -1);
    const colStep = to.col === from.col ? 0 : (to.col > from.col ? 1 : -1);

    let currRow = from.row + rowStep;
    let currCol = from.col + colStep;

    while (currRow !== to.row || currCol !== to.col) {
      if (board[currRow][currCol]) return false;
      currRow += rowStep;
      currCol += colStep;
    }
    return true;
  };

  const isValidMove = (from: Square, to: Square, piece: Piece): boolean => {
    const target = board[to.row][to.col];
    if (target && target.color === piece.color) return false;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        if (colDiff === 0) {
          if (to.row === from.row + direction && !target) return true;
          if (from.row === startRow && to.row === from.row + 2 * direction && !target && !board[from.row + direction][from.col]) return true;
        } 
        // Capture
        else if (colDiff === 1 && to.row === from.row + direction && target) {
          return true;
        }
        return false;

      case 'rook':
        if (rowDiff === 0 || colDiff === 0) {
          return isPathClear(from, to);
        }
        return false;

      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'bishop':
        if (rowDiff === colDiff) {
          return isPathClear(from, to);
        }
        return false;

      case 'queen':
        if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
          return isPathClear(from, to);
        }
        return false;

      case 'king':
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (view !== 'play' || turn !== 'white' || winner) return;

    const piece = board[row][col];

    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }

      const selectedPiece = board[selectedSquare.row][selectedSquare.col];
      if (selectedPiece && isValidMove(selectedSquare, { row, col }, selectedPiece)) {
        setPendingMove({ from: selectedSquare, to: { row, col } });
        setCurrentQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
        setView('question');
        return;
      }
    }

    if (piece && piece.color === turn) {
      setSelectedSquare({ row, col });
    } else {
      setSelectedSquare(null);
    }
  };

  const isKingInCheck = (color: Color, currentBoard: (Piece | null)[][]): boolean => {
    let kingPos: Square | null = null;
    currentBoard.forEach((row, r) => {
      row.forEach((p, c) => {
        if (p?.type === 'king' && p.color === color) {
          kingPos = { row: r, col: c };
        }
      });
    });

    if (!kingPos) return false;

    // Check if any opponent piece can move to kingPos
    let isCheck = false;
    currentBoard.forEach((row, r) => {
      row.forEach((p, c) => {
        if (p && p.color !== color) {
          // Temporarily use a simplified isValidMove that doesn't rely on state
          if (canPieceMove(p, { row: r, col: c }, kingPos!, currentBoard)) {
            isCheck = true;
          }
        }
      });
    });
    return isCheck;
  };

  const canPieceMove = (piece: Piece, from: Square, to: Square, currentBoard: (Piece | null)[][]): boolean => {
    const target = currentBoard[to.row][to.col];
    if (target && target.color === piece.color) return false;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    const checkPath = (f: Square, t: Square): boolean => {
      const rStep = t.row === f.row ? 0 : (t.row > f.row ? 1 : -1);
      const cStep = t.col === f.col ? 0 : (t.col > f.col ? 1 : -1);
      let cr = f.row + rStep;
      let cc = f.col + cStep;
      while (cr !== t.row || cc !== t.col) {
        if (currentBoard[cr][cc]) return false;
        cr += rStep; cc += cStep;
      }
      return true;
    };

    switch (piece.type) {
      case 'pawn':
        const dir = piece.color === 'white' ? -1 : 1;
        const startR = piece.color === 'white' ? 6 : 1;
        if (colDiff === 0 && to.row === from.row + dir && !target) return true;
        if (colDiff === 0 && from.row === startR && to.row === from.row + 2 * dir && !target && !currentBoard[from.row + dir][from.col]) return true;
        if (colDiff === 1 && to.row === from.row + dir && target) return true;
        return false;
      case 'rook': return (rowDiff === 0 || colDiff === 0) && checkPath(from, to);
      case 'knight': return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      case 'bishop': return rowDiff === colDiff && checkPath(from, to);
      case 'queen': return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && checkPath(from, to);
      case 'king': return rowDiff <= 1 && colDiff <= 1;
      default: return false;
    }
  };

  const executeMove = (from: Square, to: Square) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    const target = newBoard[to.row][to.col];

    if (target) {
      setCaptured(prev => ({
        ...prev,
        [target.color]: [...prev[target.color as keyof typeof prev], target]
      }));
      if (target.type === 'king') {
        setWinner(piece?.color || null);
        setView('finish');
      }
    }

    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
    setBoard(newBoard);
    setLastMove({ from, to });
    
    // Check for check
    const nextTurn = turn === 'white' ? 'black' : 'white';
    if (isKingInCheck(nextTurn, newBoard)) {
      setInCheck(nextTurn);
    } else {
      setInCheck(null);
    }

    setSelectedSquare(null);
    setTurn(nextTurn);
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;

    const isCorrect = option === currentQuestion?.correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      if (pendingMove) {
        executeMove(pendingMove.from, pendingMove.to);
      }
      setView('play');
    }, 1500);
  };

  // --- AI Logic ---
  const makeAIMove = useCallback(() => {
    if (turn !== 'black' || view !== 'play' || winner) return;

    const blackPieces: { from: Square, piece: Piece }[] = [];
    board.forEach((row, r) => {
      row.forEach((p, c) => {
        if (p && p.color === 'black') {
          blackPieces.push({ from: { row: r, col: c }, piece: p });
        }
      });
    });

    // Simple AI: Prioritize captures, then random valid move
    const captureMoves: { from: Square, to: Square }[] = [];
    const regularMoves: { from: Square, to: Square }[] = [];

    blackPieces.forEach(bp => {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (isValidMove(bp.from, { row: r, col: c }, bp.piece)) {
            if (board[r][c]) {
              captureMoves.push({ from: bp.from, to: { row: r, col: c } });
            } else {
              regularMoves.push({ from: bp.from, to: { row: r, col: c } });
            }
          }
        }
      }
    });

    const move = captureMoves.length > 0 
      ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
      : regularMoves[Math.floor(Math.random() * regularMoves.length)];

    if (move) {
      setTimeout(() => {
        executeMove(move.from, move.to);
      }, 1000);
    }
  }, [board, turn, view, winner]);

  useEffect(() => {
    if (turn === 'black' && view === 'play') {
      makeAIMove();
    }
  }, [turn, view, makeAIMove]);

  const resetGame = () => {
    setBoard(INITIAL_PIECES);
    setSelectedSquare(null);
    setTurn('white');
    setView('intro');
    setWinner(null);
    setCaptured({ white: [], black: [] });
    setLastMove(null);
    setInCheck(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col items-center justify-center p-4">
      
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl w-full text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-block p-6 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
                <Sword className="w-16 h-16 text-blue-500" />
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic">
                CHESS <span className="text-blue-500">BATTLE</span>
              </h1>
              <p className="text-neutral-400 font-bold text-lg uppercase tracking-widest">
                Մարտահրավեր նետիր <span className="text-white">Ernesto de Lopez</span>-ին:
              </p>
            </div>

            <button 
              onClick={() => setView('play')}
              className="px-12 py-6 bg-white text-black rounded-full font-black text-2xl uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-2xl"
            >
              ՍԿՍԵԼ ԽԱՂԸ
            </button>
          </motion.div>
        )}

        {(view === 'play' || view === 'question') && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl flex flex-col lg:flex-row items-start gap-8"
          >
            {/* Left: Stats & Captured */}
            <div className="w-full lg:w-72 space-y-4">
              <div className={`p-6 rounded-3xl border-2 transition-all ${turn === 'black' ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10 opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8" />
                  <div>
                    <div className="text-[10px] font-black uppercase opacity-50">Opponent</div>
                    <div className="font-black italic">Ernesto de Lopez</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {captured.white.map((p, i) => (
                    <span key={i} className="text-xl opacity-60">{PIECE_ICONS[p.type]}</span>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-3xl border-2 transition-all ${turn === 'white' ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10 opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8" />
                  <div>
                    <div className="text-[10px] font-black uppercase opacity-50">Player</div>
                    <div className="font-black italic">ԴՈՒ</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {captured.black.map((p, i) => (
                    <span key={i} className="text-xl opacity-60 text-white">{PIECE_ICONS[p.type]}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <History className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">Turn Status</span>
                </div>
                <div className={`text-lg font-black uppercase tracking-tighter ${turn === 'white' ? 'text-purple-400 animate-pulse' : 'text-blue-400'}`}>
                  {turn === 'white' ? 'Ձեր քայլն է' : 'Ernesto-ն մտածում է...'}
                </div>
                {inCheck && (
                  <div className="mt-2 px-4 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-bounce">
                    ՇԱԽ {inCheck === 'white' ? 'ՁԵԶ' : 'ERNESTO-ԻՆ'}
                  </div>
                )}
              </div>
            </div>

            {/* Center: 2D Board */}
            <div className="flex-1 flex justify-center">
              <div className="bg-neutral-800 p-2 rounded-xl shadow-2xl border-4 border-white/5">
                <div className="grid grid-cols-8 gap-0.5">
                  {board.map((row, r) => (
                    row.map((piece, c) => {
                      const isDark = (r + c) % 2 === 1;
                      const isSelected = selectedSquare?.row === r && selectedSquare?.col === c;
                      const isLastMove = (lastMove?.from.row === r && lastMove?.from.col === c) || (lastMove?.to.row === r && lastMove?.to.col === c);
                      const canMoveHere = selectedSquare && isValidMove(selectedSquare, { row: r, col: c }, board[selectedSquare.row][selectedSquare.col]!);
                      
                      return (
                        <div
                          key={`${r}-${c}`}
                          onClick={() => handleSquareClick(r, c)}
                          className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl cursor-pointer transition-all relative ${
                            isDark ? 'bg-neutral-700' : 'bg-neutral-600'
                          } ${isSelected ? 'bg-blue-500/50 ring-2 ring-blue-400 inset-0' : ''} ${isLastMove ? 'bg-yellow-500/20' : ''} ${canMoveHere ? 'after:content-[""] after:w-3 after:h-3 after:bg-emerald-400/40 after:rounded-full' : ''}`}
                        >
                          {piece && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={piece.color === 'white' ? 'text-white drop-shadow-lg' : 'text-black drop-shadow-[0_0_1px_rgba(255,255,255,0.8)]'}
                            >
                              {PIECE_ICONS[piece.type]}
                            </motion.span>
                          )}
                          {c === 0 && <span className="absolute left-0.5 top-0.5 text-[8px] opacity-30 font-black">{8 - r}</span>}
                          {r === 7 && <span className="absolute right-0.5 bottom-0.5 text-[8px] opacity-30 font-black">{String.fromCharCode(97 + c)}</span>}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Question Card */}
            <AnimatePresence>
              {view === 'question' && currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full lg:w-80 bg-white text-black rounded-3xl p-6 shadow-2xl relative"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px]">
                      <HelpCircle className="w-4 h-4" />
                      Battle Question
                    </div>
                    
                    <h2 className="text-2xl font-black italic leading-tight">
                      {currentQuestion.q.split('____').map((part, i) => (
                        <React.Fragment key={i}>
                          {part}
                          {i === 0 && <span className="text-blue-600 underline decoration-2 mx-1">?</span>}
                        </React.Fragment>
                      ))}
                    </h2>
                    
                    <p className="text-neutral-400 font-bold italic text-sm border-t border-neutral-100 pt-4">
                      {currentQuestion.translation}
                    </p>

                    <div className="space-y-2">
                      {currentQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          disabled={!!feedback}
                          onClick={() => handleAnswer(opt)}
                          className={`w-full py-3 rounded-xl font-black text-lg transition-all border-b-4 ${
                            feedback === 'correct' && opt === currentQuestion.correct
                              ? 'bg-emerald-500 border-emerald-700 text-white'
                              : feedback === 'wrong' && opt !== currentQuestion.correct
                              ? 'bg-neutral-50 border-neutral-200 text-neutral-300 opacity-40'
                              : 'bg-neutral-100 border-neutral-300 text-neutral-900 hover:bg-blue-600 hover:text-white hover:border-blue-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {feedback && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className={`flex items-center justify-center gap-2 font-black uppercase text-[10px] ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {feedback === 'correct' ? <Zap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        {feedback === 'correct' ? 'ՃԻՇՏ Է!' : 'ՍԽԱԼ Է! ՔԱՅԼԸ ՉԵՂԱՐԿՎԵՑ'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {view === 'finish' && (
          <motion.div 
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white text-black rounded-[3rem] p-12 text-center shadow-2xl"
          >
            <Trophy className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-4xl font-black uppercase italic mb-2">
              {winner === 'white' ? 'ԴՈՒ ՀԱՂԹԵՑԻՐ!' : 'ERNESTO-Ն ՀԱՂԹԵՑ'}
            </h2>
            <p className="text-neutral-500 font-bold mb-8 uppercase tracking-widest">
              {winner === 'white' ? 'Շախմատային մարտը ավարտված է:' : 'Փորձիր նորից:'}
            </p>
            <button 
              onClick={resetGame}
              className="w-full py-5 bg-blue-600 text-white rounded-full font-black text-xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
            >
              ՆՈՐԻՑ ԽԱՂԱԼ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
