/*
 * CAMADA 1 - Semaforo.
 * Sensor:   relogio -> simbolo T (um "tick")
 * Atuador:  tres luzes. A saida acende a luz certa; o NOME da saida tambem
 *           aparece em texto (a cor nunca e a unica informacao).
 */
(function () {
  var Lab = window.Lab, ref;
  var LUZES = [['VERMELHO', '#E53935', 50], ['AMARELO', '#FDD835', 105], ['VERDE', '#43A047', 160]];

  var SVG = '<svg viewBox="0 0 320 260" role="group" aria-label="Semáforo">' +
    '<rect x="110" y="10" width="100" height="190" rx="14" fill="#333" stroke="#1A1A1A" stroke-width="2"/>' +
    LUZES.map(function (l) { return '<circle class="luz" data-g="' + l[0] + '" cx="160" cy="' + l[2] + '" r="22" fill="#666"/>'; }).join('') +
    '<g class="relogio" role="button" tabindex="0" aria-label="Tick do relógio (evento T)"><circle cx="266" cy="95" r="34" fill="#fff" stroke="#5A5A5A" stroke-width="3"/>' +
    '<path d="M266,95 V72 M266,95 L282,105" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/><text class="fx" x="266" y="150">Tick · T</text></g>' +
    '<text class="fx" x="160" y="232" style="font-size:18px"></text></svg>';

  Lab.Fisico.registrar({
    id: 'semaforo',
    montar: function (el, aoEvento) {
      el.innerHTML = SVG; ref = el;
      Lab.Fisico.botao(el.querySelector('.relogio'), function () { aoEvento('T'); });
    },
    mostrarSaida: function (g) {
      LUZES.forEach(function (l) {
        var c = ref.querySelector('.luz[data-g="' + l[0] + '"]'), acesa = l[0] === g;
        c.setAttribute('class', acesa ? 'luz acesa' : 'luz');
        c.setAttribute('fill', acesa ? l[1] : '#666');
        c.setAttribute('stroke', acesa ? '#fff' : 'none');
        c.setAttribute('stroke-width', acesa ? '5' : '0');
      });
      ref.querySelector('text[style]').textContent = 'Saída: ' + g;
    }
  });
})();
