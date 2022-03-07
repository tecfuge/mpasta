import React from "react";
import { Col, Row, Nav } from "react-bootstrap";

const MenuHead = ({ categories, setCategory }) => (

<Row className="list-tab">
  <Col>
    <Nav variant="pills" className="flex-row">
      {categories && categories.map((cat, i) => (
        <Nav.Item key={i} onClick={() => setCategory({cat_id: cat.id, is_deal: cat.is_deal})}>
          <Nav.Link eventKey={cat.id}>{cat.name}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  </Col>
</Row>
);

export default MenuHead;
