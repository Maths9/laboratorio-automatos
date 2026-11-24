import React from 'react';
import {
  Cpu,
  GitBranch,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Play,
  RotateCw,
  Box,
  Compass,
} from 'lucide-react';
import { CatracaSVG } from '../components/svg/CatracaSVG';
import { SemaforoSVG } from '../components/svg/SemaforoSVG';
import { MooreMachine } from '../types/automaton';

interface HomeTabProps {
  onNavegarPara: (aba: string) => void;
  onSelecionarSistema: (sistema: MooreMachine) => void;
  sistemas: MooreMachine[];
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavegarPara,
  onSelecionarSistema,
  sistemas,
}) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl dark:shadow-2xl transition-all">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Cpu className="w-4 h-4" />
            Teoria da Computação + Robótica Educacional
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Laboratório Virtual de{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-teal-300 bg-clip-text text-transparent">
              Robótica e Autômatos
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Aprenda Máquinas de Moore, simulação de sensores e atuadores e o algoritmo de{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">minimização por refinamento de partições</strong> diretamente no seu navegador, sem
            necessidade de Arduino, componentes físicos ou instalações complexas.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavegarPara('guia')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4 text-cyan-200" />
              Guia Teórico Completo
            </button>

            <button
              onClick={() => onNavegarPara('simulacao')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Iniciar Laboratório
            </button>

            <button
              onClick={() => onNavegarPara('biblioteca')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Box className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              Conhecer os Projetos
            </button>

            <button
              onClick={() => onNavegarPara('desafio')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-semibold text-sm border border-amber-200 dark:border-amber-700/50 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Modo Desafio
            </button>
          </div>
        </div>

        {/* Prévia SVG interativa na lateral */}
        <div className="mt-8 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800/80">
          <div className="bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Sistema Físico Interativo (Catraca)
            </span>
            <div className="w-full max-w-[260px]">
              <CatracaSVG saida="BLOQUEADA" interativo={false} />
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Semáforo Temporizado (Moore 8 → 4)
            </span>
            <div className="w-full max-w-[240px]">
              <SemaforoSVG saida="VERDE" interativo={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Destaques Acadêmicos e Pedagógicos */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <GitBranch className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Editor Visual em React Flow</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Desenhe autômatos conectando nós de estados com transições direcionadas rotuladas. Definição
            formal M = (Q, Σ, δ, q₀, Γ, λ) atualizada dinamicamente.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-cyan-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
            <RotateCw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Algoritmo de Minimização</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Refinamento de partições passo a passo: visualize a partição inicial P₀ por saída λ, o
            desmembramento de blocos nas rodadas e o autômato mínimo resultante.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-emerald-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Robótica Lúdica & Didática</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A robótica serve como ponte visual tangível: cada estado do autômato ganha vida em atuadores,
            servomotores e luzes, tornando os teoremas formais intuitivos e divertidos.
          </p>
        </div>
      </section>

      {/* Projetos Pré-configurados Prontos para Uso */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sistemas Pré-configurados Obrigatórios</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Escolha um dos sistemas didáticos para carregar no simulador e na área de minimização.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sistemas.slice(0, 2).map((sis) => (
            <div
              key={sis.nome}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {sis.nome}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono border border-blue-200 dark:border-blue-500/30">
                    {sis.Q.length} estados
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {sis.descricao}
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 mb-6">
                  <span className="bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
                    Entradas Σ: [{sis.Sigma.join(', ')}]
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
                    Saídas Γ: [{sis.Gamma.join(', ')}]
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    onSelecionarSistema(sis);
                    onNavegarPara('simulacao');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Simular Sistema
                </button>
                <button
                  onClick={() => {
                    onSelecionarSistema(sis);
                    onNavegarPara('minimizacao');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-all shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  Minimizar Estados
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
