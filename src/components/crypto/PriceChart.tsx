import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import {
  CHART_TIMEFRAME_PRESETS,
  DEFAULT_CHART_TIMEFRAME_PRESET,
} from '@/lib/chart-timeframes';
import { formatCompactPrice, formatPrice, formatTimestamp } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppCurrency } from '@/hooks/useAppCurrency';

interface PriceChartProps {
  symbol: string;
}

export function PriceChart({ symbol }: PriceChartProps) {
  const [activeFrame, setActiveFrame] = useState(
    DEFAULT_CHART_TIMEFRAME_PRESET
  );
  const { currency } = useAppCurrency();
  const { data, isLoading } = useHistoricalData(
    symbol,
    currency,
    activeFrame.value,
    activeFrame.limit
  );

  const chartData = data?.map(d => ({ time: d.time, price: d.close })) ?? [];
  const isPositive =
    chartData.length > 1
      ? chartData[chartData.length - 1].price >= chartData[0].price
      : true;
  const color = isPositive ? '#22c55e' : '#ef4444';

  return (
    <Card className="bg-card/70 border shadow-sm">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">
          {symbol} / {currency}
        </CardTitle>
        <div className="bg-muted inline-flex w-fit gap-1 rounded-lg p-1">
          {CHART_TIMEFRAME_PRESETS.map(tf => (
            <button
              key={tf.label}
              onClick={() => setActiveFrame(tf)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                activeFrame.label === tf.label
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 6, left: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/60"
              />
              <XAxis
                dataKey="time"
                tickFormatter={v => formatTimestamp(v, activeFrame.value)}
                className="text-muted-foreground text-xs"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                tickFormatter={v => formatCompactPrice(v, currency)}
                className="text-muted-foreground"
                tick={{ fontSize: 11 }}
                width={58}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={value =>
                  value != null && typeof value === 'number'
                    ? [formatPrice(value, currency), 'Price']
                    : ['—', 'Price']
                }
                labelFormatter={v =>
                  typeof v === 'number'
                    ? formatTimestamp(v, activeFrame.value)
                    : String(v)
                }
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                fill="url(#colorGradient)"
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
