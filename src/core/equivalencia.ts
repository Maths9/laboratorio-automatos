import { MooreMachine, EquivalenceTestResult } from '../types/automaton';
import { obterSaidasSequencia } from './moore';

/**
 * Gerador pseudoaleatório com semente (Mulberry32) para testes 100% reproduzíveis.
 */
export function criarGeradorPseudoaleatorio(semente: number = 12345): () => number {
  let a = semente >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Verifica se duas máquinas possuem o mesmo alfabeto de entrada Σ.
 */
export function mesmosAlfabetosEntrada(a: MooreMachine, b: MooreMachine): boolean {
  if (a.Sigma.length !== b.Sigma.length) return false;
  return a.Sigma.every((s) => b.Sigma.includes(s));
}

/**
 * Validação por 400 sequências aleatórias de símbolos de entrada.
 * Compara as saídas observáveis produzidas por ambas as máquinas em cada passo.
 */
export function validarEquivalenciaAleatoria(
  maquinaA: MooreMachine,
  maquinaB: MooreMachine,
  qtdSequencias: number = 400,
  comprimentoSequencia: number = 30,
  semente: number = 12345
): EquivalenceTestResult {
  if (!mesmosAlfabetosEntrada(maquinaA, maquinaB)) {
    return {
      equivalentes: false,
      motivo: `Os alfabetos de entrada Σ são incompatíveis: {${maquinaA.Sigma.join(', ')}} vs {${maquinaB.Sigma.join(', ')}}.`,
    };
  }

  const rng = criarGeradorPseudoaleatorio(semente);

  for (let i = 0; i < qtdSequencias; i++) {
    const sequencia: string[] = [];
    for (let j = 0; j < comprimentoSequencia; j++) {
      const idx = Math.floor(rng() * maquinaA.Sigma.length);
      sequencia.push(maquinaA.Sigma[idx]);
    }

    const saidasA = obterSaidasSequencia(maquinaA, sequencia);
    const saidasB = obterSaidasSequencia(maquinaB, sequencia);

    for (let k = 0; k < saidasA.length; k++) {
      if (saidasA[k] !== saidasB[k]) {
        return {
          equivalentes: false,
          testadas: i + 1,
          tamanho: comprimentoSequencia,
          contraexemplo: sequencia.slice(0, k),
          motivo: `Divergência de saída detectada no passo ${k}: Máquina A gerou "${saidasA[k]}", enquanto Máquina B gerou "${saidasB[k]}".`,
          saidasA: saidasA.slice(0, k + 1),
          saidasB: saidasB.slice(0, k + 1),
        };
      }
    }
  }

  return {
    equivalentes: true,
    testadas: qtdSequencias,
    tamanho: comprimentoSequencia,
  };
}

/**
 * Validação formal exata através de Busca em Largura (BFS) no espaço cartesiano de pares de estados (qa, qb).
 * Prova matematicamente a equivalência se nenhum par alcançável produzir saídas distintas.
 */
export function validarEquivalenciaExata(maquinaA: MooreMachine, maquinaB: MooreMachine): EquivalenceTestResult {
  if (!mesmosAlfabetosEntrada(maquinaA, maquinaB)) {
    return {
      equivalentes: false,
      motivo: `Os alfabetos de entrada Σ são incompatíveis: {${maquinaA.Sigma.join(', ')}} vs {${maquinaB.Sigma.join(', ')}}.`,
    };
  }

  const chave = (qa: string, qb: string) => `${qa}\u0000${qb}`;
  const pai: Record<string, { de: string | null; simbolo: string | null }> = {};
  const inicio = chave(maquinaA.q0, maquinaB.q0);
  pai[inicio] = { de: null, simbolo: null };

  const fila: [string, string][] = [[maquinaA.q0, maquinaB.q0]];
  let paresVisitados = 0;

  while (fila.length > 0) {
    const [qa, qb] = fila.shift()!;
    paresVisitados++;
    const ch = chave(qa, qb);

    const saidaA = maquinaA.lambda[qa];
    const saidaB = maquinaB.lambda[qb];

    if (saidaA !== saidaB) {
      // Reconstroi o contraexemplo
      const caminho: string[] = [];
      let atual: string | null = ch;
      while (atual && pai[atual]?.de !== null) {
        if (pai[atual].simbolo) caminho.unshift(pai[atual].simbolo!);
        atual = pai[atual].de;
      }

      return {
        equivalentes: false,
        paresVisitados,
        contraexemplo: caminho,
        motivo: `Par de estados inalcançáveis com saídas discrepantes: λ("${qa}") = "${saidaA}" ≠ λ("${qb}") = "${saidaB}".`,
        saidasA: obterSaidasSequencia(maquinaA, caminho),
        saidasB: obterSaidasSequencia(maquinaB, caminho),
      };
    }

    for (let i = 0; i < maquinaA.Sigma.length; i++) {
      const s = maquinaA.Sigma[i];
      const proxA = maquinaA.delta[qa]?.[s];
      const proxB = maquinaB.delta[qb]?.[s];

      if (!proxA || !proxB) continue;

      const pc = chave(proxA, proxB);
      if (!(pc in pai)) {
        pai[pc] = { de: ch, simbolo: s };
        fila.push([proxA, proxB]);
      }
    }
  }

  return {
    equivalentes: true,
    paresVisitados,
  };
}
