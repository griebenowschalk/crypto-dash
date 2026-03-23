import { H1, P } from '@/components/typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppCurrency } from '@/hooks/useAppCurrency';
import type { Currency } from '@/types/crypto';

export function Settings() {
  const { currency, setCurrency, options } = useAppCurrency();

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <H1>Settings</H1>
        <P>Configure global preferences for CryptoDash.</P>
      </div>

      <section className="bg-card/70 border p-4">
        <h2 className="mb-2 text-sm font-medium tracking-wide uppercase">
          Display Currency
        </h2>
        <P className="text-muted-foreground mt-0 mb-3 text-sm">
          Default currency is South African Rand. This updates prices and charts
          across the app.
        </P>
        <Select
          value={currency}
          onValueChange={value => setCurrency(value as Currency)}
        >
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </div>
  );
}
