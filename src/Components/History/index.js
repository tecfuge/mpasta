import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Card,
  ListGroup
} from "react-bootstrap";
import { request } from "Helpers/ajax";
import useQuery from "Hooks/useQuery";
import { useAuth } from "Contexts/auth";
import { formatPrice } from "Data/fooddata";
import { useHistory } from "react-router-dom";

const OrderHistory = () => {

  const goback = useHistory();
  const { loggedUser } = useAuth();
  const query = useQuery();
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    
    if (loggedUser) {
      setUserId(loggedUser.id);
    }

  }, [loggedUser]);

  useEffect(() => {
    // Get Offer details

    const myHistory = async(id) => {      
      const ofres = await request("GET", "myorders/"+id, null, false);

      if (ofres.status) {
        setHistory(ofres.orders);

      } else {
        console.log("ERROR");
      }
    };

    if(userId){ myHistory(userId); }

  }, [userId]);

  const goTracking = (invoice) => {
    
      goback.push(
        `/tracker?id=${invoice}`
      );

  };
	return (
		<> 
		<Container style={{minHeight: '530px'}}>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
      <Row>
        <Col><h2 className="myorder-hd">My Orders</h2></Col>
      </Row>
      <Row>
        <Col><hr/></Col>
      </Row>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
       
        { history && Object.values(history).map((order, i) =>(
          <Row key={i}>
            <Col>
              <Card className="history-ls">
                <Card.Body>
                <Row>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                   
                    <ListGroup variant="flush">
                    { order.items && Object.values(order.items).map((item, j) =>(
                      <ListGroup.Item className="list-hs" key={j}>                       
                       <small>{item.quantity? item.quantity: 1} x {item.product_name}</small><br/>
                       { order.subitems[item.id] && Object.values(order.subitems[item.id]).map((sub, k) => (
                         <small className="text-muted mr-2" key={k}>{sub.product_name},</small>
                        ))}
                        { item.ingredients && item.ingredients.map((top, l) => (
                         <small className="text-muted mr-2" key={l}>{top},</small>
                        ))}
                      </ListGroup.Item>
                    )
                    )}
                    </ListGroup>
                  </Col>
                  <Col xs={12} sm={12} md={2} lg={2} xl={2}>

                    <Button variant="link" onClick={() => goTracking(order.invoiceno)} >TRACK YOUR ORDER</Button>
                  </Col>
                  <Col xs={12} sm={12} md={1} lg={1} xl={1}></Col>
                  <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                    <div className="text-right">
                      <small>Order Number <b>{order.invoiceno}</b></small><br/>
                      <small>Ordered On  <b>{order.created_at}</b></small><br/>
                      <small className="text-danger">Total Amount <b>{formatPrice(order.total_amount)}</b></small>

                    </div>

                  </Col>
                </Row>
                </Card.Body>
              </Card>
              <p></p>
          </Col>
          </Row>
        )
        )}          
        
      <Row>
        <Col> &nbsp;</Col>
      </Row>
    </Container>
		</>
	);
};

export default OrderHistory;
