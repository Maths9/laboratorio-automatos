import React, { useState, useEffect } from 'react';

interface CatracaSVGProps {
  saida: string;
  onEvento?: (simbolo: string) => void;
  interativo?: boolean;
}

export const CatracaSVG: React.FC<CatracaSVGProps> = ({
  saida,
  onEvento,
  interativo = true,
}) => {
  const isLiberada = saida === 'LIBERADA';
  const [angulo, setAngulo] = useState(0);
  const [animandoMoeda, setAnimandoMoeda] = useState(false);
  const [mensagemAcao, setMensagemAcao] = useState<string>('');

  useEffect(() => {
    if (isLiberada) {
      setMensagemAcao('Catraca destravada! Empurre a haste para passar.');
    } else {
      setMensagemAcao('Catraca bloqueada. Insira uma moeda válida (M).');
    }
  }, [isLiberada]);

  const handleMoeda = () => {
    if (!interativo || !onEvento) return;
    setAnimandoMoeda(true);
    setMensagemAcao('Moeda inserida! Processando no autômato...');
    setTimeout(() => setAnimandoMoeda(false), 600);
    onEvento('M');
  };

  const handleGiro = () => {
    if (!interativo || !onEvento) return;
    if (isLiberada) {
      setAngulo((prev) => prev + 120);
      setMensagemAcao('Pessoa passou! Os braços giraram 120°.');
    } else {
      setMensagemAcao('Tentativa de giro impedida: mecanismo travado!');
    }
    onEvento('G');
  };

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 360 280"
        className="w-full max-w-sm drop-shadow-xl"
        role="img"
        aria-label="Catraca Inteligente em SVG"
      >
        <defs>
          {/* Gradientes metálicos e luzes */}
          <linearGradient id="corpoMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="painelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <filter id="brilhoVerde" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="brilhoVermelho" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base do chão / demarcação de passagem */}
        <rect x="20" y="230" width="320" height="20" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <line x1="60" y1="240" x2="300" y2="240" stroke="#475569" strokeDasharray="6 6" strokeWidth="2" />

        {/* Gabinete metálico da catraca */}
        <rect
          x="130"
          y="40"
          width="100"
          height="160"
          rx="16"
          fill="url(#corpoMetal)"
          stroke="#64748b"
          strokeWidth="3"
        />

        {/* Eixo central dos braços rotativos com animação CSS */}
        <g
          style={{
            transformOrigin: '180px 120px',
            transform: `rotate(${angulo}deg)`,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Braços tripé em aço cromado */}
          <line x1="180" y1="120" x2="180" y2="35" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
          <line x1="180" y1="120" x2="253" y2="162" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
          <line x1="180" y1="120" x2="107" y2="162" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />

          {/* Tampa do rotor */}
          <circle cx="180" cy="120" r="22" fill="#0f172a" stroke="#94a3b8" strokeWidth="4" />
          <circle cx="180" cy="120" r="10" fill="#38bdf8" />
        </g>

        {/* Moeda animada ao cair no slot */}
        {animandoMoeda && (
          <circle
            cx="65"
            cy="110"
            r="12"
            fill="#eab308"
            stroke="#ca8a04"
            strokeWidth="3"
            className="animate-bounce"
          >
            <animate attributeName="cy" from="70" to="125" dur="0.4s" fill="freeze" />
            <animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="freeze" />
          </circle>
        )}

        {/* Botão interativo do Sensor Moeda (M) */}
        <g
          onClick={handleMoeda}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <rect x="20" y="80" width="90" height="60" rx="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          {/* Fenda da moeda */}
          <rect x="45" y="90" width="40" height="6" rx="3" fill="#1e293b" />
          <text x="65" y="118" textAnchor="middle" fill="#854d0e" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            Moeda (M)
          </text>
          <text x="65" y="132" textAnchor="middle" fill="#a16207" fontSize="10" fontFamily="sans-serif">
            Inserir
          </text>
        </g>

        {/* Botão interativo do Sensor Giro (G) */}
        <g
          onClick={handleGiro}
          className={`${interativo ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} transition-all`}
        >
          <rect x="250" y="80" width="90" height="60" rx="10" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
          <path d="M285,92 A14,14 0 1,1 275,102" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
          <polygon points="273,95 275,105 285,103" fill="#1d4ed8" />
          <text x="295" y="118" textAnchor="middle" fill="#1e40af" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            Giro (G)
          </text>
          <text x="295" y="132" textAnchor="middle" fill="#2563eb" fontSize="10" fontFamily="sans-serif">
            Empurrar
          </text>
        </g>

        {/* Painel Display do Atuador (Saída λ) */}
        <rect
          x="95"
          y="205"
          width="170"
          height="45"
          rx="10"
          fill={isLiberada ? '#052e16' : '#450a0a'}
          stroke={isLiberada ? '#22c55e' : '#ef4444'}
          strokeWidth="3"
          filter={isLiberada ? 'url(#brilhoVerde)' : 'url(#brilhoVermelho)'}
        />

        {/* Ícone de Cadeado aberto / fechado */}
        {isLiberada ? (
          <g transform="translate(110, 215)" stroke="#4ade80" strokeWidth="2.5" fill="none">
            {/* Cadeado aberto */}
            <path d="M6,10 V6 a5,5 0 0 1 10,0 v2" />
            <rect x="2" y="10" width="16" height="12" rx="3" fill="#22c55e" />
          </g>
        ) : (
          <g transform="translate(110, 215)" stroke="#f87171" strokeWidth="2.5" fill="none">
            {/* Cadeado fechado */}
            <path d="M6,10 V6 a5,5 0 0 1 10,0 v4" />
            <rect x="2" y="10" width="16" height="12" rx="3" fill="#ef4444" />
          </g>
        )}

        {/* Texto do status da saída */}
        <text
          x="195"
          y="234"
          textAnchor="middle"
          fill={isLiberada ? '#4ade80' : '#fca5a5'}
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {saida || 'BLOQUEADA'}
        </text>
      </svg>

      {/* Caixa de feedback textual para acessibilidade e clareza didática */}
      <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
        isLiberada
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
          : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
      }`}>
        {mensagemAcao}
      </div>
    </div>
  );
};
