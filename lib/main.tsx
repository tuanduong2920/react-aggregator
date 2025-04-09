import { SwapWidget } from "./components/swap-widget";
import { SuiContextProviders } from "./contexts/sui-context-provider";
import { Network } from "./models";

interface IAggregatorComponent {
  network?: Network;
}

export const AggregatorComponent = ({
  network = "devnet",
}: IAggregatorComponent) => {
  return (
    <SuiContextProviders network={network}>
      <SwapWidget />
    </SuiContextProviders>
  );
};
