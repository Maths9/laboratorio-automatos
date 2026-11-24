import React, { useState, useMemo } from 'react';
import { MooreMachine, MinimizationResult } from '../types/automaton';
import { minimizarMoore, formatarNomeBloco } from '../core/minimizacao';
import { AutomatonFlowEditor } from '../components/flow/AutomatonFlowEditor';
import { DefinicaoFormal } from '../components/formal/DefinicaoFormal';
import { ExplicacaoContextual } from '../components/pedagogico/ExplicacaoContextual';
import {
  GitCompare,
  Layers,
  AlertCircle,
  TrendingDown,
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
      {/* ============================================================== */}
      {/* 1. PARTE PRÁTICA: COMPARAÇÃO LADO A LADO E EVOLUÇÃO           */}
      {/* ============================================================== */}

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Minimização de Estados por Refinamento de Partições
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Algoritmo matemático de particionamento para Máquinas de Moore: da partição inicial P₀ até a forma mínima irredutível.
          </p>
        </div>

        {/* Badge de Redução Percentual */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-500/30 px-4 py-2 rounded-2xl shadow-sm">
            <TrendingDown className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
                Redução de Estados
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {resultado.nOriginal} → {resultado.nMinimo} estados ({resultado.reducaoPercentual}% menor)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estados Inalcançáveis (se houver) */}
      {resultado.removidos.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-500/40 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <strong className="block text-amber-900 dark:text-amber-300 font-bold mb-0.5">
              Etapa Prévia: Remoção de Estados Inalcançáveis
            </strong>
            Os seguintes estados não possuem caminho a partir de q₀ = "{maquina.q0}" e foram descartados antes do particionamento:
            <span className="font-mono font-bold text-slate-900 dark:text-white ml-1">
              [{resultado.removidos.join(', ')}]
            </span>
          </div>
        </div>
      )}

      {/* Seção Prática: Comparação Lado a Lado (Original vs Minimizado) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Comparação Lado a Lado: Original × Minimizado
          </h3>

          {onAplicarMinimizada && (
            <button
              onClick={() => {
                onAplicarMinimizada(resultado.minimo);
                alert('Máquina minimizada carregada como o sistema atual do laboratório!');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Carregar Autômato Mínimo na Bancada
            </button>
          )}
        </div>

        {/* Tabela Resumo Comparativo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estados Originais</span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {resultado.nOriginal}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estados Minimizados</span>
            <span className="text-2xl font-bold font-mono text-blue-600 dark:text-cyan-400">
              {resultado.nMinimo}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estados Agrupados</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {resultado.nOriginal - resultado.nMinimo}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Economia de Complexidade</span>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {resultado.reducaoPercentual}%
            </span>
          </div>
        </div>

        {/* Diagramas Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Autômato Original */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. Autômato Original ({resultado.nOriginal} estados)
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                q₀ = {maquina.q0}
              </span>
            </div>
            <AutomatonFlowEditor maquina={maquina} readOnly={true} altura="420px" />
          </div>

          {/* Autômato Minimizado */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                2. Autômato Minimizado ({resultado.nMinimo} estados)
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-cyan-300">
                q₀ = {resultado.minimo.q0}
              </span>
            </div>
            <AutomatonFlowEditor maquina={resultado.minimo} readOnly={true} altura="420px" />
          </div>
        </div>
      </div>

      {/* Painel do Passo a Passo das Partições (P0, P1, ...) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Evolução Iterativa das Partições
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>Partição P{p.rodada}</span>
              {p.estavel && (
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
                  Estável
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Detalhes da Partição Selecionada */}
        {resultado.particoes[etapaVisualizada] && (
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                {etapaVisualizada === 0 ? 'Partição Inicial P₀ (Agrupamento por Saída λ)' : `Rodada ${etapaVisualizada}: Refinamento por Assinatura de Transição`}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
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
                    className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 min-w-[140px] shadow-sm"
                  >
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white mb-1">
                      Bloco B{bIdx + 1} = {formatarNomeBloco(bloco)}
                    </span>
                    <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400">
                      Saída associada: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{saida}</strong>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bloco.map((q) => (
                        <span
                          key={q}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-blue-700 dark:text-cyan-300 font-semibold"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. EXPLICAÇÃO TEÓRICA E DEFINIÇÃO FORMAL (ABAIXO)               */}
      {/* ============================================================== */}

      {/* Explicação Didática da Rodada com ExplicacaoContextual */}
      {resultado.particoes[etapaVisualizada] && (
        <ExplicacaoContextual
          titulo={
            etapaVisualizada === 0
              ? `Partição P₀: Separação por Saída Inicial λ`
              : `Partição P${resultado.particoes[etapaVisualizada].rodada}: ${
                  resultado.particoes[etapaVisualizada].estavel
                    ? 'Estabilidade e Fim do Algoritmo'
                    : 'Refinamento por Assinatura de Transições'
                }`
          }
          oQueEstaAcontecendo={resultado.particoes[etapaVisualizada].explicacao}
          conceitoTeorico={
            etapaVisualizada === 0
              ? 'Dois estados p e q com saídas diferentes (λ(p) ≠ λ(q)) são imediatamente 0-distinguíveis pela palavra vazia ε. Por isso, a partição inicial P₀ divide Q em blocos cujos estados produzem a mesma saída.'
              : resultado.particoes[etapaVisualizada].estavel
              ? 'Quando P_k = P_{k-1}, nenhum bloco sofreu cisão nesta iteração. Pelo Teorema de Moore e Myhill-Nerode, a partição atingiu o ponto fixo estável e os blocos representam as classes de equivalência mínimas.'
              : 'Para cada bloco de estados, verificamos para qual bloco cada estado transiciona sob cada símbolo a ∈ Σ. Se estados do mesmo bloco caem em blocos futuros diferentes, eles são k-distinguíveis e o bloco é cindido.'
          }
          formulaOuRegra={
            etapaVisualizada === 0
              ? 'p, q ∈ B₀ ⟺ λ(p) = λ(q)'
              : 'Assinatura(q) = (Bloco(δ(q, a₁)), Bloco(δ(q, a₂)), ...)'
          }
          dicaPratica={
            resultado.particoes[etapaVisualizada].estavel
              ? `Conclusão matemática: o autômato foi reduzido para ${resultado.nMinimo} estados sem alterar nenhuma sequência de saídas.`
              : 'Clique nas outras rodadas acima para acompanhar a evolução das quebras de blocos.'
          }
        />
      )}

      {/* Definição Formal da Máquina Mínima Resultante */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Definição Matemática do Autômato Mínimo
        </span>
        <DefinicaoFormal maquina={resultado.minimo} />
      </div>
    </div>
  );
};
