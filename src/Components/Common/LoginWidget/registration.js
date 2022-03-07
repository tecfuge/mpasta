import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";

import { useAuth } from "Contexts/auth";
import { request } from "Helpers/ajax";

const Registration = ({ closePopup }) => {
  const { logIn } = useAuth();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    // cpassword: "",
  });

  const setForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [showError, setError] = useState('');

  const handleRegister = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{ 

      setValidated(true);

      if (formData.name &&  formData.email && formData.password && formData.phone) {
        const res = await request("POST", "register", formData);
        // do login, after successful registration

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
    <Form className="signup" noValidate validated={validated}>
        {showError && (<div className="alert alert-danger small">{showError}</div>)} 
      <Form.Group controlId="name-reg">
        <Form.Label>Name</Form.Label>
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <i className="fas fa-user"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl            
            placeholder="Enter Your Name"
            name="name"
            required
            onChange={(e) => setForm("name", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid name.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="email-reg">
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
            type="email"
            required
            onChange={(e) => setForm("email", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="phone-reg">
        <Form.Label>Phone Number</Form.Label>
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>+971</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="050 299 1759"
            name="phone"
            type="tel" 
            pattern="^\d{10}$" required
            onChange={(e) => setForm("phone", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid mobile.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="password-reg">
        <Form.Label>Password</Form.Label>
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <i className="fas fa-unlock-alt"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="password"
            name='password'
            required
            placeholder="Enter Your Password"
            onChange={(e) => setForm("password", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid password.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <div className="text-center">
        <Button variant="danger" type="button" onClick={handleRegister}>
          Sign Up
        </Button>
        <p className="mt-2 mb-2">By creating an account you agree to the </p>
        <p className="mt-2 mb-2 ">
          <a href="/terms" target="_blank" className="">
            Terms of Service
          </a>
          and <a href="/privacy" target="_blank">Privacy Policy</a>
        </p>
      </div>
    </Form>
  );
};

export default Registration;
