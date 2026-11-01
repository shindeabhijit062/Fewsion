import React from 'react';
import { FEATURES, FeatureInfo, FeatureKey, featureLabel } from '@/lib/featureStatus';

const STYLES: Record<FeatureInfo['status'], string> = {
  live: 'bg-green-100 text-green-800 border-green-200',
  beta: 'bg-amber-100 text-amber-900 border-amber-200',
  soon: 'bg-slate-100 text-slate-700 border-slate-200',
};

/** Small "Live / Beta / Coming Q1 2027" tag, driven by lib/featureStatus.ts */
export default function StatusChip({ feature, className = '' }: { feature: FeatureKey; className?: string }) {
  const info: FeatureInfo = FEATURES[feature];
  return (
    <span
      className={`ml-2 inline-block whitespace-nowrap rounded-full border px-2 py-0.5 align-middle text-xs font-bold leading-none ${STYLES[info.status]} ${className}`}
    >
      {featureLabel(feature)}
    </span>
  );
}
