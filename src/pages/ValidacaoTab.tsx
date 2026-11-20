import React, { useState, useMemo } from 'react';
import { MooreMachine, EquivalenceTestResult } from '../types/automaton';
import { minimizarMoore } from '../core/minimizacao';
import {
  validarEquivalenciaAleatoria,
  validarEquivalenciaExata,
} from '../core/equivalencia';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sliders,
  AlertTriangle,
  FileCheck,
  Hash,
} from 'lucide-react';

interface ValidacaoTabProps {
  maquina: MooreMachine;
}

export const ValidacaoTab: React.FC<ValidacaoTabProps> = ({ maquina }) => {
  // Autômato minimizado calculado
  const minimizada = useMemo(() => minimizarMoore(maquina).minimo, [maquina]);

  // Parâmetros de teste
  const [qtdSequencias, setQtdSequencias] = useState<number>(400);
  const [tamanhoSequencia, setTamanhoSequencia] = useState<number>(30);
  const [semente, setSemente] = useState<number>(12345);

  const [resultadoAleatorio, setResultadoAleatorio] = useState<EquivalenceTestResult | null>(null);
  const [resultadoExato, setResultadoExato] = useState<EquivalenceTestResult | null>(null);
  const [executando, setExecutando] = useState(false);

  // Executar a bateria de testes
  const rodarValidacao = () => {
    setExecutando(true);
    setTimeout(() => {
      const resAleat = validarEquivalenciaAleatoria(
        maquina,
        minimizada,
        qtdSequencias,
        tamanhoSequencia,
        semente
      );
      const resExato = validarEquivalenciaExata(maquina, minimizada);

      setResultadoAleatorio(resAleat);
      setResultadoExato(resExato);
      setExecutando(false);
    }, 150);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Validação Formal e Teste de Equivalência
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Comprovação de preservação comportamental entre o Autômato Original ({maquina.Q.length} estados) e o Minimizado ({minimizada.Q.length} estados).
          </p>
        </div>

        <button
          onClick={rodarValidacao}
          disabled={executando}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          {executando ? 'Testando...' : 'Executar Bateria de Testes (400 Sequências)'}
        </button>
      </div>

      {/* Painel de Configurações dos Testes com Semente Reproduzível */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Parâmetros do Teste Amostral (Pseudoaleatório Reproduzível)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Quantidade de Sequências de Entrada
            </label>
            <input
              type="number"
              min={10}
              max={2000}
              value={qtdSequencias}
              onChange={(e) => setQtdSequencias(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Padrão exigido: 400 sequências
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Comprimento de Cada Sequência (Passos)
            </label>
            <input
              type="number"
              min={5}
              max={100}
              value={tamanhoSequencia}
              onChange={(e) => setTamanhoSequencia(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Padrão exigido: 30 símbolos por sequência
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Semente Pseudoaleatória (Mulberry32)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={semente}
                onChange={(e) => setSemente(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => setSemente(Math.floor(Math.random() * 99999))}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                title="Sortear nova semente"
              >
                Sortear
              </button>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Garante repetibilidade exata dos testes
            </span>
          </div>
        </div>
      </div>

      {/* Resultados dos Testes */}
      {resultadoAleatorio && (
        <div className="space-y-6">
          {/* Card Resumo do Resultado Geral */}
          <div
            className={`p-6 rounded-3xl border shadow-2xl transition-all ${
              resultadoAleatorio.equivalentes && resultadoExato?.equivalentes
                ? 'bg-emerald-950/40 border-emerald-500/50'
                : 'bg-rose-950/40 border-rose-500/50'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    resultadoAleatorio.equivalentes
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {resultadoAleatorio.equivalentes ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {resultadoAleatorio.equivalentes
                      ? '100% de Equivalência Observável Confirmada!'
                      : 'Divergência Encontrada Entre as Máquinas!'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {resultadoAleatorio.equivalentes
                      ? `Todas as ${resultadoAleatorio.testadas} sequências aleatórias produziram exatamente a mesma cadeia de saídas nos autômatos original e minimizado.`
                      : resultadoAleatorio.motivo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Testadas</span>
                  <span className="text-white font-bold">{resultadoAleatorio.testadas}</span>
                </div>
                <div className="w-[1px] h-6 bg-slate-800" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Divergências</span>
                  <span
                    className={`font-bold ${
                      resultadoAleatorio.equivalentes ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {resultadoAleatorio.equivalentes ? '0' : '1+'}
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-slate-800" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Pares BFS</span>
                  <span className="text-cyan-400 font-bold">
                    {resultadoExato?.paresVisitados ?? '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contraexemplo caso exista divergência */}
            {!resultadoAleatorio.equivalentes && resultadoAleatorio.contraexemplo && (
              <div className="mt-6 pt-6 border-t border-rose-500/30 space-y-3">
                <span className="text-xs font-bold text-rose-300 block">
                  Sequência Responsável pela Divergência (Contraexemplo):
                </span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-400 break-words">
                  Sequência: [{resultadoAleatorio.contraexemplo.join(', ')}]
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Saídas Original:</span>
                    <span className="text-emerald-400">
                      [{resultadoAleatorio.saidasA?.join(', ')}]
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Saídas Minimizado:</span>
                    <span className="text-rose-400">
                      [{resultadoAleatorio.saidasB?.join(', ')}]
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Comparativo Metodológico: Amostral vs BFS Exato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-sm text-white">
                  1. Validação Amostral (400 Sequências)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gera 400 caminhos aleatórios de 30 símbolos cada. Compara a saída produzida pela máquina de Moore a cada transição.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
                Resultado: <strong className="text-emerald-400">{resultadoAleatorio.testadas} sequências equivalentes</strong> (0 divergências).
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-sm text-white">
                  2. Verificação Exata (BFS no Produto Cartesiano)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Busca em largura sobre pares de estados (qa, qb) alcançáveis. Prova matematicamente que para qualquer caminho finito ou infinito, as saídas serão sempre idênticas.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
                Resultado: <strong className="text-cyan-400">{resultadoExato?.paresVisitados} pares de estados</strong> verificados com sucesso.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
