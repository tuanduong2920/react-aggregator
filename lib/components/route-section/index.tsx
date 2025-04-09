import { numericFormatter } from "react-number-format";
import "./style.css";
import { formatProps } from "@/lib/models";

interface IRouteSection {
  fromToken: string;
  toToken: string;
  exchange: number;
  splitsNumber?: number;
  hopsNumber?: number;
}

export const RouteSectionComponent = (props: IRouteSection) => {
  const {
    fromToken,
    toToken,
    exchange,
    splitsNumber = 0,
    hopsNumber = 0,
  } = props;
  return (
    <div className="route-section">
      <span className="section-label">
        1 {fromToken} = {numericFormatter(String(exchange), formatProps)}{" "}
        {toToken}
      </span>
      <div className="route-details">
        <span className="route-liquidity">Route</span>
        <div className="route-path">
          {splitsNumber} splits, {hopsNumber} hops
        </div>
      </div>
    </div>
  );
};
