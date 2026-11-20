import React, { useState } from 'react';
import {
  componentesCatalogo,
  sistemasPredefinidos,
} from '../data/sistemasPredefinidos';
import {
  RoboticComponentSpec,
  ComponentCategory,
  MooreMachine,
} from '../types/automaton';
import {
  DoorClosed,
  TrafficCone,
  ShieldAlert,
  Warehouse,
  KeyRound,
  Radio,
  Wifi,
  Sun,
  Thermometer,
  CircleDot,
  CreditCard,
  Lightbulb,
  Volume2,
  Cog,
  Gauge,
  Tv,
  Lock,
  Search,
  Filter,
  CheckCircle,
  Plus,
  Play,
  ArrowRight,
} from 'lucide-react';
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

interface BibliotecaTabProps {
  onAdicionarAoLab?: (comp: RoboticComponentSpec) => void;
  onCarregarSistema?: (sis: MooreMachine) => void;
  onNavegarPara?: (aba: string) => void;
}

export const BibliotecaTab: React.FC<BibliotecaTabProps> = ({
  onAdicionarAoLab,
  onCarregarSistema,
  onNavegarPara,
}) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<ComponentCategory | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [componenteSelecionado, setComponenteSelecionado] = useState<RoboticComponentSpec | null>(
    componentesCatalogo[0]
  );

  const componentesFiltrados = componentesCatalogo.filter((c) => {
    const matchCat = categoriaAtiva === 'todos' || c.categoria === categoriaAtiva;
    const matchBusca =
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      c.funcao.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const renderIcone = (nome: string, cor: string) => {
    const props = { className: 'w-6 h-6', style: { color: cor } };
    switch (nome) {
      case 'DoorClosed': return <DoorClosed {...props} />;
      case 'TrafficCone': return <TrafficCone {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Warehouse': return <Warehouse {...props} />;
      case 'KeyRound': return <KeyRound {...props} />;
      case 'Radio': return <Radio {...props} />;
      case 'Wifi': return <Wifi {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Thermometer': return <Thermometer {...props} />;
      case 'CircleDot': return <CircleDot {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'Lightbulb': return <Lightbulb {...props} />;
      case 'Volume2': return <Volume2 {...props} />;
      case 'Cog': return <Cog {...props} />;
      case 'Gauge': return <Gauge {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Lock': return <Lock {...props} />;
      default: return <CircleDot {...props} />;
    }
  };

  const renderSVGInterativo = (id: string) => {
    switch (id) {
      case 'sen_presenca': return <SensorPresencaSVG ativo={true} />;
      case 'sen_ultrassom': return <SensorUltrassomSVG ativo={true} />;
      case 'sen_luz': return <SensorLuzSVG ativo={true} />;
      case 'sen_temp': return <SensorTempSVG ativo={true} />;
      case 'sen_botao': return <BotaoSVG ativo={true} />;
      case 'sen_rfid': return <LeitorRFIDSVG ativo={true} />;
      case 'atu_led': return <LedSVG ligado={true} cor="#22c55e" />;
      case 'atu_buzzer': return <BuzzerSVG tocando={true} />;
      case 'atu_motor': return <MotorSVG girando={true} />;
      case 'atu_servo': return <ServoSVG angulo={90} />;
      case 'atu_display': return <DisplaySVG texto="LIBERADO" />;
      case 'atu_mecanismo': return <TravaSVG liberada={true} />;
      default:
        return (
          <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
            SVG
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Cabeçalho da Biblioteca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Biblioteca de Componentes Robóticos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore os componentes mecatrônicos vetoriais (SVG), sensores lógicos de entrada e atuadores de saída.
          </p>
        </div>

        {/* Barra de Busca e Filtro */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar componente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Abas de Categorias */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'todos', label: 'Todos os Componentes' },
          { id: 'sistemas', label: '5.1 Sistemas Automatizados' },
          { id: 'sensores', label: '5.2 Sensores e Entradas' },
          { id: 'atuadores', label: '5.3 Atuadores e Saídas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoriaAtiva(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoriaAtiva === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid de Componentes e Painel Lateral de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Cards de Componentes */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {componentesFiltrados.map((comp) => {
            const isSelected = componenteSelecionado?.id === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => setComponenteSelecionado(comp)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        {renderIcone(comp.icone, comp.cor)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{comp.nome}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {comp.categoria}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {comp.descricao}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    {comp.simboloAssociado ? (
                      <span className="font-mono text-cyan-400 font-bold">
                        Entrada Σ: "{comp.simboloAssociado}"
                      </span>
                    ) : comp.saidaAssociada ? (
                      <span className="font-mono text-emerald-400 font-bold">
                        Saída λ: "{comp.saidaAssociada}"
                      </span>
                    ) : (
                      'Sistema completo'
                    )}
                  </span>
                  <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver detalhes <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Painel de Visualização e Teste do Componente Selecionado */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          {componenteSelecionado ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  {componenteSelecionado.categoria}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ID: {componenteSelecionado.id}
                </span>
              </div>

              {/* Renderização do SVG do componente */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[160px]">
                {renderSVGInterativo(componenteSelecionado.id)}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {componenteSelecionado.nome}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {componenteSelecionado.descricao}
                </p>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">
                    Função no Sistema:
                  </span>
                  <p className="text-xs text-slate-400">
                    {componenteSelecionado.funcao}
                  </p>
                </div>
              </div>

              {/* Ações com o componente */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    onAdicionarAoLab?.(componenteSelecionado);
                    onNavegarPara?.('lab');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow"
                >
                  <Plus className="w-4 h-4" />
                  Inserir no Laboratório de Montagem
                </button>

                {componenteSelecionado.categoria === 'sistemas' && (
                  <button
                    onClick={() => {
                      const sis = sistemasPredefinidos.find((s) =>
                        s.nome.toLowerCase().includes(componenteSelecionado.nome.toLowerCase().slice(0, 5))
                      );
                      if (sis && onCarregarSistema) {
                        onCarregarSistema(sis);
                        onNavegarPara?.('simulacao');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                  >
                    <Play className="w-4 h-4 text-emerald-400" />
                    Carregar e Simular no Autômato
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Selecione um componente para ver especificações.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
