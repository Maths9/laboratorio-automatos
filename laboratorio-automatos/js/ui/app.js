/*
 * CAMADA 3 - INTERFACE EDUCACIONAL
 * Arquivo: app.js
 * Liga botoes e paineis ao motor (Lab.Moore, Lab.Minimizacao, Lab.Equivalencia).
 * A interface nao calcula nada de automatos: so chama o motor e mostra o resultado.
 * Gancho para a camada 1 (Etapa 4): se existir Lab.aoMudarEstado(maquina, estado),
 * ele e chamado a cada mudanca de estado.
 */
(function () {
  var Lab = window.Lab, $ = function (i) { return document.getElementById(i); };
  var orig, res, modo, atual, hist, vis, ult, cron;

  function M() { return modo === 'minimo' ? res.minimo : orig; }
  function lista(a) { return '{' + a.join(', ') + '}'; }
  function msg(t, tipo) { var e = $('msg'); e.textContent = t; e.className = ''; void e.offsetWidth; e.className = 'msg ' + (tipo || 'info'); }   // reinicia a animacao

  // Redesenha diagrama, definicao formal, tabela de δ e λ, estado atual e historico.
  function render() {
    var m = M();
    Lab.Diagrama.desenhar($('diagrama'), m, atual, ult);
    $('def').textContent = 'Q = ' + lista(m.Q) + ' · Σ = ' + lista(m.Sigma) + ' · q0 = ' + m.q0 + ' · Γ = ' + lista(m.Gamma);
    var t = '<caption>Funções δ e λ</caption><tr><th scope="col">q</th>' +
      m.Sigma.map(function (s) { return '<th scope="col">δ(q, ' + s + ')</th>'; }).join('') + '<th scope="col">λ(q)</th></tr>';
    m.Q.forEach(function (q) {
      t += '<tr><th scope="row">' + q + '</th>' + m.Sigma.map(function (s) { return '<td>' + m.delta[q][s] + '</td>'; }).join('') + '<td>' + m.lambda[q] + '</td></tr>';
    });
    $('tab-delta').innerHTML = t;
    $('atual').textContent = 'Estado atual: ' + atual + ' · saída λ(' + atual + ') = ' + m.lambda[atual];
    $('hist').innerHTML = hist.map(function (h) {
      return '<tr><td>' + h.passo + '</td><td>' + (h.entrada || '—') + '</td><td>' + h.estado + '</td><td>' + h.saida + '</td></tr>';
    }).join('');
    var rol = $('hist').parentNode.parentNode; rol.scrollTop = rol.scrollHeight;   // acompanha a ultima linha
    if (Lab.aoMudarEstado) Lab.aoMudarEstado(m, atual);
  }

  // Botoes de entrada (um por simbolo de Σ). Montados uma vez, para nao perder o foco do teclado.
  function montarEntradas() {
    var ent = $('entradas'); ent.innerHTML = '';
    M().Sigma.forEach(function (s) {
      var b = document.createElement('button');
      b.textContent = s; b.setAttribute('aria-label', 'Entrada ' + s);
      b.onclick = function () { entrar([s]); };
      ent.appendChild(b);
    });
  }

  function reiniciar() {
    var m = M(); atual = m.q0; ult = null;
    hist = [{ passo: 0, entrada: null, estado: atual, saida: m.lambda[atual] }];
    render(); msg('Simulação reiniciada no estado inicial q0 = ' + atual + '.');
  }

  function entrar(seq) {
    var m = M(), ant = atual;
    seq.forEach(function (s) {
      ant = atual; atual = Lab.Moore.passo(m, atual, s); ult = { de: ant, simbolo: s };
      hist.push({ passo: hist.length, entrada: s, estado: atual, saida: Lab.Moore.saida(m, atual) });
    });
    render();
    var h = hist[hist.length - 1];
    msg('Entrada ' + h.entrada + ': δ(' + ant + ', ' + h.entrada + ') = ' + h.estado + ' · saída ' + h.saida + '.');
  }

  function executar() {
    var texto = $('seq').value.toUpperCase().replace(/[\s,]/g, ''), seq = texto.split('').filter(Boolean), m = M();
    for (var i = 0; i < seq.length; i++) {
      if (m.Sigma.indexOf(seq[i]) < 0) { msg('O símbolo "' + seq[i] + '" (posição ' + (i + 1) + ') não pertence a Σ = ' + lista(m.Sigma) + '.', 'erro'); return; }
    }
    if (!seq.length) { msg('Digite uma sequência de símbolos de Σ = ' + lista(m.Sigma) + '.', 'erro'); return; }
    reiniciar(); entrar(seq);
    msg('Sequência ' + seq.join('') + ' executada a partir de q0. Estado final: ' + atual + ', saída ' + M().lambda[atual] + '.', 'ok');
  }

  function ver(nome) {
    modo = nome;
    $('ver-orig').setAttribute('aria-pressed', nome === 'original');
    $('ver-min').setAttribute('aria-pressed', nome === 'minimo');
    montarEntradas(); reiniciar();
    var dg = $('diagrama'); dg.classList.remove('troca'); void dg.offsetWidth; dg.classList.add('troca');
    msg('Mostrando o autômato ' + (nome === 'minimo' ? 'mínimo (' + res.nMinimo + ' estados).' : 'original (' + res.nOriginal + ' estados).'));
  }

  function carregar(nome) {
    orig = Lab.Maquinas[nome]; res = Lab.Minimizacao.minimizar(orig); vis = 0;
    // Camada 1: o sensor dispara um simbolo de Σ e a interface o entrega ao motor.
    Lab.Fisico.usar(nome, $('fisico'), function (s) { entrar([s]); });
    clearInterval(cron); $('partes').innerHTML = ''; $('resumo').textContent = '';
    $('prox').disabled = true; $('ver-min').disabled = true;
    ver('original');
    msg('Sistema carregado: ' + orig.nome + ' (' + res.nOriginal + ' estados).');
  }

  // Contagem animada n → m (direto ao resultado se o usuario pediu menos movimento).
  function contar(de, ate, fn) {
    clearInterval(cron);
    var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, n = de;
    fn(n);
    if (quieto || de === ate) { fn(ate); return; }
    cron = setInterval(function () { n += n > ate ? -1 : 1; fn(n); if (n === ate) clearInterval(cron); }, 350);
  }

  // Mostra a proxima particao (P0, P1, ...). Ao chegar na ultima, mostra n → m.
  function avancar() {
    var p = res.particoes[vis++], li = document.createElement('li');
    li.innerHTML = '<strong>P' + p.rodada + '</strong> ' + p.blocos.map(function (b) { return '<span class="bloco">' + lista(b) + '</span>'; }).join(' ') + '<br><small>' + p.explicacao + '</small>';
    $('partes').appendChild(li);
    if (vis < res.particoes.length) { $('prox').disabled = false; msg('P' + p.rodada + ' mostrada. Aperte "Próxima rodada" para refinar.'); return; }
    $('prox').disabled = true; $('ver-min').disabled = false;
    var rem = res.removidos.length ? ' (inalcançáveis removidos: ' + res.removidos.join(', ') + ')' : '';
    contar(res.nOriginal, res.nMinimo, function (n) { $('resumo').textContent = 'Resultado: ' + res.nOriginal + ' estados → ' + n + ' estados' + (n === res.nMinimo ? rem + '.' : ''); });
    msg('Partição estável: ' + res.nOriginal + ' → ' + res.nMinimo + ' estados. Use o botão "Mínimo" para ver o autômato mínimo.', 'ok');
    $('ver-min').focus();
  }

  function iniciarMin() { vis = 0; clearInterval(cron); $('partes').innerHTML = ''; $('resumo').textContent = ''; $('ver-min').disabled = true; avancar(); if (vis < res.particoes.length) $('prox').focus(); }

  function validar() {
    var a = Lab.Equivalencia.aleatoria(orig, res.minimo, 400, 30), b = Lab.Equivalencia.exata(orig, res.minimo);
    if (a.equivalentes && b.equivalentes) {
      msg('Equivalentes! Saídas iguais em ' + a.testadas + ' sequências aleatórias de ' + a.tamanho + ' símbolos, e a verificação exata percorreu ' + b.paresVisitados + ' pares de estados sem achar diferença.', 'ok');
    } else {
      var c = b.contraexemplo || a.contraexemplo || [];
      msg('NÃO equivalentes. Contraexemplo: ' + (c.join('') || '(sequência vazia)') + '.', 'erro');
    }
  }

  // Camada 1: a saida do estado atual vai para os atuadores do sistema fisico.
  Lab.aoMudarEstado = function (m, q) { Lab.Fisico.mostrar(m.lambda[q]); };
  $('maq').onchange = function () { carregar(this.value); };
  $('ver-orig').onclick = function () { ver('original'); };
  $('ver-min').onclick = function () { ver('minimo'); };
  $('reiniciar').onclick = reiniciar;
  $('executar').onclick = executar;
  $('seq').onkeydown = function (e) { if (e.key === 'Enter') executar(); };
  $('iniciar').onclick = iniciarMin;
  $('prox').onclick = avancar;
  $('validar').onclick = validar;
  carregar('catraca');
})();
