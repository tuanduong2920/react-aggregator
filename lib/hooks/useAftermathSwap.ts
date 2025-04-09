import { Aftermath } from "aftermath-ts-sdk";
import { useEffect, useState } from "react";
import {
  IBestRoute,
  ITokensMetadata,
  ITokensPrice,
  TOKENS_ADDRESS,
} from "../models";



export const useAftermathSwap = () => {
  const aftermathSDK = new Aftermath("MAINNET");
  const [fromToken, setFromToken] = useState(TOKENS_ADDRESS.SUI);
  const [toToken, setToToken] = useState(TOKENS_ADDRESS.CETUS);
  const [tokensPrice, setTokensPrice] = useState<ITokensPrice | null>(null);
  const [tokensMetadata, setTokensMetadata] = useState<ITokensMetadata | null>(
    null
  );

  const coinsService = aftermathSDK.Coin();
  const pricesService = aftermathSDK.Prices();
  const routeService = aftermathSDK.Router();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleInitData();
  }, [fromToken, toToken]);

  const handleInitData = async () => {
    try {
      setLoading(true);
      await aftermathSDK.init();
      await handleGetTokenPrices();
      await handleGetTokenMetadata();
    } finally {
      setLoading(false);
    }
  };

  const handleGetTokenPrices = async () => {
    try {
      const [from, to] = await Promise.all([
        pricesService.getCoinPriceInfo({
          coin: fromToken,
        }),
        pricesService.getCoinPriceInfo({
          coin: toToken,
        }),
      ]);

      setTokensPrice({ from, to });
    } catch {
      console.error("FAILED: handleGetTokenPrices");
    }
  };

  const handleGetTokenMetadata = async () => {
    try {
      const [from, to] = await Promise.all([
        coinsService.getCoinMetadata(fromToken),
        coinsService.getCoinMetadata(toToken),
      ]);

      setTokensMetadata({ from, to });
    } catch {
      console.error("FAILED: handleGetTokenMetadata");
    }
  };

  const swapTokenPosition = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const getTradeRoute = ({
    fromCoin = fromToken,
    toCoin = toToken,
    amount,
  }: IBestRoute) => {
    const chargeAmount =
      amount * Math.pow(10, tokensMetadata?.from?.decimals ?? 9);
    return routeService.getCompleteTradeRouteGivenAmountIn({
      coinInType: fromCoin,
      coinOutType: toCoin,
      coinInAmount: BigInt(chargeAmount),
    });
  };

  const swapTokens = async () => {
    //TODO: Do something to make this app can swap between two token
  };

  return {
    fromToken,
    toToken,
    tokensMetadata,
    tokensPrice,
    loading,
    swapTokenPosition,
    getTradeRoute,
    swapTokens,
  };
};
