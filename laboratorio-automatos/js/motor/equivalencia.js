/*
 * CAMADA 2 - MOTOR DE AUTOMATOS
 * Arquivo: equivalencia.js
 *
 * Validacao de equivalencia entre duas maquinas de Moore (original x minima).
 * Duas maquinas sao equivalentes se, para TODA sequencia de entrada, produzem
 * a mesma sequencia de saidas (incluindo a saida do estado inicial).
 *
 *  - aleatoria(): compara 400 sequencias de 30 simbolos (teste de amostra).
 *  - exata():     busca em largura sobre PARES de estados (prova completa).
 */
(function () {
  var Lab = (typeof window !== 'undefined') ? (window.Lab = window.Lab || {}) : (globalThis.Lab = globalThis.Lab || {});

  /* Gerador pseudoaleatorio com semente (mulberry32): mesma semente, mesmo resultado.
     Assim o teste e repetivel e da para reproduzir uma falha. */
  function gerador(semente) {
    var a = semente >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function mesmoAlfabeto(a, b) {
    return a.Sigma.length === b.Sigma.length && a.Sigma.every(function (s) { return b.Sigma.indexOf(s) >= 0; });
  }

  function aleatoria(a, b, qtdSequencias, tamanho, semente) {
    qtdSequencias = qtdSequencias || 400;
    tamanho = tamanho || 30;
    if (!mesmoAlfabeto(a, b)) return { equivalentes: false, motivo: 'Os alfabetos Σ são diferentes.' };
    var rnd = gerador(semente === undefined ? 12345 : semente);
    for (var i = 0; i < qtdSequencias; i++) {
      var seq = [];
      for (var j = 0; j < tamanho; j++) seq.push(a.Sigma[Math.floor(rnd() * a.Sigma.length)]);
      var sa = Lab.Moore.saidas(a, seq), sb = Lab.Moore.saidas(b, seq);
      for (var k = 0; k < sa.length; k++) {
        if (sa[k] !== sb[k]) return { equivalentes: false, testadas: i + 1, contraexemplo: seq.slice(0, k), motivo: 'Saídas diferentes após ler a sequência.' };
      }
    }
    return { equivalentes: true, testadas: qtdSequencias, tamanho: tamanho };
  }

  /* BFS sobre pares (qa, qb): se algum par alcancavel tem saidas diferentes,
     as maquinas NAO sao equivalentes e o caminho ate o par e o contraexemplo. */
  function exata(a, b) {
    if (!mesmoAlfabeto(a, b)) return { equivalentes: false, motivo: 'Os alfabetos Σ são diferentes.' };
    var chave = function (x, y) { return x + '\u0000' + y; };
    var pai = {};
    var inicio = chave(a.q0, b.q0);
    pai[inicio] = null;
    var fila = [[a.q0, b.q0]];
    var pares = 0;
    while (fila.length) {
      var par = fila.shift();
      pares++;
      var qa = par[0], qb = par[1], ch = chave(qa, qb);
      if (a.lambda[qa] !== b.lambda[qb]) {
        var caminho = [];
        for (var c = ch; pai[c] && pai[c].de !== null; c = pai[c].de) caminho.unshift(pai[c].simbolo);
        return { equivalentes: false, paresVisitados: pares, contraexemplo: caminho, motivo: 'Os estados (' + qa + ', ' + qb + ') têm saídas diferentes.' };
      }
      for (var i = 0; i < a.Sigma.length; i++) {
        var s = a.Sigma[i];
        var prox = [a.delta[qa][s], b.delta[qb][s]], pc = chave(prox[0], prox[1]);
        if (!(pc in pai)) { pai[pc] = { de: ch, simbolo: s }; fila.push(prox); }
      }
    }
    return { equivalentes: true, paresVisitados: pares };
  }

  Lab.Equivalencia = { aleatoria: aleatoria, exata: exata };
})();
