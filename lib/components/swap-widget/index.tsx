import { useAftermathSwap, useWalletBalance } from "@/lib";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { Coin, RouterCompleteTradeRoute } from "aftermath-ts-sdk";
import { useEffect, useState } from "react";
import { RouteSectionComponent } from "../route-section";
import { SwapSectionComponent } from "../swap-section";
import "./styles.css";

export const SwapWidget = () => {
  const currentAccount = useCurrentAccount();
  const { balances } = useWalletBalance();
  const {
    fromToken,
    toToken,
    tokensMetadata,
    tokensPrice,
    loading,
    swapTokenPosition,
    getTradeRoute,
    swapTokens,
  } = useAftermathSwap();

  const [payNumber, setPayNumber] = useState(0);
  const [receiveNumber, setReceiveNumber] = useState(0);
  const [tradeRoute, setTradeRoute] = useState<RouterCompleteTradeRoute | null>(
    null
  );

  const exChangeRate = () => {
    if (!tradeRoute) {
      return 0;
    }

    const from = Coin.balanceWithDecimals(
      tradeRoute?.coinIn.amount,
      tokensMetadata?.from?.decimals ?? 9
    );
    const to = Coin.balanceWithDecimals(
      tradeRoute?.coinOut.amount,
      tokensMetadata?.to?.decimals ?? 9
    );

    return to / from;
  };

  useEffect(() => {
    if (payNumber) {
      handlePayNumberChange();
    }
  }, [payNumber]);

  const handlePayNumberChange = async () => {
    const route = await getTradeRoute({ amount: payNumber });
    setTradeRoute(route);

    console.log(route);

    const receiveNumber = Coin.balanceWithDecimals(
      route.coinOut.amount,
      tokensMetadata?.to?.decimals ?? 9
    );
    setReceiveNumber(receiveNumber);
  };

  const handleSwapTokenPosition = () => {
    swapTokenPosition();
    reset();
  };

  const reset = () => {
    setTradeRoute(null);
    setReceiveNumber(0);
    setPayNumber(0);
  };

  const getTotalBalanceWithDecimal = (balance: number, tokenDecimal = 9) => {
    return Coin.balanceWithDecimals(balance, tokenDecimal);
  };

  const getTokenBalanceWallet = (token: string) => {
    return balances?.find((balance) => balance.coinType === token);
  };

  const handleTrade = async () => {
    await swapTokens();
  };

  return (
    <>
      <div className="swap-widget-container">
        {loading && <div className="loader"></div>}
        <SwapSectionComponent
          balance={getTotalBalanceWithDecimal(
            Number(getTokenBalanceWallet(fromToken)?.totalBalance ?? 0),
            tokensMetadata?.from?.decimals
          )}
          value={payNumber}
          fiatRatio={tokensPrice?.from?.price}
          sectionLabel="You Pay"
          setValue={(val) => setPayNumber(val)}
          tokens={[]}
          token={tokensMetadata?.from}
        />

        <div className="swap-arrow-container">
          <button
            className="swap-arrow-button"
            onClick={handleSwapTokenPosition}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"
              />
            </svg>
          </button>
        </div>

        <SwapSectionComponent
          value={receiveNumber}
          balance={getTotalBalanceWithDecimal(
            Number(getTokenBalanceWallet(toToken)?.totalBalance ?? 0),
            tokensMetadata?.to?.decimals
          )}
          fiatRatio={tokensPrice?.to?.price}
          sectionLabel="You Receive"
          setValue={(val) => setReceiveNumber(val)}
          tokens={[]}
          token={tokensMetadata?.to}
        />

        {tradeRoute && (
          <RouteSectionComponent
            fromToken={tokensMetadata?.from?.symbol ?? ""}
            toToken={tokensMetadata?.to?.symbol ?? ""}
            exchange={exChangeRate() ?? 0}
            hopsNumber={tradeRoute?.routes?.[0].paths.length}
            splitsNumber={tradeRoute?.routes?.length}
          />
        )}

        {currentAccount ? (
          <button className="connect-wallet-button" onClick={handleTrade}>
            Trade
          </button>
        ) : (
          <ConnectButton className="connect-wallet-button" />
        )}
      </div>
    </>
  );
};
