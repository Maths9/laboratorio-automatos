import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowRight, Trash2, Edit2, PlayCircle } from 'lucide-react';

export interface StateNodeData {
  label: string;
  saida: string;
  isInitial: boolean;
  isActive?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onSetInitial?: (id: string) => void;
  [key: string]: unknown;
}

export const StateNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as StateNodeData;
  const { label, saida, isInitial, isActive } = nodeData;

  // Cor base dependendo da saída
  const getCorSaida = (s: string) => {
    const limpo = (s || '').toUpperCase();
    if (limpo.includes('VERDE') || limpo.includes('LIBERADA') || limpo.includes('ABERTO')) {
      return { border: 'border-emerald-500', bg: 'bg-emerald-950/80', badge: 'bg-emerald-500/20 text-emerald-300' };
    }
    if (limpo.includes('VERMELHO') || limpo.includes('BLOQUEADA') || limpo.includes('FECHADO') || limpo.includes('SIRENE')) {
      return { border: 'border-rose-500', bg: 'bg-rose-950/80', badge: 'bg-rose-500/20 text-rose-300' };
    }
    if (limpo.includes('AMARELO') || limpo.includes('VIGILANTE') || limpo.includes('MOTOR')) {
      return { border: 'border-amber-500', bg: 'bg-amber-950/80', badge: 'bg-amber-500/20 text-amber-300' };
    }
    return { border: 'border-blue-500', bg: 'bg-slate-900/90', badge: 'bg-blue-500/20 text-blue-300' };
  };

  const cores = getCorSaida(saida);

  return (
    <div className="relative group">
      {/* Seta indicativa de Estado Inicial q0 */}
      {isInitial && (
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20 pointer-events-none">
          <span className="text-[11px] font-bold text-amber-400 bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-500/40 shadow">
            início
          </span>
          <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
      )}

      {/* Handles para conexões em 4 posições cardeais */}
      <Handle type="target" position={Position.Top} id="top-t" className="!w-3 !h-3 !bg-blue-400" />
      <Handle type="source" position={Position.Top} id="top-s" className="!w-3 !h-3 !bg-emerald-400" />
      
      <Handle type="target" position={Position.Right} id="right-t" className="!w-3 !h-3 !bg-blue-400" />
      <Handle type="source" position={Position.Right} id="right-s" className="!w-3 !h-3 !bg-emerald-400" />

      <Handle type="target" position={Position.Bottom} id="bottom-t" className="!w-3 !h-3 !bg-blue-400" />
      <Handle type="source" position={Position.Bottom} id="bottom-s" className="!w-3 !h-3 !bg-emerald-400" />

      <Handle type="target" position={Position.Left} id="left-t" className="!w-3 !h-3 !bg-blue-400" />
      <Handle type="source" position={Position.Left} id="left-s" className="!w-3 !h-3 !bg-emerald-400" />

      {/* Círculo do Estado de Moore */}
      <div
        className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 shadow-xl backdrop-blur-md border-2 ${cores.border} ${cores.bg} ${
          isActive ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-slate-950 scale-105 shadow-cyan-500/50' : ''
        } ${selected ? 'border-sky-400 ring-2 ring-sky-400/50' : ''}`}
      >
        {/* Anel duplo interno para destacar o estado */}
        <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />

        {/* Nome do Estado */}
        <span className="font-mono font-bold text-sm text-white tracking-wide max-w-[90px] truncate" title={label}>
          {label}
        </span>

        {/* Divisor estético */}
        <div className="w-12 h-[1px] bg-white/20 my-1" />

        {/* Saída λ do Estado de Moore */}
        <span
          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full max-w-[96px] truncate ${cores.badge}`}
          title={`Saída: ${saida}`}
        >
          {saida || 'SEM SAÍDA'}
        </span>

        {/* Botões rápidos em hover */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-lg shadow-lg z-30">
          {!isInitial && nodeData.onSetInitial && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nodeData.onSetInitial?.(id);
              }}
              title="Definir como Estado Inicial"
              className="p-1 hover:bg-slate-800 text-amber-400 rounded"
            >
              <PlayCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {nodeData.onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nodeData.onEdit?.(id);
              }}
              title="Editar Estado"
              className="p-1 hover:bg-slate-800 text-sky-400 rounded"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {nodeData.onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nodeData.onDelete?.(id);
              }}
              title="Excluir Estado"
              className="p-1 hover:bg-rose-950/60 text-rose-400 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
