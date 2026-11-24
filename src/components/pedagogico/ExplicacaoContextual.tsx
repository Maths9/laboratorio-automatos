import React, { useState } from 'react';
import { Lightbulb, BookOpen, ChevronDown, ChevronUp, Cpu, Compass, X } from 'lucide-react';

export interface ExplicacaoContextualProps {
  titulo: string;
  conceitoTeorico: string;
  oQueEstaAcontecendo: string;
  formulaOuRegra?: string;
  dicaPratica?: string;
  visivelInicialmente?: boolean;
}

/**
 * Componente flutuante/embutido de explicação pedagógica em tempo real.
 * Totalmente adaptado para Modo Claro (Light) e Modo Escuro (Dark).
 */
export const ExplicacaoContextual: React.FC<ExplicacaoContextualProps> = ({
  titulo,
  conceitoTeorico,
  oQueEstaAcontecendo,
  formulaOuRegra,
  dicaPratica,
  visivelInicialmente = true,
}) => {
  const [expandido, setExpandido] = useState(visivelInicialmente);
  const [fechado, setFechado] = useState(false);

  if (fechado) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setFechado(false)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
          title="Abrir explicação pedagógica de Teoria da Computação"
        >
          <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>O que a Teoria da Computação diz aqui?</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 dark:from-blue-950/40 dark:via-slate-900/90 dark:to-indigo-950/40 p-5 shadow-lg backdrop-blur-sm transition-all text-slate-800 dark:text-slate-200">
      <div className="flex items-center justify-between gap-2 border-b border-blue-100 dark:border-blue-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase block font-mono">
              Teoria da Computação em Ação
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {titulo}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpandido(!expandido)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={expandido ? 'Recolher detalhes' : 'Expandir detalhes'}
          >
            {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setFechado(true)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Minimizar explicação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="space-y-3 text-xs">
        {/* O que está acontecendo agora */}
        <div className="flex items-start gap-2.5 bg-white/90 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-700 dark:text-cyan-300 font-bold block text-[11px] mb-0.5">
              O que está acontecendo neste instante:
            </strong>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{oQueEstaAcontecendo}</p>
          </div>
        </div>

        {expandido && (
          <>
            {/* Conceito Teórico / Modelo Matemático */}
            <div className="flex items-start gap-2.5 bg-indigo-50/70 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-900 dark:text-indigo-300 font-bold block text-[11px] mb-0.5">
                  Conceito Formal de Teoria da Computação:
                </strong>
                <p className="text-indigo-950 dark:text-indigo-100 leading-relaxed font-sans">{conceitoTeorico}</p>
              </div>
            </div>

            {/* Regra ou Notação Matemática */}
            {formulaOuRegra && (
              <div className="bg-slate-100 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-500 font-bold select-none">Notação:</span>
                <code className="font-semibold">{formulaOuRegra}</code>
              </div>
            )}

            {/* Dica Didática */}
            {dicaPratica && (
              <div className="flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 px-3.5 py-2 rounded-xl">
                <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">{dicaPratica}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
