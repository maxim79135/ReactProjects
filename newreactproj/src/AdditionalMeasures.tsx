import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "reactstrap";

function AdditionalMeasures() {
  return (
    <Container className="card">
      <Row>Header</Row>
      <Row>
        <Col xs="6">123</Col>
        <Col xs="6">
          <Row>
            <Col>Header 1</Col>
            <Col>Header 2</Col>
            <Col>Header 3</Col>
          </Row>
          <Row>
            <Col>Measure 1</Col>
            <Col>Measure 2</Col>
            <Col>Measure 3</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AdditionalMeasures;
