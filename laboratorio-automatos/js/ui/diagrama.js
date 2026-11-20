/*
 * CAMADA 3 - INTERFACE EDUCACIONAL
 * Arquivo: diagrama.js
 * Desenha o diagrama de estados em SVG: estados em circulo, saida por cor E
 * por texto, estado atual com anel duplo, estado inicial com seta "inicio".
 * So le a maquina (JSON); nao tem logica de simulacao nem de minimizacao.
 */
(function () {
  var Lab = window.Lab = window.Lab || {};
  var COR = { BLOQUEADA: '#F4C7C3', LIBERADA: '#C8E6C9', VERDE: '#C8E6C9', AMARELO: '#FFF0A8', VERMELHO: '#F4C7C3' };
  var EXTRA = ['#D6E4FF', '#E8D5F5', '#FFE0B2'];
  // Respeita quem pediu menos movimento no sistema.
  var ANIMA = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function rot(u, a) { return [u[0] * Math.cos(a) - u[1] * Math.sin(a), u[0] * Math.sin(a) + u[1] * Math.cos(a)]; }
  function unit(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; }

  function desenhar(el, m, atual, ult) {   // ult = { de, simbolo }: ultima transicao (ou null)
    var W = 560, H = 460, cx = W / 2, cy = H / 2, n = m.Q.length, P = {}, r = {}, u = {};
    // Estados distribuidos em circulo, o primeiro no topo.
    m.Q.forEach(function (q, i) {
      var a = -Math.PI / 2 + 2 * Math.PI * i / n, R = n > 1 ? 160 : 0;
      P[q] = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
      u[q] = n > 1 ? [Math.cos(a), Math.sin(a)] : [0, -1];   // direcao "para fora"
      r[q] = Math.max(24, q.length * 3.6 + 10);               // raio cresce com o nome
    });

    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Diagrama de estados de ' + esc(m.nome) + '">' +
      '<defs><marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M0,0L10,5L0,10z" fill="#1A1A1A"/></marker>' +
      '<marker id="setaAz" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#0B57D0"/></marker></defs>';

    // Transicoes: simbolos com o mesmo destino compartilham uma seta (rotulo "M,G").
    m.Q.forEach(function (q) {
      var grupos = {};
      m.Sigma.forEach(function (sy) { var d = m.delta[q][sy]; (grupos[d] = grupos[d] || []).push(sy); });
      Object.keys(grupos).forEach(function (d) {
        var p0 = P[q], p1 = P[d], caminho, x, y;
        if (d === q) {                                         // laco: curva para fora do circulo
          var k = r[q], L = k + 55, a1 = rot(u[q], -0.5), a2 = rot(u[q], 0.5), c1 = rot(u[q], -0.6), c2 = rot(u[q], 0.6);
          caminho = 'M' + [p0[0] + a1[0] * k, p0[1] + a1[1] * k] + ' C' + [p0[0] + c1[0] * L, p0[1] + c1[1] * L] + ' ' +
            [p0[0] + c2[0] * L, p0[1] + c2[1] * L] + ' ' + [p0[0] + a2[0] * (k + 4), p0[1] + a2[1] * (k + 4)];
          x = p0[0] + u[q][0] * (k + 50); y = p0[1] + u[q][1] * (k + 50);
        } else {                                               // curva suave: ida e volta nao se sobrepoem
          var dx = p1[0] - p0[0], dy = p1[1] - p0[1], dist = Math.hypot(dx, dy), off = 0.2 * dist;
          var C = [(p0[0] + p1[0]) / 2 - dy / dist * off, (p0[1] + p1[1]) / 2 + dx / dist * off];
          var v0 = unit(p0, C), v1 = unit(C, p1);
          var S = [p0[0] + v0[0] * r[q], p0[1] + v0[1] * r[q]], E = [p1[0] - v1[0] * (r[d] + 4), p1[1] - v1[1] * (r[d] + 4)];
          caminho = 'M' + S + ' Q' + C + ' ' + E;
          x = 0.25 * S[0] + 0.5 * C[0] + 0.25 * E[0]; y = 0.25 * S[1] + 0.5 * C[1] + 0.25 * E[1];
        }
        var usada = ult && ult.de === q && grupos[d].indexOf(ult.simbolo) >= 0;
        s += '<path d="' + caminho + '" pathLength="1" fill="none" stroke="' + (usada ? '#0B57D0' : '#1A1A1A') + '" stroke-width="' + (usada ? 3.2 : 1.6) + '"' + (usada ? ' class="usada"' : '') + ' marker-end="url(#' + (usada ? 'setaAz' : 'seta') + ')"/>' +
          (usada && ANIMA ? '<circle r="6" fill="#0B57D0" stroke="#fff" stroke-width="2"><animateMotion dur="0.6s" fill="freeze" path="' + caminho + '"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="0.7s" fill="freeze"/></circle>' : '') +
          '<text class="rot" x="' + x + '" y="' + (y + 4) + '">' + esc(grupos[d].join(',')) + '</text>';
      });
    });

    // Seta do estado inicial.
    var v = rot(u[m.q0], 1.2), p = P[m.q0], k0 = r[m.q0];
    s += '<path d="M' + [p[0] + v[0] * (k0 + 50), p[1] + v[1] * (k0 + 50)] + ' L' + [p[0] + v[0] * (k0 + 3), p[1] + v[1] * (k0 + 3)] +
      '" stroke="#1A1A1A" stroke-width="2" marker-end="url(#seta)"/>' +
      '<text class="saida" x="' + (p[0] + v[0] * (k0 + 64)) + '" y="' + (p[1] + v[1] * (k0 + 64) + 4) + '">início</text>';

    // Estados: cor da saida + rotulo de texto; estado atual com anel duplo.
    m.Q.forEach(function (q) {
      var c = P[q], ativo = q === atual, g = m.lambda[q], cor = COR[g] || EXTRA[m.Gamma.indexOf(g) % 3];
      s += '<g tabindex="0" role="img" aria-label="Estado ' + esc(q) + ', saída ' + esc(g) + (q === m.q0 ? ', estado inicial' : '') + (ativo ? ', estado atual' : '') + '">';
      if (ativo) s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (r[q] + 6) + '" class="anel" fill="none" stroke="#0B57D0" stroke-width="3"/>';
      s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + r[q] + '" fill="' + cor + '" stroke="' + (ativo ? '#0B57D0' : '#5A5A5A') + '" stroke-width="2.5"/>' +
        '<text class="nome" x="' + c[0] + '" y="' + (c[1] + 4) + '">' + esc(q) + '</text>' +
        '<text class="saida" x="' + c[0] + '" y="' + (c[1] + r[q] + (ativo ? 22 : 16)) + '">' + esc(g) + '</text></g>';
    });
    el.innerHTML = s + '</svg>';
  }

  Lab.Diagrama = { desenhar: desenhar };
})();
