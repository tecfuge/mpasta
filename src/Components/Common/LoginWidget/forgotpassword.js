import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";

import { useAuth } from "Contexts/auth";
import { request } from "Helpers/ajax";

const ForgotPassword = ({ closePopup, setTab }) => {  
  const { logIn } = useAuth();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: ""
  }); 

  const setForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [showError, setError] = useState('');
  const [showSucc, setSucc] = useState('');

  const handleForgot = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{ 
      setValidated(true);
      
      if (formData.email) {
        const res = await request("POST", "forgot", formData);

        // do login, on success
        if (res.status) {
          setError("");
          setSucc("Please check your inbox to reset password");

          setTimeout(function(){ 
            closePopup();
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
      <Form className="forgot-password" noValidate validated={validated}>
        {showError && (<div className="alert alert-danger small">{showError}</div>)}  
        {showSucc && (<div className="alert alert-success small">{showSucc}</div>)}  
        <Form.Group controlId="email-fp">
          <Form.Label>Email</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <i className="fas fa-envelope"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl              
              placeholder="Enter Your Email"
              name="email"
              required
              type="email"
              onChange={(e) => setForm("email", e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid email.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <div className="text-center">
          <Button variant="danger" type="button" onClick={handleForgot}>
            Reset Password
          </Button>
          <p className="mt-2 mb-2 forgot-link">          
            <a href="#" onClick={() =>  setTab('login')}>Already have account ?</a>
          </p>
        </div>
      </Form>      
    </>
  );
};

export default ForgotPassword;
