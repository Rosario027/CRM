import React from 'react';

/* ─────────────────────────────────────────────────────────────
   SVG logos matching each insurer's real brand identity.
   Used in motor + health quotation print templates.
   To add a new insurer:  add a case below with its SVG.
───────────────────────────────────────────────────────────── */

interface Props {
  name: string;
  width?: number;
  height?: number;
  forPrint?: boolean;
}

const InsurerLogo: React.FC<Props> = ({ name, width = 90, height = 36, forPrint = false }) => {
  const key = name.toLowerCase().trim();
  const logo = getLogo(key, width, height, forPrint);
  return logo ?? <FallbackLogo name={name} width={width} height={height} />;
};

/* ── Fallback: coloured badge with text ─────────────────── */
const FallbackLogo: React.FC<{ name: string; width: number; height: number }> = ({ name, width, height }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <rect width={width} height={height} rx="4" fill="#334155" />
    <text x={width / 2} y={height / 2 + 4} textAnchor="middle" fill="#fff"
      fontFamily="Arial,sans-serif" fontSize="9" fontWeight="bold">
      {name.slice(0, 18)}
    </text>
  </svg>
);

function getLogo(key: string, w: number, h: number, _p: boolean): React.ReactNode {

  /* ── TATA AIG ────────────────────────────────────────── */
  if (key.includes('tata') && key.includes('aig')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#002F6C"/>
      <text x="45" y="14" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="11" fontWeight="900" letterSpacing="2">TATA AIG</text>
      <rect x="12" y="18" width="66" height="1.5" fill="#E31837"/>
      <text x="45" y="30" textAnchor="middle" fill="#ccc" fontFamily="Arial" fontSize="7.5" letterSpacing="0.5">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── ICICI LOMBARD ───────────────────────────────────── */
  if (key.includes('icici') && key.includes('lombard')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#fff" stroke="#e0e0e0"/>
      <rect width="90" height="12" rx="4" fill="#EE3124"/>
      <rect y="8" width="90" height="4" fill="#EE3124"/>
      <text x="45" y="10" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">iCICI</text>
      <text x="45" y="26" textAnchor="middle" fill="#EE3124" fontFamily="Arial" fontSize="10" fontWeight="900">Lombard</text>
      <text x="45" y="34" textAnchor="middle" fill="#555" fontFamily="Arial" fontSize="6.5">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── RELIANCE GENERAL ────────────────────────────────── */
  if (key.includes('reliance') && !key.includes('indusind')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#003087"/>
      <circle cx="14" cy="18" r="9" fill="#0056b3"/>
      <circle cx="14" cy="18" r="5" fill="#fff"/>
      <circle cx="14" cy="18" r="2.5" fill="#003087"/>
      <text x="52" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="10" fontWeight="900">RELIANCE</text>
      <text x="52" y="28" textAnchor="middle" fill="#8ab4f8" fontFamily="Arial" fontSize="7.5">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── ROYAL SUNDARAM ──────────────────────────────────── */
  if (key.includes('royal') || key.includes('sundaram')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#fff" stroke="#e0e0e0"/>
      <circle cx="14" cy="18" r="10" fill="#E31837"/>
      <text x="14" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">sf</text>
      <text x="55" y="15" textAnchor="middle" fill="#E31837" fontFamily="Arial" fontSize="8" fontWeight="900">ROYAL SUNDARAM</text>
      <text x="55" y="26" textAnchor="middle" fill="#555" fontFamily="Arial" fontSize="7">INSURANCE</text>
      <text x="55" y="34" textAnchor="middle" fill="#888" fontFamily="Arial" fontSize="6">Sundaram Finance Group</text>
    </svg>
  );

  /* ── BAJAJ ALLIANZ ───────────────────────────────────── */
  if (key.includes('bajaj')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#fff" stroke="#e0e0e0"/>
      <rect width="90" height="16" rx="4" fill="#003087"/>
      <rect y="12" width="90" height="4" fill="#003087"/>
      <rect y="16" width="90" height="20" rx="4" fill="#FF6600"/>
      <rect y="16" width="90" height="4" fill="#FF6600"/>
      <text x="45" y="12" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8.5" fontWeight="900">BAJAJ ALLIANZ</text>
      <text x="45" y="30" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7.5" fontWeight="700">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── HDFC ERGO ───────────────────────────────────────── */
  if (key.includes('hdfc')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#004C8C"/>
      <rect x="0" y="0" width="30" height="36" rx="4" fill="#E31837"/>
      <rect x="26" y="0" width="4" height="36" fill="#E31837"/>
      <text x="15" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">HDFC</text>
      <text x="60" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="11" fontWeight="900">ERGO</text>
      <text x="60" y="29" textAnchor="middle" fill="#aad4ff" fontFamily="Arial" fontSize="6.5">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── NEW INDIA ASSURANCE ─────────────────────────────── */
  if (key.includes('new india')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#006400"/>
      <circle cx="15" cy="18" r="10" fill="#005000" stroke="#4caf50" strokeWidth="1"/>
      <text x="15" y="22" textAnchor="middle" fill="#fff" fontFamily="serif" fontSize="10" fontWeight="900">NI</text>
      <text x="55" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8.5" fontWeight="900">NEW INDIA</text>
      <text x="55" y="26" textAnchor="middle" fill="#a5d6a7" fontFamily="Arial" fontSize="7.5">ASSURANCE</text>
    </svg>
  );

  /* ── ORIENTAL INSURANCE ──────────────────────────────── */
  if (key.includes('oriental')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#8B1A1A"/>
      <circle cx="15" cy="18" r="9" fill="#b71c1c"/>
      <text x="15" y="22" textAnchor="middle" fill="#fff" fontFamily="serif" fontSize="9" fontWeight="900">OI</text>
      <text x="55" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8.5" fontWeight="900">ORIENTAL</text>
      <text x="55" y="28" textAnchor="middle" fill="#ffcdd2" fontFamily="Arial" fontSize="7.5">INSURANCE</text>
    </svg>
  );

  /* ── UNITED INDIA INSURANCE ──────────────────────────── */
  if (key.includes('united india')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#1A237E"/>
      <circle cx="15" cy="18" r="9" fill="#283593"/>
      <text x="15" y="22" textAnchor="middle" fill="#fff" fontFamily="serif" fontSize="8" fontWeight="900">UI</text>
      <text x="55" y="14" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8" fontWeight="900">UNITED INDIA</text>
      <text x="55" y="27" textAnchor="middle" fill="#9fa8da" fontFamily="Arial" fontSize="7.5">INSURANCE</text>
    </svg>
  );

  /* ── NATIONAL INSURANCE ──────────────────────────────── */
  if (key.includes('national')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#00695C"/>
      <circle cx="15" cy="18" r="9" fill="#00796b"/>
      <text x="15" y="22" textAnchor="middle" fill="#fff" fontFamily="serif" fontSize="9" fontWeight="900">NI</text>
      <text x="55" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8.5" fontWeight="900">NATIONAL</text>
      <text x="55" y="28" textAnchor="middle" fill="#b2dfdb" fontFamily="Arial" fontSize="7.5">INSURANCE</text>
    </svg>
  );

  /* ── SBI GENERAL ─────────────────────────────────────── */
  if (key.includes('sbi')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#22368C"/>
      <rect x="4" y="6" width="22" height="24" rx="3" fill="#fff"/>
      <text x="15" y="22" textAnchor="middle" fill="#22368C" fontFamily="Arial" fontSize="10" fontWeight="900">SBI</text>
      <text x="58" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">GENERAL</text>
      <text x="58" y="28" textAnchor="middle" fill="#9fa8da" fontFamily="Arial" fontSize="7.5">INSURANCE</text>
    </svg>
  );

  /* ── ZURICH KOTAK / KOTAK GENERAL ───────────────────── */
  if (key.includes('kotak') || key.includes('zurich')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#E31837"/>
      <rect x="4" y="6" width="20" height="24" rx="2" fill="#fff"/>
      <text x="14" y="22" textAnchor="middle" fill="#E31837" fontFamily="Arial" fontSize="9" fontWeight="900">ZK</text>
      <text x="57" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8.5" fontWeight="900">ZURICH KOTAK</text>
      <text x="57" y="28" textAnchor="middle" fill="#ffcdd2" fontFamily="Arial" fontSize="7">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── IFFCO TOKIO ─────────────────────────────────────── */
  if (key.includes('iffco')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#fff" stroke="#e0e0e0"/>
      <rect width="90" height="16" rx="4" fill="#FF6600"/>
      <rect y="12" width="90" height="4" fill="#FF6600"/>
      <rect y="16" width="90" height="20" rx="4" fill="#003087"/>
      <rect y="16" width="90" height="4" fill="#003087"/>
      <text x="45" y="12" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">IFFCO-TOKIO</text>
      <text x="45" y="30" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7.5">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── DIGIT INSURANCE ─────────────────────────────────── */
  if (key.includes('digit')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#3D1A8E"/>
      <circle cx="16" cy="18" r="10" fill="#5c35c2"/>
      <text x="16" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="8" fontWeight="900">d</text>
      <text x="56" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="12" fontWeight="900">digit</text>
      <text x="56" y="29" textAnchor="middle" fill="#c3b1e1" fontFamily="Arial" fontSize="7">INSURANCE</text>
    </svg>
  );

  /* ── ACKO GENERAL ────────────────────────────────────── */
  if (key.includes('acko')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="18" fill="#2D3BE0"/>
      <text x="45" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="12" fontWeight="900">acko</text>
      <text x="45" y="28" textAnchor="middle" fill="#9fa8ff" fontFamily="Arial" fontSize="7">GENERAL INSURANCE</text>
    </svg>
  );

  /* ── STAR HEALTH ─────────────────────────────────────── */
  if (key.includes('star health') || (key.includes('star') && key.includes('health'))) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#fff" stroke="#e0e0e0"/>
      <polygon points="14,6 16.5,13 24,13 18,17.5 20,24.5 14,20 8,24.5 10,17.5 4,13 11.5,13" fill="#E31837"/>
      <text x="57" y="16" textAnchor="middle" fill="#E31837" fontFamily="Arial" fontSize="10" fontWeight="900">STAR</text>
      <text x="57" y="28" textAnchor="middle" fill="#555" fontFamily="Arial" fontSize="8">HEALTH INSURANCE</text>
    </svg>
  );

  /* ── NIVA BUPA ───────────────────────────────────────── */
  if (key.includes('niva') || key.includes('bupa')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#6A0DAD"/>
      <circle cx="13" cy="18" r="9" fill="#7b1fa2"/>
      <text x="13" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7" fontWeight="900">NB</text>
      <text x="55" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">niva bupa</text>
      <text x="55" y="28" textAnchor="middle" fill="#e1bee7" fontFamily="Arial" fontSize="7">HEALTH INSURANCE</text>
    </svg>
  );

  /* ── INDUSIND GENERAL (formerly Reliance) ────────────── */
  if (key.includes('indusind')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#4A148C"/>
      <rect x="4" y="10" width="18" height="16" rx="2" fill="#7b1fa2"/>
      <text x="13" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7" fontWeight="900">IIG</text>
      <text x="56" y="14" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7.5" fontWeight="900">IndusInd General</text>
      <text x="56" y="26" textAnchor="middle" fill="#ce93d8" fontFamily="Arial" fontSize="6.5">GENERAL INSURANCE</text>
      <text x="56" y="34" textAnchor="middle" fill="#9e6bba" fontFamily="Arial" fontSize="5.5">formerly Reliance</text>
    </svg>
  );

  /* ── CARE HEALTH ─────────────────────────────────────── */
  if (key.includes('care')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#00897B"/>
      <text x="45" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="12" fontWeight="900">care</text>
      <text x="45" y="29" textAnchor="middle" fill="#b2dfdb" fontFamily="Arial" fontSize="7.5">HEALTH INSURANCE</text>
    </svg>
  );

  /* ── ADITYA BIRLA HEALTH ─────────────────────────────── */
  if (key.includes('aditya') || key.includes('birla')) return (
    <svg width={w} height={h} viewBox="0 0 90 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="36" rx="4" fill="#E31837"/>
      <circle cx="13" cy="18" r="9" fill="#c62828"/>
      <text x="13" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7" fontWeight="900">AB</text>
      <text x="55" y="14" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="7.5" fontWeight="900">ADITYA BIRLA</text>
      <text x="55" y="26" textAnchor="middle" fill="#ffcdd2" fontFamily="Arial" fontSize="7">HEALTH INSURANCE</text>
    </svg>
  );

  return null;
};

export default InsurerLogo;
