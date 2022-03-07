import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import PaymentWidget from "./PaymentWidget";

const disabledClass = {
  pointerEvents: "none",
  opacity: "0.2",
};

export default ({ type, setType, paymentLoading, iframe, next }) => {
  //const [type, setType] = useState("cod");
  const [openPopUp, setOpenPopUp] = useState(false);

  useEffect(() => {
    setOpenPopUp(iframe !== null);
  }, [iframe]);

  return (
    <div className="checkout-wrapper">
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>
          <h3>Payment Method</h3>
          <small className="text-muted">Select a Payment Method </small>
        </Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>
          <fieldset>
            <Form.Group as={Row}>
              <Col xs={12} md={12} lg={12}>
                <Form.Check
                  type="radio"
                  label="Credit/Debit Card"
                  name="payment_method"
                  id="creditcard"
                  onClick={() => setType("card")}
                  checked={type === "card"}
                  readOnly
                />
                <Form.Check
                  type="radio"
                  label="Cash On Delivery"
                  name="payment_method"
                  id="cod"
                  onClick={() => setType("cod")}
                  checked={type === "cod"}
                  readOnly
                />
              </Col>
            </Form.Group>
          </fieldset>
        </Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      {type === "card" && (
        <>
          <Row>
            <Col>
              <div style={paymentLoading ? disabledClass : {}}>
                {openPopUp && (
                  <PaymentWidget
                    iframe={iframe}
                    closePopUp={() => setOpenPopUp(false)}
                    next={next}
                  />
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col>
          <p className="small text-muted">
            PLACE ORDER to complete your purchase. We'll keep in touch with you
            to confirm location and delivery date & time
          </p>
        </Col>
      </Row>
    </div>
  );
};