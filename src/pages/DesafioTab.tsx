import React, { useState, useMemo } from 'react';
import { MooreMachine, ChallengeQuestion } from '../types/automaton';
import { catracaSistema, semaforoSistema, alarmeSistema } from '../data/sistemasPredefinidos';
import { minimizarMoore, formatarNomeBloco } from '../core/minimizacao';
import { AutomatonFlowEditor } from '../components/flow/AutomatonFlowEditor';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Plus,
  Trash2,
  ChevronRight,
  Award,
  Lightbulb,
} from 'lucide-react';

const desafiosDisponiveis: ChallengeQuestion[] = [
  {
    id: 'desafio_catraca',
    titulo: 'Desafio 1: Minimização da Catraca Inteligente',
    enunciado: 'A catraca possui 4 estados {T1, T2, L1, L2}. Agrupe os estados equivalentes que podem ser unificados sem alterar o comportamento do sistema.',
    dificuldade: 'Iniciante',
    maquina: catracaSistema,
    dica: 'Comece observando as saídas: T1 e T2 têm saída BLOQUEADA, enquanto L1 e L2 têm saída LIBERADA. Teste se as entradas M e G mantêm os pares juntos!',
    explicacaoGeral: 'T1 e T2 são equivalentes pois ambos produzem BLOQUEADA e levam a L1/L2 com M e T2/T1 com G. O mesmo vale para L1 e L2. O resultado são 2 estados: {T1, T2} e {L1, L2}.',
  },
  {
    id: 'desafio_alarme',
    titulo: 'Desafio 2: Otimização da Central de Alarme',
    enunciado: 'A central possui 5 estados com sensores de presença e chave. Identifique quais estados redundantes de desarme e sirene podem ser agrupados.',
    dificuldade: 'Intermediário',
    maquina: alarmeSistema,
    dica: 'Analise os dois estados desarmados (DESARM_A e DESARM_B) e os dois estados com a sirene acionada (ALARME_1 e ALARME_2).',
    explicacaoGeral: 'DESARM_A e DESARM_B são indistinguíveis por qualquer sequência de teste. ALARME_1 e ALARME_2 alternam entre si sob P e vão para DESARM sob K. Portanto, minimiza para 3 estados.',
  },
  {
    id: 'desafio_semaforo',
    titulo: 'Desafio 3: Semáforo Temporizado de 8 Estados',
    enunciado: 'O ciclo do semáforo tem 8 estados {V1, A1, R1, R2, V2, A2, R3, R4}. Consegue agrupar os estados redundantes em apenas 4 blocos?',
    dificuldade: 'Avançado',
    maquina: semaforoSistema,
    dica: 'Atenção aos 4 estados vermelhos: na primeira rodada após P0, R1 e R3 levam para R2 e R4, enquanto R2 e R4 levam para o verde (V2 e V1)!',
    explicacaoGeral: 'Os estados agrupam-se em 4 blocos: {V1, V2}, {A1, A2}, {R1, R3} e {R2, R4}. Cada bloco preserva rigorosamente a transição para a próxima cor.',
  },
];

export const DesafioTab: React.FC = () => {
  const [desafioAtivoIdx, setDesafioAtivoIdx] = useState(0);
  const desafio = desafiosDisponiveis[desafioAtivoIdx];

  // Solução matemática oficial calculada pelo algoritmo
  const solucaoOficial = useMemo(() => {
    return minimizarMoore(desafio.maquina);
  }, [desafio]);

  // Grupos criados pelo aluno: array de arrays de strings (nomes dos estados)
  const [gruposAluno, setGruposAluno] = useState<string[][]>([
    [desafio.maquina.Q[0]],
  ]);

  const [verificado, setVerificado] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [errosExplicados, setErrosExplicados] = useState<string[]>([]);
  const [mostrarDica, setMostrarDica] = useState(false);

  // Trocar de desafio e reiniciar o estado do aluno
  const selecionarDesafio = (idx: number) => {
    setDesafioAtivoIdx(idx);
    const d = desafiosDisponiveis[idx];
    setGruposAluno([[d.maquina.Q[0]]]);
    setVerificado(false);
    setAcertou(false);
    setErrosExplicados([]);
    setMostrarDica(false);
  };

  // Estados ainda não alocados em nenhum grupo
  const estadosAlocados = useMemo(() => {
    return new Set(gruposAluno.flat());
  }, [gruposAluno]);

  const estadosDisponiveis = useMemo(() => {
    return desafio.maquina.Q.filter((q) => !estadosAlocados.has(q));
  }, [desafio, estadosAlocados]);

  // Ações de montagem dos grupos
  const adicionarGrupo = () => {
    if (estadosDisponiveis.length > 0) {
      setGruposAluno([...gruposAluno, [estadosDisponiveis[0]]]);
    } else {
      setGruposAluno([...gruposAluno, []]);
    }
    setVerificado(false);
  };

  const removerGrupo = (idx: number) => {
    setGruposAluno(gruposAluno.filter((_, i) => i !== idx));
    setVerificado(false);
  };

  const moverEstadoParaGrupo = (estado: string, destinoGrupoIdx: number) => {
    const novos = gruposAluno.map((g, i) => {
      const semEstado = g.filter((q) => q !== estado);
      if (i === destinoGrupoIdx) {
        return [...semEstado, estado];
      }
      return semEstado;
    });
    setGruposAluno(novos.filter((g) => g.length > 0));
    setVerificado(false);
  };

  const adicionarEstadoAoGrupo = (estado: string, grupoIdx: number) => {
    const novos = [...gruposAluno];
    if (!novos[grupoIdx].includes(estado)) {
      novos[grupoIdx] = [...novos[grupoIdx], estado];
      setGruposAluno(novos);
    }
    setVerificado(false);
  };

  const removerEstadoDoGrupo = (estado: string, grupoIdx: number) => {
    const novos = [...gruposAluno];
    novos[grupoIdx] = novos[grupoIdx].filter((q) => q !== estado);
    setGruposAluno(novos.filter((g) => g.length > 0));
    setVerificado(false);
  };

  // Conferir a resposta do estudante
  const conferirResposta = () => {
    const erros: string[] = [];

    // 1. Checar se todos os estados foram alocados
    if (estadosDisponiveis.length > 0) {
      erros.push(`Ainda restam estados não alocados: [${estadosDisponiveis.join(', ')}].`);
    }

    // 2. Checar erro de saída (P0): estados no mesmo grupo com saídas diferentes
    gruposAluno.forEach((grupo, idx) => {
      if (grupo.length <= 1) return;
      const primeiraSaida = desafio.maquina.lambda[grupo[0]];
      grupo.forEach((q) => {
        const saidaQ = desafio.maquina.lambda[q];
        if (saidaQ !== primeiraSaida) {
          erros.push(
            `Erro de Partição Inicial P₀ no Grupo ${idx + 1}: o estado "${q}" (saída ${saidaQ}) não pode ficar com "${grupo[0]}" (saída ${primeiraSaida}), pois estados com saídas distintas nunca são equivalentes!`
          );
        }
      });
    });

    // 3. Comparar agrupamento com os blocos da solução mínima oficial
    const blocosOficiais = solucaoOficial.particoes[solucaoOficial.particoes.length - 1].blocos;
    const blocosAlunoNormalizados = gruposAluno
      .map((g) => g.toSorted().join(','))
      .filter(Boolean)
      .toSorted();
    const blocosOficiaisNormalizados = blocosOficiais
      .map((b) => b.toSorted().join(','))
      .toSorted();

    const saoIguais =
      erros.length === 0 &&
      blocosAlunoNormalizados.length === blocosOficiaisNormalizados.length &&
      blocosAlunoNormalizados.every((b, i) => b === blocosOficiaisNormalizados[i]);

    if (saoIguais) {
      setAcertou(true);
      setErrosExplicados([]);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      setAcertou(false);
      if (erros.length === 0) {
        erros.push(
          'Os agrupamentos ainda não correspondem aos blocos mínimos equivalentes. Analise para onde cada estado transita sob cada símbolo de Σ!'
        );
      }
      setErrosExplicados(erros);
    }

    setVerificado(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Modo Desafio: Agrupamento de Estados Equivalentes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Teste suas habilidades em Teoria da Computação: identifique os blocos equivalentes e confira sua resposta contra o algoritmo.
          </p>
        </div>

        {/* Seleção do Desafio */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {desafiosDisponiveis.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => selecionarDesafio(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                desafioAtivoIdx === idx
                  ? 'bg-blue-600 border-blue-500 text-white shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d.titulo.split(':')[0]} ({d.dificuldade})
            </button>
          ))}
        </div>
      </div>

      {/* Enunciado do Desafio */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            {desafio.dificuldade} • {desafio.maquina.nome} ({desafio.maquina.Q.length} estados)
          </span>

          <button
            onClick={() => setMostrarDica(!mostrarDica)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            {mostrarDica ? 'Ocultar Dica' : 'Ver Dica Pedagógica'}
          </button>
        </div>

        <h3 className="text-lg font-bold text-white">{desafio.enunciado}</h3>

        {mostrarDica && (
          <div className="bg-amber-950/50 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 animate-in fade-in">
            <strong className="block text-amber-300 font-bold mb-1">Dica Pedagógica:</strong>
            {desafio.dica}
          </div>
        )}
      </div>

      {/* Área Interativa: Diagrama do Autômato + Bancada de Agrupamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualização do Autômato a ser Minimizado */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Diagrama do Autômato Original
          </span>
          <AutomatonFlowEditor maquina={desafio.maquina} readOnly={true} altura="420px" />
        </div>

        {/* Painel de Montagem dos Grupos do Estudante */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                Seus Grupos de Estados Equivalentes
              </h4>
              <button
                onClick={adicionarGrupo}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Bloco
              </button>
            </div>

            {/* Estados Ainda Não Agrupados */}
            {estadosDisponiveis.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-4">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">
                  Estados Pendentes para Alocar ({estadosDisponiveis.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {estadosDisponiveis.map((q) => (
                    <div
                      key={q}
                      className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-mono text-cyan-300 shadow"
                    >
                      <span>{q}</span>
                      <span className="text-[10px] text-slate-400">
                        (λ: {desafio.maquina.lambda[q]})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Grupos Criados pelo Estudante */}
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {gruposAluno.map((grupo, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      Bloco {gIdx + 1} ({grupo.length} estado{grupo.length !== 1 ? 's' : ''})
                    </span>
                    <button
                      onClick={() => removerGrupo(gIdx)}
                      className="p-1 hover:bg-rose-950 text-rose-400 rounded transition-all"
                      title="Excluir este bloco"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Badges de estados dentro do bloco */}
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                    {grupo.map((q) => (
                      <span
                        key={q}
                        className="flex items-center gap-1 bg-blue-950 text-blue-200 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
                      >
                        {q} (λ: {desafio.maquina.lambda[q]})
                        <button
                          onClick={() => removerEstadoDoGrupo(q, gIdx)}
                          className="hover:text-rose-400 ml-0.5"
                          title="Remover estado deste bloco"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {/* Botão de adicionar estado pendente ao grupo */}
                    {estadosDisponiveis.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            adicionarEstadoAoGrupo(e.target.value, gIdx);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="" disabled>
                          + Adicionar estado...
                        </option>
                        {estadosDisponiveis.map((q) => (
                          <option key={q} value={q}>
                            {q} (λ: {desafio.maquina.lambda[q]})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Conferir */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={conferirResposta}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Conferir Resposta
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Detalhado após a Verificação */}
      {verificado && (
        <div
          className={`p-6 rounded-3xl border shadow-2xl transition-all ${
            acertou
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            {acertou ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
            )}
            <div>
              <h3 className="text-xl font-bold text-white">
                {acertou
                  ? 'Parabéns! Sua minimização está matematicamente perfeita!'
                  : 'Ainda há inconsistências no agrupamento dos estados.'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {acertou
                  ? 'Você identificou com precisão todos os estados equivalentes da máquina de Moore!'
                  : 'Confira as explicações dos erros e a solução correta abaixo.'}
              </p>
            </div>
          </div>

          {/* Lista de Erros Encontrados */}
          {!acertou && errosExplicados.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 mb-4">
              <span className="text-xs font-bold text-rose-400 block">
                Erros Identificados:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-rose-300">
                {errosExplicados.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solução Completa Calculada pelo Algoritmo */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">
              Solução Completa Oficial ({solucaoOficial.nMinimo} estados equivalentes):
            </span>
            <div className="flex flex-wrap gap-2">
              {solucaoOficial.particoes[solucaoOficial.particoes.length - 1].blocos.map(
                (bloco, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white"
                  >
                    Bloco {i + 1}: {formatarNomeBloco(bloco)} (λ:{' '}
                    <strong className="text-emerald-400">
                      {desafio.maquina.lambda[bloco[0]]}
                    </strong>
                    )
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              {desafio.explicacaoGeral}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
