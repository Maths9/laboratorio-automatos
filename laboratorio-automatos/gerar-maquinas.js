/*
 * Regenera js/maquinas.js a partir de maquinas/*.json.
 * Uso:  node gerar-maquinas.js
 * Por que existe: o navegador bloqueia fetch() de arquivos locais (file://),
 * entao o app le uma copia embutida dos JSONs. Rode este script sempre que
 * editar ou adicionar uma maquina em maquinas/.
 */
const fs = require('fs');
const path = require('path');
require('./js/motor/moore.js');
const pasta = path.join(__dirname, 'maquinas'), todas = {};
fs.readdirSync(pasta).filter(f => f.endsWith('.json')).forEach(f => {
  const m = JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8')), erros = Lab.Moore.validar(m);
  if (erros.length) { console.log('IGNORADA ' + f + ':\n  - ' + erros.join('\n  - ')); return; }
  todas[f.replace('.json', '')] = m;
});
fs.writeFileSync(path.join(__dirname, 'js/maquinas.js'),
  '/* Copia embutida de maquinas/*.json (gerada por gerar-maquinas.js), para funcionar offline via file:// */\nwindow.Lab=window.Lab||{};\nLab.Maquinas=' + JSON.stringify(todas) + ';\n');
console.log('js/maquinas.js gerado com: ' + Object.keys(todas).join(', '));
