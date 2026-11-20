import { MooreMachine } from '../types/automaton';

/**
 * Remove estados inalcançáveis a partir do estado inicial q0 via BFS.
 * Retorna uma nova máquina contendo apenas os estados acessíveis e a lista de removidos.
 */
export function removerInalcancaveis(original: MooreMachine): { maquina: MooreMachine; removidos: string[] } {
  const visitados = new Set<string>();
  const fila: string[] = [];

  if (original.Q.includes(original.q0)) {
    visitados.add(original.q0);
    fila.push(original.q0);
  }

  while (fila.length > 0) {
    const atual = fila.shift()!;
    const trans = original.delta[atual] || {};
    original.Sigma.forEach((s) => {
      const dest = trans[s];
      if (dest && original.Q.includes(dest) && !visitados.has(dest)) {
        visitados.add(dest);
        fila.push(dest);
      }
    });
  }

  const alcancaveis = original.Q.filter((q) => visitados.has(q));
  const removidos = original.Q.filter((q) => !visitados.has(q));

  const novoDelta: Record<string, Record<string, string>> = {};
  const novoLambda: Record<string, string> = {};

  alcancaveis.forEach((q) => {
    novoDelta[q] = {};
    original.Sigma.forEach((s) => {
      novoDelta[q][s] = original.delta[q][s];
    });
    novoLambda[q] = original.lambda[q];
  });

  const maquinaLimpa: MooreMachine = {
    nome: original.nome,
    descricao: original.descricao,
    tipoFisico: original.tipoFisico,
    Q: alcancaveis,
    Sigma: [...original.Sigma],
    delta: novoDelta,
    q0: original.q0,
    Gamma: [...original.Gamma],
    lambda: novoLambda,
  };

  return { maquina: maquinaLimpa, removidos };
}
