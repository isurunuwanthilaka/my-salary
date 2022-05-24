import React, { useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { round } from "lodash";

function App() {
  const [basic, setBasic] = useState(320000);
  const [dollarRate, setDollarRate] = useState(350);
  const [requested, setRequested] = useState(false);
  const [calObj, setCalObj] = useState({});

  const $ = (num) => {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(num);
  };

  const rs = (num) => {
    var formatter = new Intl.NumberFormat("si-LK", {
      style: "currency",
      currency: "LKR",
    });
    return formatter.format(num);
  };

  const basicHandler = (event) => {
    setBasic(event.target.value);
    setRequested(false);
  };

  const dollarRateHandler = (event) => {
    setDollarRate(event.target.value);
    setRequested(false);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setRequested(true);

    const peggedRate = 200;
    const usdBasic = basic / peggedRate;
    const taxRate1 = 6 / 100;
    const taxThreshold1 = 250000;
    const taxRate2 = 12 / 100;
    const taxThreshold2 = 500000;
    const epfRate = 8 / 100;
    const epfRateEmployer = 12 / 100;
    const etfRate = 3 / 100;
    const internetAllowance = 2000;
    const stampDuty = 50;

    const basicInUsd = round(basic / peggedRate, 2);
    const totalInLkr = basicInUsd * dollarRate + internetAllowance;

    const taxableIncome2 = totalInLkr - taxThreshold2;
    let totalTax = round(taxableIncome2 * taxRate2, 2);

    totalTax += round(taxThreshold1 * taxRate1, 2);

    const epfDeductionsEmployee = round(basic * epfRate, 2);
    const epfByEmployer = round(basic * epfRateEmployer, 2);
    const etfByEmployer = round(basic * etfRate, 2);

    const takeHome = totalInLkr - epfDeductionsEmployee - totalTax - stampDuty;

    //calculate
    setCalObj({
      ...calObj,
      usdBasic,
      basic,
      epfDeductionsEmployee,
      epfDeductionsEmployee,
      epfByEmployer,
      etfByEmployer,
      takeHome,
      totalTax,
      stampDuty,
      internetAllowance,
      totalInLkr,
    });
  };

  const DataForm = () => {
    return (
      <div>
        <Container className="m-5 w-25">
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="form.basic">
              <Form.Label>Basic Salary (LKR) </Form.Label>
              <Form.Control
                type="number"
                value={basic}
                onChange={basicHandler}
                placeholder="Enter Basic Salary"
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId="form.DollarRate">
              <Form.Label>Dollar Rate</Form.Label>
              <Form.Control
                type="number"
                value={dollarRate}
                onChange={dollarRateHandler}
                placeholder="Enter Dollar Rate"
                required
              />
            </Form.Group>
            <Button className="my-3" type="submit">
              Create Pay Sheet
            </Button>
          </Form>
        </Container>
      </div>
    );
  };

  const PaySheet = () => {
    return (
      <div>
        <Container className="m-5 w-25">
          <hr />
          <Row>
            <Col className="font-weight-bold">Basic in LKR :</Col>
            <Col className="text-end">{rs(calObj.basic)}</Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">Basic in USD :</Col>
            <Col className="text-end">{$(calObj.usdBasic)}</Col>
          </Row>
          <hr />
          <Row>
            <Col className="font-weight-bold">Internet :</Col>
            <Col className="text-end">{rs(calObj.internetAllowance)}</Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">Total income :</Col>
            <Col className="text-end">{rs(calObj.totalInLkr)}</Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">Total APIT :</Col>
            <Col className="text-end">{rs(calObj.totalTax)}</Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">EPF :</Col>
            <Col className="text-end">{rs(calObj.epfDeductionsEmployee)}</Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">Stmp duty :</Col>
            <Col className="text-end">{rs(calObj.stampDuty)}</Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">Total EPF :</Col>
            <Col className="text-end">
              {rs(calObj.epfByEmployer + calObj.epfDeductionsEmployee)}
            </Col>
          </Row>
          <Row>
            <Col className="font-weight-bold">Total ETF :</Col>
            <Col className="text-end">{rs(calObj.epfByEmployer)}</Col>
          </Row>
          <hr />
          <Row>
            <Col className="font-weight-bold">Take home :</Col>
            <Col className="text-end">{rs(calObj.takeHome)}</Col>
          </Row>
        </Container>
      </div>
    );
  };

  if (requested) {
    return (
      <>
        <DataForm />
        <PaySheet />
      </>
    );
  } else {
    return (
      <>
        <DataForm />
      </>
    );
  }
}

export default App;
