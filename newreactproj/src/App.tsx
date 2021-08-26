import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "reactstrap";
import AdditionalMeasures from "./AdditionalMeasures";

function App() {
  return (
    // <div className="container_card">
      <Row xs="2">
        <AdditionalMeasures/>
        <AdditionalMeasures/>
        <AdditionalMeasures/>
        <AdditionalMeasures/>
        <AdditionalMeasures/>
        <AdditionalMeasures/>
      </Row>
    // </div>
  );
}

export default App;
