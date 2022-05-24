import React, { useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { round } from "lodash";

function App() {
  const [basic, setBasic] = useState(100000);
  const [dollarRate, setDollarRate] = useState(353);
  const [requested, setRequested] = useState(false);
  const [calObj, setCalObj] = useState({
    usdBasic: 0,
    basic: 0,
    epfDeductionsEmployee: 0,
    epfByEmployer: 0,
    etfByEmployer: 0,
    takeHome: 0,
    totalTax: 0,
    stampDuty: 0,
    internetAllowance: 0,
    totalInLkr: 0,
  });

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

  const submitHandler = () => {
    const peggedRate = 200;
    const usdBasic = basic / peggedRate;
    const taxRate1 = 6 / 100;
    const taxThreshold1 = 250000;
    const taxRate2 = 12 / 100;
    const taxThreshold2 = 500000;
    const taxRate3 = 18 / 100;
    const taxThreshold3 = 750000;
    const epfRate = 8 / 100;
    const epfRateEmployer = 12 / 100;
    const etfRate = 3 / 100;
    const internetAllowance = 2000;
    const stampDuty = 50;

    const basicInUsd = round(basic / peggedRate, 2);
    const totalInLkr = basicInUsd * dollarRate + internetAllowance;

    let totalTax = 0.0;
    if (totalInLkr >= taxThreshold1 && totalInLkr < taxThreshold2) {
      const taxableIncome1 = totalInLkr - taxThreshold1;
      totalTax += round(taxableIncome1 * taxRate1, 2);
    }
    if (totalInLkr >= taxThreshold1 && totalInLkr >= taxThreshold2) {
      const taxableIncomeFull1 = taxThreshold2 - taxThreshold1;
      totalTax += round(taxableIncomeFull1 * taxRate1, 2);
    }

    if (totalInLkr >= taxThreshold2 && totalInLkr < taxThreshold3) {
      const taxableIncome2 = totalInLkr - taxThreshold2;
      totalTax += round(taxableIncome2 * taxRate2, 2);
    }

    if (totalInLkr >= taxThreshold2 && totalInLkr >= taxThreshold3) {
      const taxableIncomeFull2 = taxThreshold3 - taxThreshold2;
      totalTax += round(taxableIncomeFull2 * taxRate2, 2);
    }

    if (totalInLkr > taxThreshold3) {
      const taxableIncome3 = totalInLkr - taxThreshold3;
      const tax3 = round(taxableIncome3 * taxRate3, 2);
      if (tax3 <= 90000) {
        totalTax += tax3;
      } else {
        totalTax += round(90000, 2);
      }
    }

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
      epfByEmployer,
      etfByEmployer,
      takeHome,
      totalTax,
      stampDuty,
      internetAllowance,
      totalInLkr,
    });
    setRequested(true);
  };

  return (
    <>
      <Container className="m-5 w-25">
        <Row className="my-2">
          <Col>
            <Form.Label>Basic Salary (LKR) </Form.Label>
            <Form.Control
              type="number"
              value={basic}
              onChange={(e) => {
                setBasic(e.target.value);
                setRequested(false);
              }}
              placeholder="Enter Basic Salary"
            />
          </Col>
        </Row>
        <Row className="my-2">
          <Col>
            <Form.Label>Dollar Rate</Form.Label>
            <Form.Control
              key={"dollar-rate"}
              type="number"
              value={dollarRate}
              onChange={(e) => {
                setDollarRate(e.target.value);
                setRequested(false);
              }}
              placeholder="Enter Dollar Rate"
            />
          </Col>
        </Row>
        <Button className="my-3" onClick={submitHandler}>
          Create Pay Sheet
        </Button>
      </Container>
      {requested && (
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
      )}
    </>
  );
}

export default App;
