// These are the most-used visual units — used in Dashboard and Markets.

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import type { HistoricalDataPoint } from '@/types/crypto';

interface SparklineProps {
  data: HistoricalDataPoint[] | undefined;
  positive: boolean;
}

export function Sparkline({ data, positive }: SparklineProps) {
  const points = Array.isArray(data) ? data : [];
  if (points.length === 0) {
    return null;
  }

  const color = positive ? '#22c55e' : '#ef4444';
  const chartData = points.map(d => ({ value: d.close }));

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          dot={false}
          strokeWidth={1.5}
        />
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <div className="bg-popover border-border rounded border px-2 py-1 text-xs">
                {payload[0].value}
              </div>
            ) : null
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
