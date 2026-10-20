export interface CryptoConversion {
  BTC: { rate: number; amount: number; address: string };
  ETH: { rate: number; amount: number; address: string };
  USDT: { rate: number; amount: number; address: string };
}

// 2026 Stable Base Rates for NGN conversions (assuming ₦1,500 / USD)
// BTC: $66,000 -> ₦99,000,000
// ETH: $3,500  -> ₦5,250,000
// USDT: $1.00  -> ₦1,500
export const CRYPTO_RATES = {
  BTC: 99000000,
  ETH: 5250000,
  USDT: 1500,
};

export const CRYPTO_ADDRESSES = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // ERC20/TRC20 Address mock
};

export function convertNgnToCrypto(ngnAmount: number): CryptoConversion {
  return {
    BTC: {
      rate: CRYPTO_RATES.BTC,
      amount: parseFloat((ngnAmount / CRYPTO_RATES.BTC).toFixed(8)),
      address: CRYPTO_ADDRESSES.BTC,
    },
    ETH: {
      rate: CRYPTO_RATES.ETH,
      amount: parseFloat((ngnAmount / CRYPTO_RATES.ETH).toFixed(6)),
      address: CRYPTO_ADDRESSES.ETH,
    },
    USDT: {
      rate: CRYPTO_RATES.USDT,
      amount: parseFloat((ngnAmount / CRYPTO_RATES.USDT).toFixed(2)),
      address: CRYPTO_ADDRESSES.USDT,
    },
  };
}

export function formatCryptoAmount(amount: number, currency: string): string {
  switch (currency.toUpperCase()) {
    case "BTC":
      return `${amount.toFixed(8)} BTC`;
    case "ETH":
      return `${amount.toFixed(6)} ETH`;
    case "USDT":
      return `${amount.toFixed(2)} USDT`;
    default:
      return `${amount} ${currency}`;
  }
}
