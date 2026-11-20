import { MooreMachine, StepHistoryItem } from '../types/automaton';

/**
 * Validação formal de uma máquina de Moore M = (Q, Σ, δ, q0, Γ, λ).
 * Retorna uma lista de mensagens de erro detalhadas em português. Lista vazia significa autômato válido e completo.
 */
export function validarMoore(m: MooreMachine): string[] {
  const erros: string[] = [];

  if (!m || typeof m !== 'object') {
    return ['A máquina precisa ser um objeto válido.'];
  }

  if (!Array.isArray(m.Q) || m.Q.length === 0) {
    erros.push('O conjunto de estados Q precisa conter pelo menos um estado.');
  }

  if (!Array.isArray(m.Sigma) || m.Sigma.length === 0) {
    erros.push('O alfabeto de entrada Σ (Sigma) precisa conter pelo menos um símbolo.');
  }

  if (!Array.isArray(m.Gamma) || m.Gamma.length === 0) {
    erros.push('O alfabeto de saída Γ (Gamma) precisa conter pelo menos uma saída.');
  }

  if (typeof m.q0 !== 'string' || !m.q0.trim()) {
    erros.push('É obrigatório definir o estado inicial q0.');
  } else if (Array.isArray(m.Q) && !m.Q.includes(m.q0)) {
    erros.push(`O estado inicial q0 ("${m.q0}") não pertence ao conjunto de estados Q.`);
  }

  if (!m.delta || typeof m.delta !== 'object') {
    erros.push('Falta a função de transição δ (delta).');
  }

  if (!m.lambda || typeof m.lambda !== 'object') {
    erros.push('Falta a função de saída λ (lambda).');
  }

  if (erros.length > 0) return erros;

  // Verificação de completude para autômato determinístico total
  m.Q.forEach((q) => {
    // Validação da saída λ(q)
    const saida = m.lambda[q];
    if (saida === undefined || saida === null || saida === '') {
      erros.push(`O estado "${q}" não possui uma saída λ associada.`);
    } else if (!m.Gamma.includes(saida)) {
      erros.push(`A saída λ("${q}") = "${saida}" não pertence ao alfabeto de saídas Γ.`);
    }

    // Validação da transição δ(q, s) para todo s ∈ Σ
    m.Sigma.forEach((s) => {
      const destino = m.delta[q]?.[s];
      if (!destino) {
        erros.push(`Transição indefinida: δ("${q}", "${s}") não foi informada.`);
      } else if (!m.Q.includes(destino)) {
        erros.push(`Transição inconsistente: δ("${q}", "${s}") leva para "${destino}", que não existe em Q.`);
      }
    });
  });

  return erros;
}

/**
 * Executa um único passo da máquina de Moore a partir do estado atual e símbolo de entrada.
 */
export function executarPasso(m: MooreMachine, estadoAtual: string, simbolo: string): string {
  if (!m.Sigma.includes(simbolo)) {
    throw new Error(`O símbolo de entrada "${simbolo}" não pertence ao alfabeto Σ = {${m.Sigma.join(', ')}}.`);
  }
  const prox = m.delta[estadoAtual]?.[simbolo];
  if (!prox) {
    throw new Error(`Transição indefinida para δ("${estadoAtual}", "${simbolo}").`);
  }
  return prox;
}

/**
 * Retorna a saída observável de um estado na máquina de Moore.
 */
export function obterSaida(m: MooreMachine, estado: string): string {
  return m.lambda[estado] ?? 'INDEFINIDA';
}

/**
 * Executa uma sequência completa de símbolos e retorna todo o histórico passo a passo.
 */
export function executarSequencia(m: MooreMachine, sequencia: string[]): StepHistoryItem[] {
  let q = m.q0;
  const historico: StepHistoryItem[] = [
    {
      passo: 0,
      entrada: null,
      estadoAnterior: null,
      estado: q,
      saida: obterSaida(m, q),
      timestamp: Date.now(),
    },
  ];

  for (let i = 0; i < sequencia.length; i++) {
    const s = sequencia[i];
    const anterior = q;
    q = executarPasso(m, q, s);
    historico.push({
      passo: i + 1,
      entrada: s,
      estadoAnterior: anterior,
      estado: q,
      saida: obterSaida(m, q),
      timestamp: Date.now() + i,
    });
  }

  return historico;
}

/**
 * Retorna apenas o vetor de saídas correspondente a uma sequência de entradas.
 */
export function obterSaidasSequencia(m: MooreMachine, sequencia: string[]): string[] {
  return executarSequencia(m, sequencia).map((h) => h.saida);
}
