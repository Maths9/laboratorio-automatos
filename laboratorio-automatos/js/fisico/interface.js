/*
 * CAMADA 1 - SIMULACAO DO SISTEMA FISICO
 * Arquivo: interface.js  (a interface padronizada com as outras camadas)
 *
 * Todo sistema fisico (catraca, semaforo, alarme...) e um objeto com:
 *   id            -> mesmo nome da maquina em maquinas/ ("catraca")
 *   montar(el, aoEvento) -> desenha o sistema em SVG dentro de "el".
 *                    Quando um "sensor" dispara (moeda, giro, tick), chama
 *                    aoEvento(simbolo), onde simbolo pertence a Σ.
 *   mostrarSaida(g)      -> recebe a saida g ∈ Γ do estado atual e atualiza
 *                    os "atuadores" (cadeado, luzes...).
 * Assim: EVENTO DE ENTRADA entra, SAIDA DO ESTADO sai. Este arquivo e os
 * sistemas NAO importam o motor: so conhecem simbolos e nomes de saida.
 */
(function () {
  var Lab = window.Lab = window.Lab || {}, sistemas = {}, ativo = null;

  function registrar(s) { sistemas[s.id] = s; }

  function usar(id, el, aoEvento) {
    ativo = sistemas[id] || null;
    el.innerHTML = '';
    if (ativo) ativo.montar(el, aoEvento); else el.textContent = 'Sistema físico ainda não disponível.';
  }

  function mostrar(saida) { if (ativo) ativo.mostrarSaida(saida); }

  // Torna um grupo SVG um botao acessivel (clique, Enter ou Espaco).
  function botao(g, fn) {
    g.addEventListener('click', fn);
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }

  Lab.Fisico = { registrar: registrar, usar: usar, mostrar: mostrar, botao: botao };
})();
