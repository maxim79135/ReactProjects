import * as React from "react";
import * as CSS from "csstype";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "reactstrap";

function AdditionalCategory(props) {
  const { settings, names } = props;
  const additionalMeasuresFlag = [
    settings.measureComparison1.show,
    settings.measureComparison2.show,
    settings.measureComparison3.show,
  ];

  const style = {
    textAlign: settings.categoryAdditionalMeasures
      .horizontalAlignment as CSS.Property.TextAlign,
    paddingTop: settings.categoryAdditionalMeasures.paddingTop,
    color: settings.categoryAdditionalMeasures.color,
    fontSize: settings.categoryAdditionalMeasures.textSize,
    fontFamily: settings.categoryAdditionalMeasures.fontFamily,
  };

  return (
    settings.categoryAdditionalMeasures.show && (
      <Row style={{ height: "25%" }}>
        {names.map(
          (name, i) =>
            additionalMeasuresFlag[i] && <Col style={style}>{name}</Col>
        )}
      </Row>
    )
  );
}

export default AdditionalCategory;
