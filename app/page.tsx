"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Sparkles, Award } from 'lucide-react';
import Image from 'next/image';
import { generateMockData } from './utils/generateMockData';
import { IUserProfile, IUserResponse } from './types/user';



export default function TVDisplay() {
  const [results, setResults] = useState<IUserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [shownNewIds, setShownNewIds] = useState<Set<string>>(new Set());
  const previousResultsRef = useRef<IUserProfile[]>([]);

  // Buscar dados da API a cada 5 segundos
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:3001/results');
        const data = await response.json();

        debugger
        // Enriquecer dados do backend com informações mockadas
        const enrichedData = data.map((item: IUserResponse) => {
          const mockData = generateMockData(item.profession);
          return {
            ...item,
            description: mockData.description,
            salary: mockData.salary,
            tags: mockData.tags
          };
        });

        console.log('Dados buscados:', enrichedData);

        // Detectar novos resultados
        const previousIds = new Set(previousResultsRef.current.map(r => r.id));
        const newResults = enrichedData.filter((r: IUserProfile) => !previousIds.has(r.id));

        if (newResults.length > 0 && previousResultsRef.current.length > 0) {
          // Marcar novos resultados
          const updatedData = enrichedData.map((r: IUserProfile) => ({
            ...r,
            isNew: newResults.some((nr: IUserProfile) => nr.id === r.id) && !shownNewIds.has(r.id)
          }));

          setResults(updatedData);
          setNewCount(newResults.length);
          setShowAchievement(true);

          // Ocultar animação após 3 segundos
          setTimeout(() => setShowAchievement(false), 3000);

          // Ir para o primeiro novo resultado após a animação
          setTimeout(() => {
            const firstNewIndex = updatedData.findIndex((r: IUserProfile) => r.isNew);
            if (firstNewIndex !== -1) {
              setCurrentIndex(firstNewIndex);
            }
          }, 3000);
        } else {
          setResults(enrichedData);
        }

        previousResultsRef.current = enrichedData;
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, [shownNewIds]);

  // Rotacionar entre os resultados com tempo diferenciado
  useEffect(() => {
    if (results.length === 0) return;

    const current = results[currentIndex];
    const isNewResult = current?.isNew && !shownNewIds.has(current.id);
    const displayTime = isNewResult ? 15000 : 5000;

    const interval = setInterval(() => {
      // Marcar o atual como mostrado antes de avançar
      if (current?.isNew && !shownNewIds.has(current.id)) {
        setShownNewIds(prev => new Set([...prev, current.id]));
      }

      // Avançar para o próximo
      setCurrentIndex((prev) => (prev + 1) % results.length);
    }, displayTime);

    return () => clearInterval(interval);
  }, [results.length, currentIndex]);

  if (isLoading || results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-2xl">Aguardando resultados...</p>
        </div>
      </div>
    );
  }

  const current = results[currentIndex];
  const isCurrentNew = current?.isNew && !shownNewIds.has(current.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 overflow-hidden">
      {/* Animação de Conquista */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-12 shadow-2xl border-4 border-yellow-300 relative overflow-hidden"
            >
              {/* Confetes animados */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0, x: 0 }}
                  animate={{
                    opacity: 0,
                    y: Math.random() * 300 - 150,
                    x: Math.random() * 300 - 150,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 2, delay: i * 0.05 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][i % 4] }}
                />
              ))}

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Award className="w-24 h-24 text-white mx-auto mb-4" />
                </motion.div>
                <h2 className="text-5xl font-black text-white mb-2">NOVA{newCount > 1 ? 'S' : ''} PROFISSÃO{newCount > 1 ? 'ÕES' : ''}</h2>
                <h3 className="text-6xl font-black text-white mb-2">DESCOBERTA{newCount > 1 ? 'S' : ''}!</h3>
                <motion.p
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
                  className="text-3xl font-bold text-yellow-100"
                >
                  +{newCount}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='border rounded-3xl border-slate-300 bg-slate-800/50 relative'>
        {/* Badge NOVO */}
        {isCurrentNew && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-8 right-8 z-20"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-6 py-3 shadow-2xl border-2 border-yellow-300 flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-white text-2xl font-black uppercase">NOVO</span>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-3xl p-5 shadow-2xl border-b border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ANÁLISE E DESENVOLVIMENTO DE</h1>
                <h2 className="text-5xl font-black text-white">SISTEMAS</h2>
              </div>
            </div>
            <div className="text-right">
              <h1 className="flex gap-3 text-5xl font-bold text-white items-center">
                <Image
                  src="/new-logo-ulbra.png"
                  alt="Logo ULBRA"
                  width={50}
                  height={50}
                />
                ULBRA
              </h1>
              <h2 className="text-3xl font-black text-white">Torres</h2>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="rounded-b-3xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-0 bg-gradient-to-br from-blue-900/50 to-slate-900/50">
              {/* Coluna Esquerda - Imagem */}
              <div className="relative h-[640px] py-4 px-8">
                <img
                  src={current.userPhoto}
                  alt={current.userName}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-1 left-10 right-8">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 mb-4"
                  >
                    <img
                      src={current.userPhoto}
                      alt={current.userName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-xl bg-white"
                    />
                    <div>
                      <h3 className="text-white text-4xl font-bold">{current.userName}</h3>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Coluna Direita - Informações */}
              <div className="py-4 border-l border-slate-300 flex flex-col justify-between">
                <div>
                  {/* Profissão */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r mx-5 my-2 from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-white text-4xl font-black">{current.profession.split(' ')[0]}</h2>
                        <h2 className="text-white text-4xl font-black">{current.profession.split(' ').slice(1).join(' ')}</h2>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-white rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <hr className="border-slate-300" />

                  {/* Data de início */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-700/50 rounded-xl p-4 mx-6 my-2 flex items-center justify-between"
                  >
                    <span className="text-slate-200 font-semibold">Data de Início</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <CalendarDays className="" />
                          <span className="text-slate-200 text-sm">09 Fev 2026</span>
                          <div className="flex gap-2">
                            {['09', '10', '11', '12', '13'].map((day, i) => (
                              <div
                                key={day}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i === 0
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-slate-200'
                                  }`}
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <hr className="border-slate-300" />

                  {/* Descrição */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mx-6 my-2"
                  >
                    <h3 className="text-white text-2xl font-bold mb-4">{current.profession}</h3>
                    <p className="text-slate-300 text-lg leading-normal">
                      {current.description}
                    </p>
                  </motion.div>

                  <hr className="border-slate-300" />

                  {/* Salários */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mx-6 my-2"
                  >
                    <h4 className="text-white text-xl font-bold mb-4">
                      MÉDIA SALARIAL (MENSAL)
                      <span className="text-slate-400 text-xs font-normal ml-2">
                        *Os valores podem variar conforme a empresa, área de atuação e região.
                      </span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(current.salary).map(([level, value]) => (
                        <div key={level} className="bg-slate-700/50 rounded-xl p-3">
                          <p className="text-blue-400 text-sm font-bold uppercase mb-0.5">{level}</p>
                          <p className="text-white text-xl font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <hr className="border-slate-300" />

                {/* Tags */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex flex-wrap gap-3 mx-6 mt-2">
                    {current.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold uppercase"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicador de progresso */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-8 flex items-center justify-center gap-3"
      >
        {results.map((result, index) => (
          <div
            key={result.id}
            className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex
              ? 'w-16 bg-blue-500'
              : result.isNew && !shownNewIds.has(result.id)
                ? 'w-3 bg-yellow-400'
                : 'w-2 bg-slate-600'
              }`}
          />
        ))}
      </motion.div>

      <p className="text-white text-xl font-bold absolute bottom-6 right-6">
        {results.length} Profissões descobertas!
      </p>
    </div>
  );
}