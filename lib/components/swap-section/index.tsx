import { CoinMetadaWithInfo } from "aftermath-ts-sdk";
import { NumericFormat, numericFormatter } from "react-number-format";
import "./styles.css";
import { BalanceInputAction, formatProps } from "@/lib/models";

const TokenIcon = ({ token }: { token?: CoinMetadaWithInfo | null }) => (
  <div className="token-icon">
    {token?.iconUrl && <img src={token?.iconUrl} alt="token-img" />}
  </div>
);

export interface ISwapSection {
  sectionLabel: string;
  haftLabel?: string;
  maxLabel?: string;
  value?: number;
  setValue: (val: number) => void;
  tokens: unknown[]; //Todo: Make clear
  token?: CoinMetadaWithInfo | null;
  setToken?: (e: string) => void;
  balance?: number;
  fiatRatio?: number;
}

export const SwapSectionComponent = (props: ISwapSection) => {
  const {
    value,
    setValue,
    token,
    sectionLabel,
    balance = 0,
    fiatRatio,
  } = props;

  const getFiatCost = () => {
    if (value && fiatRatio) return value * fiatRatio;
    return 0;
  };

  const applyBalanceAction = (rate: number) => setValue(balance * rate);

  return (
    <>
      <div className="swap-section">
        <div className="section-header">
          <span className="section-label">{sectionLabel}</span>
          <div className="section-actions">
            {Object.values(BalanceInputAction).map((action) => (
              <button
                key={action.value}
                className="action-button"
                onClick={() => applyBalanceAction(action.inputRate)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
        <div className="input-row">
          <NumericFormat
            type="text"
            className="amount-input"
            value={value}
            placeholder="0.0"
            onValueChange={(e) => {
              console.log(e);
              setValue(e.floatValue ?? 0);
            }}
            thousandSeparator
            decimalScale={5}
          />
          <div className="token-selector">
            <TokenIcon token={token} />
            <div>{token?.symbol}</div>
          </div>
        </div>
        <div className="balance-info">
          <div className="fiat-value">
            ${numericFormatter(String(getFiatCost()), formatProps)}
          </div>
          <div className="token-balance">
            <span className="wallet-icon">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"
                />
              </svg>
            </span>
            {numericFormatter(String(balance), formatProps)}
          </div>
        </div>
      </div>
    </>
  );
};
