import React, {useState, useEffect} from "react";
import {
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import useQuery from "Hooks/useQuery";
import { request } from "Helpers/ajax";

const Payment = () => {
  const [showError, setError] = useState(""); 
  const query = useQuery();
  const orderId = query.get("refno");
  const [status, setStatus] = useState(query.get("status"));

  const closePopUp = () => {
    window.top.postMessage(
      JSON.stringify({
        action: "close",
        next: (status == 1)? 1: 0
      }),
      "*"
    );
  };
  useEffect(() => {    
    return () => { document.getElementById('tidio-chat').style.display = 'none'; }
  });
  useEffect(() => {
      // Success
      const handleTransaction = async (event) => {
        
        let final = {};
        final.orderid = orderId;

        const res = await request("POST", "transaction", final);
        // do login, on success
        if (res.status) {
          //console.log(res.data);
          setError("");
          setTimeout(function(){ 
            closePopUp();
          }, 1000);
         
        } else {
          let errStr = Object.keys(res.errors).length > 0 ? res.errors : "";
          setError(errStr);          
        }
      };
      // cancel / decline
      const handlePaymentStatus = async (event) => {
        
        let final = {};
        final.orderid = orderId;
        final.payment_status = status;


        const res = await request("POST", "savepaymentstatus", final);
        // do login, on success
        if (res.status) {
          //console.log(res.data);
          setError("");
          setTimeout(function(){ 
            closePopUp();
          }, 1000);
         
        } else {
          let errStr = Object.keys(res.errors).length > 0 ? res.errors : "";
          setError(errStr);          
        }
      };

      if(status == 1){ // Payment success
        handleTransaction();
      }else if(status == 2 || status == 3){ // Cancel / Decline      
        handlePaymentStatus();
      }

  }, [orderId]);

	return (
		<> 
		<Container>      
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col className="text-center"> 
          {showError && <div className="alert alert-danger small">{showError}</div>}

          {(status && status == 1 &&
              <div className="alert alert-success">Your order payment done successfully !</div>
            )}
          {(status && status == 2 &&
              <div className="alert alert-danger">Your order payment cancelled. If there is any issue for the payment, please select Cash On Delivery to complete the order.</div>
            )}
          {(status && status == 3 &&
              <div className="alert alert-danger">Your order payment declined. If there is any issue for the payment, please select Cash On Delivery to complete the order.</div>
          )}

          <p className="small">If it doesn't close automatically, you can close the window and continue. </p>
          <button onClick={closePopUp}  className="btn btn-secondary mt-2">Close</button>
        </Col>
      </Row>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
    </Container>
		</>
	);
};

export default Payment;