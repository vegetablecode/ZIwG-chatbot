import React, { Component } from "react";
import ForecastComponent from "./externalAPIComponents/ForecastComponent";
import MemeComponent from "./externalAPIComponents/MemeComponent";
import QRCodeComponent from "./externalAPIComponents/QRCodeComponent";
import BtcPriceComponent from "./externalAPIComponents/BtcPriceComponent";

class ExternalAPIResponse extends Component {
  render() {
    const { request } = this.props;
    var displayedComponent = "";

    switch (request.response.type) {
      case "General_Weather":
        displayedComponent = (
          <ForecastComponent params={request.response.params} />
        );
        break;

      case "Memes":
        displayedComponent = <MemeComponent params={request.response.params} />;
        break;

      case "QRcode":
        displayedComponent = <QRCodeComponent params={request.response.params} />
        break;
      case "Bitcoin":
          displayedComponent = <BtcPriceComponent params={request.response.params} />
          break;

      default:
        displayedComponent = "";
    }

    return <div>{displayedComponent}</div>;
  }
}

export default ExternalAPIResponse;
