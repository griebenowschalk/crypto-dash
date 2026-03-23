import type { TimeFrame } from '@/types/crypto';

/** UI preset for historical OHLC charts (maps to CryptoCompare histo endpoints). */
export type ChartTimeframePreset = {
  label: string;
  value: TimeFrame;
  limit: number;
};

export const CHART_TIMEFRAME_PRESETS: readonly ChartTimeframePreset[] = [
  { label: '1H', value: 'minute', limit: 60 },
  { label: '24H', value: 'hour', limit: 24 },
  { label: '7D', value: 'hour', limit: 168 },
  { label: '30D', value: 'day', limit: 30 },
  { label: '1Y', value: 'day', limit: 365 },
] as const;

/** Default tab in chart UIs (24H). */
export const DEFAULT_CHART_TIMEFRAME_PRESET: ChartTimeframePreset =
  CHART_TIMEFRAME_PRESETS.find(p => p.label === '24H')!;
