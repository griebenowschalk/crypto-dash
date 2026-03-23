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
  PRICE_CHART_CURRENCY,
} from '@/lib/chart-timeframes';
import { formatPrice, formatTimestamp } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChartProps {
  symbol: string;
}

export function PriceChart({ symbol }: PriceChartProps) {
  const [activeFrame, setActiveFrame] = useState(
    DEFAULT_CHART_TIMEFRAME_PRESET
  );
  const { data, isLoading } = useHistoricalData(
    symbol,
    PRICE_CHART_CURRENCY,
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">
          {symbol} / {PRICE_CHART_CURRENCY}
        </CardTitle>
        <div className="flex gap-1">
          {CHART_TIMEFRAME_PRESETS.map(tf => (
            <button
              key={tf.label}
              onClick={() => setActiveFrame(tf)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                activeFrame.label === tf.label
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
                tickFormatter={v => formatTimestamp(v, activeFrame.value)}
                className="text-muted-foreground text-xs"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={v => formatPrice(v, PRICE_CHART_CURRENCY)}
                className="text-muted-foreground"
                tick={{ fontSize: 11 }}
                width={70}
              />
              <Tooltip
                formatter={value =>
                  value != null && typeof value === 'number'
                    ? [formatPrice(value, PRICE_CHART_CURRENCY), 'Price']
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
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                fill="url(#colorGradient)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
