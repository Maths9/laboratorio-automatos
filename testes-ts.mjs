import { validarMoore, executarPasso, obterSaida, executarSequencia } from './src/core/moore.ts';
import { minimizarMoore } from './src/core/minimizacao.ts';
import { validarEquivalenciaAleatoria, validarEquivalenciaExata } from './src/core/equivalencia.ts';
import { catracaSistema, semaforoSistema, alarmeSistema, portaoSistema } from './src/data/sistemasPredefinidos.ts';
import { XStateMooreRunner } from './src/core/xstateAdapter.ts';

console.log('=== TESTES DO NÚCLEO TYPESCRIPT & XSTATE ===\n');

// 1. Validação de Moore
console.log('1. Validando sistemas pré-definidos...');
const erroCatraca = validarMoore(catracaSistema);
const erroSemaforo = validarMoore(semaforoSistema);
if (erroCatraca.length > 0 || erroSemaforo.length > 0) {
  throw new Error('Falha na validação dos autômatos pré-definidos');
}
console.log('  [OK] Catraca e Semáforo são autômatos de Moore válidos e determinísticos totais.');

// 2. Minimização da Catraca: 4 -> 2
console.log('\n2. Testando Minimização da Catraca Inteligente (4 -> 2 estados)...');
const resCatraca = minimizarMoore(catracaSistema);
console.log(`  Estados originais: ${resCatraca.nOriginal}, Estados mínimos: ${resCatraca.nMinimo}`);
if (resCatraca.nOriginal !== 4 || resCatraca.nMinimo !== 2) {
  throw new Error(`Catraca deveria minimizar de 4 para 2 estados, obtido ${resCatraca.nMinimo}`);
}
console.log(`  Partição final: ${JSON.stringify(resCatraca.particoes[resCatraca.particoes.length - 1].blocos)}`);
console.log('  [OK] Catraca minimizada com sucesso de 4 para 2 estados ({T1, T2} e {L1, L2})!');

// 3. Minimização do Semáforo: 8 -> 4
console.log('\n3. Testando Minimização do Semáforo Temporizado (8 -> 4 estados)...');
const resSemaforo = minimizarMoore(semaforoSistema);
console.log(`  Estados originais: ${resSemaforo.nOriginal}, Estados mínimos: ${resSemaforo.nMinimo}`);
if (resSemaforo.nOriginal !== 8 || resSemaforo.nMinimo !== 4) {
  throw new Error(`Semáforo deveria minimizar de 8 para 4 estados, obtido ${resSemaforo.nMinimo}`);
}
console.log(`  Partição final: ${JSON.stringify(resSemaforo.particoes[resSemaforo.particoes.length - 1].blocos)}`);
console.log('  [OK] Semáforo minimizado com sucesso de 8 para 4 estados ({V1, V2}, {A1, A2}, {R1, R3}, {R2, R4})!');

// 4. Teste de Equivalência por 400 Sequências Aleatórias
console.log('\n4. Testando Equivalência Observável com 400 Sequências Aleatórias (comprimento 30)...');
const eqCatraca = validarEquivalenciaAleatoria(catracaSistema, resCatraca.minimo, 400, 30, 12345);
if (!eqCatraca.equivalentes) {
  throw new Error('Falha de equivalência na Catraca: ' + eqCatraca.motivo);
}
console.log(`  [OK] Catraca: 400 sequências testadas - 100% equivalentes.`);

const eqSemaforo = validarEquivalenciaAleatoria(semaforoSistema, resSemaforo.minimo, 400, 30, 12345);
if (!eqSemaforo.equivalentes) {
  throw new Error('Falha de equivalência no Semáforo: ' + eqSemaforo.motivo);
}
console.log(`  [OK] Semáforo: 400 sequências testadas - 100% equivalentes.`);

// 5. Teste de Equivalência Exata BFS
console.log('\n5. Testando Prova Exata de Equivalência via BFS...');
const bfsCatraca = validarEquivalenciaExata(catracaSistema, resCatraca.minimo);
const bfsSemaforo = validarEquivalenciaExata(semaforoSistema, resSemaforo.minimo);
if (!bfsCatraca.equivalentes || !bfsSemaforo.equivalentes) {
  throw new Error('Falha na prova BFS');
}
console.log(`  [OK] Catraca BFS: ${bfsCatraca.paresVisitados} pares de estados verificados.`);
console.log(`  [OK] Semáforo BFS: ${bfsSemaforo.paresVisitados} pares de estados verificados.`);

// 6. Teste do Runner XState
console.log('\n6. Testando Motor de Simulação XState...');
const runner = new XStateMooreRunner(catracaSistema);
if (runner.getEstadoAtual() !== 'T1' || runner.getSaidaAtual() !== 'BLOQUEADA') {
  throw new Error('Estado inicial inválido no XState');
}
runner.enviarEvento('M');
if (runner.getEstadoAtual() !== 'L1' || runner.getSaidaAtual() !== 'LIBERADA') {
  throw new Error('Transição com moeda falhou no XState: estado ' + runner.getEstadoAtual());
}
runner.enviarEvento('G');
if (runner.getEstadoAtual() !== 'T1' || runner.getSaidaAtual() !== 'BLOQUEADA') {
  throw new Error('Transição com giro falhou no XState: estado ' + runner.getEstadoAtual());
}
runner.reiniciar();
if (runner.getEstadoAtual() !== 'T1') {
  throw new Error('Reinicialização falhou no XState');
}
runner.destruir();
console.log('  [OK] XState Moore Runner validado com transições reativas, metadados de saída e reinicialização.');

console.log('\nTODOS OS TESTES TYPESCRIPT FORAM CONCLUÍDOS COM 100% DE SUCESSO!');
