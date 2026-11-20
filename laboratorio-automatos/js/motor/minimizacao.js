/*
 * CAMADA 2 - MOTOR DE AUTOMATOS
 * Arquivo: minimizacao.js
 *
 * Minimizacao de maquina de Moore por REFINAMENTO DE PARTICOES.
 *
 *  1) Remove estados inalcancaveis a partir de q0.
 *  2) P0: agrupa os estados pela SAIDA lambda (estados com saidas
 *     diferentes nunca podem ser equivalentes).
 *  3) Em cada rodada, divide os blocos cujos estados levam, para algum
 *     simbolo, a blocos de destino diferentes.
 *  4) Repete ate nenhum bloco mudar. Cada bloco vira um estado do automato
 *     minimo, herdando transicao e saida de qualquer membro.
 *
 * Custo de pior caso: cada rodada olha |Q|*|Sigma| transicoes e ha no
 * maximo |Q| rodadas, ou seja, O(|Q|^2 * |Sigma|) - quadratico em |Q|.
 *
 * Devolve tambem a lista de particoes P0, P1, ... com explicacoes, para a
 * interface mostrar o passo a passo (a interface so le, nao recalcula).
 */
(function () {
  var Lab = (typeof window !== 'undefined') ? (window.Lab = window.Lab || {}) : (globalThis.Lab = globalThis.Lab || {});

  /* Nome didatico de um bloco: {T1,T2}. */
  function nomeDoBloco(estados) { return '{' + estados.join(',') + '}'; }

  /* Transforma o mapa estado->indice_do_bloco em lista de blocos (listas de estados). */
  function blocosDe(Q, indice) {
    var blocos = [];
    Q.forEach(function (q) {
      var i = indice[q];
      if (!blocos[i]) blocos[i] = [];
      blocos[i].push(q);
    });
    return blocos;
  }

  function minimizar(original) {
    var rem = Lab.Alcancaveis.removerInalcancaveis(original);
    var m = rem.maquina;
    var Q = m.Q;
    var particoes = [];

    // ---- P0: agrupar pela saida ----
    var indice = {};          // estado -> numero do bloco atual
    var porSaida = {};        // saida -> numero do bloco
    var qtd = 0;
    Q.forEach(function (q) {
      var g = m.lambda[q];
      if (!(g in porSaida)) porSaida[g] = qtd++;
      indice[q] = porSaida[g];
    });
    particoes.push({
      rodada: 0,
      blocos: blocosDe(Q, indice),
      mudou: true,
      explicacao: 'P0: estados com a mesma saída (λ) ficam juntos.'
    });

    // ---- Rodadas de refinamento ----
    var estavel = false;
    while (!estavel) {
      var novoIndice = {};
      var porAssinatura = {};
      var total = 0;
      var motivos = [];
      Q.forEach(function (q) {
        // Assinatura = bloco atual + bloco de destino para cada simbolo de Sigma.
        var destinos = m.Sigma.map(function (s) { return indice[m.delta[q][s]]; });
        var chave = indice[q] + '|' + destinos.join(',');
        if (!(chave in porAssinatura)) porAssinatura[chave] = total++;
        novoIndice[q] = porAssinatura[chave];
      });

      estavel = (total === qtd);  // so se divide: se o numero de blocos nao cresceu, nada mudou
      if (!estavel) {
        // Texto didatico: quais blocos antigos foram divididos?
        var antigos = blocosDe(Q, indice), novos = blocosDe(Q, novoIndice);
        antigos.forEach(function (b) {
          var partes = novos.filter(function (n) { return indice[n[0]] === indice[b[0]]; });
          if (partes.length > 1) {
            motivos.push(nomeDoBloco(b) + ' foi dividido em ' + partes.map(nomeDoBloco).join(' e ') + ', pois seus estados levam a blocos diferentes.');
          }
        });
        indice = novoIndice;
        qtd = total;
        particoes.push({
          rodada: particoes.length,
          blocos: blocosDe(Q, indice),
          mudou: true,
          explicacao: motivos.join(' ')
        });
      } else {
        particoes[particoes.length - 1].estavel = true;
        particoes[particoes.length - 1].explicacao += ' (Última rodada confirmou: nenhum bloco mudou, a partição está estável.)';
      }
    }

    // ---- Montar o automato minimo ----
    var blocos = blocosDe(Q, indice);
    var nomes = blocos.map(nomeDoBloco);
    var delta = {}, lambda = {};
    blocos.forEach(function (b, i) {
      var rep = b[0];  // qualquer membro serve como representante
      delta[nomes[i]] = {};
      m.Sigma.forEach(function (s) { delta[nomes[i]][s] = nomes[indice[m.delta[rep][s]]]; });
      lambda[nomes[i]] = m.lambda[rep];
    });
    var minimo = {
      nome: (original.nome || 'Máquina') + ' (mínimo)',
      Q: nomes.slice(),
      Sigma: m.Sigma.slice(),
      delta: delta,
      q0: nomes[indice[m.q0]],
      Gamma: m.Gamma.slice(),
      lambda: lambda
    };

    return {
      nOriginal: original.Q.length,
      removidos: rem.removidos,
      nAlcancaveis: Q.length,
      particoes: particoes,
      minimo: minimo,
      nMinimo: nomes.length,
      blocoDe: Object.keys(indice).reduce(function (o, q) { o[q] = nomes[indice[q]]; return o; }, {})
    };
  }

  Lab.Minimizacao = { minimizar: minimizar };
})();
