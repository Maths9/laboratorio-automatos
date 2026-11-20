/*
 * CAMADA 1 - Alarme (ESTRUTURA PRONTA PARA A v2).
 * Para ativar: criar maquinas/alarme.json, desenhar o SVG em montar(),
 * chamar aoEvento(simbolo) nos sensores e reagir a mostrarSaida(g).
 * Nada no motor precisa mudar.
 */
(function () {
  Lab.Fisico.registrar({
    id: 'alarme',
    montar: function (el) { el.textContent = 'Alarme: previsto para a versão 2.'; },
    mostrarSaida: function () {}
  });
})();
