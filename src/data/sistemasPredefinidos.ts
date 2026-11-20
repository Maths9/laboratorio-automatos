import { MooreMachine, RoboticComponentSpec } from '../types/automaton';

/**
 * Catraca Inteligente (4 estados -> 2 estados minimizados)
 */
export const catracaSistema: MooreMachine = {
  nome: 'Catraca Inteligente',
  descricao: 'Sistema de controle de fluxo de pedestres. Moeda (M) desbloqueia o mecanismo; Giro (G) permite a passagem e trava novamente.',
  tipoFisico: 'catraca',
  Q: ['T1', 'T2', 'L1', 'L2'],
  Sigma: ['M', 'G'],
  delta: {
    T1: { M: 'L1', G: 'T2' },
    T2: { M: 'L2', G: 'T1' },
    L1: { M: 'L2', G: 'T1' },
    L2: { M: 'L1', G: 'T2' },
  },
  q0: 'T1',
  Gamma: ['BLOQUEADA', 'LIBERADA'],
  lambda: {
    T1: 'BLOQUEADA',
    T2: 'BLOQUEADA',
    L1: 'LIBERADA',
    L2: 'LIBERADA',
  },
};

/**
 * Semáforo com temporização (8 estados -> 4 estados minimizados)
 */
export const semaforoSistema: MooreMachine = {
  nome: 'Semáforo de Trânsito',
  descricao: 'Controle de tráfego com 8 estados temporizados sincronizados por pulso de clock (T). Minimiza para 4 estados mantendo a sequência Verde -> Amarelo -> Vermelho -> Vermelho.',
  tipoFisico: 'semaforo',
  Q: ['V1', 'A1', 'R1', 'R2', 'V2', 'A2', 'R3', 'R4'],
  Sigma: ['T'],
  delta: {
    V1: { T: 'A1' },
    A1: { T: 'R1' },
    R1: { T: 'R2' },
    R2: { T: 'V2' },
    V2: { T: 'A2' },
    A2: { T: 'R3' },
    R3: { T: 'R4' },
    R4: { T: 'V1' },
  },
  q0: 'V1',
  Gamma: ['VERDE', 'AMARELO', 'VERMELHO'],
  lambda: {
    V1: 'VERDE',
    A1: 'AMARELO',
    R1: 'VERMELHO',
    R2: 'VERMELHO',
    V2: 'VERDE',
    A2: 'AMARELO',
    R3: 'VERMELHO',
    R4: 'VERMELHO',
  },
};

/**
 * Alarme de Segurança com Sensores (5 estados)
 */
export const alarmeSistema: MooreMachine = {
  nome: 'Alarme de Segurança',
  descricao: 'Sistema residencial com sensor de presença (P) e chave/teclado de segurança (K). Possui estados redundantes de vigilância que podem ser minimizados.',
  tipoFisico: 'alarme',
  Q: ['DESARM_A', 'DESARM_B', 'VIGILANCIA', 'ALARME_1', 'ALARME_2'],
  Sigma: ['P', 'K'],
  delta: {
    DESARM_A: { P: 'DESARM_A', K: 'VIGILANCIA' },
    DESARM_B: { P: 'DESARM_B', K: 'VIGILANCIA' },
    VIGILANCIA: { P: 'ALARME_1', K: 'DESARM_A' },
    ALARME_1: { P: 'ALARME_2', K: 'DESARM_B' },
    ALARME_2: { P: 'ALARME_1', K: 'DESARM_A' },
  },
  q0: 'DESARM_A',
  Gamma: ['SILENCIOSO', 'VIGILANTE', 'SIRENE_LIGADA'],
  lambda: {
    DESARM_A: 'SILENCIOSO',
    DESARM_B: 'SILENCIOSO',
    VIGILANCIA: 'VIGILANTE',
    ALARME_1: 'SIRENE_LIGADA',
    ALARME_2: 'SIRENE_LIGADA',
  },
};

/**
 * Portão Automático com Sensor de Obstáculo
 */
export const portaoSistema: MooreMachine = {
  nome: 'Portão Automático Inteligente',
  descricao: 'Portão eletrônico acionado por controle remoto (C) e protegido por feixe infravermelho de obstáculo (O).',
  tipoFisico: 'portao',
  Q: ['F1', 'F2', 'ABRINDO', 'ABERTO_1', 'ABERTO_2', 'FECHANDO'],
  Sigma: ['C', 'O'],
  delta: {
    F1: { C: 'ABRINDO', O: 'F1' },
    F2: { C: 'ABRINDO', O: 'F2' },
    ABRINDO: { C: 'ABERTO_1', O: 'ABRINDO' },
    ABERTO_1: { C: 'FECHANDO', O: 'ABERTO_2' },
    ABERTO_2: { C: 'FECHANDO', O: 'ABERTO_1' },
    FECHANDO: { C: 'ABRINDO', O: 'ABRINDO' },
  },
  q0: 'F1',
  Gamma: ['FECHADO', 'MOTOR_ABRINDO', 'ABERTO', 'MOTOR_FECHANDO'],
  lambda: {
    F1: 'FECHADO',
    F2: 'FECHADO',
    ABRINDO: 'MOTOR_ABRINDO',
    ABERTO_1: 'ABERTO',
    ABERTO_2: 'ABERTO',
    FECHANDO: 'MOTOR_FECHANDO',
  },
};

export const sistemasPredefinidos: MooreMachine[] = [
  catracaSistema,
  semaforoSistema,
  alarmeSistema,
  portaoSistema,
];

/**
 * Catálogo completo de componentes da Biblioteca Robótica (Seção 5)
 */
export const componentesCatalogo: RoboticComponentSpec[] = [
  // Sistemas Completos
  {
    id: 'sis_catraca',
    nome: 'Catraca Inteligente',
    categoria: 'sistemas',
    descricao: 'Mecanismo eletromecânico tripé com travamento por solenoide e detector de giro.',
    funcao: 'Controlar o fluxo de acesso unidirecional ou bidirecional.',
    icone: 'DoorClosed',
    cor: '#3b82f6',
  },
  {
    id: 'sis_semaforo',
    nome: 'Semáforo de Trânsito',
    categoria: 'sistemas',
    descricao: 'Conjunto semafórico óptico de três focos com sincronização temporizada.',
    funcao: 'Orientar o fluxo de veículos e pedestres em cruzamentos.',
    icone: 'TrafficCone',
    cor: '#10b981',
  },
  {
    id: 'sis_alarme',
    nome: 'Alarme de Segurança',
    categoria: 'sistemas',
    descricao: 'Central de alarme patrimonial com aviso sonoro, estrobo e arme/desarme.',
    funcao: 'Detectar invasões não autorizadas em perímetros monitorados.',
    icone: 'ShieldAlert',
    cor: '#ef4444',
  },
  {
    id: 'sis_portao',
    nome: 'Portão Deslizante Automático',
    categoria: 'sistemas',
    descricao: 'Portão acionado por cremalheira, motorredutor reversível e fim de curso.',
    funcao: 'Abrir e fechar acessos veiculares com parada de emergência por sensor.',
    icone: 'Warehouse',
    cor: '#8b5cf6',
  },
  {
    id: 'sis_acesso',
    nome: 'Sistema de Controle de Acesso',
    categoria: 'sistemas',
    descricao: 'Totem de controle com fechadura eletroímã e validação biométrica/RFID.',
    funcao: 'Liberar portas e catracas exclusivamente a usuários autorizados.',
    icone: 'KeyRound',
    cor: '#f59e0b',
  },

  // Sensores e Entradas
  {
    id: 'sen_presenca',
    nome: 'Sensor de Presença (PIR)',
    categoria: 'sensores',
    descricao: 'Sensor piroelétrico passivo infravermelho que detecta variação térmica corporal.',
    funcao: 'Detectar movimento de pessoas em um raio de até 7 metros.',
    simboloAssociado: 'P',
    icone: 'Radio',
    cor: '#06b6d4',
  },
  {
    id: 'sen_ultrassom',
    nome: 'Sensor Ultrassônico (HC-SR04)',
    categoria: 'sensores',
    descricao: 'Transdutor que emite ondas acústicas de 40kHz e mede o tempo de eco.',
    funcao: 'Medição precisa de distância e detecção de obstáculos próximos.',
    simboloAssociado: 'O',
    icone: 'Wifi',
    cor: '#0ea5e9',
  },
  {
    id: 'sen_luz',
    nome: 'Sensor de Luminosidade (LDR)',
    categoria: 'sensores',
    descricao: 'Resistor fotoelétrico cuja resistência diminui com a incidência de luz.',
    funcao: 'Identificar transição entre dia/noite ou presença de feixe luminoso.',
    simboloAssociado: 'L',
    icone: 'Sun',
    cor: '#eab308',
  },
  {
    id: 'sen_temp',
    nome: 'Sensor de Temperatura (NTC)',
    categoria: 'sensores',
    descricao: 'Termistor para monitoramento térmico ambiental ou de motores.',
    funcao: 'Prevenção de superaquecimento e disparo de sistemas de ventilação.',
    simboloAssociado: 'T',
    icone: 'Thermometer',
    cor: '#f97316',
  },
  {
    id: 'sen_botao',
    nome: 'Botão Pulsador / Push-Button',
    categoria: 'sensores',
    descricao: 'Contato mecânico momentâneo normalmente aberto (NA).',
    funcao: 'Disparar pulsos manuais de comando (como inserção de moeda ou tick).',
    simboloAssociado: 'M',
    icone: 'CircleDot',
    cor: '#64748b',
  },
  {
    id: 'sen_rfid',
    nome: 'Leitor RFID / NFC (RC522)',
    categoria: 'sensores',
    descricao: 'Módulo transceptor de radiofrequência em 13.56 MHz para tags e crachás.',
    funcao: 'Leitura de credenciais de identificação sem contato.',
    simboloAssociado: 'K',
    icone: 'CreditCard',
    cor: '#6366f1',
  },

  // Atuadores e Saídas
  {
    id: 'atu_led',
    nome: 'LED Indicador Multicolor',
    categoria: 'atuadores',
    descricao: 'Diodo emissor de luz de alta intensidade nas cores Verde, Amarelo e Vermelho.',
    funcao: 'Sinalização visual imediata do estado operacional da máquina.',
    saidaAssociada: 'VERDE',
    icone: 'Lightbulb',
    cor: '#22c55e',
  },
  {
    id: 'atu_buzzer',
    nome: 'Buzzer Sonoro Piezoelétrico',
    categoria: 'atuadores',
    descricao: 'Transdutor acústico capaz de emitir tons contínuos ou bipes intermitentes.',
    funcao: 'Alarme sonoro para alertas de invasão ou confirmação de eventos.',
    saidaAssociada: 'SIRENE_LIGADA',
    icone: 'Volume2',
    cor: '#ef4444',
  },
  {
    id: 'atu_motor',
    nome: 'Motor DC com Redução',
    categoria: 'atuadores',
    descricao: 'Motor elétrico de corrente contínua com engrenagens metálicas de alto torque.',
    funcao: 'Tracionar mecanismos pesados como portões, esteiras ou pontes levadiças.',
    saidaAssociada: 'MOTOR_ABRINDO',
    icone: 'Cog',
    cor: '#a855f7',
  },
  {
    id: 'atu_servo',
    nome: 'Servomotor de Precisão',
    categoria: 'atuadores',
    descricao: 'Atuador rotativo com realimentação de malha fechada ajustável de 0° a 180°.',
    funcao: 'Posicionar braços mecânicos, travas angulares e barreiras articuladas.',
    saidaAssociada: 'LIBERADA',
    icone: 'Gauge',
    cor: '#3b82f6',
  },
  {
    id: 'atu_display',
    nome: 'Display LCD / OLED Alfanumérico',
    categoria: 'atuadores',
    descricao: 'Painel matricial para exibição de texto com o estado e mensagens ao usuário.',
    funcao: 'Comunicação direta com o operador ou transeunte.',
    saidaAssociada: 'MENSAGEM',
    icone: 'Tv',
    cor: '#14b8a6',
  },
  {
    id: 'atu_mecanismo',
    nome: 'Mecanismo Trava / Solenoide',
    categoria: 'atuadores',
    descricao: 'Pino de aço eletromagnético retrátil de retenção mecânica.',
    funcao: 'Bloquear ou liberar fisicamente a rotação de catracas ou portas.',
    saidaAssociada: 'BLOQUEADA',
    icone: 'Lock',
    cor: '#dc2626',
  },
];
