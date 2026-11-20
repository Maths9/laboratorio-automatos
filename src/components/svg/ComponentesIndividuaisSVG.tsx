import React from 'react';

// ==========================================
// SENSORES E ENTRADAS
// ==========================================

export const SensorPresencaSVG: React.FC<{ ativo?: boolean; onClick?: () => void }> = ({ ativo, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none group">
    <svg viewBox="0 0 100 90" className="w-20 h-18 drop-shadow">
      <rect x="15" y="20" width="70" height="55" rx="8" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
      {/* Lente Fresnel abobadada */}
      <circle
        cx="50"
        cy="45"
        r="20"
        fill={ativo ? '#38bdf8' : '#334155'}
        stroke="#7dd3fc"
        strokeWidth="2"
        className={ativo ? 'animate-pulse' : ''}
      />
      {/* Padrão facetado da lente */}
      <line x1="35" y1="45" x2="65" y2="45" stroke="#0284c7" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="50" y2="60" stroke="#0284c7" strokeWidth="1.5" />
      <circle cx="50" cy="45" r="10" fill="none" stroke="#0284c7" strokeWidth="1" />
      {/* LED de disparo PIR */}
      <circle cx="75" cy="30" r="3" fill={ativo ? '#ef4444' : '#64748b'} />
    </svg>
    <span className="text-[11px] font-bold text-sky-400 mt-1">Sensor PIR (P)</span>
  </div>
);

export const SensorUltrassomSVG: React.FC<{ ativo?: boolean; onClick?: () => void }> = ({ ativo, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none group">
    <svg viewBox="0 0 110 90" className="w-22 h-18 drop-shadow">
      <rect x="10" y="25" width="90" height="45" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
      {/* Transdutor Emissor */}
      <circle cx="35" cy="48" r="14" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
      <circle cx="35" cy="48" r="7" fill={ativo ? '#38bdf8' : '#334155'} />
      {/* Transdutor Receptor */}
      <circle cx="75" cy="48" r="14" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
      <circle cx="75" cy="48" r="7" fill={ativo ? '#38bdf8' : '#334155'} />
      {/* Ondas sônicas quando ativo */}
      {ativo && (
        <path d="M55,30 A15,15 0 0,1 55,65" fill="none" stroke="#bae6fd" strokeWidth="2" className="animate-ping" />
      )}
    </svg>
    <span className="text-[11px] font-bold text-cyan-400 mt-1">Ultrassom (O)</span>
  </div>
);

export const SensorLuzSVG: React.FC<{ ativo?: boolean; onClick?: () => void }> = ({ ativo, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none group">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <circle cx="45" cy="45" r="28" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
      <circle cx="45" cy="45" r="18" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
      {/* Trilha serpentina do LDR */}
      <path d="M36,40 Q40,36 45,40 Q50,44 54,40 M36,45 Q40,41 45,45 Q50,49 54,45 M36,50 Q40,46 45,50 Q50,54 54,50" fill="none" stroke="#b45309" strokeWidth="2" />
      {ativo && (
        <g stroke="#facc15" strokeWidth="2">
          <line x1="20" y1="20" x2="30" y2="30" />
          <line x1="70" y1="20" x2="60" y2="30" />
        </g>
      )}
    </svg>
    <span className="text-[11px] font-bold text-yellow-400 mt-1">Sensor LDR (L)</span>
  </div>
);

export const SensorTempSVG: React.FC<{ ativo?: boolean; onClick?: () => void }> = ({ ativo, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none group">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <rect x="38" y="15" width="14" height="45" rx="7" fill="#334155" stroke="#f97316" strokeWidth="2" />
      <circle cx="45" cy="62" r="14" fill={ativo ? '#ea580c' : '#c2410c'} stroke="#f97316" strokeWidth="2" />
      <rect x="42" y={ativo ? 30 : 45} width="6" height={ativo ? 32 : 17} fill="#fdba74" />
    </svg>
    <span className="text-[11px] font-bold text-orange-400 mt-1">Temp. NTC (T)</span>
  </div>
);

export const BotaoSVG: React.FC<{ ativo?: boolean; onClick?: () => void }> = ({ ativo, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none group">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <rect x="18" y="20" width="54" height="54" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
      <circle
        cx="45"
        cy="47"
        r={ativo ? 18 : 20}
        fill={ativo ? '#f59e0b' : '#3b82f6'}
        stroke="#1d4ed8"
        strokeWidth="2"
        className="transition-all"
      />
      <circle cx="45" cy="47" r="10" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
    </svg>
    <span className="text-[11px] font-bold text-blue-400 mt-1">Botão / Moeda (M)</span>
  </div>
);

export const LeitorRFIDSVG: React.FC<{ ativo?: boolean; onClick?: () => void }> = ({ ativo, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none group">
    <svg viewBox="0 0 100 90" className="w-20 h-18 drop-shadow">
      <rect x="15" y="15" width="70" height="60" rx="8" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
      {/* Símbolo de antena NFC */}
      <path d="M35,38 A16,16 0 0,1 65,38" fill="none" stroke="#a5b4fc" strokeWidth="2.5" />
      <path d="M42,46 A8,8 0 0,1 58,46" fill="none" stroke="#a5b4fc" strokeWidth="2" />
      <circle cx="50" cy="54" r="3" fill={ativo ? '#4ade80' : '#818cf8'} />
    </svg>
    <span className="text-[11px] font-bold text-indigo-400 mt-1">Leitor RFID (K)</span>
  </div>
);

// ==========================================
// ATUADORES E SAÍDAS
// ==========================================

export const LedSVG: React.FC<{ ligado?: boolean; cor?: string; rotulo?: string }> = ({
  ligado = false,
  cor = '#22c55e',
  rotulo = 'LED Status',
}) => (
  <div className="flex flex-col items-center select-none">
    <svg viewBox="0 0 80 90" className="w-16 h-18 drop-shadow">
      <rect x="25" y="55" width="30" height="15" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2" />
      <path
        d="M25,55 C25,25 55,25 55,55 Z"
        fill={ligado ? cor : '#1e293b'}
        stroke={ligado ? '#ffffff' : '#475569'}
        strokeWidth="2"
        className={ligado ? 'animate-pulse' : ''}
      />
      {ligado && (
        <circle cx="40" cy="38" r="8" fill="#ffffff" opacity="0.6" />
      )}
    </svg>
    <span className="text-[11px] font-bold text-emerald-400 mt-1">{rotulo}</span>
    <span className="text-[10px] text-slate-400">{ligado ? 'LIGADO' : 'DESLIGADO'}</span>
  </div>
);

export const BuzzerSVG: React.FC<{ tocando?: boolean }> = ({ tocando }) => (
  <div className="flex flex-col items-center select-none">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <circle cx="45" cy="45" r="28" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
      <circle cx="45" cy="45" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
      <circle cx="45" cy="45" r="5" fill={tocando ? '#ef4444' : '#64748b'} />
      {tocando && (
        <g stroke="#f87171" strokeWidth="2" fill="none" className="animate-ping">
          <path d="M75,30 Q85,45 75,60" />
          <path d="M15,30 Q5,45 15,60" />
        </g>
      )}
    </svg>
    <span className="text-[11px] font-bold text-rose-400 mt-1">Buzzer / Sirene</span>
    <span className="text-[10px] text-slate-400">{tocando ? 'EMITINDO SOM' : 'MUDO'}</span>
  </div>
);

export const MotorSVG: React.FC<{ girando?: boolean }> = ({ girando }) => (
  <div className="flex flex-col items-center select-none">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <rect x="20" y="25" width="50" height="40" rx="8" fill="#334155" stroke="#a855f7" strokeWidth="2" />
      {/* Eixo central com hélice rotativa */}
      <g
        style={{
          transformOrigin: '45px 45px',
          animation: girando ? 'spin 1s linear infinite' : 'none',
        }}
      >
        <circle cx="45" cy="45" r="12" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
        <line x1="45" y1="30" x2="45" y2="60" stroke="#c084fc" strokeWidth="3" />
        <line x1="30" y1="45" x2="60" y2="45" stroke="#c084fc" strokeWidth="3" />
      </g>
    </svg>
    <span className="text-[11px] font-bold text-purple-400 mt-1">Motor DC</span>
    <span className="text-[10px] text-slate-400">{girando ? 'ACIONADO' : 'PARADO'}</span>
  </div>
);

export const ServoSVG: React.FC<{ angulo?: number }> = ({ angulo = 0 }) => (
  <div className="flex flex-col items-center select-none">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <rect x="18" y="30" width="54" height="40" rx="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
      {/* Braço rotativo */}
      <g
        style={{
          transformOrigin: '45px 35px',
          transform: `rotate(${angulo}deg)`,
          transition: 'transform 0.4s ease',
        }}
      >
        <circle cx="45" cy="35" r="10" fill="#93c5fd" />
        <line x1="45" y1="35" x2="70" y2="35" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
    <span className="text-[11px] font-bold text-blue-400 mt-1">Servomotor</span>
    <span className="text-[10px] text-slate-400">Ângulo: {angulo}°</span>
  </div>
);

export const DisplaySVG: React.FC<{ texto?: string }> = ({ texto = 'PRONTO' }) => (
  <div className="flex flex-col items-center select-none">
    <svg viewBox="0 0 130 70" className="w-28 h-16 drop-shadow">
      <rect x="5" y="10" width="120" height="50" rx="6" fill="#022c22" stroke="#10b981" strokeWidth="2" />
      <rect x="12" y="16" width="106" height="38" rx="4" fill="#064e3b" />
      <text
        x="65"
        y="40"
        textAnchor="middle"
        fill="#34d399"
        fontSize="11"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {texto.length > 12 ? texto.slice(0, 11) + '..' : texto}
      </text>
    </svg>
    <span className="text-[11px] font-bold text-emerald-400 mt-1">Display LCD</span>
  </div>
);

export const TravaSVG: React.FC<{ liberada?: boolean }> = ({ liberada }) => (
  <div className="flex flex-col items-center select-none">
    <svg viewBox="0 0 90 90" className="w-18 h-18 drop-shadow">
      <rect x="25" y="40" width="40" height="35" rx="6" fill={liberada ? '#065f46' : '#991b1b'} stroke={liberada ? '#10b981' : '#ef4444'} strokeWidth="2" />
      {/* Haste do cadeado / solenoide */}
      {liberada ? (
        <path d="M35,40 V28 a10,10 0 0,1 20,0 v4" fill="none" stroke="#34d399" strokeWidth="4" />
      ) : (
        <path d="M35,40 V28 a10,10 0 0,1 20,0 v12" fill="none" stroke="#f87171" strokeWidth="4" />
      )}
      <circle cx="45" cy="55" r="4" fill="#ffffff" />
    </svg>
    <span className="text-[11px] font-bold text-rose-400 mt-1">Mecanismo Trava</span>
    <span className="text-[10px] text-slate-400">{liberada ? 'DESTRAVADO' : 'TRAVADO'}</span>
  </div>
);
