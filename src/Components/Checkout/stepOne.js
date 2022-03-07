import React, { useEffect, useState } from "react";

import { Button, Col, Container, Row, Form } from "react-bootstrap";

import { useAuth } from "Contexts/auth";
import useQuery from "Hooks/useQuery";
import { useGlobal } from "Contexts/global";

export default ({
  user,
  setUser,
  address,
  setAddress,
  orderComments,
  setOrderComments,
}) => {
  const { loggedUser } = useAuth();
  const query = useQuery();
  const { setShowLocationPopup } = useGlobal();
  const isTakeAway = query.get("t") == 2;
  const { deliveryLocations, pickupLocations } = useGlobal();

  useEffect(() => {
    if (loggedUser) {
      //console.log("loggedUser", typeof loggedUser);
      setUser({
        user_id: loggedUser.id,
        firstname: loggedUser.name.split(" ")[0],
        lastname: loggedUser.name.split(" ")[1] ? loggedUser.name.split(" ")[1] : '',
        email: loggedUser.email,
        phone: loggedUser.phone,
        password: null,
        confirmpassword: null
      });

      // if (loggedUser?.address) {
      //   setAddress(loggedUser.address);
      // }
    }
  }, [loggedUser, setUser, setAddress]);

  const setField = (field, value, type = "user") => {
    const cbk = (prev) => ({
      ...prev,
      [field]: value,
    });
    if (type === 1) setUser(cbk);
    if (type === 2) setAddress(cbk);
  };

  return (

    <div className="checkout-wrapper">
      <Row>
        <Col>&nbsp;</Col>
      </Row>

      <Row>
        <Col>
          <h3>Address Details</h3>
          <small className="text-muted">
            Customer information and Delivery or Pickup details
          </small>
        </Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>
          <Form.Control type="hidden" value={user.user_id} name="user_id" />
          <Form.Group controlId="firstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={user.firstname}
              name="firstname"

              onChange={(e) => setField("firstname", e.target.value, 1)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid first name.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="lastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={user.lastname}
              name="lastname"

              onChange={(e) => setField("lastname", e.target.value, 1)}
            />

          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={user.email}
              name="email"

              onChange={(e) => setField("email", e.target.value, 1)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your mobile number"
              value={user.phone}
              name="phone"

              onChange={(e) => setField("phone", e.target.value, 1)}
            />
          </Form.Group>
        </Col>
      </Row>
      {!loggedUser ? (
        <Row>
          <Col>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>            
               <Form.Control
                type="password"
                name='password'
                value={user.password}
                required
                maxLength="10" 
                minLength="6"
                placeholder="Enter Your Password"
                onChange={(e) => setField("password", e.target.value, 1)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="confirm-pass">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Your Confirm Password"
                value={user.confirmpassword}
                name="confirmpassword"
                required
                maxLength="10"
                minLength="6"
                onChange={(e) => setField("confirmpassword", e.target.value, 1)}
              />
            </Form.Group>
          </Col>
        </Row>
        ):''
      }     
      {isTakeAway ? (
        <>
          <Row>
            <Col>
              <div className="a-divider a-divider-break">
                <h5>Pickup Address</h5>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-muted small">
                {query.get("location")}
                <Button
                  variant="link"
                  onClick={() =>
                    setShowLocationPopup({
                      show: true,
                      location: "",
                    })
                  }
                >
                  Change
                </Button>
                <Form.Control
                  type="hidden"
                  value={address.address}
                  name="address"
                />
                <Form.Control
                  type="hidden"
                  value={address.delivery_method}
                  name="delivery_method"
                />
              </p>
            </Col>
          </Row>
        </>
      ) : (
          <>
            <Row>
              <Col>
                <div className="a-divider a-divider-break">
                  <h5>Delivery Address</h5>
                </div>
              </Col>
            </Row>
            <Row>
            <Col>
              <p className="text-muted small">
                {query.get("location")}
                <Button
                  variant="link"
                  onClick={() =>
                    setShowLocationPopup({
                      show: true,
                      location : null,
                      isDelivery : true,
                    })
                  }
                >
                Change
                </Button>
               
                <Form.Control
                  type="hidden"
                  value={address.delivery_method}
                  name="delivery_method"
                />
              </p>
            </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={address.city}
                    name="city"
                    onChange={(e) => setField("city", e.target.value, 2)}
                  >
                    {Object.keys(deliveryLocations).map((city, i) => (
                      <option value={city} key={i}>{city.toUpperCase()}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="area">
                  <Form.Label>Area </Form.Label>

                  <Form.Control
                    as="select"
                    custom
                    value={address.area}
                    name="area"
                    onChange={(e) => setField("area", e.target.value, 2)}
                  >
                    <option value="">-- Select --</option>
                    {Object.values(deliveryLocations).length > 0 &&
                      Object.values(deliveryLocations[address.city]).map((area, i) => (
                        <option value={area.name} key={i}>{area.name.toUpperCase()}</option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="103 M, Bin Thani Building, Al Khaleej Al Arabi Street , Near to Car wash Station"
                    value={address.address}
                    name="address"

                    onChange={(e) => setField("address", e.target.value, 2)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

      <Row>
        <Col>
          <Form.Group controlId="comments">
            <Form.Label>Order Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your comment"
              value={orderComments}
              name="comments"
              onChange={(e) => setOrderComments(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};