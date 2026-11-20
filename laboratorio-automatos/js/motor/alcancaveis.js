/*
 * CAMADA 2 - MOTOR DE AUTOMATOS
 * Arquivo: alcancaveis.js
 *
 * Passo 1 do algoritmo: remover estados inalcancaveis a partir de q0.
 * Um estado e alcancavel se existe alguma sequencia de entradas que leva
 * de q0 ate ele. Usamos busca em largura (BFS).
 */
(function () {
  var Lab = (typeof window !== 'undefined') ? (window.Lab = window.Lab || {}) : (globalThis.Lab = globalThis.Lab || {});

  /* Devolve os estados alcancaveis, na ordem em que a BFS os descobre. */
  function calcular(m) {
    var visto = {};
    visto[m.q0] = true;
    var fila = [m.q0];
    var ordem = [];
    while (fila.length) {
      var q = fila.shift();
      ordem.push(q);
      m.Sigma.forEach(function (s) {
        var d = m.delta[q][s];
        if (!visto[d]) { visto[d] = true; fila.push(d); }
      });
    }
    return ordem;
  }

  /* Devolve { maquina, removidos }: copia da maquina so com estados alcancaveis. */
  function removerInalcancaveis(m) {
    var alc = calcular(m);
    var conj = {};
    alc.forEach(function (q) { conj[q] = true; });

    var delta = {}, lambda = {};
    alc.forEach(function (q) { delta[q] = {}; m.Sigma.forEach(function (s) { delta[q][s] = m.delta[q][s]; }); lambda[q] = m.lambda[q]; });

    var Gamma = m.Gamma.filter(function (g) { return alc.some(function (q) { return lambda[q] === g; }); });
    return {
      maquina: { nome: m.nome, Q: m.Q.filter(function (q) { return conj[q]; }), Sigma: m.Sigma.slice(), delta: delta, q0: m.q0, Gamma: Gamma, lambda: lambda },
      removidos: m.Q.filter(function (q) { return !conj[q]; })
    };
  }

  Lab.Alcancaveis = { calcular: calcular, removerInalcancaveis: removerInalcancaveis };
})();
