import { useProfile } from './useProfile';

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
};

export function useCurrency() {
    const { profile } = useProfile();
    const currency = profile?.currency ?? 'USD';
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

    const format = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatSimple = (amount: number) => {
        return `${symbol}${Math.abs(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return { currency, symbol, format, formatSimple };
}
