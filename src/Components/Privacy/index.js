import React from "react";
import {
  Jumbotron,
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";

const Privacy = () => {
	return (
		<>
    <Jumbotron className="p-0">
    <div className="headabout">
      <h2 className="abthead">Privacy Policy</h2>
    </div>
  </Jumbotron>
  <Container style={{minHeight: '440px'}}>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
      <Row>
        <Col> <h3>Privacy Policy</h3></Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col> 
          <ul className="ls-style">
          <li >All credit/debit cards details and personally identifiable information will NOT be stored, sold, shared, rented or leased to any third parties</li>
          <li><a href="/">www.mammaspizza.ae</a> will not pass any debit/credit card details to third parties</li>
          <li><a href="/">www.mammaspizza.ae</a> takes appropriate steps to ensure data privacy and security including through various hardware and software methodologies. However, (www.mammaspizza.ae) cannot guarantee the security of any information that is disclosed online</li>
          <li>The <a href="/">www.mammaspizza.ae</a> is not responsible for the privacy policies of websites to which it links. If you provide any information to such third parties different rules regarding the collection and use of your personal information may apply. You should contact these entities directly if you have any questions about their use of the information that they collect.</li>
          <li>The Website Policies and Terms & Conditions may be changed or updated occasionally to meet the requirements and standards. Therefore, the Customers’ are encouraged to frequently visit these sections to be updated about the changes on the website. Modifications will be effective on the day they are posted</li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
    </Container>
		</>
	);
};

export default Privacy;
