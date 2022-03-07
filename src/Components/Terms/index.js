import React from "react";
import {
  Jumbotron,
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";

const Terms = () => {
	return (
		<> 
		<Jumbotron className="p-0">
      <div className="headabout">
        <h2 className="abthead">Terms & Conditions</h2>
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
        <Col> 
          <ul className="ls-style pd-10">
          <li>ALQUBAISI RESTAURANT maintains the <a href="/">mammaspasta.com</a></li>
          <li>United Arab of Emirates is our country of domicile and stipulate that the governing law is the local law. All disputes arising in connection therewith shall be heard only by a court of competent jurisdiction in U.A.E.</li>
          <li>Visa or MasterCard debit and credit cards in AED will be accepted for payment</li>
          <li>We will not trade with or provide any services to OFAC (Office of Foreign Assets Control) and sanctioned countries in accordance with the law of UAE</li>
          <li>Customer using the website who are Minor /under the age of 18 shall not register as a User of the website and shall not transact on or use the website</li>
          <li>Cardholder must retain a copy of transaction records and Merchant policies and rules</li>
          <li>User is responsible for maintaining the confidentiality of his account</li>
          </ul>   
          <p>&nbsp;</p>        
        </Col>
      </Row>
      <Row> 
        <Col>

          <p><b>PAYMENT CONFIRMATION: </b></p>
          <p>Once the Payment is made the confirmation notice will be sent to the client via email</p>         
         

          <p><b>CANCELLATION POLICY:</b></p>
          <p>Mammas Pizza offer a standard no refund policy on all orders made online for delivery. If you wish to cancel your order you will not be offered a refund, this includes any other fees and surcharges.</p>         
          

          <p><b>REFUND POLICY:</b></p>
          <p>Mammas Pizza offer a standard no refund policy on all orders made online for delivery. If you wish to cancel your order you will not be offered a refund, this includes any other fees and surcharges.</p>
          <p>"Refunds will be done only through the Original Mode of Payment"</p>          
          
               
          <p><b>DELIVERY/SHIPPING POLICY:</b></p>
          
          <p>The geographical area for delivery is within Dubai and in Abu Dhabi mentioned in our website as delivery Locations. Delivery of the order are handled by our driver.</p>
          <p>The estimated delivery time is maximum 45 minutes (depends on location) after placing the order and payment confirmation. Provide the accurate address and contact details to avoid any delivery delay</p>
          
        </Col>
      </Row>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
    </Container>
		</>
	);
};


export default Terms;