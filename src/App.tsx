import React, { useState } from 'react';
import { MooreMachine, RoboticComponentSpec } from './types/automaton';
import {
  catracaSistema,
  semaforoSistema,
  alarmeSistema,
  portaoSistema,
  sistemasPredefinidos,
} from './data/sistemasPredefinidos';
import { HomeTab } from './pages/HomeTab';
import { LabMontagemTab } from './pages/LabMontagemTab';
import { BibliotecaTab } from './pages/BibliotecaTab';
import { EditorTab } from './pages/EditorTab';
import { SimulacaoTab } from './pages/SimulacaoTab';
import { MinimizacaoTab } from './pages/MinimizacaoTab';
import { ValidacaoTab } from './pages/ValidacaoTab';
import { DesafioTab } from './pages/DesafioTab';
import {
  Home,
  Wrench,
  Box,
  GitBranch,
  PlayCircle,
  Minimize2,
  ShieldCheck,
  Award,
  Cpu,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const App: React.FC = () => {
  // Aba ativa atual
  const [abaAtiva, setAbaAtiva] = useState<string>('home');

  // Máquina ativa no laboratório (padrão inicial: Catraca)
  const [maquinaAtiva, setMaquinaAtiva] = useState<MooreMachine>(catracaSistema);

  // Estados compartilhados de execução
  const [estadoAtual, setEstadoAtual] = useState<string>(maquinaAtiva.q0);
  const [saidaAtual, setSaidaAtual] = useState<string>(
    maquinaAtiva.lambda[maquinaAtiva.q0] ?? ''
  );

  // Ao trocar de máquina, reinicia o estado
  const selecionarMaquina = (m: MooreMachine) => {
    setMaquinaAtiva(m);
    setEstadoAtual(m.q0);
    setSaidaAtual(m.lambda[m.q0] ?? '');
  };

  const handleDispararEvento = (simbolo: string) => {
    if (!maquinaAtiva.Sigma.includes(simbolo)) return;
    const prox = maquinaAtiva.delta[estadoAtual]?.[simbolo];
    if (prox) {
      setEstadoAtual(prox);
      setSaidaAtual(maquinaAtiva.lambda[prox] ?? '');
    }
  };

  const handleReiniciar = () => {
    setEstadoAtual(maquinaAtiva.q0);
    setSaidaAtual(maquinaAtiva.lambda[maquinaAtiva.q0] ?? '');
  };

  const tabs = [
    { id: 'home', label: 'Início', icone: Home },
    { id: 'lab', label: 'Bancada Robótica', icone: Wrench },
    { id: 'biblioteca', label: 'Biblioteca', icone: Box },
    { id: 'editor', label: 'Editor de Autômatos', icone: GitBranch },
    { id: 'simulacao', label: 'Simulação', icone: PlayCircle },
    { id: 'minimizacao', label: 'Minimização', icone: Minimize2 },
    { id: 'validacao', label: 'Validação (400x)', icone: ShieldCheck },
    { id: 'desafio', label: 'Modo Desafio', icone: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo e Nome do Projeto */}
          <div
            onClick={() => setAbaAtiva('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm md:text-base text-white tracking-tight flex items-center gap-1.5">
                LabRobótica{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  &amp; Autômatos
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Minimização de Máquinas de Moore
              </span>
            </div>
          </div>

          {/* Seletor do Sistema Ativo Global */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 hidden sm:inline">Sistema:</span>
            <select
              value={maquinaAtiva.nome}
              onChange={(e) => {
                const encontrado = sistemasPredefinidos.find((s) => s.nome === e.target.value);
                if (encontrado) selecionarMaquina(encontrado);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {sistemasPredefinidos.map((s) => (
                <option key={s.nome} value={s.nome} className="bg-slate-900 text-white">
                  {s.nome} ({s.Q.length} estados)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Abas de Navegação */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icone;
              const isAtiva = abaAtiva === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isAtiva
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isAtiva ? 'text-white' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal da Aba Ativa */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {abaAtiva === 'home' && (
          <HomeTab
            onNavegarPara={setAbaAtiva}
            onSelecionarSistema={selecionarMaquina}
            sistemas={sistemasPredefinidos}
          />
        )}

        {abaAtiva === 'lab' && (
          <LabMontagemTab
            maquina={maquinaAtiva}
            estadoAtual={estadoAtual}
            saidaAtual={saidaAtual}
            onDispararEvento={handleDispararEvento}
            onReiniciar={handleReiniciar}
          />
        )}

        {abaAtiva === 'biblioteca' && (
          <BibliotecaTab
            onAdicionarAoLab={() => setAbaAtiva('lab')}
            onCarregarSistema={selecionarMaquina}
            onNavegarPara={setAbaAtiva}
          />
        )}

        {abaAtiva === 'editor' && (
          <EditorTab
            maquina={maquinaAtiva}
            onChangeMaquina={selecionarMaquina}
            onSelecionarPredefinido={selecionarMaquina}
          />
        )}

        {abaAtiva === 'simulacao' && (
          <SimulacaoTab
            maquina={maquinaAtiva}
          />
        )}

        {abaAtiva === 'minimizacao' && (
          <MinimizacaoTab
            maquina={maquinaAtiva}
            onAplicarMinimizada={selecionarMaquina}
          />
        )}

        {abaAtiva === 'validacao' && (
          <ValidacaoTab
            maquina={maquinaAtiva}
          />
        )}

        {abaAtiva === 'desafio' && (
          <DesafioTab />
        )}
      </main>

      {/* Rodapé Informativo */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>Laboratório Virtual de Robótica e Autômatos Finitos • Teoria da Computação</span>
          <span className="font-mono text-slate-400">
            Máquina Atual: {maquinaAtiva.nome} (|Q|={maquinaAtiva.Q.length}, |Σ|={maquinaAtiva.Sigma.length})
          </span>
        </div>
      </footer>
    </div>
  );
};
export default App;
