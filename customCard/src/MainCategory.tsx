import * as React from "react";
import * as CSS from "csstype";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "reactstrap";

function MainCategory(props) {
  const { settings, categoryName } = props;

  const style = {
    textAlign: settings.categoryMainMeasureSettings
      .horizontalAlignment as CSS.Property.TextAlign,
    paddingTop: settings.categoryMainMeasureSettings.paddingTop,
    color: settings.categoryMainMeasureSettings.color,
    fontSize: settings.categoryMainMeasureSettings.textSize,
    fontFamily: settings.categoryMainMeasureSettings.fontFamily,
  };

  return (
    settings.categoryMainMeasureSettings.show && (
      <Row>
        <Col style={style}>{categoryName}</Col>
      </Row>
    )
  );
}

export default MainCategory;
