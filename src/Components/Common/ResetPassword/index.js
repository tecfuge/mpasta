import React, {useState, useEffect} from "react";
import {
 Button, Form, InputGroup, FormControl , Col,
  Container,
  Row,
} from "react-bootstrap";
import useQuery from "Hooks/useQuery";
import { request } from "Helpers/ajax";

import { useAuth } from "Contexts/auth";

const ResetPassword = () => {
  const query = useQuery();
  const tokn = query.get("token");
  const { logIn } = useAuth();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });

  const setForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [showError, setError] = useState('');
  const [showSuccess, setSuccess] = useState('');
  // Success
  const handleReset = async (event) => {    
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else if(formData.password != formData.confirmpassword){
        setValidated(false);
        setError("Passwords don't match");

      }else{ 
        setValidated(true);
      
        if (formData.password && tokn) {
          formData.token = tokn;
          const res = await request("POST", "resetpassword", formData);

          // do login, on success
          if (res.status) {
            setError("");
            setSuccess("Your password reset successfully");

            logIn({
              user: res.user,
              token: res.token,
            });
            setTimeout(function(){ 
               window.location.href = '/';
            }, 1000);
           
          }else{        
            let errStr = (Object.keys(res.errors).length > 0)? res.errors : '';
            setError(errStr);
          }
        }
     }
  };
      
	return (
		<> 
    <Container style={{minHeight: '530px'}}>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
      <Row>
        <Col> <h3>ADD NEW PASSWORD</h3></Col>
      </Row>
      <Row>
        <Col> &nbsp;</Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
      <Form className="resetpass" noValidate validated={validated}>
        {showError && (<div className="alert alert-danger small">{showError}</div>)}  
        {showSuccess && (<div className="alert alert-success small">{showSuccess}</div>)}  

        <Form.Group controlId="password-reset">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            placeholder="Enter Your Password"
            name="password"
            type="password" required 
            onChange={(e) => setForm("password", e.target.value)}
             style={{padding: '2%'}}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid password.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="cpassword-reset">
          <Form.Label>Confirm Password</Form.Label>    
            <Form.Control
              placeholder="Enter Your Confirm Password"
              name="confirmpassword"
              type="password"
              required         
              onChange={(e) => setForm("confirmpassword", e.target.value)}
              style={{padding: '1%'}}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid confirm password.
            </Form.Control.Feedback>          
        </Form.Group>
        <div className="text-center">
          <Button variant="danger" type="button" onClick={handleReset}>
            Set New Password
          </Button>    
        </div>
      </Form>              
		</Col>
    <Col xs={12} sm={6} md={6} lg={6}></Col>
    </Row>
    <Row>
        <Col> &nbsp;</Col>
      </Row>
    </Container>
    </>
	);
};

export default ResetPassword;