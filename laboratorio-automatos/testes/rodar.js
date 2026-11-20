/*
 * ETAPA 2 - TESTES DO MOTOR (linha de comando)
 * Uso:  node testes/rodar.js
 *
 * Confere: 4 -> 2 (catraca), 8 -> 4 (semaforo), particoes P0/P1,
 * equivalencia (aleatoria e exata), casos de erro e propriedades
 * em maquinas aleatorias. Termina com codigo 1 se algum teste falhar.
 */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
['moore', 'alcancaveis', 'minimizacao', 'equivalencia'].forEach(n => require(path.join(base, 'js/motor', n + '.js')));
const ler = nome => JSON.parse(fs.readFileSync(path.join(base, 'maquinas', nome + '.json'), 'utf8'));
const copia = o => JSON.parse(JSON.stringify(o));

let ok = 0, falhas = 0;
function teste(nome, fn) {
  try { fn(); ok++; console.log('  ok  ' + nome); }
  catch (e) { falhas++; console.log('  FALHOU  ' + nome + '\n        ' + e.message); }
}
function igual(obtido, esperado, msg) {
  const a = JSON.stringify(obtido), b = JSON.stringify(esperado);
  if (a !== b) throw new Error((msg || 'valores diferentes') + ': obtido ' + a + ', esperado ' + b);
}
function verdade(cond, msg) { if (!cond) throw new Error(msg); }

const catraca = ler('catraca'), semaforo = ler('semaforo');

console.log('\n[1] Validação do JSON (Moore)');
teste('catraca e semáforo são válidos', () => {
  igual(Lab.Moore.validar(catraca), []); igual(Lab.Moore.validar(semaforo), []);
});
teste('detecta q0 fora de Q', () => {
  const m = copia(catraca); m.q0 = 'X'; verdade(Lab.Moore.validar(m).length > 0, 'não detectou');
});
teste('detecta δ incompleta', () => {
  const m = copia(catraca); delete m.delta.T1.G; verdade(Lab.Moore.validar(m).length > 0, 'não detectou');
});
teste('detecta λ fora de Γ', () => {
  const m = copia(catraca); m.lambda.T1 = 'QUEBRADA'; verdade(Lab.Moore.validar(m).length > 0, 'não detectou');
});

console.log('\n[2] Execução (passo a passo)');
teste('passo 0 já mostra a saída de q0', () => {
  const h = Lab.Moore.executar(catraca, []);
  igual(h.length, 1); igual(h[0].saida, 'BLOQUEADA');
});
teste('catraca: M libera, G bloqueia', () => {
  igual(Lab.Moore.saidas(catraca, ['M', 'G', 'M', 'M']), ['BLOQUEADA', 'LIBERADA', 'BLOQUEADA', 'LIBERADA', 'LIBERADA']);
});
teste('semáforo: ciclo de 8 ticks volta ao início', () => {
  const h = Lab.Moore.executar(semaforo, Array(8).fill('T'));
  igual(h[8].estado, 'V1');
});
teste('símbolo fora de Σ gera erro', () => {
  let erro = false; try { Lab.Moore.executar(catraca, ['X']); } catch (e) { erro = true; }
  verdade(erro, 'deveria lançar erro');
});

console.log('\n[3] Minimização: resultados esperados');
teste('catraca: 4 → 2 e P0 já estável', () => {
  const r = Lab.Minimizacao.minimizar(catraca);
  igual([r.nOriginal, r.nMinimo], [4, 2]);
  igual(r.particoes.length, 1, 'só deve existir P0');
  igual(r.particoes[0].blocos, [['T1', 'T2'], ['L1', 'L2']]);
});
teste('semáforo: 8 → 4 com uma rodada separando {R1,R3} de {R2,R4}', () => {
  const r = Lab.Minimizacao.minimizar(semaforo);
  igual([r.nOriginal, r.nMinimo], [8, 4]);
  igual(r.particoes.length, 2, 'P0 e P1');
  igual(r.particoes[0].blocos, [['V1', 'V2'], ['A1', 'A2'], ['R1', 'R2', 'R3', 'R4']]);
  igual(r.particoes[1].blocos, [['V1', 'V2'], ['A1', 'A2'], ['R1', 'R3'], ['R2', 'R4']]);
});
teste('mínimo do semáforo mantém ciclo V → A → R → R', () => {
  const r = Lab.Minimizacao.minimizar(semaforo);
  const s = Lab.Moore.saidas(r.minimo, Array(4).fill('T'));
  igual(s, ['VERDE', 'AMARELO', 'VERMELHO', 'VERMELHO', 'VERDE']);
});
teste('estados inalcançáveis são removidos antes de minimizar', () => {
  const m = copia(semaforo);
  m.Q.push('X'); m.delta.X = { T: 'V1' }; m.lambda.X = 'VERDE';
  const r = Lab.Minimizacao.minimizar(m);
  igual(r.removidos, ['X']); igual([r.nOriginal, r.nAlcancaveis, r.nMinimo], [9, 8, 4]);
});
teste('minimizar o mínimo não muda nada (idempotência)', () => {
  [catraca, semaforo].forEach(m => {
    const r1 = Lab.Minimizacao.minimizar(m), r2 = Lab.Minimizacao.minimizar(r1.minimo);
    igual(r2.nMinimo, r1.nMinimo);
  });
});

console.log('\n[4] Equivalência original × mínimo');
[['catraca', catraca], ['semáforo', semaforo]].forEach(([nome, m]) => {
  teste(nome + ': 400 sequências de 30 símbolos', () => {
    const r = Lab.Equivalencia.aleatoria(m, Lab.Minimizacao.minimizar(m).minimo);
    verdade(r.equivalentes && r.testadas === 400 && r.tamanho === 30, 'não equivalentes');
  });
  teste(nome + ': verificação exata (pares de estados)', () => {
    verdade(Lab.Equivalencia.exata(m, Lab.Minimizacao.minimizar(m).minimo).equivalentes, 'não equivalentes');
  });
});
teste('mínimo adulterado é rejeitado e o contraexemplo realmente distingue', () => {
  const r = Lab.Minimizacao.minimizar(semaforo), ruim = copia(r.minimo);
  ruim.lambda[ruim.Q[3]] = 'VERDE';
  const e = Lab.Equivalencia.exata(semaforo, ruim);
  verdade(!e.equivalentes, 'deveria acusar diferença');
  const a = Lab.Moore.saidas(semaforo, e.contraexemplo), b = Lab.Moore.saidas(ruim, e.contraexemplo);
  verdade(JSON.stringify(a) !== JSON.stringify(b), 'contraexemplo não distingue as máquinas');
  verdade(!Lab.Equivalencia.aleatoria(semaforo, ruim).equivalentes, 'a aleatória também deveria acusar');
});
teste('alfabetos diferentes não são equivalentes', () => {
  verdade(!Lab.Equivalencia.exata(catraca, semaforo).equivalentes, 'deveria rejeitar');
});

console.log('\n[5] Propriedades em 300 máquinas aleatórias');
function rng(s) { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function maquinaAleatoria(r) {
  const n = 2 + Math.floor(r() * 11), sig = r() < 0.5 ? ['a'] : ['a', 'b'], sai = ['X', 'Y', 'Z'].slice(0, 2 + Math.floor(r() * 2));
  const Q = Array.from({ length: n }, (_, i) => 'q' + i), delta = {}, lambda = {};
  Q.forEach(q => { delta[q] = {}; sig.forEach(s => delta[q][s] = Q[Math.floor(r() * n)]); lambda[q] = sai[Math.floor(r() * sai.length)]; });
  return { nome: 'aleatória', Q, Sigma: sig, delta, q0: 'q0', Gamma: sai, lambda };
}
teste('mínimo é equivalente, menor ou igual e já irredutível', () => {
  const r = rng(2026);
  for (let i = 0; i < 300; i++) {
    const m = maquinaAleatoria(r), res = Lab.Minimizacao.minimizar(m);
    verdade(Lab.Moore.validar(res.minimo).length === 0, 'mínimo inválido na máquina ' + i);
    verdade(res.nMinimo <= res.nAlcancaveis && res.nAlcancaveis <= res.nOriginal, 'contagem incoerente na máquina ' + i);
    verdade(Lab.Equivalencia.exata(m, res.minimo).equivalentes, 'não equivalente na máquina ' + i);
    verdade(Lab.Equivalencia.aleatoria(m, res.minimo, 50, 20, i).equivalentes, 'aleatória falhou na máquina ' + i);
    igual(Lab.Minimizacao.minimizar(res.minimo).nMinimo, res.nMinimo, 'não irredutível na máquina ' + i);
  }
});

console.log('\n' + ok + ' testes passaram, ' + falhas + ' falharam.');
process.exit(falhas ? 1 : 0);
