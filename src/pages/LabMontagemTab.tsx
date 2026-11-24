import React from 'react';
import { MooreMachine } from '../types/automaton';
import { CatracaSVG } from '../components/svg/CatracaSVG';
import { SemaforoSVG } from '../components/svg/SemaforoSVG';
import { AlarmeSVG } from '../components/svg/AlarmeSVG';
import { PortaoSVG } from '../components/svg/PortaoSVG';
import {
  RotateCcw,
  Zap,
  Play,
  Activity,
  Compass,
} from 'lucide-react';
import { ExplicacaoContextual } from '../components/pedagogico/ExplicacaoContextual';

interface LabMontagemTabProps {
  maquina: MooreMachine;
  estadoAtual: string;
  saidaAtual: string;
  onDispararEvento: (simbolo: string) => void;
  onReiniciar: () => void;
}

export const LabMontagemTab: React.FC<LabMontagemTabProps> = ({
  maquina,
  estadoAtual,
  saidaAtual,
  onDispararEvento,
  onReiniciar,
}) => {
  const renderSistemaPrincipal = () => {
    switch (maquina.tipoFisico) {
      case 'catraca':
        return <CatracaSVG saida={saidaAtual} onEvento={onDispararEvento} />;
      case 'semaforo':
        return <SemaforoSVG saida={saidaAtual} onEvento={onDispararEvento} />;
      case 'alarme':
        return <AlarmeSVG saida={saidaAtual} onEvento={onDispararEvento} />;
      case 'portao':
        return <PortaoSVG saida={saidaAtual} onEvento={onDispararEvento} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Activity className="w-12 h-12 text-blue-600 dark:text-cyan-400 mb-2 animate-pulse" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{maquina.nome}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Sistema em execução. Estado atual: <strong className="text-blue-600 dark:text-cyan-400">{estadoAtual}</strong> | Saída:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">{saidaAtual}</strong>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Cabeçalho da Bancada */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Bancada de Simulação Lúdica do Autômato
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Veja a Teoria da Computação em ação: interaja com o sistema mecânico à esquerda e acompanhe a explicação formal à direita.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-3 text-xs font-mono shadow-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Estado: <strong className="text-blue-600 dark:text-cyan-400">{estadoAtual}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400">
              Saída λ: <strong className="text-emerald-600 dark:text-emerald-400">{saidaAtual}</strong>
            </span>
          </div>

          <button
            onClick={onReiniciar}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-sm"
            title="Reiniciar máquina para q0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DISPOSIÇÃO LADO A LADO: SIMULAÇÃO PRÁTICA (ESQ) | TEORIA (DIR) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA ESQUERDA (7 colunas): SIMULAÇÃO VISUAL E DISPARO DE ENTRADAS */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Representação Lúdica: {maquina.nome}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                q₀ = {maquina.q0}
              </span>
            </div>

            {/* Renderizador Vetorial SVG */}
            <div className="py-4 flex justify-center items-center min-h-[300px]">
              {renderSistemaPrincipal()}
            </div>
          </div>

          {/* Disparo de Entradas Σ */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Disparar Símbolos de Entrada (Σ):
            </span>
            <div className="flex flex-wrap gap-2">
              {maquina.Sigma.map((s) => (
                <button
                  key={s}
                  onClick={() => onDispararEvento(s)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Símbolo "{s}"
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block font-mono">
              δ({estadoAtual}, σ) calcula o próximo estado e atualiza a saída física λ.
            </span>
          </div>
        </div>

        {/* COLUNA DIREITA (5 colunas): EXPLICAÇÃO TEÓRICA E PEDAGÓGICA */}
        <div className="lg:col-span-5 space-y-4">
          <ExplicacaoContextual
            titulo={`Teoria da Computação em Sistemas Físicos`}
            oQueEstaAcontecendo={`O sistema "${maquina.nome}" está no estado "${estadoAtual}", gerando a saída λ = "${saidaAtual}". Observe como as cores, luzes e posições do desenho à esquerda refletem exatamente o estado do autômato.`}
            conceitoTeorico={`Na Máquina de Moore, cada estado q ∈ Q possui uma saída associada dada por λ: Q → Γ. A robótica é utilizada aqui como metáfora visual lúdica para demonstrar que a computação de estados finitos rege processos determinísticos do mundo real.`}
            formulaOuRegra={`Entrada (Σ) ⟶ δ(q, σ) ⟶ Novo Estado q' ⟶ λ(q')`}
            dicaPratica={`Clique nos botões de símbolo do alfabeto Σ ou diretamente nas partes clicáveis do desenho para testar as transições da máquina.`}
          />
        </div>
      </div>
    </div>
  );
};
