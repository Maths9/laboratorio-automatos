import React, { useState } from 'react';
import { MooreMachine, RoboticComponentSpec } from '../types/automaton';
import { componentesCatalogo } from '../data/sistemasPredefinidos';
import { CatracaSVG } from '../components/svg/CatracaSVG';
import { SemaforoSVG } from '../components/svg/SemaforoSVG';
import { AlarmeSVG } from '../components/svg/AlarmeSVG';
import { PortaoSVG } from '../components/svg/PortaoSVG';
import {
  SensorPresencaSVG,
  SensorUltrassomSVG,
  SensorLuzSVG,
  SensorTempSVG,
  BotaoSVG,
  LeitorRFIDSVG,
  LedSVG,
  BuzzerSVG,
  MotorSVG,
  ServoSVG,
  DisplaySVG,
  TravaSVG,
} from '../components/svg/ComponentesIndividuaisSVG';
import {
  Layers,
  Trash2,
  Play,
  RotateCcw,
  Zap,
  ArrowRight,
  Plus,
  HelpCircle,
} from 'lucide-react';

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
  // Lista de componentes inseridos na bancada de montagem
  const [componentesBancada, setComponentesBancada] = useState<string[]>([
    'atu_led',
    'atu_mecanismo',
    'sen_botao',
  ]);

  const adicionarComponente = (id: string) => {
    if (!componentesBancada.includes(id)) {
      setComponentesBancada([...componentesBancada, id]);
    }
  };

  const removerComponente = (id: string) => {
    setComponentesBancada(componentesBancada.filter((c) => c !== id));
  };

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
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
            <Layers className="w-12 h-12 text-blue-400 mb-2 animate-bounce" />
            <h4 className="font-bold text-white text-base">{maquina.nome}</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Sistema personalizado em execução. Estado: <strong className="text-cyan-400">{estadoAtual}</strong> | Saída:{' '}
              <strong className="text-emerald-400">{saidaAtual}</strong>
            </p>
          </div>
        );
    }
  };

  const renderComponenteBancada = (id: string) => {
    const isAtuadorLigado =
      saidaAtual.includes('LIBERADA') ||
      saidaAtual.includes('VERDE') ||
      saidaAtual.includes('SIRENE') ||
      saidaAtual.includes('ABRINDO');

    switch (id) {
      case 'sen_presenca':
        return <SensorPresencaSVG ativo={isAtuadorLigado} onClick={() => onDispararEvento('P')} />;
      case 'sen_ultrassom':
        return <SensorUltrassomSVG ativo={isAtuadorLigado} onClick={() => onDispararEvento('O')} />;
      case 'sen_luz':
        return <SensorLuzSVG ativo={isAtuadorLigado} onClick={() => onDispararEvento('L')} />;
      case 'sen_temp':
        return <SensorTempSVG ativo={isAtuadorLigado} onClick={() => onDispararEvento('T')} />;
      case 'sen_botao':
        return <BotaoSVG ativo={false} onClick={() => onDispararEvento(maquina.Sigma[0] || 'M')} />;
      case 'sen_rfid':
        return <LeitorRFIDSVG ativo={isAtuadorLigado} onClick={() => onDispararEvento('K')} />;
      case 'atu_led':
        return (
          <LedSVG
            ligado={isAtuadorLigado}
            cor={saidaAtual.includes('VERMELHO') || saidaAtual.includes('BLOQUEADA') ? '#ef4444' : '#22c55e'}
            rotulo="LED Feedback"
          />
        );
      case 'atu_buzzer':
        return <BuzzerSVG tocando={saidaAtual.includes('SIRENE') || saidaAtual.includes('BLOQUEADA')} />;
      case 'atu_motor':
        return <MotorSVG girando={saidaAtual.includes('ABRINDO') || saidaAtual.includes('FECHANDO')} />;
      case 'atu_servo':
        return <ServoSVG angulo={isAtuadorLigado ? 90 : 0} />;
      case 'atu_display':
        return <DisplaySVG texto={saidaAtual || 'AGUARDANDO'} />;
      case 'atu_mecanismo':
        return <TravaSVG liberada={isAtuadorLigado} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Cabeçalho da Bancada */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Laboratório de Montagem e Testes Físicos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Bancada interativa: interaja com o sistema mecatrônico e adicione sensores e atuadores auxiliares.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              Estado: <strong className="text-cyan-400">{estadoAtual}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Saída λ: <strong className="text-emerald-400">{saidaAtual}</strong>
            </span>
          </div>

          <button
            onClick={onReiniciar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            title="Reiniciar máquina para q0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Grid Principal: Sistema Central + Bancada de Atuadores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Sistema Robótico Principal em Destaque */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-base text-white">
                Mecanismo Físico: {maquina.nome}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              q₀ = {maquina.q0}
            </span>
          </div>

          {/* Renderizador do Sistema SVG */}
          <div className="py-4 flex justify-center items-center">
            {renderSistemaPrincipal()}
          </div>

          {/* Botões rápidos de disparo de eventos de entrada Σ */}
          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Disparar Sensores de Entrada (Σ):
            </span>
            <div className="flex flex-wrap gap-2">
              {maquina.Sigma.map((s) => (
                <button
                  key={s}
                  onClick={() => onDispararEvento(s)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-mono font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Símbolo "{s}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 3: Componentes Auxiliares Acoplados */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Bancada de Auxiliares
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {componentesBancada.length} conectados
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Estes componentes reagem imediatamente à saída <strong className="text-emerald-400">λ({estadoAtual}) = "{saidaAtual}"</strong>.
            </p>

            {/* Grid dos componentes na bancada */}
            <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {componentesBancada.map((id) => {
                const spec = componentesCatalogo.find((c) => c.id === id);
                return (
                  <div
                    key={id}
                    className="relative group bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center hover:border-slate-700 transition-all shadow"
                  >
                    <button
                      onClick={() => removerComponente(id)}
                      className="absolute top-1.5 right-1.5 hidden group-hover:flex p-1 bg-rose-950 text-rose-400 hover:bg-rose-900 rounded-md transition-all"
                      title="Remover da bancada"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {renderComponenteBancada(id)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adicionar novos sensores e atuadores */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              Conectar Mais Componentes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {componentesCatalogo
                .filter((c) => c.categoria !== 'sistemas' && !componentesBancada.includes(c.id))
                .slice(0, 6)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => adicionarComponente(c.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 transition-all"
                  >
                    <Plus className="w-3 h-3 text-cyan-400" />
                    {c.nome.split(' ')[0]}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
