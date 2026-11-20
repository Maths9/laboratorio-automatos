import React, { useRef } from 'react';
import { MooreMachine } from '../types/automaton';
import { AutomatonFlowEditor } from '../components/flow/AutomatonFlowEditor';
import { DefinicaoFormal } from '../components/formal/DefinicaoFormal';
import { sistemasPredefinidos } from '../data/sistemasPredefinidos';
import {
  Download,
  Upload,
  Plus,
  RefreshCw,
  FolderOpen,
  Sparkles,
} from 'lucide-react';

interface EditorTabProps {
  maquina: MooreMachine;
  onChangeMaquina: (nova: MooreMachine) => void;
  onSelecionarPredefinido: (m: MooreMachine) => void;
}

export const EditorTab: React.FC<EditorTabProps> = ({
  maquina,
  onChangeMaquina,
  onSelecionarPredefinido,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exportar autômato como arquivo JSON
  const handleExportarJSON = () => {
    const jsonStr = JSON.stringify(maquina, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${maquina.nome.toLowerCase().replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importar autômato a partir de arquivo JSON
  const handleImportarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.Q && parsed.Sigma && parsed.delta && parsed.q0 && parsed.lambda) {
          onChangeMaquina(parsed as MooreMachine);
          alert(`Autômato "${parsed.nome || 'Personalizado'}" carregado com sucesso!`);
        } else {
          alert('Arquivo JSON inválido: certifique-se de que possui Q, Sigma, delta, q0 e lambda.');
        }
      } catch (err) {
        alert('Erro ao interpretar o arquivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Criar um novo autômato vazio
  const handleCriarNovoAutomato = () => {
    if (confirm('Deseja criar um novo autômato do zero? O atual será substituído na bancada.')) {
      const novo: MooreMachine = {
        nome: 'Autômato Personalizado',
        descricao: 'Criado no laboratório virtual',
        tipoFisico: 'custom',
        Q: ['q0', 'q1'],
        Sigma: ['0', '1'],
        delta: {
          q0: { '0': 'q0', '1': 'q1' },
          q1: { '0': 'q1', '1': 'q0' },
        },
        q0: 'q0',
        Gamma: ['SAIDA_A', 'SAIDA_B'],
        lambda: {
          q0: 'SAIDA_A',
          q1: 'SAIDA_B',
        },
      };
      onChangeMaquina(novo);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Cabeçalho do Editor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Editor Visual de Autômatos Finitos (React Flow)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Construa e edite máquinas de Moore personalizadas: adicione estados, configure transições direcionadas e saídas λ.
          </p>
        </div>

        {/* Ações de Importação / Exportação / Criar Novo */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportarJSON}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            title="Importar autômato em formato JSON"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Carregar JSON
          </button>

          <button
            onClick={handleExportarJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            title="Exportar autômato em formato JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Salvar JSON
          </button>

          <button
            onClick={handleCriarNovoAutomato}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Criar do Zero
          </button>
        </div>
      </div>

      {/* Seletor Rápido de Sistemas Prontos */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 whitespace-nowrap">
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          Carregar Exemplo:
        </span>
        {sistemasPredefinidos.map((sis) => (
          <button
            key={sis.nome}
            onClick={() => onSelecionarPredefinido(sis)}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              sis.nome === maquina.nome
                ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {sis.nome} ({sis.Q.length} estados)
          </button>
        ))}
      </div>

      {/* Área do Editor React Flow */}
      <div className="w-full">
        <AutomatonFlowEditor
          maquina={maquina}
          onChangeMaquina={onChangeMaquina}
          altura="560px"
        />
      </div>

      {/* Definição Formal Matemática M = (Q, Σ, δ, q0, Γ, λ) */}
      <div className="w-full">
        <DefinicaoFormal maquina={maquina} />
      </div>
    </div>
  );
};
