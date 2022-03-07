import React from "react";
import {
  Jumbotron,
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";

const Contact = () => {
	return (
		<>
    <Jumbotron className="p-0">
      <div className="headabout">
        <h2 className="abthead">Contact Us</h2>
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
      <Row className="contactpadding">
        <Col lg={1} md={1}></Col>
        <Col lg={4} md={4} sm={6} xs={12} style={{ margin:15}}> 
          <address ><b>Al Qubaisi Restaurant </b><br/>
          15th Floor Office number - 1501 <br/>
          Sheikh Zayed Road <br/>
          Dubai, UAE<br/>
          75899
          </address>
        
         <div className="mt-2"><a href="tel:+97143328383" className="link-d">+(971) 4 332 8383</a><br/>           
         <a href="mailto:info.mammaspizza@alqubaisigroup.com" className="link-d">info.mammaspizza@alqubaisigroup.com</a>
         </div>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}> 
          <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.4259074336064!2d55.2796543150101!3d25.222575983884294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42ed8e2c95e5%3A0xf7630f7d26aed943!2sSkin%20Jam%20General%20Trading!5e0!3m2!1sen!2sae!4v1605782556980!5m2!1sen!2sae" width="100%" height="400" frameBorder="0" tabindex="0"></iframe>
        </Col>
        <Col lg={1} md={1}></Col>
      </Row>
    </Container>
		</>
	);
};

export default Contact;
