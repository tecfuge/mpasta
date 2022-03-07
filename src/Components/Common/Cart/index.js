import React, { useEffect, useState } from "react";
import {
  Card,
  ListGroup,
  InputGroup,
  FormControl,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";

import { formatPrice } from "Data/fooddata";
import { useOrder } from "Contexts/order";
import useQuery from "Hooks/useQuery";
import { useGlobal } from "Contexts/global";
import { request } from "Helpers/ajax";

const CartRow = ({ item }) => {
  const { updateOrder, removeOrder } = useOrder();

  const dec = () => {
    if (item.count > 1) {
      updateOrder(item.key, item.count - 1);
    }
  };

  const inc = () => {
    if (item.count < 10) {
      updateOrder(item.key, item.count + 1);
    }
  };

  const remove = () => {
    removeOrder(item.key);
  };
  
  return (
    <Row
      style={{ borderBottom: "1px solid rgba(0,0,0,.125)", padding: "1% 0" }}
    >
      <Col xs={3} sm={3} md={3} lg={3} className="text-right">
        <img
          width="90%"
          className="mb-2"
          src={`${process.env.REACT_APP_IMAGE_PATH}${item.default_image}`}
        />
      </Col>
      <Col xs={9} sm={9} md={9} lg={9}>
        <Row>
          <Col xs={7} sm={7} md={12} lg={7}>
            <span style={{ fontSize: "1rem", fontWeight: "600" }}>
              {" "}
              {item.name}
            </span>
          </Col>
          <Col xs={5} sm={5} md={12} lg={5}>
            <span className="text-danger" style={{ fontSize: "0.8rem" }}>
              {(item.discount)? formatPrice(item.discount): formatPrice(item.price)}
            </span>
          </Col>
        </Row>
        <Row>
          <Col xs={5} sm={5} md={9} lg={5}>
            <InputGroup className="mt-1 mb-1">
              <InputGroup.Prepend>
                <Button variant="light" onClick={dec}>
                  <i className="fas fa-minus"></i>
                </Button>
              </InputGroup.Prepend>
              <FormControl
                aria-describedby="basic-addon1"
                value={item.count}
                style={{ fontSize: "0.8rem", margin: "1px 0", padding: 0 }}
                disabled
              />
              <InputGroup.Append>
                <Button variant="light" onClick={inc}>
                  <i className="fas fa-plus"></i>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col xs={7} sm={7} md={3} lg={7} className="text-center">
            <i
              className="fas fa-trash-alt"
              onClick={remove}
              style={{
                cursor: "pointer",
                margin: "0 0 0 5px",
                fontSize: "0.9rem",
              }}
            ></i>
          </Col>
        </Row>
        {item.offersubproducts && (
            <Row>
            <Col xs={7} sm={7} md={12} lg={7}>
              {Object.values(item.offersubproducts).map((subprod, j) => (
                <div className="ingredients-info" key={j}>
                  {subprod.name}
                </div>
              ))}
            </Col>
            <Col xs={5} sm={5} md={12} lg={5}>
              
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={7} sm={7} md={12} lg={7}>
            {item.ingredients.map((ingredient, j) => (
              <div className="ingredients-info" key={j}>
                {ingredient.title}
              </div>
            ))}
          </Col>
          <Col xs={5} sm={5} md={12} lg={5}>
            <span className="text-danger" style={{ fontSize: "0.8rem" }}>
              {item.ingredientsPrice ? formatPrice(item.ingredientsPrice) : ""}
            </span>
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </Col>
    </Row>
  );
};

const Cart = () => {
  const {
    orders,
    totalPrice,
    tax,
    discount,
    couponApplied,
    setCouponApplied,
    setDelivery,
    delivery, 
    emptyCart,
    isVoucher,
    displayTotal
  } = useOrder();
  const query = useQuery();
  const { setVouchers, settings } = useGlobal();
  const isTakeAway = query.get("t") == 2;
  const [coupon, setCoupon] = useState("");
  const [validated, setValidated] = useState(true);

  
  const applyCoupon = async (e) => {
    // check for valid
    setCoupon(coupon.trim());

    if (!coupon || coupon == null) {
      setValidated(false);
      return false;
    }

    const voucherdata = await request(
      "POST",
      "isvoucherused",
      {'code' : coupon},
      false
    );
    if (voucherdata.status) {
      
      setVouchers(voucherdata.data);

      setValidated(true);
      setCouponApplied(coupon);
      (!isTakeAway )? setDelivery(voucherdata.data.delivery_cost): setDelivery(0);

    } else {
    
      setValidated(false);
      setCouponApplied(null);
    
      console.log(voucherdata.errors);
    }

  };
  //
  (!isTakeAway )? setDelivery(delivery): setDelivery(0); 

  return orders.length === 0 ? (
    <span></span>
  ) : (
    <>
      <Card border="light" className="cart-info">
        <Card.Header>
          ORDER SUMMARY
          <a href="#" className="float-right" onClick={emptyCart}>
            Clear
          </a>
        </Card.Header>
        <Card.Body>
          {orders.map((item, i) => (
            <CartRow key={i} item={item} />
          ))}
        </Card.Body>
        <Card.Footer>
          {totalPrice && settings.is_voucher == 1 && isVoucher ? (
            <>
              <Row>
                <Col xs={8} md={8} lg={8}>
                  <Form.Group controlId="coupon_code">
                    <Form.Control
                      type="text"
                      placeholder="Enter your code"
                      name="coupon_code"
                      size="sm"
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={4} md={4} lg={4}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={applyCoupon}
                    style={{
                      padding: "4% 8%",
                      fontSize: "0.8rem",
                      width: "100%",
                    }}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} lg={12}>
                  {!validated && (
                    <div className="text-danger" style={{ fontSize: "0.8rem" }}>
                      You have entered invalid coupon
                    </div>
                  )}
                </Col>
              </Row>
            </>
          ) : (
            ""
          )}
          <ListGroup variant="flush">
            <ListGroup.Item>
              Price
              <span className="float-right">{formatPrice(totalPrice)}</span>
            </ListGroup.Item>
            
            <ListGroup.Item>
              Discount
              <span className="float-right">
                {formatPrice(discount.discount_price)}
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax <span className="float-right">{formatPrice(tax)}</span>
            </ListGroup.Item>
            {!isTakeAway && (
              <ListGroup.Item>
                Delivery <span className="float-right text-success">{delivery? formatPrice(delivery): 'FREE' }</span>
              </ListGroup.Item>
            )}            
            <ListGroup.Item className="lt-last">
              <b>Total</b>
              <span className="float-right text-danger">
                { displayTotal ? formatPrice(displayTotal) : 0}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Cart;
