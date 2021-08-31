import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "reactstrap";

function AdditionalMeasure(props) {
  const { settings, values, index } = props;
  const additionalMeasuresFlag = [
    settings.measureComparison1.show,
    settings.measureComparison2.show,
    settings.measureComparison3.show,
  ];

  const style = {
    textAlign: "center" as "center",
  };

  return (
    <Row style={{ display: "flex", flexWrap: "wrap", alignContent: "stretch" }}>
      {values.map(
        (v, i) =>
          additionalMeasuresFlag[i] && (
            <Col style={style}>{v.values[index]}</Col>
          )
      )}
    </Row>
  );
}

export default AdditionalMeasure;
