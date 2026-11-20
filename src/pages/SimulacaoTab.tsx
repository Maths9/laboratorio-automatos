import React, { useState, useEffect, useRef } from 'react';
import { MooreMachine, StepHistoryItem } from '../types/automaton';
import { XStateMooreRunner } from '../core/xstateAdapter';
import { AutomatonFlowEditor } from '../components/flow/AutomatonFlowEditor';
import { CatracaSVG } from '../components/svg/CatracaSVG';
import { SemaforoSVG } from '../components/svg/SemaforoSVG';
import { AlarmeSVG } from '../components/svg/AlarmeSVG';
import { PortaoSVG } from '../components/svg/PortaoSVG';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  History,
  Activity,
  Layers,
  FastForward,
  Sliders,
  Send,
} from 'lucide-react';

interface SimulacaoTabProps {
  maquina: MooreMachine;
  onAlternarMinimizada?: () => void;
  temMinimizada?: boolean;
}

export const SimulacaoTab: React.FC<SimulacaoTabProps> = ({
  maquina,
}) => {
  // Instância do motor XState
  const runnerRef = useRef<XStateMooreRunner | null>(null);

  const [estadoAtual, setEstadoAtual] = useState<string>(maquina.q0);
  const [saidaAtual, setSaidaAtual] = useState<string>(maquina.lambda[maquina.q0] ?? '');
  const [historico, setHistorico] = useState<StepHistoryItem[]>([]);

  // Controle de reprodução automática
  const [reproduzindo, setReproduzindo] = useState(false);
  const [velocidadeMs, setVelocidadeMs] = useState(1000);
  const [sequenciaTexto, setSequenciaTexto] = useState('');
  const [filaExecucao, setFilaExecucao] = useState<string[]>([]);

  // Inicializa o XState Moore Runner ao trocar de máquina
  useEffect(() => {
    if (runnerRef.current) {
      runnerRef.current.destruir();
    }

    const runner = new XStateMooreRunner(maquina);
    runnerRef.current = runner;

    setEstadoAtual(runner.getEstadoAtual());
    setSaidaAtual(runner.getSaidaAtual());
    setHistorico(runner.getHistorico());

    const unsubscribe = runner.subscrever((novoEstado, novaSaida, novoHistorico) => {
      setEstadoAtual(novoEstado);
      setSaidaAtual(novaSaida);
      setHistorico(novoHistorico);
    });

    return () => {
      unsubscribe();
      runner.destruir();
      runnerRef.current = null;
    };
  }, [maquina]);

  // Disparo manual de um símbolo de entrada
  const dispararEntrada = (s: string) => {
    if (runnerRef.current) {
      runnerRef.current.enviarEvento(s);
    }
  };

  // Reiniciar a máquina para o estado inicial q0
  const reiniciar = () => {
    setReproduzindo(false);
    setFilaExecucao([]);
    if (runnerRef.current) {
      runnerRef.current.reiniciar();
    }
  };

  // Próximo passo da fila de sequência
  const proximoPasso = () => {
    if (filaExecucao.length > 0) {
      const prox = filaExecucao[0];
      setFilaExecucao(filaExecucao.slice(1));
      dispararEntrada(prox);
    } else {
      // Dispara o primeiro símbolo padrão de Σ
      if (maquina.Sigma.length > 0) {
        dispararEntrada(maquina.Sigma[0]);
      }
    }
  };

  // Enfileirar sequência digitada pelo usuário
  const carregarSequencia = () => {
    const chars = sequenciaTexto
      .trim()
      .split('')
      .filter((c) => maquina.Sigma.includes(c));
    if (chars.length === 0) {
      alert(`Nenhum símbolo válido encontrado. O alfabeto Σ é {${maquina.Sigma.join(', ')}}.`);
      return;
    }
    setFilaExecucao(chars);
    setReproduzindo(true);
  };

  // Loop de execução automática com velocidade configurável
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (reproduzindo && filaExecucao.length > 0) {
      timer = setTimeout(() => {
        const prox = filaExecucao[0];
        setFilaExecucao(filaExecucao.slice(1));
        dispararEntrada(prox);
      }, velocidadeMs);
    } else if (filaExecucao.length === 0 && reproduzindo) {
      setReproduzindo(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [reproduzindo, filaExecucao, velocidadeMs]);

  // Renderiza o componente físico SVG correspondente
  const renderSistemaFisico = () => {
    switch (maquina.tipoFisico) {
      case 'catraca':
        return <CatracaSVG saida={saidaAtual} onEvento={dispararEntrada} />;
      case 'semaforo':
        return <SemaforoSVG saida={saidaAtual} onEvento={dispararEntrada} />;
      case 'alarme':
        return <AlarmeSVG saida={saidaAtual} onEvento={dispararEntrada} />;
      case 'portao':
        return <PortaoSVG saida={saidaAtual} onEvento={dispararEntrada} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
            <Activity className="w-12 h-12 text-cyan-400 mb-2 animate-pulse" />
            <span className="text-white font-bold text-sm">{maquina.nome}</span>
            <span className="text-xs text-slate-400 mt-1 font-mono">
              Saída atual λ({estadoAtual}): <strong className="text-emerald-400">{saidaAtual}</strong>
            </span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Barra de Controles da Simulação */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        {/* Indicadores de Estado Atual e Saída (Destaques) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Estado Atual:</span>
            <span className="font-mono font-bold text-sm text-cyan-400 tracking-wider">
              {estadoAtual}
            </span>
            {estadoAtual === maquina.q0 && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-500/30">
                q₀
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Saída λ:</span>
            <span className="font-mono font-bold text-sm text-emerald-400 tracking-wider">
              {saidaAtual || '—'}
            </span>
          </div>
        </div>

        {/* Botões de Ação do Simulador */}
        <div className="flex flex-wrap items-center gap-2">
          {reproduzindo ? (
            <button
              onClick={() => setReproduzindo(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow transition-all active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              Pausar
            </button>
          ) : (
            <button
              onClick={() => {
                if (filaExecucao.length === 0) {
                  // Se não tem sequência na fila, cria uma sequência de 5 passos aleatórios
                  const aleat: string[] = [];
                  for (let i = 0; i < 5; i++) {
                    aleat.push(maquina.Sigma[Math.floor(Math.random() * maquina.Sigma.length)]);
                  }
                  setFilaExecucao(aleat);
                }
                setReproduzindo(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Iniciar
            </button>
          )}

          <button
            onClick={proximoPasso}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition-all active:scale-95"
            title="Avançar 1 passo"
          >
            <StepForward className="w-3.5 h-3.5" />
            Próxima Transição
          </button>

          <button
            onClick={reiniciar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
            title="Reiniciar máquina para q0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>

        {/* Controle de Velocidade */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Velocidade:</span>
          <select
            value={velocidadeMs}
            onChange={(e) => setVelocidadeMs(Number(e.target.value))}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value={1500} className="bg-slate-900">Lenta (1.5s)</option>
            <option value={1000} className="bg-slate-900">Normal (1.0s)</option>
            <option value={500} className="bg-slate-900">Rápida (0.5s)</option>
            <option value={200} className="bg-slate-900">Muito Rápida (0.2s)</option>
          </select>
        </div>
      </div>

      {/* Disparador de Símbolos e Entrada de Sequência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Botões individuais de entrada Σ */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Disparar Entrada Individual (Σ):
          </span>
          <div className="flex flex-wrap gap-2">
            {maquina.Sigma.map((s) => (
              <button
                key={s}
                onClick={() => dispararEntrada(s)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-mono font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Evento "{s}"
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 mt-2 font-mono">
            δ({estadoAtual}, s) calcula o próximo estado conforme a máquina de Moore.
          </span>
        </div>

        {/* Executar Sequência Completa (ex: MGM, TTTT) */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Executar Sequência de Símbolos:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ex: ${maquina.Sigma.join('')}${maquina.Sigma[0] || ''}`}
              value={sequenciaTexto}
              onChange={(e) => setSequenciaTexto(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={carregarSequencia}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Executar
            </button>
          </div>
          {filaExecucao.length > 0 && (
            <div className="mt-2 text-xs font-mono text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Fila pendente: [{filaExecucao.join(', ')}]
            </div>
          )}
        </div>
      </div>

      {/* Grid Principal: Diagrama de Autômato + Sistema Físico SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor / Diagrama Visual com Estado Atual Destacado */}
        <div className="lg:col-span-2">
          <AutomatonFlowEditor
            maquina={maquina}
            estadoAtivo={estadoAtual}
            readOnly={true}
            altura="460px"
          />
        </div>

        {/* Representação Física em SVG */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Sistema Físico Vetorial (SVG)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                {maquina.tipoFisico?.toUpperCase() || 'ROBÔ'}
              </span>
            </div>

            <div className="py-2 flex justify-center items-center">
              {renderSistemaFisico()}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
            A saída <strong className="text-emerald-400">λ({estadoAtual}) = "{saidaAtual}"</strong> controla
            diretamente a aparência e a mecânica do componente acima.
          </div>
        </div>
      </div>

      {/* Histórico Detalhado de Transições */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            Histórico de Transições da Máquina de Moore ({historico.length} registros)
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Passo 0 indica a saída inicial do estado q₀ antes de qualquer entrada.
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {historico.slice().reverse().map((h) => (
            <div
              key={h.passo}
              className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800/80 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold w-12">
                  #{h.passo}
                </span>

                {h.passo === 0 ? (
                  <span className="text-amber-400 font-sans font-semibold">
                    Início em q₀ = {h.estado}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">{h.estadoAnterior}</span>
                    <span className="text-cyan-400 font-bold">--[{h.entrada}]--&gt;</span>
                    <span className="text-white font-bold">{h.estado}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px]">Saída λ:</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">
                  {h.saida}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
