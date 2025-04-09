import { CoinMetadaWithInfo, CoinPriceInfo } from "aftermath-ts-sdk";
import { NumericFormatProps } from "react-number-format";

export enum TOKENS_ADDRESS {
  SUI = "0x2::sui::SUI",
  CETUS = "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS",
}

export interface ITokensPrice {
  from: CoinPriceInfo | null;
  to: CoinPriceInfo | null;
}
export interface ITokensMetadata {
  from: CoinMetadaWithInfo | null;
  to: CoinMetadaWithInfo | null;
}

export interface IBestRoute {
  fromCoin?: string;
  toCoin?: string;
  amount: number;
}

export const BalanceInputAction = {
  HALF: { value: "Half", label: "Half", inputRate: 0.5 },
  MAX: { value: "Max", label: "Max", inputRate: 1 },
};

export const formatProps: NumericFormatProps = {
  thousandSeparator: ",",
  decimalScale: 5,
};

export type Network = "mainnet" | "testnet" | "devnet" | "localnet";
