/*
 * CAMADA 2 - MOTOR DE AUTOMATOS
 * Arquivo: moore.js
 *
 * Maquina de Moore M = (Q, Sigma, delta, q0, Gamma, lambda), descrita em JSON:
 *   Q      -> conjunto de estados              (lista de textos)
 *   Sigma  -> alfabeto de entrada              (lista de textos)
 *   delta  -> funcao de transicao  Q x Sigma -> Q   (objeto: delta[estado][simbolo])
 *   q0     -> estado inicial
 *   Gamma  -> alfabeto de saida                (lista de textos)
 *   lambda -> funcao de saida  Q -> Gamma      (objeto: lambda[estado])
 *
 * Em uma maquina de Moore a saida depende SO do estado. Por isso a saida
 * do estado inicial q0 ja existe antes de qualquer simbolo ser lido.
 *
 * Este arquivo NAO conhece SVG, HTML nem catraca/semaforo (sem acoplamento).
 */
(function () {
  var Lab = (typeof window !== 'undefined')
    ? (window.Lab = window.Lab || {})
    : (globalThis.Lab = globalThis.Lab || {});

  /* Confere se o JSON descreve uma maquina de Moore completa e coerente.
     Devolve uma lista de mensagens de erro em portugues (lista vazia = ok). */
  function validar(m) {
    var erros = [];
    if (!m || typeof m !== 'object') return ['A máquina precisa ser um objeto JSON.'];
    ['Q', 'Sigma', 'Gamma'].forEach(function (c) {
      if (!Array.isArray(m[c]) || m[c].length === 0) erros.push('O conjunto ' + c + ' precisa ser uma lista não vazia.');
    });
    if (typeof m.q0 !== 'string') erros.push('Falta o estado inicial q0.');
    if (!m.delta || typeof m.delta !== 'object') erros.push('Falta a função de transição δ (delta).');
    if (!m.lambda || typeof m.lambda !== 'object') erros.push('Falta a função de saída λ (lambda).');
    if (erros.length) return erros;

    if (m.Q.indexOf(m.q0) < 0) erros.push('O estado inicial q0 = ' + m.q0 + ' não pertence a Q.');
    m.Q.forEach(function (q) {
      // λ precisa estar definida e dentro de Γ
      if (m.Gamma.indexOf(m.lambda[q]) < 0) erros.push('λ(' + q + ') não está definida em Γ.');
      // δ precisa ser total: um destino para cada símbolo de Σ
      m.Sigma.forEach(function (s) {
        var destino = m.delta[q] && m.delta[q][s];
        if (m.Q.indexOf(destino) < 0) erros.push('δ(' + q + ', ' + s + ') não leva a um estado de Q.');
      });
    });
    return erros;
  }

  /* delta(q, simbolo): um passo da maquina. */
  function passo(m, q, simbolo) {
    if (m.Sigma.indexOf(simbolo) < 0) throw new Error('O símbolo "' + simbolo + '" não pertence a Σ.');
    return m.delta[q][simbolo];
  }

  /* lambda(q): saida associada ao estado. */
  function saida(m, q) {
    return m.lambda[q];
  }

  /* Executa uma sequencia (lista de simbolos) a partir de q0.
     Devolve o historico: o passo 0 e o estado inicial, ainda sem entrada. */
  function executar(m, sequencia) {
    var q = m.q0;
    var historico = [{ passo: 0, entrada: null, estado: q, saida: saida(m, q) }];
    for (var i = 0; i < sequencia.length; i++) {
      q = passo(m, q, sequencia[i]);
      historico.push({ passo: i + 1, entrada: sequencia[i], estado: q, saida: saida(m, q) });
    }
    return historico;
  }

  /* Apenas as saidas da execucao (incluindo a do estado inicial). */
  function saidas(m, sequencia) {
    return executar(m, sequencia).map(function (h) { return h.saida; });
  }

  Lab.Moore = { validar: validar, passo: passo, saida: saida, executar: executar, saidas: saidas };
})();
