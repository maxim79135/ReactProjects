import * as React from "react";
import * as CSS from "csstype";
import "bootstrap/dist/css/bootstrap.css";
import { Col } from "reactstrap";

function MainMeasure(props) {
  const { value, settings, flag } = props;
  const style = {
    fontSize: settings.mainMeasureSettings.textSize,
    color: settings.mainMeasureSettings.color,
    fontFamily: settings.mainMeasureSettings.fontFamily,
    textAlign: "center" as "center",
    display: "flex" as "flex",
    justifyContent: "center" as "center",
    flexDirection: "column" as "column",
  };

  const xs = flag ? "" : "6";
  return (
    <Col xs={xs} style={style}>
      {value}
    </Col>
  );
}

export default MainMeasure;
