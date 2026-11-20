import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StateNode, StateNodeData } from './StateNode';
import { MooreMachine } from '../../types/automaton';
import { validarMoore } from '../../core/moore';
import {
  Plus,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
} from 'lucide-react';

interface AutomatonFlowEditorProps {
  maquina: MooreMachine;
  onChangeMaquina?: (nova: MooreMachine) => void;
  estadoAtivo?: string;
  readOnly?: boolean;
  altura?: string | number;
}

export const AutomatonFlowEditor: React.FC<AutomatonFlowEditorProps> = ({
  maquina,
  onChangeMaquina,
  estadoAtivo,
  readOnly = false,
  altura = '500px',
}) => {
  const nodeTypes = useMemo(() => ({ estado: StateNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Modais de edição
  const [modalNovoEstado, setModalNovoEstado] = useState(false);
  const [novoEstadoNome, setNovoEstadoNome] = useState('');
  const [novoEstadoSaida, setNovoEstadoSaida] = useState('');
  const [novoEstadoInicial, setNovoEstadoInicial] = useState(false);

  const [modalTransicao, setModalTransicao] = useState<{
    aberto: boolean;
    origem: string;
    destino: string;
    simbolo: string;
  }>({ aberto: false, origem: '', destino: '', simbolo: '' });

  const [estadoEditando, setEstadoEditando] = useState<{
    id: string;
    label: string;
    saida: string;
    isInitial: boolean;
  } | null>(null);

  // Calcula layout circular automático para os nós
  const gerarLayout = useCallback((m: MooreMachine, ativo?: string) => {
    const total = m.Q.length;
    const raio = Math.max(160, total * 35);
    const centroX = 350;
    const centroY = 240;

    const novosNodes: Node[] = m.Q.map((q, i) => {
      const angulo = (i / total) * 2 * Math.PI - Math.PI / 2;
      const x = total === 1 ? centroX : centroX + raio * Math.cos(angulo);
      const y = total === 1 ? centroY : centroY + raio * Math.sin(angulo);

      return {
        id: q,
        type: 'estado',
        position: { x, y },
        data: {
          label: q,
          saida: m.lambda[q] ?? '',
          isInitial: q === m.q0,
          isActive: q === ativo,
          onDelete: readOnly ? undefined : (id: string) => excluirEstado(id),
          onEdit: readOnly ? undefined : (id: string) => abrirEditarEstado(id),
          onSetInitial: readOnly ? undefined : (id: string) => definirInicial(id),
        } as StateNodeData,
      };
    });

    // Constrói as arestas direcionadas
    const novasEdges: Edge[] = [];
    m.Q.forEach((origem) => {
      const trans = m.delta[origem] || {};
      Object.entries(trans).forEach(([simbolo, destino]) => {
        if (!m.Q.includes(destino)) return;
        const isSelf = origem === destino;

        novasEdges.push({
          id: `e-${origem}-${simbolo}-${destino}`,
          source: origem,
          target: destino,
          label: `${simbolo}`,
          type: isSelf ? 'smoothstep' : 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: '#38bdf8',
          },
          style: {
            stroke: '#38bdf8',
            strokeWidth: 2,
          },
          labelStyle: {
            fill: '#f8fafc',
            fontWeight: 700,
            fontSize: 12,
            fontFamily: 'monospace',
          },
          labelBgStyle: {
            fill: '#0f172a',
            fillOpacity: 0.9,
            stroke: '#38bdf8',
            strokeWidth: 1.5,
            rx: 4,
          },
          labelBgPadding: [6, 4],
        });
      });
    });

    return { novosNodes, novasEdges };
  }, [readOnly]);

  // Sincroniza com a máquina recebida
  useEffect(() => {
    const { novosNodes, novasEdges } = gerarLayout(maquina, estadoAtivo);
    setNodes(novosNodes);
    setEdges(novasEdges);
  }, [maquina, estadoAtivo, gerarLayout, setNodes, setEdges]);

  // Ações de modificação do grafo
  const excluirEstado = (id: string) => {
    if (readOnly || !onChangeMaquina) return;
    if (maquina.Q.length <= 1) {
      alert('O autômato deve ter pelo menos um estado.');
      return;
    }

    const novosQ = maquina.Q.filter((q) => q !== id);
    const novoDelta: Record<string, Record<string, string>> = {};
    const novoLambda: Record<string, string> = {};

    novosQ.forEach((q) => {
      novoDelta[q] = {};
      maquina.Sigma.forEach((s) => {
        const dest = maquina.delta[q]?.[s];
        if (dest && dest !== id) {
          novoDelta[q][s] = dest;
        }
      });
      novoLambda[q] = maquina.lambda[q];
    });

    const novoQ0 = maquina.q0 === id ? novosQ[0] : maquina.q0;

    onChangeMaquina({
      ...maquina,
      Q: novosQ,
      delta: novoDelta,
      lambda: novoLambda,
      q0: novoQ0,
    });
  };

  const definirInicial = (id: string) => {
    if (readOnly || !onChangeMaquina) return;
    onChangeMaquina({
      ...maquina,
      q0: id,
    });
  };

  const abrirEditarEstado = (id: string) => {
    setEstadoEditando({
      id,
      label: id,
      saida: maquina.lambda[id] || '',
      isInitial: id === maquina.q0,
    });
  };

  const salvarEdicaoEstado = () => {
    if (!estadoEditando || !onChangeMaquina) return;
    const antigaId = estadoEditando.id;
    const novaId = estadoEditando.label.trim();
    const novaSaida = estadoEditando.saida.trim();

    if (!novaId) return;

    // Se mudou o nome
    const novosQ = maquina.Q.map((q) => (q === antigaId ? novaId : q));
    const novoDelta: Record<string, Record<string, string>> = {};
    const novoLambda: Record<string, string> = {};

    maquina.Q.forEach((q) => {
      const qEfetivo = q === antigaId ? novaId : q;
      novoDelta[qEfetivo] = {};
      maquina.Sigma.forEach((s) => {
        const d = maquina.delta[q]?.[s];
        if (d) {
          novoDelta[qEfetivo][s] = d === antigaId ? novaId : d;
        }
      });
      novoLambda[qEfetivo] = q === antigaId ? novaSaida : maquina.lambda[q];
    });

    const novasGammas = Array.from(new Set([...maquina.Gamma, novaSaida])).filter(Boolean);

    onChangeMaquina({
      ...maquina,
      Q: novosQ,
      q0: estadoEditando.isInitial ? novaId : maquina.q0 === antigaId ? novaId : maquina.q0,
      Gamma: novasGammas,
      delta: novoDelta,
      lambda: novoLambda,
    });

    setEstadoEditando(null);
  };

  const salvarNovoEstado = () => {
    if (!onChangeMaquina) return;
    const nome = novoEstadoNome.trim();
    const saida = novoEstadoSaida.trim();

    if (!nome) {
      alert('Informe o nome do estado.');
      return;
    }
    if (maquina.Q.includes(nome)) {
      alert(`O estado "${nome}" já existe.`);
      return;
    }

    const novosQ = [...maquina.Q, nome];
    const novasGammas = saida && !maquina.Gamma.includes(saida) ? [...maquina.Gamma, saida] : maquina.Gamma;
    const novoLambda: Record<string, string> = { ...maquina.lambda, [nome]: saida || 'DEFAULT' };
    const novoDelta: Record<string, Record<string, string>> = { ...maquina.delta, [nome]: {} };

    // Inicializa transições direcionando para ele mesmo como padrão
    maquina.Sigma.forEach((s) => {
      novoDelta[nome][s] = nome;
    });

    onChangeMaquina({
      ...maquina,
      Q: novosQ,
      Gamma: novasGammas,
      lambda: novoLambda,
      delta: novoDelta,
      q0: novoEstadoInicial || maquina.Q.length === 0 ? nome : maquina.q0,
    });

    setNovoEstadoNome('');
    setNovoEstadoSaida('');
    setNovoEstadoInicial(false);
    setModalNovoEstado(false);
  };

  // Conexão de aresta via arrastar do React Flow
  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly || !onChangeMaquina || !params.source || !params.target) return;
      const primeiroSimbolo = maquina.Sigma[0] || 'T';
      setModalTransicao({
        aberto: true,
        origem: params.source,
        destino: params.target,
        simbolo: primeiroSimbolo,
      });
    },
    [maquina.Sigma, onChangeMaquina, readOnly]
  );

  const salvarTransicao = () => {
    if (!onChangeMaquina) return;
    const { origem, destino, simbolo } = modalTransicao;
    if (!origem || !destino || !simbolo) return;

    const novoSigma = maquina.Sigma.includes(simbolo) ? maquina.Sigma : [...maquina.Sigma, simbolo];
    const novoDelta = { ...maquina.delta };
    if (!novoDelta[origem]) novoDelta[origem] = {};
    novoDelta[origem][simbolo] = destino;

    onChangeMaquina({
      ...maquina,
      Sigma: novoSigma,
      delta: novoDelta,
    });

    setModalTransicao({ aberto: false, origem: '', destino: '', simbolo: '' });
  };

  // Remover aresta ao clicar nela
  const onEdgeClick = (_evt: React.MouseEvent, edge: Edge) => {
    if (readOnly || !onChangeMaquina) return;
    const [, origem, simbolo] = edge.id.split('-');
    if (confirm(`Deseja remover a transição δ(${origem}, ${simbolo})?`)) {
      const novoDelta = { ...maquina.delta };
      if (novoDelta[origem]) {
        delete novoDelta[origem][simbolo];
      }
      onChangeMaquina({
        ...maquina,
        delta: novoDelta,
      });
    }
  };

  // Validação em tempo real
  const erros = useMemo(() => validarMoore(maquina), [maquina]);

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative">
      {/* Barra de Ferramentas Superior */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur z-10 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wide text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            {maquina.nome}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
            |Q| = {maquina.Q.length} estados
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
            |Σ| = {maquina.Sigma.length} ({maquina.Sigma.join(', ')})
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalNovoEstado(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Estado
            </button>
            <button
              onClick={() => {
                const { novosNodes, novasEdges } = gerarLayout(maquina, estadoAtivo);
                setNodes(novosNodes);
                setEdges(novasEdges);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all border border-slate-700"
              title="Organizar layout em círculo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reorganizar
            </button>
          </div>
        )}
      </div>

      {/* Área do Grafo React Flow */}
      <div style={{ height: altura }} className="w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onEdgeClick={readOnly ? undefined : onEdgeClick}
          fitView
          attributionPosition="bottom-left"
          className="bg-slate-950"
        >
          <Background color="#1e293b" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-slate-900 !border-slate-800 !text-white !fill-white" />
          <MiniMap
            nodeColor={(n) => (n.id === maquina.q0 ? '#f59e0b' : '#3b82f6')}
            maskColor="rgba(15, 23, 42, 0.7)"
            className="!bg-slate-900 !border-slate-800 rounded-lg"
          />
        </ReactFlow>

        {/* Notificação de Validação no Canto Inferior */}
        <div className="absolute bottom-3 right-3 max-w-sm z-10 pointer-events-none">
          {erros.length === 0 ? (
            <div className="flex items-center gap-2 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg backdrop-blur">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Autômato determinístico consistente e completo.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 bg-amber-950/90 text-amber-200 border border-amber-500/40 p-2.5 rounded-lg text-xs shadow-lg backdrop-blur">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Atenção: pendências na validação ({erros.length})</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300/90 max-h-24 overflow-y-auto">
                {erros.slice(0, 3).map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
                {erros.length > 3 && <li>...e mais {erros.length - 3} avisos.</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Adicionar Novo Estado */}
      {modalNovoEstado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Adicionar Novo Estado
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Estado (ex: S1, Q_ESPERA)</label>
                <input
                  type="text"
                  value={novoEstadoNome}
                  onChange={(e) => setNovoEstadoNome(e.target.value)}
                  placeholder="Nome do estado"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Saída λ Produzida (ex: BLOQUEADA, VERDE)</label>
                <input
                  type="text"
                  value={novoEstadoSaida}
                  onChange={(e) => setNovoEstadoSaida(e.target.value)}
                  placeholder="Saída do estado"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkInicial"
                  checked={novoEstadoInicial}
                  onChange={(e) => setNovoEstadoInicial(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-950 border-slate-700 focus:ring-0"
                />
                <label htmlFor="chkInicial" className="text-xs text-slate-300 cursor-pointer">
                  Definir como Estado Inicial (q0)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setModalNovoEstado(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={salvarNovoEstado}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow"
              >
                Criar Estado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar Transição */}
      {modalTransicao.aberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Criar Transição</h3>
            <p className="text-xs text-slate-400 mb-4">
              De <span className="font-mono font-bold text-cyan-400">{modalTransicao.origem}</span> para{' '}
              <span className="font-mono font-bold text-emerald-400">{modalTransicao.destino}</span>
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Símbolo de Entrada Σ (ex: M, G, T)
              </label>
              <input
                type="text"
                value={modalTransicao.simbolo}
                onChange={(e) => setModalTransicao({ ...modalTransicao, simbolo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setModalTransicao({ aberto: false, origem: '', destino: '', simbolo: '' })}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={salvarTransicao}
                className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow"
              >
                Salvar Transição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Estado */}
      {estadoEditando && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-sky-400" />
              Editar Estado "{estadoEditando.id}"
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Estado</label>
                <input
                  type="text"
                  value={estadoEditando.label}
                  onChange={(e) => setEstadoEditando({ ...estadoEditando, label: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Saída λ</label>
                <input
                  type="text"
                  value={estadoEditando.saida}
                  onChange={(e) => setEstadoEditando({ ...estadoEditando, saida: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkEditInicial"
                  checked={estadoEditando.isInitial}
                  onChange={(e) => setEstadoEditando({ ...estadoEditando, isInitial: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded bg-slate-950 border-slate-700"
                />
                <label htmlFor="chkEditInicial" className="text-xs text-slate-300 cursor-pointer">
                  Estado Inicial (q0)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setEstadoEditando(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicaoEstado}
                className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
