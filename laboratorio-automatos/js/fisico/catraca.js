/*
 * CAMADA 1 - Catraca (vista de cima).
 * Sensores:   moeda -> simbolo M ; giro (empurrar) -> simbolo G
 * Atuador:    trava. Saida BLOQUEADA = cadeado fechado; LIBERADA = cadeado aberto.
 * Os bracos so giram se a saida passou de LIBERADA para BLOQUEADA apos um giro
 * (uma pessoa passou). Isso usa so entradas e saidas: nao depende do motor.
 */
(function () {
  var Lab = window.Lab, ref, ang = 0, ultima = null, evento = null;

  var SVG = '<svg viewBox="0 0 320 230" role="group" aria-label="Catraca, vista de cima">' +
    '<rect x="125" y="55" width="70" height="110" rx="10" fill="#E0E0E0" stroke="#5A5A5A" stroke-width="2"/>' +
    '<g class="bracos" style="transform-origin:160px 110px"><g stroke="#1A1A1A" stroke-width="8" stroke-linecap="round">' +
    '<line x1="160" y1="110" x2="160" y2="60"/><line x1="160" y1="110" x2="203" y2="135"/><line x1="160" y1="110" x2="117" y2="135"/></g>' +
    '<circle cx="160" cy="110" r="10" fill="#5A5A5A"/></g>' +
    '<circle class="coin" cx="52" cy="70" r="7" fill="#F9A825" stroke="#1A1A1A" stroke-width="2" opacity="0"/>' +
    '<g class="moeda" role="button" tabindex="0" aria-label="Inserir moeda (evento M)"><rect x="8" y="85" width="88" height="50" rx="8" fill="#FFF0A8" stroke="#5A5A5A" stroke-width="2"/>' +
    '<rect x="44" y="93" width="16" height="4" fill="#1A1A1A"/><text class="fx" x="52" y="122">Moeda · M</text></g>' +
    '<g class="giro" role="button" tabindex="0" aria-label="Empurrar a catraca (evento G)"><rect x="224" y="85" width="88" height="50" rx="8" fill="#D6E4FF" stroke="#5A5A5A" stroke-width="2"/>' +
    '<text class="fx" x="268" y="115">Girar · G</text></g>' +
    '<text class="saida nota" x="160" y="180"></text>' +
    '<rect class="painel" x="80" y="188" width="160" height="38" rx="8" fill="#F4C7C3" stroke="#5A5A5A" stroke-width="2"/>' +
    '<g stroke="#1A1A1A" stroke-width="3" fill="none"><path class="fechado" d="M94,201 v-6 a7,7 0 0 1 14,0 v6"/><path class="aberto" d="M94,195 v-6 a7,7 0 0 1 14,0 v3" style="display:none"/></g>' +
    '<rect x="90" y="201" width="22" height="15" rx="2" fill="#1A1A1A"/><text class="fl" x="122" y="213"></text></svg>';

  function q(c) { return ref.querySelector(c); }

  Lab.Fisico.registrar({
    id: 'catraca',
    montar: function (el, aoEvento) {
      el.innerHTML = SVG; ref = el;
      Lab.Fisico.botao(q('.moeda'), function () { evento = 'M'; var c = q('.coin'); c.classList.remove('cai'); void c.getBoundingClientRect(); c.classList.add('cai'); aoEvento('M'); });
      Lab.Fisico.botao(q('.giro'), function () { evento = 'G'; aoEvento('G'); });
      ultima = null; evento = null;
    },
    mostrarSaida: function (g) {
      var lib = g === 'LIBERADA';
      q('.painel').setAttribute('fill', lib ? '#C8E6C9' : '#F4C7C3');
      q('.fl').textContent = g;
      q('.fechado').style.display = lib ? 'none' : '';
      q('.aberto').style.display = lib ? '' : 'none';
      var nota = '';
      if (evento === 'M') nota = 'Moeda inserida.';
      if (evento === 'G') nota = (ultima === 'LIBERADA' && !lib) ? 'Uma pessoa passou: os braços giraram.' : 'Catraca travada: os braços não giram.';
      if (evento === 'G' && ultima === 'LIBERADA' && !lib) { ang += 120; q('.bracos').style.transform = 'rotate(' + ang + 'deg)'; }
      q('.nota').textContent = nota;
      evento = null; ultima = g;
    }
  });
})();
