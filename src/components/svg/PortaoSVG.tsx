import React from 'react';

interface PortaoSVGProps {
  saida: string;
  onEvento?: (simbolo: string) => void;
  interativo?: boolean;
}

export const PortaoSVG: React.FC<PortaoSVGProps> = ({
  saida,
  onEvento,
  interativo = true,
}) => {
  const isAberto = saida === 'ABERTO';
  const isFechado = saida === 'FECHADO';
  const isAbrindo = saida === 'MOTOR_ABRINDO';
  const isFechando = saida === 'MOTOR_FECHANDO';

  // Deslocamento horizontal do portão de acordo com o estado
  let posicaoX = 140;
  if (isAberto) posicaoX = 240;
  if (isAbrindo) posicaoX = 190;
  if (isFechando) posicaoX = 170;
  if (isFechado) posicaoX = 140;

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 360 260"
        className="w-full max-w-sm drop-shadow-xl"
        role="img"
        aria-label="Portão Automático em SVG"
      >
        {/* Muros laterais */}
        <rect x="20" y="50" width="70" height="150" fill="#334155" stroke="#1e293b" strokeWidth="3" />
        <rect x="270" y="50" width="70" height="150" fill="#334155" stroke="#1e293b" strokeWidth="3" />

        {/* Trilho guia no piso */}
        <line x1="20" y1="200" x2="340" y2="200" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

        {/* Folha do portão deslizante */}
        <g
          style={{
            transform: `translateX(${posicaoX - 140}px)`,
            transition: 'transform 0.6s ease-in-out',
          }}
        >
          <rect x="90" y="70" width="120" height="125" rx="4" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
          {/* Grades */}
          <line x1="110" y1="70" x2="110" y2="195" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="130" y1="70" x2="130" y2="195" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="150" y1="70" x2="150" y2="195" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="170" y1="70" x2="170" y2="195" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="190" y1="70" x2="190" y2="195" stroke="#cbd5e1" strokeWidth="3" />
        </g>

        {/* Feixe fotoelétrico do sensor de obstáculo (O) */}
        <line
          x1="90"
          y1="180"
          x2="270"
          y2="180"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />

        {/* Botão de Controle Remoto (C) */}
        <g
          onClick={() => interativo && onEvento?.('C')}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <rect x="25" y="15" width="80" height="35" rx="6" fill="#fae8ff" stroke="#a855f7" strokeWidth="2" />
          <text x="65" y="38" textAnchor="middle" fill="#7e22ce" fontSize="12" fontWeight="bold">
            Controle (C)
          </text>
        </g>

        {/* Botão Sensor de Obstáculo (O) */}
        <g
          onClick={() => interativo && onEvento?.('O')}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <rect x="255" y="15" width="85" height="35" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <text x="297" y="38" textAnchor="middle" fill="#b91c1c" fontSize="12" fontWeight="bold">
            Obstáculo (O)
          </text>
        </g>

        {/* Display do estado do motor */}
        <rect x="80" y="215" width="200" height="35" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text
          x="180"
          y="238"
          textAnchor="middle"
          fill={isAbrindo || isFechando ? '#facc15' : isAberto ? '#4ade80' : '#f87171'}
          fontSize="13"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {saida || 'FECHADO'}
        </text>
      </svg>
      <div className="mt-2 text-xs text-slate-400">
        {isAbrindo && '⚙️ Motor girando: abrindo o portão...'}
        {isFechando && '⚙️ Motor girando: fechando o portão...'}
        {isAberto && '🟢 Portão completamente aberto.'}
        {isFechado && '🔴 Portão travado e fechado.'}
      </div>
    </div>
  );
};
