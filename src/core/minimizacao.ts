import { MooreMachine, MinimizationResult, PartitionRound } from '../types/automaton';
import { removerInalcancaveis } from './alcancaveis';

/**
 * Formatação do nome de um bloco de estados equivalentes: ex: "{T1, T2}"
 */
export function formatarNomeBloco(estados: string[]): string {
  return '{' + [...estados].sort().join(', ') + '}';
}

/**
 * Converte o mapeamento { [estado]: indiceBloco } em uma lista de blocos de estados.
 */
function extrairBlocos(Q: string[], indice: Record<string, number>): string[][] {
  const blocos: string[][] = [];
  Q.forEach((q) => {
    const idx = indice[q];
    if (!blocos[idx]) blocos[idx] = [];
    blocos[idx].push(q);
  });
  return blocos;
}

/**
 * Algoritmo de Minimização de Máquinas de Moore por Refinamento de Partições.
 *
 * 1. Remove estados inalcançáveis a partir de q0.
 * 2. Partição Inicial P0: agrupa os estados estritamente pela sua saída observável λ (estados com saídas distintas jamais são equivalentes).
 * 3. Rodadas sucessivas (P1, P2, ...): analisa a assinatura de transição de cada estado (bloco atual + bloco de destino para cada símbolo de Σ).
 *    Caso estados no mesmo bloco tenham destinos em blocos distintos para algum símbolo, eles são refinados (separados).
 * 4. Critério de parada: quando o número de blocos não se altera em uma rodada, a partição é declarada estável.
 * 5. Construção do autômato mínimo: cada bloco final torna-se um estado da máquina minimizada, preservando transições e saídas.
 */
export function minimizarMoore(original: MooreMachine): MinimizationResult {
  const { maquina: m, removidos } = removerInalcancaveis(original);
  const Q = m.Q;
  const particoes: PartitionRound[] = [];

  // ==========================================
  // ETAPA 1: Partição Inicial P0 (por saída)
  // ==========================================
  let indice: Record<string, number> = {};
  const porSaida: Record<string, number> = {};
  let totalBlocos = 0;

  Q.forEach((q) => {
    const saida = m.lambda[q];
    if (!(saida in porSaida)) {
      porSaida[saida] = totalBlocos++;
    }
    indice[q] = porSaida[saida];
  });

  const blocosP0 = extrairBlocos(Q, indice);
  const resumoP0 = blocosP0
    .map((b) => `${formatarNomeBloco(b)} (saída: ${m.lambda[b[0]]})`)
    .join(', ');

  particoes.push({
    rodada: 0,
    blocos: blocosP0,
    mudou: true,
    explicacao: `Partição inicial P0 agrupando estados com a mesma saída λ: ${resumoP0}.`,
  });

  // ==========================================
  // ETAPA 2: Refinamento Iterativo (P1, P2...)
  // ==========================================
  let estavel = false;
  let rodadaContador = 1;

  while (!estavel) {
    const novoIndice: Record<string, number> = {};
    const porAssinatura: Record<string, number> = {};
    const assinaturasDetalhadas: Record<string, { estado: string; blocoAtual: number; destinos: number[]; chave: string }> = {};
    let novosBlocosTotal = 0;
    const motivos: string[] = [];

    Q.forEach((q) => {
      // Assinatura de transição = [bloco_atual] + [destino_para_cada_simbolo_de_Sigma]
      const destinos = m.Sigma.map((s) => indice[m.delta[q][s]]);
      const chave = `${indice[q]}|${destinos.join(',')}`;

      if (!(chave in porAssinatura)) {
        porAssinatura[chave] = novosBlocosTotal++;
      }
      novoIndice[q] = porAssinatura[chave];

      assinaturasDetalhadas[q] = {
        estado: q,
        blocoAtual: indice[q],
        destinos,
        chave,
      };
    });

    estavel = novosBlocosTotal === totalBlocos;

    if (!estavel) {
      // Analisar quais blocos anteriores foram divididos
      const blocosAntigos = extrairBlocos(Q, indice);
      const blocosNovos = extrairBlocos(Q, novoIndice);

      blocosAntigos.forEach((bAntigo) => {
        // Encontrar as subdivisões do bloco antigo
        const partes = blocosNovos.filter((n) => indice[n[0]] === indice[bAntigo[0]]);
        if (partes.length > 1) {
          motivos.push(
            `O bloco ${formatarNomeBloco(bAntigo)} foi dividido em ${partes.map(formatarNomeBloco).join(' e ')}, pois seus estados transitam para blocos diferentes ao receber entradas.`
          );
        }
      });

      indice = novoIndice;
      totalBlocos = novosBlocosTotal;

      particoes.push({
        rodada: rodadaContador,
        blocos: extrairBlocos(Q, indice),
        mudou: true,
        explicacao: motivos.length > 0 ? motivos.join(' ') : `Rodada ${rodadaContador}: refinamento das transições.`,
        assinaturas: assinaturasDetalhadas,
      });

      rodadaContador++;
    } else {
      // A partição atingiu estabilidade
      const ultima = particoes[particoes.length - 1];
      ultima.estavel = true;
      ultima.explicacao += ' (Partição estável alcançada: todos os estados do mesmo bloco transitam para blocos equivalentes sob qualquer entrada de Σ).';
    }
  }

  // ==========================================
  // ETAPA 3: Construção da Máquina Minimizada
  // ==========================================
  const blocosFinais = extrairBlocos(Q, indice);
  const nomesNovos = blocosFinais.map(formatarNomeBloco);

  const novoDelta: Record<string, Record<string, string>> = {};
  const novoLambda: Record<string, string> = {};

  blocosFinais.forEach((bloco, i) => {
    const representante = bloco[0];
    const nomeBloco = nomesNovos[i];
    novoDelta[nomeBloco] = {};

    m.Sigma.forEach((s) => {
      const destOriginal = m.delta[representante][s];
      const indiceDestino = indice[destOriginal];
      novoDelta[nomeBloco][s] = nomesNovos[indiceDestino];
    });

    novoLambda[nomeBloco] = m.lambda[representante];
  });

  const estadoInicialMinimo = nomesNovos[indice[m.q0]];

  const maquinaMinima: MooreMachine = {
    nome: `${original.nome} (Minimizado)`,
    descricao: `Versão mínima equivalente de "${original.nome}", com ${nomesNovos.length} estados.`,
    tipoFisico: original.tipoFisico,
    Q: nomesNovos,
    Sigma: [...m.Sigma],
    delta: novoDelta,
    q0: estadoInicialMinimo,
    Gamma: Array.from(new Set(Object.values(novoLambda))),
    lambda: novoLambda,
  };

  const blocoDe: Record<string, string> = {};
  Object.keys(indice).forEach((q) => {
    blocoDe[q] = nomesNovos[indice[q]];
  });

  const reducaoPercentual =
    original.Q.length > 0
      ? Math.round(((original.Q.length - nomesNovos.length) / original.Q.length) * 100)
      : 0;

  return {
    original,
    nOriginal: original.Q.length,
    removidos,
    nAlcancaveis: Q.length,
    particoes,
    minimo: maquinaMinima,
    nMinimo: nomesNovos.length,
    blocoDe,
    reducaoPercentual,
  };
}
