import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";

const PaymentWidget = ({ iframe, closePopUp, next }) => {
  //const closePopup = () => {  setComingApp(false) };

  useEffect(() => {
    const handler = (event) => {
      const data = event.data
        ? typeof event.data === "string"
          ? JSON.parse(event.data)
          : event.data
        : {};
      if (data.action === "close") {
        closePopUp();
        if (data.next === 1) {
          next();
        }
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [closePopUp, next]);

  return (
    <Modal
      show={iframe !== null}
      // onHide={closePopup}
      backdrop="static"
      keyboard={false}
      className="payment-popup"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <iframe
          id="telr"
          src={iframe ? iframe.page_url : ""}
          frameBorder="0"
        ></iframe>
        <div>&nbsp;</div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentWidget;
