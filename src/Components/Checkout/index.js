import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import MultiStep from "./react-multistep";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import PreOrderHead from "Components/Common/PreOrderHead";
import LocationHead from "Components/Common/LocationHead";
import Cart from "Components/Common/Cart";
import { useGlobal } from "Contexts/global";
import { useAuth } from "Contexts/auth";

const steps = [
  { component: (props) => <StepOne {...props} /> },
  { component: (props) => <StepTwo {...props} /> },
  { component: (props) => <StepThree {...props} /> },
];

const prevStyle = { "borderWidth": "2px", margin: "1% 2%" };
const nextStyle = { "borderWidth": "2px", margin: "1% 2%" };

const Checkout = () => {
  const { setLoginTab } = useGlobal();
  const { loggedUser } = useAuth();

  return (
    <Container fluid>
      <div className="wrapper">
        <Row>
          <Col>&nbsp; </Col>
        </Row>
        <Row>
          <Col xs={12} md={8} sm={8} lg={8} xl={8} className="border-rt">
            <Row>
              <Col>
                <h2>Checkout</h2>
                <hr />
              </Col>
            </Row>
            {!loggedUser && (
              <Row>
                <Col>
                  <p className="small">
                    <Button variant="link" onClick={() => setLoginTab("login")}>
                      Login
                  </Button>
                  to your account or
                  <Button
                      variant="link"
                      onClick={() => setLoginTab("registration")}
                    >
                      Signup
                  </Button>
                  for quick access to your personal data in future orders.
                </p>
                </Col>
              </Row>
            )}
            <MultiStep
              steps={steps}
              prevStyle={prevStyle}
              nextStyle={nextStyle}
            />
          </Col>

          <Col xs={12} md={4} sm={4} lg={4} xl={4}>
            <div className="rightDiv">
              <LocationHead />
              <PreOrderHead /> 
              <Cart />
            </div>
          </Col>
          <Col xs={12} md={1} lg={1}></Col>
        </Row>
      </div>
    </Container>
  );
};

export default Checkout;
