import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  GitBranch,
  RotateCcw,
  ShieldCheck,
  Zap,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface GuiaTabProps {
  onNavegarPara?: (aba: string) => void;
}

export const GuiaTab: React.FC<GuiaTabProps> = ({ onNavegarPara }) => {
  const [secaoAberta, setSecaoAberta] = useState<string>('intro');

  const toggleSecao = (id: string) => {
    setSecaoAberta(secaoAberta === id ? '' : id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Cabeçalho do Guia */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4" />
            Fundamentos Teóricos e Aplicações Práticas
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Guia de Teoria da Computação &amp; Autômatos Finitos
          </h1>
          <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed">
            Compreenda como modelos matemáticos abstratos governam sistemas do mundo real — desde catracas de metrô e semáforos até circuitos integrados e compiladores.
          </p>
        </div>
      </div>

      {/* Roteiro Rápido: Conexão Teoria → Prática */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => toggleSecao('intro')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            secaoAberta === 'intro'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-bold block mb-1">Módulo 1</span>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">O que é um Autômato?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            Máquinas de estados finitos e o modelo de Moore.
          </p>
        </div>

        <div
          onClick={() => toggleSecao('formal')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            secaoAberta === 'formal'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">Módulo 2</span>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">A 6-Tupla Formal</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            M = (Q, Σ, δ, q₀, Γ, λ) explicada termo a termo.
          </p>
        </div>

        <div
          onClick={() => toggleSecao('minimizacao')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            secaoAberta === 'minimizacao'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">Módulo 3</span>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Minimização por Partições</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            Passo a passo do refinamento de P₀ até a estabilidade.
          </p>
        </div>

        <div
          onClick={() => toggleSecao('robotica')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            secaoAberta === 'robotica'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">Módulo 4</span>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Robótica &amp; Exemplos</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            Por que minimizar a Catraca (4→2) e o Semáforo (8→4)?
          </p>
        </div>
      </div>

      {/* Conteúdo Expansível e Didático */}
      <div className="space-y-4">
        {/* MÓDULO 1: O que é um Autômato Finito */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSecao('intro')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  O que é um Autômato Finito e por que estudamos em Computação?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A ponte entre matemática abstrata, controle industrial e software.
                </p>
              </div>
            </div>
            {secaoAberta === 'intro' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {secaoAberta === 'intro' && (
            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
              <p>
                Um <strong>Autômato Finito (Finite State Machine - FSM)</strong> é um modelo matemático de computação com memória limitada. Ele consiste em um conjunto fixo de <strong>estados</strong>, um conjunto de <strong>entradas possíveis</strong> e regras que definem como o sistema transita de um estado para outro conforme recebe eventos do ambiente.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Máquina de Moore (Usada neste Laboratório)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    A saída do sistema depende <strong>exclusivamente do estado atual</strong>. Exemplo: estar no estado "TRAVADA" gera a saída "BLOQUEADA", não importando como o sistema chegou até lá. É o modelo padrão para robôs e circuitos digitais síncronos.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Máquina de Mealy (Comparativo)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    A saída é associada diretamente à <strong>transição</strong> (combinação de estado atual + entrada que acabou de ocorrer). Pode reagir no mesmo ciclo, mas é mais suscetível a ruídos em circuitos físicos.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Na prática:</strong> Cada microcontrolador ou software embarcado que controla catracas, semáforos, elevadores e máquinas de lavar é, em essência, uma máquina de estados finitos determinística.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* MÓDULO 2: A Definição Formal da Máquina de Moore */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSecao('formal')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  A Definição Matemática Formal: M = (Q, Σ, δ, q₀, Γ, λ)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Desmistificando a 6-tupla exigida em cursos universitários e no ENEM/vestibulares técnicos.
                </p>
              </div>
            </div>
            {secaoAberta === 'formal' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {secaoAberta === 'formal' && (
            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
              <p>
                Em Teoria da Computação, qualquer sistema discreto é especificado formalmente por uma tupla matemática. Para a <strong>Máquina de Moore</strong>, utilizamos 6 componentes:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <span className="font-bold text-sky-600 dark:text-sky-400 w-8">Q</span>
                  <div>
                    <strong className="font-sans text-slate-800 dark:text-white">Conjunto Finito de Estados:</strong>
                    <p className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      Todas as situações possíveis em que a máquina pode se encontrar. Exemplo na Catraca: Q = &#123;T1, T2, L1, L2&#125;.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 w-8">Σ</span>
                  <div>
                    <strong className="font-sans text-slate-800 dark:text-white">Alfabeto de Entrada (Sigma):</strong>
                    <p className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      Conjunto finito de símbolos externos que os sensores podem disparar. Exemplo: Σ = &#123;M, G&#125; (Moeda ou Giro).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 w-8">δ</span>
                  <div>
                    <strong className="font-sans text-slate-800 dark:text-white">Função de Transição (Delta): δ: Q × Σ → Q</strong>
                    <p className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      Diz: "Estando no estado <em>q</em> e recebendo o símbolo <em>s</em>, para qual próximo estado devemos ir?". Em um autômato determinístico total, deve haver exatamente um destino para cada combinação.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <span className="font-bold text-amber-600 dark:text-amber-400 w-8">q₀</span>
                  <div>
                    <strong className="font-sans text-slate-800 dark:text-white">Estado Inicial: q₀ ∈ Q</strong>
                    <p className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      O estado em que a máquina acorda quando o circuito é energizado ou ligado.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <span className="font-bold text-purple-600 dark:text-purple-400 w-8">Γ</span>
                  <div>
                    <strong className="font-sans text-slate-800 dark:text-white">Alfabeto de Saídas (Gamma):</strong>
                    <p className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      Os sinais físicos produzidos para os atuadores. Exemplo: Γ = &#123;BLOQUEADA, LIBERADA&#125;.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <span className="font-bold text-pink-600 dark:text-pink-400 w-8">λ</span>
                  <div>
                    <strong className="font-sans text-slate-800 dark:text-white">Função de Saída (Lambda): λ: Q → Γ</strong>
                    <p className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      Mapeia cada estado diretamente para sua saída observável. Exemplo: λ(T1) = BLOQUEADA.
                    </p>
                  </div>
                </div>
              </div>

              {onNavegarPara && (
                <button
                  onClick={() => onNavegarPara('editor')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Ver Definição Formal no Editor <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* MÓDULO 3: Minimização de Autômatos por Refinamento de Partições */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSecao('minimizacao')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Por que Minimizar? O Algoritmo de Refinamento de Partições
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Como identificar e unificar estados redundantes sem alterar o comportamento observável.
                </p>
              </div>
            </div>
            {secaoAberta === 'minimizacao' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {secaoAberta === 'minimizacao' && (
            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
              <p>
                <strong>Por que minimizamos autômatos?</strong> Na indústria, cada estado a mais em um circuito lógico requer mais portas lógicas, mais flip-flops e mais consumo de energia. Em software, estados redundantes aumentam a complexidade ciclomática e a chance de bugs. Minimizar significa encontrar a <strong>máquina mínima canônica equivalente</strong>.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Etapas do Algoritmo de Refinamento de Partições:
                </h4>

                <ol className="list-decimal list-inside space-y-2 text-xs">
                  <li>
                    <strong>Eliminação de Inalcançáveis:</strong> Remove-se qualquer estado que não possa ser atingido por nenhum caminho a partir de <em>q₀</em> (busca em largura - BFS).
                  </li>
                  <li>
                    <strong>Partição Inicial P₀ (Separação por Saída):</strong> Estados com saídas diferentes <em>nunca</em> podem ser equivalentes! Portanto, agrupam-se os estados estritamente pelo valor de sua função de saída λ.
                    <br />
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">
                      Ex: P₀ = &#123;T1, T2&#125; (BLOQUEADA) &#123;L1, L2&#125; (LIBERADA)
                    </span>
                  </li>
                  <li>
                    <strong>Refinamento Iterativo (P₁, P₂, ...):</strong> Para cada bloco, analisa-se a "assinatura de transição" de seus estados. Para cada símbolo <em>s ∈ Σ</em>, os estados desse bloco levam a destinos no <em>mesmo bloco</em>? Se um estado leva a um bloco diferente de seus vizinhos sob a mesma entrada, ele deve ser <strong>separado</strong> em um novo bloco!
                  </li>
                  <li>
                    <strong>Critério de Estabilidade:</strong> Quando uma rodada inteira não gera nenhuma divisão nova de blocos, o algoritmo atinge a <strong>partição estável final</strong>.
                  </li>
                  <li>
                    <strong>Construção da Máquina Mínima:</strong> Cada bloco final se torna um único estado na nova máquina mínima canônica!
                  </li>
                </ol>
              </div>

              {onNavegarPara && (
                <button
                  onClick={() => onNavegarPara('minimizacao')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Experimentar Minimização Passo a Passo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* MÓDULO 4: Casos Práticos Obrigatórios */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSecao('robotica')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Os Dois Exemplos Clássicos do Laboratório Explicados
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Entenda a redução matemática da Catraca (4→2) e do Semáforo (8→4).
                </p>
              </div>
            </div>
            {secaoAberta === 'robotica' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {secaoAberta === 'robotica' && (
            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Catraca */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                    Catraca Inteligente (4 → 2 Estados)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Na modelagem ingênua, um engenheiro pode criar estados duplicados: T1 e T2 para indicar trava, e L1 e L2 para indicar passagem liberada.
                  </p>
                  <ul className="text-xs list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 font-mono">
                    <li>P₀ = &#123;T1, T2&#125; &#123;L1, L2&#125;</li>
                    <li>Com Moeda (M), tanto T1 quanto T2 vão para o bloco liberado.</li>
                    <li>Com Giro (G), tanto T1 quanto T2 continuam no bloco travado.</li>
                    <li><strong>Resultado:</strong> T1 ≡ T2 e L1 ≡ L2. O autômato mínimo precisa de apenas <strong>2 estados</strong> (TRAVADA e LIBERADA), cortando 50% da memória!</li>
                  </ul>
                </div>

                {/* Semáforo */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Semáforo Temporizado (8 → 4 Estados)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    O semáforo possui 8 pulsos de clock (T) no seu ciclo completo: V1, A1, R1, R2, V2, A2, R3, R4.
                  </p>
                  <ul className="text-xs list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 font-mono">
                    <li>P₀ = &#123;V1, V2&#125; &#123;A1, A2&#125; &#123;R1, R2, R3, R4&#125;</li>
                    <li>Na rodada P₁, R1 e R3 vão para outro estado vermelho, mas R2 e R4 vão para o verde!</li>
                    <li>O bloco vermelho divide-se em &#123;R1, R3&#125; e &#123;R2, R4&#125;.</li>
                    <li><strong>Resultado:</strong> Redução de 8 para exatamente <strong>4 estados equivalentes</strong>, mantendo o ciclo Verde → Amarelo → Vermelho → Vermelho idêntico!</li>
                  </ul>
                </div>
              </div>

              {onNavegarPara && (
                <button
                  onClick={() => onNavegarPara('desafio')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors"
                >
                  Testar no Modo Desafio <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
