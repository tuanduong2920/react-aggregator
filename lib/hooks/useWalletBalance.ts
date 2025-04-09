// src/hooks/useWalletBalance.ts
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { CoinBalance } from "@mysten/sui.js/client";
import { useCallback, useEffect, useState } from "react";

export const useWalletBalance = () => {
  // const { account, connected } = useWallet(); // Wallet state from dapp-kit

  const account = useCurrentAccount();
  const suiClient = useSuiClient(); // RPC client from dapp-kit
  const [balances, setBalance] = useState<CoinBalance[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the wallet balance based on the connected wallet
  const fetchBalance = useCallback(async () => {
    if (!account?.address) {
      setBalance(null);
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const balanceResponse = await suiClient.getAllBalances({
        owner: account.address,
      });

      setBalance(balanceResponse); // Set balance
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [account, suiClient]);

  useEffect(() => {
    if (account) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [account, fetchBalance]);

  const getCoinBalanceByType = (ctype: string) => {
    return balances?.find((coin) => coin.coinType === ctype);
  };

  return {
    account,
    address: account?.address || null,
    balances,
    loading,
    error,
    getCoinBalanceByType,
  };
};
