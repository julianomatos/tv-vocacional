"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IUserProfile } from './types/user';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';

export default function TVDisplay() {
  const [results, setResults] = useState<IUserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar dados da API a cada 5 segundos
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:3001/results?_sort=createdAt&_order=desc');
        const data = await response.json();
        setResults(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotacionar entre os resultados a cada 12 segundos
  useEffect(() => {
    if (results.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % results.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [results.length]);

  if (isLoading || results.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-2xl">Aguardando resultados...</p>
        </div>
      </div>
    );
  }

  const current = results[currentIndex];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6 overflow-hidden">
      <div className='border rounded-3xl border-slate-300 bg-slate-800/50'>
        {/* Header */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-linear-to-r from-blue-600 to-blue-700 rounded-t-3xl p-5 shadow-2xl border-b border-slate-300"
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
                {/* <p className="text-blue-100 text-xl mt-2">ULBRA TORRES</p> */}
              </div>
            </div>
            <div className="text-center">
              {/* <p className="text-blue-100 text-lg">Resultado do Teste Vocacional</p> */}
              {/* <p className="text-white text-2xl font-bold">{results.length} profissões descobertas</p> */}
            </div>
            <div className="text-right">
              <h1 className="flex gap-3 text-5xl font-bold text-white">
                <Image
                  src="/new-logo-ulbra.png"
                  alt="ULBRA Logo"
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
            <div className="grid grid-cols-2 gap-0 bg-linear-to-br from-blue-900/50 to-slate-900/50">
              {/* Coluna Esquerda - Imagem */}
              <div className="relative h-[640px]  p-4">
                <img
                  src={current.aiImage}
                  alt={current.userName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-8 right-8">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 mb-4"
                  >
                    <img
                      src={current.userPhoto}
                      alt={current.userName}
                      className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-xl bg-white"
                    />
                    <div>
                      {/* <p className="text-blue-400 text-lg font-semibold">user.result</p> */}
                      <h3 className="text-white text-3xl font-bold">{current.userName}</h3>
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
                    {/* <p className="text-slate-400 text-sm font-semibold mb-2">stack.content</p> */}
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
                    {/* <p className="text-slate-400 text-sm font-semibold mb-3">stack.salary</p> */}
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
                          <p className="text-white text-lg font-bold">{value}</p>
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
                  {/* <p className="text-slate-400 text-sm font-semibold mb-3">stack.tags</p> */}
                  <div className="flex flex-wrap gap-3 mx-6 mt-2 ">
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
        {results.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex
              ? 'w-16 bg-blue-500'
              : 'w-2 bg-slate-600'
              }`}
          />
        ))}
      </motion.div>

      <p className="text-white text-xl font-bold absolute bottom-6 right-6">{results.length} Profissões descobertas!</p>


    </div>
  );
}