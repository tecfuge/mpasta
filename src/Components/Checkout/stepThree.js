import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { useOrder } from "Contexts/order";
import { useHistory } from "react-router-dom";

export default ({ orderSummary }) => {

  const history = useHistory();
  const { emptyCart } = useOrder();
  useEffect(() => emptyCart(), []);
  const [callus, setCallus] = useState('');

  useEffect(() => {
    if (Object.keys(orderSummary).length > 0) {
      let call = (orderSummary.location.phone) ? '+' + orderSummary.location.phone : '+97143328383';
      setCallus(call);
    }

  }, [Object.keys(orderSummary).length]);

  const goTracking = () => {
    if(orderSummary && orderSummary.order){
      history.push(
        `/tracker?id=${orderSummary.order.invoiceno}`
      );
    }
  };


  return !Object.keys(orderSummary).length ? (

    <Row>
      <Col>
        <p>&nbsp;</p>
        <p class="btn-container">
          Please finish your order ..          
        </p>
        <p>Have any query ? Click here to <Button href="tel:{callus}" variant="outline-danger" >Call Us</Button>
        </p>
        <p>&nbsp;</p>
      </Col>
    </Row>
  ) : (

      <div className="checkout-wrapper">
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        <Row>
          <Col>
            <h5>
              You order has been placed successfully !
            <i className="far fa-thumbs-up"></i>
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <Card style={{ width: '30rem' }}>
              <Card.Header as="h5">Order ID {orderSummary.order.invoiceno}</Card.Header>
              <Card.Body>
                <Card.Text>{orderSummary.order.fullname} </Card.Text>
                <Card.Text>{orderSummary.order.address} {orderSummary.order.city ? ', ' + orderSummary.order.city : ''}{orderSummary.order.area ? ', ' + orderSummary.order.area : ''}</Card.Text>
                <Card.Text>{orderSummary.order.email} | {orderSummary.order.phone}</Card.Text>
                <Card.Text>Have any query ? Click here to <Button href="tel:{callus}" variant="outline-danger" >Call Us</Button></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={2} lg={2}></Col>
          <Col xs={12} md={4} lg={4}>

          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        <Row>
          <Col><Button variant="link" onClick={goTracking} >Track Your Order</Button> </Col>
        </Row>
        
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
      </div>
    );
};