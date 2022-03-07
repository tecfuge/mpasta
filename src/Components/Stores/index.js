import React from "react";
import {
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { timeConvert } from "Data/fooddata";
import { useGlobal } from "Contexts/global";

const Stores = () => {
  const { pickupLocations } = useGlobal();

	return (
		<div className="delivery-locs" id="stores">
        <Container>
          <Row>
            <Col>
              <h3>Our Stores</h3>
            </Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4} className="deliverTo">
              <img className="img-fluid" src="/img/our-stores-img.png" />
            </Col>
            <Col xs={12} sm={12} md={8} lg={8}>
              <Row>           
              {pickupLocations && Object.keys(pickupLocations).map((city, i) => (
                
                pickupLocations[city].map((pickup, j) => (            
                <Col xs={6} sm={6} md={4} lg={4} key={j} className="mb-3">
                  <address>
                    <b
                      className="text-uppercase"
                      style={{ fontSize: "1.25rem" }}
                    >
                      {pickup.name}
                    </b>
                    <br />
                    {pickup.address}
                    <br />
                    <span className="text-capitalize">{pickup.city}</span>
                    <br />
                    {pickup.phone}<br/>                
                    <Button
                      variant="outline-dark"
                      className="mt-2 mr-2 mb-1"
                      href={"tel:"+pickup.phone}
                    >
                      <i className="fas fa-phone-alt"></i> <b>CALL</b>
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="mt-2 mb-1"
                      href={pickup.map_url}
                      target="_blank"
                    >
                      <i className="fas fa-map-marker-alt"></i> <b>DIRECTION</b>
                    </Button>
                    <p className="mt-1"><i className="far fa-clock mr-1"></i> 
                    {timeConvert(pickup.opening)} -  {timeConvert(pickup.closing)}</p>
                  </address>
                </Col>
                ))
                ))
              } 
              </Row>
              <Row>
                <Col>&nbsp;</Col>
              </Row>                           
            </Col>
          </Row>
        </Container>
      </div>
	);
};

export default Stores;
