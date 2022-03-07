import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Accordion,
  Card,
  InputGroup,
  FormControl,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { formatPrice } from "Data/fooddata";
import { useOrder } from "Contexts/order";

const MenuDetailPopup = ({ item, ingredient, subitems, closePopup }) => {
  const { orders, addOrder, updateOrder } = useOrder();
  const [count, setCount] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [subProduct, setSubProduct] = useState([]);

  useEffect(() => {
    if (subitems && subitems.length > 0) setSubProduct(subitems);
  }, [subitems]);

  const dec = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  const inc = () => {
    if (count < 10) {
      setCount((prev) => prev + 1);
    }
  };

  const decSubitem = (subprod) => {
    if (subprod?.count && subprod?.count > 0) {
      // proceed only if count > 1
      let newArr = [...subProduct];
      let item = newArr.find((o) => o.id === subprod.id);
      // decrement count
      item.count -= 1;
      setSubProduct(newArr);
    }
  };

  const incSubitem = (subprod) => {
    if ((subprod?.count || 0) < 10) {
      // proceed only if count < 10 OR count key does not exist
      let newArr = [...subProduct];
      let item = newArr.find((o) => o.id === subprod.id);
      // set default value = 0, iff count key does not exist
      if (!item?.count) item.count = 0;
      // increment count
      item.count += 1;
      setSubProduct(newArr);
    }
  };

  const addItem = () => {
    item.count = count;
    item.ingredients = ingredients;
    item.totprice = price;

    if (subProduct.length > 0) {
      for (let sub of subProduct) {
        if (sub.count > 0) {
          const existingItem = orders.find((o) => o.id === sub.id);
          if (existingItem) {
            updateOrder(existingItem.key, existingItem.count + sub.count);
          } else {
            // add sub item into cart
            if (sub?.count > 0) addOrder(sub);
          }
        }
      }
    } else {
      addOrder(item);
    }
    closePopup();
  };

  const addons = (subItem) => {
    setIngredients((prev) => {
      const itemExists = prev.filter((o) => o.id === subItem.id).length > 0;
      return itemExists
        ? prev.filter((o) => o.id !== subItem.id) // remove from array
        : [...prev, subItem]; // add to array
    });
  };

  const isDrinks = subProduct && subProduct.length > 0;
  let price = 0;

  if (isDrinks) {
    price = subProduct
      .map((o) => (o.count || 0) * item.price)
      .reduce((a, b) => a + b);
  } else {
    const ingredientPrice =
      ingredients.length > 0
        ? ingredients.map((o) => o.price * 1).reduce((a, b) => a + b)
        : 0;
    price = item.price * 1 + ingredientPrice * 1;
  }

//console.log(subitems);

  return (
    <Modal
      show={item !== null}
      onHide={closePopup}
      backdrop="static"
      keyboard={false}
      className="product-popup"
    >
      <Modal.Header closeButton>
        <img
          src={`${process.env.REACT_APP_IMAGE_PATH}${item.default_image}`}
          alt=""
          width="100%"
          height="340"
          style={{ objectFit: 'cover' }}
        />
      </Modal.Header>
      <Modal.Body>
        <h3 className="mt-3 mb-4">{item.name}</h3>
        <p className="small">{item.description}</p>
        {ingredient && Object.keys(ingredient).length > 0 && (
          <Accordion defaultActiveKey={Object.keys(ingredient)[0] + ""}>
            {Object.keys(ingredient).map((item, i) => (
              <Card key={i}>
                <Accordion.Toggle as={Card.Header} eventKey={item + ""}>
                  {item}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={item + ""}>
                  <Card.Body>
                    {ingredient[item].map((subItem, j) => (
                      <Row key={j}>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                          <Form.Group
                            controlId={subItem.title}
                            onChange={(e) => addons(subItem)}>
                            <Form.Check
                              type="checkbox"
                              label={subItem.title}
                              id={subItem.title}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                          <small className="float-right" >
                            <b>{formatPrice(subItem.price)}</b>
                          </small>
                        </Col>
                      </Row>

                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        )}
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        {subitems && Object.keys(subitems).length > 0 && (
          <Row>
            <Col>
              {subitems.map((sub, j) => (
                <Row key={j}>
                  <Col xs={8} md={8} lg={8}>
                    <h6>
                      <b>{sub.name}</b>
                    </h6>
                  </Col>
                  <Col xs={4} md={4} lg={4}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <Button variant="light" onClick={() => decSubitem(sub)}>
                          <i className="fas fa-minus"></i>
                        </Button>
                      </InputGroup.Prepend>
                      <FormControl
                        style={{ textAlign: "center" }}
                        aria-describedby="basic-addon1"
                        value={sub.count ? sub.count : 0}
                        disabled
                      />
                      <InputGroup.Append>
                        <Button variant="light" onClick={() => incSubitem(sub)}>
                          <i className="fas fa-plus"></i>
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        )}
        <Row>
          <Col>&nbsp;</Col>
        </Row>

        <Row>
          {ingredient && Object.keys(ingredient).length > 0 && (
            <Col xs={6} md={4} lg={4}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <Button variant="secondary" onClick={dec}>
                    <i className="fas fa-minus"></i>
                  </Button>
                </InputGroup.Prepend>
                <FormControl
                  aria-describedby="basic-addon1"
                  className="text-center"
                  value={count}
                  disabled
                />
                <InputGroup.Append>
                  <Button variant="secondary" onClick={inc}>
                    <i className="fas fa-plus"></i>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          )}
          <Col xs={6} md={4} lg={3}>
            <p>{formatPrice(price)}</p>
          </Col>

          <Col xs={12} md={4} lg={5}>
            <Button variant="danger" className="btn-block" onClick={addItem}>
              ADD TO CART
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MenuDetailPopup;
