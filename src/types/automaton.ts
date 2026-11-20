/**
 * Tipos fundamentais para Máquinas de Moore, Robótica e Minimização
 * Notação formal: M = (Q, Σ, δ, q0, Γ, λ)
 */

export interface MooreMachine {
  nome: string;
  descricao?: string;
  tipoFisico?: 'catraca' | 'semaforo' | 'alarme' | 'portao' | 'acesso' | 'custom';
  Q: string[];                                 // Conjunto finito de estados
  Sigma: string[];                             // Alfabeto de entrada Σ
  delta: Record<string, Record<string, string>>;// Função de transição δ: Q × Σ → Q
  q0: string;                                  // Estado inicial q0 ∈ Q
  Gamma: string[];                             // Alfabeto de saídas Γ
  lambda: Record<string, string>;              // Função de saída λ: Q → Γ
}

export interface PartitionRound {
  rodada: number;
  blocos: string[][];
  mudou: boolean;
  estavel?: boolean;
  explicacao: string;
  assinaturas?: Record<string, { estado: string; blocoAtual: number; destinos: number[]; chave: string }>;
}

export interface MinimizationResult {
  original: MooreMachine;
  nOriginal: number;
  removidos: string[];
  nAlcancaveis: number;
  particoes: PartitionRound[];
  minimo: MooreMachine;
  nMinimo: number;
  blocoDe: Record<string, string>;
  reducaoPercentual: number;
}

export interface EquivalenceTestResult {
  equivalentes: boolean;
  testadas?: number;
  tamanho?: number;
  paresVisitados?: number;
  contraexemplo?: string[];
  motivo?: string;
  saidasA?: string[];
  saidasB?: string[];
}

export interface StepHistoryItem {
  passo: number;
  entrada: string | null;
  estadoAnterior: string | null;
  estado: string;
  saida: string;
  timestamp: number;
}

// Modelagem da Biblioteca de Componentes Robóticos
export type ComponentCategory = 'sistemas' | 'sensores' | 'atuadores';

export interface RoboticComponentSpec {
  id: string;
  nome: string;
  categoria: ComponentCategory;
  descricao: string;
  funcao: string;
  simboloAssociado?: string; // Ex: M, G, T, etc.
  saidaAssociada?: string;   // Ex: LIBERADA, VERDE, etc.
  icone: string;
  cor: string;
}

export interface ChallengeQuestion {
  id: string;
  titulo: string;
  enunciado: string;
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  maquina: MooreMachine;
  dica: string;
  explicacaoGeral: string;
}
