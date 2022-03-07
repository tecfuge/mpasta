import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";

import { useAuth } from "Contexts/auth";
import { request } from "Helpers/ajax";

const Login = ({ closePopup, setTab }) => {
  const { logIn } = useAuth();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const setForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [showError, setError] = useState('');

  const handleLogin = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{ 
      setValidated(true);

      if (formData.email && formData.password) {
        const res = await request("POST", "login", formData);

        // do login, on success
        if (res.status) {
          logIn({
            user: res.user,
            token: res.token,
          });
          closePopup();

        }else{        
            let errStr = (Object.keys(res.errors).length > 0)? res.errors : '';
            setError(errStr);
        }
      }
    }
  };

  return (
    <>
      <Form className="signin" noValidate validated={validated}>
        {showError && (<div className="alert alert-danger small">{showError}</div>)}  
        <Form.Group controlId="email-log">
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

        <Form.Group controlId="password-log">
          <Form.Label>Password</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <i className="fas fa-unlock-alt"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Enter Your Password"
              name="password"
              type="password"
              required         
              onChange={(e) => setForm("password", e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <div className="text-center">
          <Button variant="danger" type="button" onClick={handleLogin}>
            Login
          </Button>
          <p className="mt-2 mb-2 forgot-link">          
            <a href="#" onClick={() =>  setTab('forgot')}>Forgot Password?</a>
          </p>
        </div>
      </Form>      
    </>
  );
};

export default Login;
