import React, { useState } from 'react';
import { MooreMachine } from '../../types/automaton';
import { Code, Table, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface DefinicaoFormalProps {
  maquina: MooreMachine;
}

export const DefinicaoFormal: React.FC<DefinicaoFormalProps> = ({ maquina }) => {
  const [expandido, setExpandido] = useState(true);
  const [copiado, setCopiado] = useState(false);

  const copiarJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(maquina, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Cabeçalho */}
      <div
        onClick={() => setExpandido(!expandido)}
        className="flex items-center justify-between p-4 bg-slate-850 cursor-pointer hover:bg-slate-800/80 transition-all border-b border-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-serif font-bold text-base">
            M
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">
              Definição Formal da Máquina de Moore
            </h4>
            <p className="text-xs text-slate-400 font-serif">
              M = (Q, Σ, δ, q₀, Γ, λ)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copiarJSON();
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition-all"
            title="Copiar JSON formal"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiado ? 'Copiado!' : 'Copiar JSON'}
          </button>
          {expandido ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expandido && (
        <div className="p-4 space-y-4 text-xs font-mono">
          {/* Tupla formal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Q: Conjunto de Estados */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">Q (Conjunto de Estados):</span>
              <span className="text-slate-200 break-words">
                {'{ ' + maquina.Q.join(', ') + ' }'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                Total: {maquina.Q.length} estados
              </span>
            </div>

            {/* Σ: Alfabeto de Entrada */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">Σ (Alfabeto de Entrada):</span>
              <span className="text-slate-200 break-words">
                {'{ ' + maquina.Sigma.join(', ') + ' }'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                Símbolos aceitos pelos sensores
              </span>
            </div>

            {/* q0: Estado Inicial */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">q₀ (Estado Inicial):</span>
              <span className="text-slate-200">
                {maquina.q0}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                Saída inicial: λ({maquina.q0}) = "{maquina.lambda[maquina.q0]}"
              </span>
            </div>

            {/* Γ: Alfabeto de Saída */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">Γ (Alfabeto de Saídas):</span>
              <span className="text-slate-200 break-words">
                {'{ ' + maquina.Gamma.join(', ') + ' }'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                Sinais enviados aos atuadores
              </span>
            </div>

            {/* λ: Função de Saída */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 md:col-span-2">
              <span className="text-pink-400 font-bold block mb-1">λ: Q → Γ (Função de Saída):</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {maquina.Q.map((q) => (
                  <span key={q} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                    λ({q}) = <strong className="text-pink-300">{maquina.lambda[q] || '—'}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* δ: Tabela da Função de Transição */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto">
            <span className="text-cyan-400 font-bold block mb-2">
              δ: Q × Σ → Q (Tabela da Função de Transição):
            </span>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">Estado (q ∈ Q)</th>
                  <th className="py-2 px-3">Saída λ(q)</th>
                  {maquina.Sigma.map((s) => (
                    <th key={s} className="py-2 px-3 text-cyan-300">
                      δ(q, {s})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {maquina.Q.map((q) => {
                  const isInitial = q === maquina.q0;
                  return (
                    <tr key={q} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                        {isInitial && <span className="text-[10px] text-amber-400">→</span>}
                        {q}
                      </td>
                      <td className="py-2 px-3 text-slate-300 font-semibold">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                          {maquina.lambda[q]}
                        </span>
                      </td>
                      {maquina.Sigma.map((s) => {
                        const destino = maquina.delta[q]?.[s];
                        return (
                          <td key={s} className="py-2 px-3">
                            {destino ? (
                              <span className="text-emerald-400 font-mono font-semibold">
                                {destino}
                              </span>
                            ) : (
                              <span className="text-rose-400 italic">indefinido</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
