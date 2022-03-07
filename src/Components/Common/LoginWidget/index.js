import React from "react";
import { Modal, Tabs, Tab } from "react-bootstrap";

import Login from "./login";
import Registration from "./registration";
import ForgotPassword from "./forgotpassword";
// import SocialLogin from "./socialLogin";

const LoginWidget = ({ tab = "login", setTab }) => {
  const closePopup = () => {
    setTab(null);
  };

  const commonProps = { closePopup, setTab };

  return (
    <Modal
      show={tab !== null}
      onHide={closePopup}
      backdrop="static"
      keyboard={false}
      className="auth-popup"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="modal-hd">
          <img src="/img/modal-logo.jpg" alt="Mammas Italia" />
        </div>
        <Tabs
          activeKey={tab}
          id="uncontrolled-tab-auth"
          onSelect={(k) => setTab(k)}
        >
          <Tab eventKey="login" title="Login">
            <Login {...commonProps} />
            {/* <SocialLogin {...commonProps} /> */}
          </Tab>
          <Tab eventKey="1" title="|"></Tab>
          <Tab eventKey="registration" title="Sign Up">
            <Registration {...commonProps} />
            {/* <SocialLogin {...commonProps} /> */}
          </Tab>
          <Tab eventKey="forgot" title="">
            <ForgotPassword {...commonProps} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default LoginWidget;
