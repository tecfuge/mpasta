import React, { useState }  from "react";
import { Modal, Button, Form, InputGroup, FormControl } from "react-bootstrap";

import { useAuth } from "Contexts/auth";
import { request } from "Helpers/ajax";

const FeedbackWidget = ({ show, setFeedback }) => {
  const closePopup = () => {  setFeedback(false) };

  const { loggedUser } = useAuth();

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email:"",
    username: "",
    comments: ""
  });

  const setForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [showError, setError] = useState('');

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{ 
      setValidated(true);
    }

    if (validated && formData.email && formData.username && formData.comments) {
      const res = await request("POST", "addfeedback", formData);

      // do login, on success
      if (res.status) {
        
        closePopup();

      }else{        
          let errStr = (Object.keys(res.errors).length > 0)? res.errors : '';
          setError(errStr);
      }
    }

  };

  return (
    <Modal
      show={show !== false}
      onHide={closePopup}
      backdrop="static"
      keyboard={false}
      className="feedback-popup"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="modal-hd">
          <img src="img/modal-logo.jpg" alt="Mammas Italia" />
        </div>
        <hr/>
        <Form className="feedbackFrm" noValidate validated={validated}>
        
        {showError && (<div className="alert alert-danger small">{showError}</div>)}  

        <Form.Group controlId="username-feed">
        <Form.Label>Your Name</Form.Label>
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <i className="fas fa-user"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl            
            placeholder="Enter Your Name"
            name="username"
            required            
            defaultValue={(loggedUser)? loggedUser.name:""}
            onChange={(e) => setForm("username", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid name.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
        <Form.Group controlId="email-feed">
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
              defaultValue={(loggedUser)? loggedUser.email:""}
              onChange={(e) => setForm("email", e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid email.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="comment-feed">
          <Form.Label>Comment</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <i className="fas fa-comment"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Enter Your Comment"
              name="comments"
              required   
              as="textarea" rows={3}      
              onChange={(e) => setForm("comments", e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your comments.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <div className="text-center">
          <Button variant="danger" type="button" onClick={handleSubmit}>
            Submit
          </Button>         
        </div>
      </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackWidget;