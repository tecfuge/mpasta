import React from "react";
import {
  Jumbotron,
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";

const About = () => {
	return (
		<>
    <Jumbotron className="p-0">
      <div className="headabout">
        <h2 className="abthead">About Us</h2>
      </div>
    </Jumbotron>
		<Container style={{minHeight: '440px'}}>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
      <Row>
        <Col></Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col lg={6} md={4} sm={6} xs={12}> 
        <p>We are a new branch of the prestigious Mamma Italia company. Mamma Italia has been serving all across UAE for nearly 10 years by satisfying your cravings for authentic Italian food. Our pasta has always been a showstopper in our flourishing Italian restaurant Mamma Italia. Now we are expanding with your love and support. It has made us enthusiastic enough to create a new branch of our company to serve you with extreme love and care.</p>

        <p>We are now extremely proud to introduce before you Mamma's  Pasta. Our main goal is to make original and exquisite pasta accessible to the public in an affordable way. Our chefs are especially trained from the master chefs of Italian culinary schools. We want to represent the authentic Italian culture in front of our audience.</p>
        </Col>
        <Col xs={12} sm={12} md={4} lg={6}>
          <div className="abtimg">
          <img src="/img/about-page-img.png" alt="mammas pasta" width="500px" height="400px"></img></div>
        </Col>
      </Row>
    </Container>
		</>
	);
};

export default About;
