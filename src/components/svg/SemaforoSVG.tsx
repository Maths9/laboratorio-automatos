import React, { useState } from 'react';

interface SemaforoSVGProps {
  saida: string;
  onEvento?: (simbolo: string) => void;
  interativo?: boolean;
}

export const SemaforoSVG: React.FC<SemaforoSVGProps> = ({
  saida,
  onEvento,
  interativo = true,
}) => {
  const [pulsandoTick, setPulsandoTick] = useState(false);

  const isVermelho = saida === 'VERMELHO';
  const isAmarelo = saida === 'AMARELO';
  const isVerde = saida === 'VERDE';

  const handleTick = () => {
    if (!interativo || !onEvento) return;
    setPulsandoTick(true);
    setTimeout(() => setPulsandoTick(false), 300);
    onEvento('T');
  };

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 320 300"
        className="w-full max-w-sm drop-shadow-xl"
        role="img"
        aria-label="Semáforo de Trânsito em SVG"
      >
        <defs>
          <filter id="brilhoLuzVermelha" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="brilhoLuzAmarela" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="brilhoLuzVerde" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Caixa principal do semáforo */}
        <rect
          x="100"
          y="20"
          width="100"
          height="220"
          rx="20"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="6"
        />

        {/* Viseiras das luzes */}
        <path d="M115,55 Q150,30 185,55" fill="none" stroke="#0f172a" strokeWidth="5" />
        <path d="M115,125 Q150,100 185,125" fill="none" stroke="#0f172a" strokeWidth="5" />
        <path d="M115,195 Q150,170 185,195" fill="none" stroke="#0f172a" strokeWidth="5" />

        {/* Luz Vermelha */}
        <circle
          cx="150"
          cy="65"
          r="26"
          fill={isVermelho ? '#ef4444' : '#450a0a'}
          stroke={isVermelho ? '#fecaca' : '#1e1b4b'}
          strokeWidth={isVermelho ? 4 : 2}
          filter={isVermelho ? 'url(#brilhoLuzVermelha)' : undefined}
          className="transition-all duration-300"
        />

        {/* Luz Amarela */}
        <circle
          cx="150"
          cy="130"
          r="26"
          fill={isAmarelo ? '#eab308' : '#422006'}
          stroke={isAmarelo ? '#fef08a' : '#1e1b4b'}
          strokeWidth={isAmarelo ? 4 : 2}
          filter={isAmarelo ? 'url(#brilhoLuzAmarela)' : undefined}
          className="transition-all duration-300"
        />

        {/* Luz Verde */}
        <circle
          cx="150"
          cy="195"
          r="26"
          fill={isVerde ? '#22c55e' : '#052e16'}
          stroke={isVerde ? '#bbf7d0' : '#1e1b4b'}
          strokeWidth={isVerde ? 4 : 2}
          filter={isVerde ? 'url(#brilhoLuzVerde)' : undefined}
          className="transition-all duration-300"
        />

        {/* Botão interativo do Sensor de Clock (Tick · T) */}
        <g
          onClick={handleTick}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <circle
            cx="255"
            cy="110"
            r="38"
            fill="#334155"
            stroke={pulsandoTick ? '#38bdf8' : '#64748b'}
            strokeWidth={pulsandoTick ? 5 : 3}
          />
          {/* Mostrador de relógio analógico */}
          <circle cx="255" cy="110" r="32" fill="#0f172a" />
          <line
            x1="255"
            y1="110"
            x2="255"
            y2="88"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            className={pulsandoTick ? 'rotate-45 origin-[255px_110px]' : ''}
          />
          <line x1="255" y1="110" x2="272" y2="110" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="255" cy="110" r="4" fill="#38bdf8" />

          <text x="255" y="165" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            Clock · T
          </text>
          <text x="255" y="180" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            Avançar pulso
          </text>
        </g>

        {/* Painel Display inferior com a saída e nome da fase */}
        <rect x="70" y="255" width="160" height="36" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text
          x="150"
          y="278"
          textAnchor="middle"
          fill={
            isVermelho ? '#f87171' : isAmarelo ? '#facc15' : isVerde ? '#4ade80' : '#94a3b8'
          }
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {saida ? `SAÍDA: ${saida}` : 'AGUARDANDO'}
        </text>
      </svg>

      <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
        isVermelho
          ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
          : isAmarelo
          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
          : isVerde
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
          : 'bg-slate-900 text-slate-400 border-slate-700'
      }`}>
        {isVermelho && '🔴 Pare! Veículos parados, pedestres podem atravessar.'}
        {isAmarelo && '🟡 Atenção! Transição iminente entre verde e vermelho.'}
        {isVerde && '🟢 Siga! Tráfego liberado para os veículos.'}
      </div>
    </div>
  );
};
