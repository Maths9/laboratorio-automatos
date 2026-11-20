import { createMachine, createActor, Actor } from 'xstate';
import { MooreMachine, StepHistoryItem } from '../types/automaton';

/**
 * Cria uma definição de máquina de estados XState (v5) correspondente a uma máquina de Moore.
 * Cada estado possui metadados com sua respectiva saída λ, e transições correspondentes a cada símbolo de Σ.
 */
export function criarXStateMachine(m: MooreMachine) {
  const statesConfig: Record<string, any> = {};

  m.Q.forEach((q) => {
    const onConfig: Record<string, any> = {};
    m.Sigma.forEach((s) => {
      const destino = m.delta[q]?.[s];
      if (destino && m.Q.includes(destino)) {
        onConfig[s] = { target: destino };
      }
    });

    statesConfig[q] = {
      on: onConfig,
      meta: {
        saida: m.lambda[q] ?? '',
        nome: q,
      },
    };
  });

  return createMachine({
    id: `moore_${m.nome.replace(/[^a-zA-Z0-9_]/g, '_')}`,
    initial: m.q0,
    states: statesConfig,
  });
}

export interface SimulationController {
  actor: Actor<any>;
  estadoAtual: string;
  saidaAtual: string;
  enviarEvento: (simbolo: string) => void;
  reiniciar: () => void;
  parar: () => void;
  obterHistorico: () => StepHistoryItem[];
  limparHistorico: () => void;
}

/**
 * Gerenciador de simulação baseado em XState para execução interativa no navegador.
 */
export class XStateMooreRunner {
  private actor: Actor<any>;
  private maquina: MooreMachine;
  private historico: StepHistoryItem[] = [];
  private ouvintes: ((estado: string, saida: string, historico: StepHistoryItem[]) => void)[] = [];

  constructor(maquina: MooreMachine) {
    this.maquina = maquina;
    const xMachine = criarXStateMachine(maquina);
    this.actor = createActor(xMachine);

    // Registro inicial do passo 0 (saída do estado inicial)
    this.historico = [
      {
        passo: 0,
        entrada: null,
        estadoAnterior: null,
        estado: maquina.q0,
        saida: maquina.lambda[maquina.q0] ?? '',
        timestamp: Date.now(),
      },
    ];

    this.actor.subscribe((snapshot) => {
      const estadoAtual = snapshot.value as string;
      const saidaAtual = this.maquina.lambda[estadoAtual] ?? '';
      this.notificar(estadoAtual, saidaAtual);
    });

    this.actor.start();
  }

  public enviarEvento(simbolo: string): boolean {
    if (!this.maquina.Sigma.includes(simbolo)) {
      return false;
    }

    const estadoAnterior = this.actor.getSnapshot().value as string;
    const destinoEsperado = this.maquina.delta[estadoAnterior]?.[simbolo];

    if (!destinoEsperado) return false;

    // Dispara transição no XState
    this.actor.send({ type: simbolo });

    const novoEstado = this.actor.getSnapshot().value as string;
    const novaSaida = this.maquina.lambda[novoEstado] ?? '';

    const novoItem: StepHistoryItem = {
      passo: this.historico.length,
      entrada: simbolo,
      estadoAnterior,
      estado: novoEstado,
      saida: novaSaida,
      timestamp: Date.now(),
    };

    this.historico.push(novoItem);
    this.notificar(novoEstado, novaSaida);
    return true;
  }

  public reiniciar() {
    this.actor.stop();
    const xMachine = criarXStateMachine(this.maquina);
    this.actor = createActor(xMachine);
    this.actor.start();

    this.historico = [
      {
        passo: 0,
        entrada: null,
        estadoAnterior: null,
        estado: this.maquina.q0,
        saida: this.maquina.lambda[this.maquina.q0] ?? '',
        timestamp: Date.now(),
      },
    ];

    this.notificar(this.maquina.q0, this.maquina.lambda[this.maquina.q0] ?? '');
  }

  public getEstadoAtual(): string {
    return (this.actor.getSnapshot()?.value as string) ?? this.maquina.q0;
  }

  public getSaidaAtual(): string {
    return this.maquina.lambda[this.getEstadoAtual()] ?? '';
  }

  public getHistorico(): StepHistoryItem[] {
    return [...this.historico];
  }

  public subscrever(fn: (estado: string, saida: string, historico: StepHistoryItem[]) => void) {
    this.ouvintes.push(fn);
    return () => {
      this.ouvintes = this.ouvintes.filter((o) => o !== fn);
    };
  }

  private notificar(estado: string, saida: string) {
    this.ouvintes.forEach((fn) => fn(estado, saida, [...this.historico]));
  }

  public destruir() {
    this.actor.stop();
    this.ouvintes = [];
  }
}
