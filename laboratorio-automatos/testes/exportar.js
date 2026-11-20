/*
 * ETAPA 2 - EXPORTACAO PARA O ORACULO (Python)
 * Uso:  node testes/exportar.js
 *
 * Para cada maquina em maquinas/ gera em testes/exportados/:
 *   <nome>.json         -> maquina original
 *   <nome>.minimo.json  -> maquina minima calculada pelo nosso motor
 * e um arquivo esperado.json com as contagens que o nosso motor encontrou.
 * O script oraculo.py recalcula tudo com bibliotecas independentes e compara.
 */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
['moore', 'alcancaveis', 'minimizacao', 'equivalencia'].forEach(n => require(path.join(base, 'js/motor', n + '.js')));
const saida = path.join(__dirname, 'exportados');
fs.mkdirSync(saida, { recursive: true });
const esperado = {};
fs.readdirSync(path.join(base, 'maquinas')).filter(f => f.endsWith('.json')).forEach(f => {
  const nome = f.replace('.json', '');
  const m = JSON.parse(fs.readFileSync(path.join(base, 'maquinas', f), 'utf8'));
  if (Lab.Moore.validar(m).length) return;  // esqueleto (ex.: alarme v2) ainda incompleto: ignora
  const r = Lab.Minimizacao.minimizar(m);
  fs.writeFileSync(path.join(saida, nome + '.json'), JSON.stringify(m, null, 2));
  fs.writeFileSync(path.join(saida, nome + '.minimo.json'), JSON.stringify(r.minimo, null, 2));
  esperado[nome] = { original: r.nOriginal, minimo: r.nMinimo };
});
fs.writeFileSync(path.join(saida, 'esperado.json'), JSON.stringify(esperado, null, 2));
console.log('Exportado em testes/exportados/:', Object.keys(esperado).join(', '));
