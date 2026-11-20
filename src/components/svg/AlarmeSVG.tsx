import React from 'react';

interface AlarmeSVGProps {
  saida: string;
  onEvento?: (simbolo: string) => void;
  interativo?: boolean;
}

export const AlarmeSVG: React.FC<AlarmeSVGProps> = ({
  saida,
  onEvento,
  interativo = true,
}) => {
  const isSirene = saida === 'SIRENE_LIGADA';
  const isVigilante = saida === 'VIGILANTE';

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 320 260"
        className="w-full max-w-sm drop-shadow-xl"
        role="img"
        aria-label="Alarme Residencial em SVG"
      >
        <defs>
          <filter id="brilhoSirene" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sirene com cúpula estroboscópica */}
        <path
          d="M120,130 C120,60 200,60 200,130 Z"
          fill={isSirene ? '#ef4444' : '#64748b'}
          stroke="#0f172a"
          strokeWidth="4"
          filter={isSirene ? 'url(#brilhoSirene)' : undefined}
          className={isSirene ? 'animate-pulse' : ''}
        />
        <rect x="105" y="130" width="110" height="30" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />

        {/* Ondas sonoras de alarme */}
        {isSirene && (
          <g stroke="#f87171" strokeWidth="3" fill="none" className="animate-ping">
            <path d="M90,95 A50,50 0 0,0 90,135" />
            <path d="M230,95 A50,50 0 0,1 230,135" />
          </g>
        )}

        {/* Sensor de Presença (P) */}
        <g
          onClick={() => interativo && onEvento?.('P')}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <rect x="20" y="80" width="80" height="60" rx="8" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
          <circle cx="60" cy="100" r="12" fill="#06b6d4" />
          <text x="60" y="125" textAnchor="middle" fill="#155e75" fontSize="11" fontWeight="bold">
            Sensor (P)
          </text>
        </g>

        {/* Teclado / Chave (K) */}
        <g
          onClick={() => interativo && onEvento?.('K')}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <rect x="220" y="80" width="80" height="60" rx="8" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
          <rect x="235" y="90" width="50" height="18" rx="3" fill="#312e81" />
          <text x="260" y="125" textAnchor="middle" fill="#3730a3" fontSize="11" fontWeight="bold">
            Chave (K)
          </text>
        </g>

        {/* Display de Status */}
        <rect x="70" y="180" width="180" height="40" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text
          x="160"
          y="205"
          textAnchor="middle"
          fill={isSirene ? '#ef4444' : isVigilante ? '#38bdf8' : '#94a3b8'}
          fontSize="13"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {saida || 'SILENCIOSO'}
        </text>
      </svg>
      <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium text-center border ${
        isSirene ? 'bg-rose-950 text-rose-300 border-rose-500' : isVigilante ? 'bg-sky-950 text-sky-300 border-sky-500' : 'bg-slate-900 text-slate-400 border-slate-700'
      }`}>
        {isSirene ? '🚨 INVASÃO DETECTADA! Sirene ativada.' : isVigilante ? '🛡️ Alarme armado em vigilância contínua.' : '⚪ Sistema desarmado.'}
      </div>
    </div>
  );
};
