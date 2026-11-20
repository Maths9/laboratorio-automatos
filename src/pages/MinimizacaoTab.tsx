import React, { useState, useMemo } from 'react';
import { MooreMachine, MinimizationResult } from '../types/automaton';
import { minimizarMoore, formatarNomeBloco } from '../core/minimizacao';
import { AutomatonFlowEditor } from '../components/flow/AutomatonFlowEditor';
import { DefinicaoFormal } from '../components/formal/DefinicaoFormal';
import {
  RotateCw,
  GitCompare,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface MinimizacaoTabProps {
  maquina: MooreMachine;
  onAplicarMinimizada?: (minimizada: MooreMachine) => void;
}

export const MinimizacaoTab: React.FC<MinimizacaoTabProps> = ({
  maquina,
  onAplicarMinimizada,
}) => {
  // Executa o algoritmo de minimização de Moore
  const resultado: MinimizationResult = useMemo(() => {
    return minimizarMoore(maquina);
  }, [maquina]);

  const [etapaVisualizada, setEtapaVisualizada] = useState<number>(0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Minimização de Estados por Refinamento de Partições
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Algoritmo matemático de particionamento para Máquinas de Moore: da partição inicial P₀ até a forma mínima irredutível.
          </p>
        </div>

        {/* Badge de Redução Percentual */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-500/30 px-4 py-2 rounded-2xl shadow">
            <TrendingDown className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Redução de Estados
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {resultado.nOriginal} → {resultado.nMinimo} estados ({resultado.reducaoPercentual}% menor)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estados Inalcançáveis (se houver) */}
      {resultado.removidos.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-950/70 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="block text-amber-300 font-bold mb-0.5">
              Etapa Prévia: Remoção de Estados Inalcançáveis
            </strong>
            Os seguintes estados não possuem caminho a partir de q₀ = "{maquina.q0}" e foram descartados antes do particionamento:
            <span className="font-mono font-bold text-white ml-1">
              [{resultado.removidos.join(', ')}]
            </span>
          </div>
        </div>
      )}

      {/* Painel do Passo a Passo das Partições (P0, P1, ...) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Evolução Iterativa das Partições
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {resultado.particoes.length} rodada(s) até a estabilidade
          </span>
        </div>

        {/* Linha do tempo das rodadas de partição */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {resultado.particoes.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setEtapaVisualizada(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                etapaVisualizada === idx
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Partição P{p.rodada}</span>
              {p.estavel && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Estável
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Detalhes da Partição Selecionada */}
        {resultado.particoes[etapaVisualizada] && (
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {etapaVisualizada === 0 ? 'Partição Inicial P₀ (Agrupamento por Saída λ)' : `Rodada ${etapaVisualizada}: Refinamento por Assinatura de Transição`}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Quantidade de blocos: {resultado.particoes[etapaVisualizada].blocos.length}
              </span>
            </div>

            {/* Visualização dos Blocos da Partição */}
            <div className="flex flex-wrap gap-3">
              {resultado.particoes[etapaVisualizada].blocos.map((bloco, bIdx) => {
                const rep = bloco[0];
                const saida = maquina.lambda[rep];
                return (
                  <div
                    key={bIdx}
                    className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-xl p-3 min-w-[140px] shadow"
                  >
                    <span className="text-xs font-mono font-bold text-white mb-1">
                      Bloco B{bIdx + 1} = {formatarNomeBloco(bloco)}
                    </span>
                    <span className="text-[11px] font-sans text-slate-400">
                      Saída associada: <strong className="text-emerald-400 font-mono">{saida}</strong>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bloco.map((q) => (
                        <span
                          key={q}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-semibold"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explicação Didática da Rodada */}
            <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200 leading-relaxed font-sans">
                {resultado.particoes[etapaVisualizada].explicacao}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seção 8.5: Comparação Lado a Lado (Original vs Minimizado) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            Comparação Lado a Lado: Original × Minimizado
          </h3>

          {onAplicarMinimizada && (
            <button
              onClick={() => {
                onAplicarMinimizada(resultado.minimo);
                alert('Máquina minimizada carregada como o sistema atual do laboratório!');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow"
            >
              <Sparkles className="w-4 h-4" />
              Carregar Autômato Mínimo no Laboratório
            </button>
          )}
        </div>

        {/* Tabela Resumo Comparativo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Estados Originais</span>
            <span className="text-2xl font-bold font-mono text-white">
              {resultado.nOriginal}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Estados Minimizados</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {resultado.nMinimo}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Estados Agrupados</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {resultado.nOriginal - resultado.nMinimo}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Economia de Complexidade</span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {resultado.reducaoPercentual}%
            </span>
          </div>
        </div>

        {/* Diagramas Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Autômato Original */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                1. Autômato Original ({resultado.nOriginal} estados)
              </span>
              <span className="text-xs font-mono text-slate-400">
                q₀ = {maquina.q0}
              </span>
            </div>
            <AutomatonFlowEditor maquina={maquina} readOnly={true} altura="420px" />
          </div>

          {/* Autômato Minimizado */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="font-bold text-xs uppercase tracking-wider text-cyan-400">
                2. Autômato Minimizado ({resultado.nMinimo} estados)
              </span>
              <span className="text-xs font-mono text-cyan-300">
                q₀ = {resultado.minimo.q0}
              </span>
            </div>
            <AutomatonFlowEditor maquina={resultado.minimo} readOnly={true} altura="420px" />
          </div>
        </div>
      </div>

      {/* Definição Formal da Máquina Mínima Resultante */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Definição Matemática do Autômato Mínimo
        </span>
        <DefinicaoFormal maquina={resultado.minimo} />
      </div>
    </div>
  );
};
