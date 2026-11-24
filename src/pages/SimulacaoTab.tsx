import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MooreMachine, StepHistoryItem } from '../types/automaton';
import { XStateMooreRunner } from '../core/xstateAdapter';
import { AutomatonFlowEditor } from '../components/flow/AutomatonFlowEditor';
import { ExplicacaoContextual } from '../components/pedagogico/ExplicacaoContextual';
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
  Sliders,
  Send,
  Zap,
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

  // Gerador dinâmico de explicação pedagógica baseado no estado atual e histórico
  const explicacaoAtual = useMemo(() => {
    const ultimoPasso = historico.length > 0 ? historico[historico.length - 1] : null;

    if (!ultimoPasso || ultimoPasso.passo === 0) {
      return {
        titulo: `Estado Inicial: q₀ = "${maquina.q0}"`,
        oQueEstaAcontecendo: `O sistema acaba de ser ligado. Na máquina de Moore, antes de qualquer estímulo externo ser processado, o sistema já assume o estado inicial q₀ e gera a saída λ(${maquina.q0}) = "${saidaAtual}".`,
        conceitoTeorico: `Em Teoria da Computação, todo autômato finito determinístico deve possuir um e apenas um estado inicial q₀ ∈ Q. As saídas de Moore são síncronas ao estado, o que significa que os atuadores físicos (motores, LEDs, travas) já recebem o valor de λ(q₀).`,
        formulaOuRegra: `q₀ = ${maquina.q0} ⇒ λ(${maquina.q0}) = "${saidaAtual}"`,
        dicaPratica: `Clique em qualquer símbolo do alfabeto Σ ou dispare uma sequência para ver a função δ computar o próximo estado.`,
      };
    }

    const { estadoAnterior, entrada, estado, saida } = ultimoPasso;
    const ehLaco = estadoAnterior === estado;

    return {
      titulo: `Transição Efetuada: δ(${estadoAnterior}, '${entrada}') = ${estado}`,
      oQueEstaAcontecendo: ehLaco
        ? `O sensor detectou o evento '${entrada}', mas o autômato permaneceu no mesmo estado "${estado}". Isso é uma auto-transição (laço), mantendo a saída como "${saida}".`
        : `O evento '${entrada}' levou o autômato do estado "${estadoAnterior}" para o estado "${estado}". Com a mudança de estado, a saída λ atualizou para "${saida}", refletindo imediatamente nos componentes robóticos.`,
      conceitoTeorico: `A função de transição δ: Q × Σ → Q determinou o próximo estado baseado unicamente no par (estado_atual, símbolo_lido). Na Máquina de Moore, a saída não depende da aresta, mas sim exclusivamente do novo estado atingido: λ(q).`,
      formulaOuRegra: `δ(${estadoAnterior}, '${entrada}') = ${estado} ⟹ λ(${estado}) = "${saida}"`,
      dicaPratica: `Observe no diagrama acima: o nó "${estado}" está iluminado em azul para indicar que ele contém o controle do processo neste momento.`,
    };
  }, [estadoAtual, saidaAtual, historico, maquina]);

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
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Activity className="w-12 h-12 text-blue-600 dark:text-cyan-400 mb-2 animate-pulse" />
            <span className="text-slate-900 dark:text-white font-bold text-sm">{maquina.nome}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Saída atual λ({estadoAtual}): <strong className="text-emerald-600 dark:text-emerald-400">{saidaAtual}</strong>
            </span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Barra Superior de Controles da Simulação */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        {/* Indicadores de Estado Atual e Saída (Destaques) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Estado Atual:</span>
            <span className="font-mono font-bold text-sm text-blue-600 dark:text-cyan-400 tracking-wider">
              {estadoAtual}
            </span>
            {estadoAtual === maquina.q0 && (
              <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                q₀
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saída λ:</span>
            <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 tracking-wider">
              {saidaAtual || '—'}
            </span>
          </div>
        </div>

        {/* Botões de Ação do Simulador */}
        <div className="flex flex-wrap items-center gap-2">
          {reproduzindo ? (
            <button
              onClick={() => setReproduzindo(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow transition-all active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              Pausar
            </button>
          ) : (
            <button
              onClick={() => {
                if (filaExecucao.length === 0) {
                  const aleat: string[] = [];
                  for (let i = 0; i < 5; i++) {
                    aleat.push(maquina.Sigma[Math.floor(Math.random() * maquina.Sigma.length)]);
                  }
                  setFilaExecucao(aleat);
                }
                setReproduzindo(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Iniciar
            </button>
          )}

          <button
            onClick={proximoPasso}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow transition-all active:scale-95"
            title="Avançar 1 passo"
          >
            <StepForward className="w-3.5 h-3.5" />
            Próxima Transição
          </button>

          <button
            onClick={reiniciar}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-sm"
            title="Reiniciar máquina para q0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>

        {/* Controle de Velocidade */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>Velocidade:</span>
          <select
            value={velocidadeMs}
            onChange={(e) => setVelocidadeMs(Number(e.target.value))}
            className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value={1500} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Lenta (1.5s)</option>
            <option value={1000} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Normal (1.0s)</option>
            <option value={500} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Rápida (0.5s)</option>
            <option value={200} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Muito Rápida (0.2s)</option>
          </select>
        </div>
      </div>

      {/* Disparador de Símbolos e Entrada de Sequência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Botões individuais de entrada Σ */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Disparar Entrada Individual (Σ):
          </span>
          <div className="flex flex-wrap gap-2">
            {maquina.Sigma.map((s) => (
              <button
                key={s}
                onClick={() => dispararEntrada(s)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Evento "{s}"
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 font-mono">
            δ({estadoAtual}, s) calcula o próximo estado determinístico.
          </span>
        </div>

        {/* Executar Sequência Completa (ex: MGM, TTTT) */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Executar Sequência de Símbolos:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ex: ${maquina.Sigma.join('')}${maquina.Sigma[0] || ''}`}
              value={sequenciaTexto}
              onChange={(e) => setSequenciaTexto(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={carregarSequencia}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Executar
            </button>
          </div>
          {filaExecucao.length > 0 && (
            <div className="mt-2 text-xs font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Fila pendente: [{filaExecucao.join(', ')}]
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DISPOSIÇÃO LADO A LADO: PRÁTICA (DIAGRAMA + ROBÔ) | TEORIA     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA ESQUERDA (7 colunas): DIAGRAMA + MECANISMO FÍSICO */}
        <div className="lg:col-span-7 space-y-6">
          {/* Editor / Diagrama Visual com Estado Atual Destacado */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-md overflow-hidden">
            <AutomatonFlowEditor
              maquina={maquina}
              estadoAtivo={estadoAtual}
              readOnly={true}
              altura="450px"
            />
          </div>

          {/* Representação Física em SVG */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                Mecanismo Físico Lúdico (SVG)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {maquina.tipoFisico?.toUpperCase() || 'SISTEMA'}
              </span>
            </div>

            <div className="py-2 flex justify-center items-center">
              {renderSistemaFisico()}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              A saída <strong className="text-emerald-600 dark:text-emerald-400">λ({estadoAtual}) = "{saidaAtual}"</strong> controla
              diretamente a mecânica do componente.
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (5 colunas): EXPLICAÇÃO TEÓRICA + HISTÓRICO */}
        <div className="lg:col-span-5 space-y-4">
          {/* Painel de Explicação Pedagógica em Tempo Real */}
          <ExplicacaoContextual
            titulo={explicacaoAtual.titulo}
            oQueEstaAcontecendo={explicacaoAtual.oQueEstaAcontecendo}
            conceitoTeorico={explicacaoAtual.conceitoTeorico}
            formulaOuRegra={explicacaoAtual.formulaOuRegra}
            dicaPratica={explicacaoAtual.dicaPratica}
          />

          {/* Histórico Detalhado de Transições */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Histórico ({historico.length})
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Passo 0: saída de q₀
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {historico.toReversed().map((h) => (
                <div
                  key={h.passo}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-bold w-7">
                      #{h.passo}
                    </span>

                    {h.passo === 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-sans font-semibold">
                        q₀ = {h.estado}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">{h.estadoAnterior}</span>
                        <span className="text-blue-600 dark:text-cyan-400 font-bold">--[{h.entrada}]--&gt;</span>
                        <span className="text-slate-900 dark:text-white font-bold">{h.estado}</span>
                      </div>
                    )}
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    {h.saida}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
