import React, { useState }  from "react";
import { Modal, Button} from "react-bootstrap";

const GetApp = ({ show, setComingApp }) => {
  const closePopup = () => {  setComingApp(false) };

  return (
    <Modal
      show={show !== false}
      onHide={closePopup}
      backdrop="static"
      keyboard={false}
      className="comingsoon-popup"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <img src="/img/coming-soon-logo.png" alt="Mammas Italia" />
          <br/>       
          <img src="/img/coming-soon-vector.png" width="100%"/>          
        </div>
        <div>&nbsp;</div>

      </Modal.Body>
    </Modal>
  );
};

export default GetApp;