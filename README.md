# Laboratório Virtual de Robótica e Autômatos Finitos com Minimização de Estados

Aplicação web interativa desenvolvida com **React**, **React Flow (@xyflow/react)**, **XState**, **SVG**, **TypeScript** e **Tailwind CSS**, destinada ao ensino de **Teoria da Computação** e **Robótica Educacional** no Ensino Médio e Superior.

O sistema permite montar, visualizar, manipular e simular sistemas automatizados diretamente no navegador (sem necessidade de Arduino, hardware físico ou instalações complexas), compreendendo como sistemas mecatrônicos são modelados formalmente por **Máquinas de Moore** e como seus autômatos podem ser minimizados através do **algoritmo matemático de refinamento de partições**.

---

## 1. Tecnologias e Bibliotecas Utilizadas

- **React 18**: Estruturação modular da aplicação, componentes reutilizáveis e controle de estado reativo.
- **React Flow (`@xyflow/react`)**: Editor visual interativo de autômatos com nós personalizados (`StateNode`), arestas direcionadas com indicação de entradas ($\Sigma$), detecção de estado inicial ($q_0$), halo de estado ativo durante simulações e conexões dinâmicas.
- **XState v5 (`xstate`)**: Mecanismo formal de execução e controle das máquinas de estados, transições reativas, metadados de saída ($\lambda$), avanço passo a passo, execução de sequências e histórico temporal.
- **SVG Interativo & Vetorial**: Componentes robóticos animados e vetoriais sem perda de qualidade (Catraca inteligente com giro de braços tripé e cofre de moedas, Semáforo óptico temporizado de 3 focos, Alarme patrimonial com estrobo e sirene acústica, Portão eletrônico deslizante, além de catálogo de sensores e atuadores).
- **TypeScript 5**: Tipagem estática rigorosa para a tupla formal $M = (Q, \Sigma, \delta, q_0, \Gamma, \lambda)$, estruturas de partições e relatórios de equivalência.
- **Tailwind CSS**: Interface moderna com tema escuro tecnológico (dark mode), paleta de alta legibilidade e responsividade.
- **Canvas-Confetti**: Feedback visual comemorativo para acertos no Modo Desafio.
- **Lucide React**: Conjunto de ícones didáticos e intuitivos.

---

## 2. Estrutura de Arquivos

```text
laboratorio-automatos/
├── index.html                           # Ponto de entrada HTML5
├── package.json                         # Dependências e scripts de build/teste
├── tsconfig.json                        # Configuração do TypeScript
├── vite.config.ts                       # Configuração do empacotador Vite
├── tailwind.config.js                   # Configuração de temas e cores Tailwind
├── postcss.config.js                    # Pipeline PostCSS
├── testes-ts.mjs                        # Testes unitários do núcleo em TypeScript
├── src/
│   ├── main.tsx                         # Inicialização da árvore React
│   ├── App.tsx                          # Layout principal com navegação entre as 8 áreas
│   ├── index.css                        # Estilos globais, animações e scrollbars
│   ├── types/
│   │   └── automaton.ts                 # Interfaces: MooreMachine, PartitionRound, etc.
│   ├── core/
│   │   ├── moore.ts                     # Validação formal, passos e execução de Moore
│   │   ├── alcancaveis.ts               # Remoção de estados inalcançáveis via BFS
│   │   ├── minimizacao.ts               # Algoritmo de refinamento de partições (P0, P1...)
│   │   ├── equivalencia.ts              # Validação de 400 sequências e prova BFS
│   │   └── xstateAdapter.ts             # Adaptador XState para execução e eventos
│   ├── data/
│   │   └── sistemasPredefinidos.ts      # Catraca (4→2), Semáforo (8→4), Alarme e catálogo
│   ├── components/
│   │   ├── flow/
│   │   │   ├── StateNode.tsx            # Nó circular de estado de Moore no React Flow
│   │   │   └── AutomatonFlowEditor.tsx  # Editor visual completo em React Flow
│   │   ├── formal/
│   │   │   └── DefinicaoFormal.tsx      # Visualizador matemático da tupla M e tabela δ
│   │   └── svg/
│   │       ├── CatracaSVG.tsx           # Catraca inteligente em SVG com giro de braços
│   │       ├── SemaforoSVG.tsx          # Semáforo de 3 luzes com relógio de clock
│   │       ├── AlarmeSVG.tsx            # Alarme de segurança com sirene e sensores
│   │       ├── PortaoSVG.tsx            # Portão automático deslizante
│   │       └── ComponentesIndividuaisSVG.tsx # Sensores (PIR, LDR, NTC, RFID) e atuadores
│   └── pages/
│       ├── HomeTab.tsx                  # 1. Página inicial com hero e atalhos
│       ├── LabMontagemTab.tsx           # 2. Laboratório de montagem e bancada física
│       ├── BibliotecaTab.tsx            # 3. Biblioteca com especificações técnicas
│       ├── EditorTab.tsx                # 4. Editor visual de autômatos e import/export JSON
│       ├── SimulacaoTab.tsx             # 5. Área de simulação com XState e histórico
│       ├── MinimizacaoTab.tsx           # 6. Área de minimização passo a passo e comparação
│       ├── ValidacaoTab.tsx             # 7. Bateria de 400 testes aleatórios e BFS
│       └── DesafioTab.tsx               # 8. Modo desafio com agrupamento interativo
└── laboratorio-automatos/               # Versão clássica vanilla e oráculo de testes
    ├── maquinas/                        # Modelos JSON (catraca.json, semaforo.json)
    └── testes/                          # Bateria de testes original
```

---

## 3. Funcionalidades Implementadas

### 3.1. Página Inicial
- Identidade visual tecnológica e educativa.
- Apresentação dos objetivos pedagógicos.
- Atalhos diretos para Simulação, Minimização, Biblioteca e Desafio.
- Demonstração interativa dos sistemas obrigatórios.

### 3.2. Laboratório de Montagem e Testes Físicos
- Mecanismo mecatrônico vetorial interativo central (Catraca, Semáforo, Alarme ou Portão).
- Bancada de componentes auxiliares acopláveis (LED, Buzzer, Motor, Servomotor, Display LCD, Solenoide).
- Disparo de sensores de entrada em tempo real e resposta física visual imediata às saídas $\lambda$.

### 3.3. Biblioteca de Componentes Robóticos (Seção 5)
- **Sistemas Automatizados**: Semáforo, Catraca inteligente, Alarme, Portão e Controle de Acesso.
- **Sensores e Entradas**: Presença (PIR), Ultrassônico (HC-SR04), Luminosidade (LDR), Temperatura (NTC), Botão de pulso e Leitor RFID.
- **Atuadores e Saídas**: LED multicolor, Buzzer acústico, Motor DC com redução, Servomotor angular, Display LCD e Mecanismo de trava eletromagnética.
- Filtro por categoria, busca textual e teste interativo dos componentes.

### 3.4. Editor Visual de Autômatos (React Flow)
- Criação, renomeação e exclusão de estados visualmente.
- Configuração da saída $\lambda$ associada a cada estado.
- Definição do estado inicial $q_0$ com indicação visual de seta "início".
- Criação de transições direcionadas rotuladas com símbolos do alfabeto de entrada $\Sigma$.
- Reorganização automática do layout em círculo com um clique.
- Exibição da **Definição Formal** $M = (Q, \Sigma, \delta, q_0, \Gamma, \lambda)$ e da tabela de transição $\delta$, atualizadas dinamicamente.
- Validação estrutural de completude determinística em tempo real.
- Exportação e importação de projetos em arquivo **JSON**.

### 3.5. Área de Simulação (XState)
- Motor de execução baseado na máquina de estados de Moore do **XState**.
- Controles: Iniciar (automático com velocidade regulável), Pausar, Próxima Transição e Reiniciar.
- Destaque em tempo real do estado ativo com halo iluminado no diagrama React Flow.
- Digitação e execução de sequências de símbolos (ex: `MGM`, `TTTT`).
- Histórico completo de transições com passo, entrada, estado anterior, novo estado e saída produzida.
- Sincronização direta com a visualização física em SVG.

### 3.6. Algoritmo de Minimização por Refinamento de Partições
- Implementação matemática pura e rigorosa em TypeScript.
- **Passo 0**: Partição inicial $P_0$ agrupando estados estritamente pela mesma saída $\lambda$.
- **Refinamento**: Rodadas sucessivas ($P_1, P_2, \dots$) analisando destinos sob cada símbolo de $\Sigma$ até alcançar partição estável.
- Explicação textual didática de cada divisão realizada.
- Geração automática da máquina mínima equivalente no React Flow.
- **Comparação Lado a Lado**: Autômato Original × Autômato Minimizado, indicando quantidade de estados, transições, estados agrupados e percentual de redução de complexidade.

### 3.7. Validação e Comparação (400 Sequências + Prova BFS)
- Teste com **400 sequências aleatórias** de 30 símbolos cada.
- Geração reproduzível através de semente pseudoaleatória (Mulberry32).
- Verificação exata em largura (BFS) sobre pares de estados $(q_a, q_b)$ no produto cartesiano.
- Comparação das saídas observáveis produzidas por cada máquina passo a passo.
- Exibição de diagnóstico com contraexemplo detalhado se houver discrepância.

### 3.8. Modo Desafio
- Ambiente de aprendizagem interativo para estudantes resolverem problemas de minimização.
- Desafios da Catraca, Alarme e Semáforo com níveis Iniciante, Intermediário e Avançado.
- Interface para criar blocos e alocar estados equivalentes.
- Botão "Conferir Resposta" com celebração por partículas de confetti.
- Detecção e explicação pedagógica de erros (como juntar estados de saídas diferentes ou transições divergentes) e comparação com a solução calculada pelo algoritmo.

---

## 4. Exemplos Obrigatórios Validados

1. **Catraca Inteligente**:
   - Estados originais: $Q = \{T_1, T_2, L_1, L_2\}$, $\Sigma = \{M, G\}$.
   - Saídas: $\lambda(T_1) = \lambda(T_2) = \text{BLOQUEADA}$; $\lambda(L_1) = \lambda(L_2) = \text{LIBERADA}$.
   - Partição $P_0$: $\{T_1, T_2\} \{L_1, L_2\}$.
   - Resultado: Redução de **4 para 2 estados** ($50\%$ de redução).

2. **Semáforo Temporizado**:
   - Estados originais: $Q = \{V_1, A_1, R_1, R_2, V_2, A_2, R_3, R_4\}$, $\Sigma = \{T\}$.
   - Partição $P_0$: $\{V_1, V_2\} \{A_1, A_2\} \{R_1, R_2, R_3, R_4\}$.
   - Primeira rodada $P_1$: separa $\{R_1, R_3\}$ e $\{R_2, R_4\}$.
   - Resultado: Redução de **8 para 4 estados** ($50\%$ de redução), preservando o ciclo Verde $\to$ Amarelo $\to$ Vermelho $\to$ Vermelho $\to$ Verde.

---

## 5. Instruções para Executar o Projeto

### Pré-requisitos
- Node.js versão 18+ (testado no Node.js v24.16.0).
- Navegador moderno (Chrome, Edge, Firefox, Brave, Safari).

### Passo a Passo

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Abra o endereço indicado (geralmente `http://localhost:3000` ou `http://localhost:5173`) no navegador.

3. **Gerar build de produção**:
   ```bash
   npm run build
   ```
   Os arquivos otimizados e minificados serão gerados na pasta `dist/`.

4. **Visualizar o build de produção**:
   ```bash
   npm run preview
   ```

---

## 6. Testes Realizados e Resultados

Foram executadas duas suítes completas de testes automatizados:

### 6.1. Suíte do Motor TypeScript (`npm run test:ts`):
- **Validação de Moore**: Catraca e Semáforo validados como máquinas determinísticas totais coerentes.
- **Minimização da Catraca**: Redução exata de 4 para 2 estados ($\{T_1, T_2\}$ e $\{L_1, L_2\}$).
- **Minimização do Semáforo**: Redução exata de 8 para 4 estados ($\{V_1, V_2\}$, $\{A_1, A_2\}$, $\{R_1, R_3\}$, $\{R_2, R_4\}$).
- **Equivalência Observável**: 400 sequências aleatórias testadas em cada máquina com **100% de equivalência**.
- **Busca em Largura (BFS)**: Prova formal exata de todos os pares de estados alcançáveis sem contraexemplos.
- **Motor XState**: Transições reativas, metadados de saída $\lambda$, avanços passo a passo e reinicialização para $q_0$.
- **Resultado**: `TODOS OS TESTES TYPESCRIPT FORAM CONCLUÍDOS COM 100% DE SUCESSO!`

### 6.2. Suíte de Regressão e Oráculo (`npm test`):
- 20 testes incluindo validação do JSON, execução passo a passo, remoção de inalcançáveis, idempotência ($min(min(M)) = min(M)$), rejeição de autômatos adulterados e propriedades em 300 máquinas aleatórias.
- **Resultado**: `20 testes passaram, 0 falharam.`

---

## 7. Status das Funcionalidades e Pendências

- **Prioridade 1 — Estrutura Fundamental**: 100% Concluída.
- **Prioridade 2 — Funcionamento & Simulação**: 100% Concluída (XState e SVG interativos).
- **Prioridade 3 — Algoritmo de Minimização**: 100% Concluída (P0, refinamento iterativo, explicações e autômato mínimo no React Flow).
- **Prioridade 4 — Validação**: 100% Concluída (400 sequências aleatórias, semente Mulberry32 e prova BFS).
- **Prioridade 5 — Recursos Complementares**: 100% Concluída (Editor customizado, salvar/carregar JSON, Modo Desafio e Bancada de Montagem).
- **Pendências**: Nenhuma pendência impeditiva ou funcional. O sistema está 100% operacional no navegador.
