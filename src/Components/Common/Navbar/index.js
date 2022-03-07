import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import SelectLocation from "./SelectLocation";
import SelectPreorder from "./SelectPreorder";
import PreOrder from "Components/Common/PreOrder";
import LoginWidget from "Components/Common/LoginWidget";
import FeedbackWidget from "Components/Common/FeedbackWidget";
import GetApp from "Components/Common/GetApp";
import { useAuth } from "Contexts/auth";
import { useGlobal } from "Contexts/global";

const NavBar = () => {
  const { loggedUser, logOut } = useAuth();
  const {
    showLocationPopup,
    setShowLocationPopup,
    loginTab,
    setLoginTab,
    feedback,
    setFeedback,
    comingApp,
    setComingApp,
    preOrderPopup, 
    setPreOrderPopup,
    openSchedule,
    setSchedule
  } = useGlobal();
  const history = useHistory();


  const toggleOrderPopup = () => {
    setShowLocationPopup((prev) => ({
      show: !prev.show,
      location: "",
      isDelivery: true,
    }));
  };

  const [isActive, setActive] = useState("false");
  const handleToggle = () => {
    setActive(!isActive);
  };

  // header fix on scroll
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 0);
    });
  }, []);

  const onLogoClick = () => history.push("/");

  return (
    <>
      <Navbar bg="dark" expand="lg" className={scroll ? "fixed" : null}>
        <Navbar.Brand>
          <img
            src="/img/logo.png"
            alt="Mammas Italia"
            className="d-inline-block align-top"
            onClick={onLogoClick}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse className="justify-content-end">
          <div className="clearfix web-links">
            <Navbar.Text className="d-block d-lg-none text-right mob-icons">
              <a className="icon-hd" title="Pre Order" onClick={() => setPreOrderPopup(true)}>
                <i className="far fa-clock"></i>
              </a>
              <a className="icon-hd"
                title="Order Now"
                onClick={toggleOrderPopup}>
                <i className="fas fa-shopping-cart"></i>
              </a>

            </Navbar.Text>
            {/* <Button
              variant="link"
              className="app-dw-link"
              onClick={() => setComingApp(true)}
            >
              <img src="/img/download-icon.png" /> Get the app
            </Button> */}
          </div>
          {/* <Button
            variant="warning"
            className="d-none d-lg-block header-preorder"
            onClick={() => setPreOrderPopup(true)}
          >
            PRE ORDER
          </Button> */}
          <Button
            variant="danger"
            className="d-none d-lg-block header-ordernow"
            onClick={toggleOrderPopup}
          >
            ORDER NOW
          </Button>
          <Navbar.Text className="d-none d-lg-block">
            <a href="tel:+971523462189" target="_blank">
              <i className="fa fa-phone-alt mr-2"></i>0523462189
            </a>
          </Navbar.Text>

          {loggedUser ? (
            <Nav>
              <Nav.Link>Hi, {loggedUser.name}</Nav.Link>              
              <Nav.Link
                className="xs-menu"
                href="/myorders">
                Order History
              </Nav.Link>
              <Nav.Link className="xs-menu" onClick={toggleOrderPopup}>
                Menu
              </Nav.Link>   
              <Nav.Link onClick={logOut}>Logout</Nav.Link>           
            </Nav>
          ) : (
            <div className="divider">
              <Nav>
                <Nav.Link
                  className="d-none d-lg-block"
                  onClick={() => setLoginTab("login")}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  className="d-none d-lg-block"
                  onClick={() => setLoginTab("registration")}
                >
                  Signup
                </Nav.Link>
                <Nav.Link className="xs-menu" href="/">
                  Home
                </Nav.Link>
                
                <Nav.Link className="xs-menu" href="/about">
                  About
                </Nav.Link>
                <Nav.Link className="xs-menu" onClick={toggleOrderPopup}>
                  Menu
                </Nav.Link>                
                <Nav.Link className="xs-menu" href="/contact">
                  Contact
                </Nav.Link>
                <Nav.Link className="xs-menu" href="/stores">
                  Our Stores
                </Nav.Link>
                <Nav.Link className="xs-menu" href="/privacy">
                  Privacy
                </Nav.Link>
                <Nav.Link className="xs-menu" href="/terms">
                  Terms
                </Nav.Link>
                {/* <Nav.Link
                  className="xs-menu"
                  href="http://mymammaitalia.com/uae/"
                  target="_blank">
                  Mammas Italia
                </Nav.Link> */}
              </Nav>
            </div>
          )}
          <div className="clearfix xs-menu divider py-2">
            <Navbar.Text className="d-block d-lg-none text-right mob-icons">
              {/* <a className="circle-icon mr-2" title="Pre Order" 
                onClick={() => setPreOrderPopup(true)}>
                 <i className="far fa-clock"></i>
              </a> */}
              <a
                className="circle-icon"
                title="Order Now"
                onClick={toggleOrderPopup}
              >
                <img src="/img/order-icon.png" />
              </a>
            </Navbar.Text>
            <Button
              variant="link"
              className="menu-btn feedback-btn"
              onClick={() => setFeedback(true)}
            >
              Feedback
            </Button>
          </div>
          <div className="xs-menu">
            {/* <div className="get-app divider">
              <span>Get the app</span>
              <div className="xs-app-links">
                <img src="/img/apple.png" className="mr-2" />
                <img src="/img/google-play.png" />
              </div>
            </div>*/}
            <div className="follow-us-menu divider">
              <p>
                Follow us on:
                <a
                  href="https://www.facebook.com/Mammas-Pizza-100534368899766/"
                  className="link-w" target="_blank"
                >
                  <i className="fab fa-facebook-f ml-4"></i>
                </a>
                <a
                  href="https://www.instagram.com/mammaspizzadelivers/"
                  className="link-w" target="_blank"
                >
                  <i className="fab fa-instagram ml-4"></i>
                </a>
              </p>
            </div>
            {loggedUser ? (
              ""
            ) : (
              <div className="menu-btn-pane">
                <span>
                  <Button
                    variant="link"
                    className="menu-btn"
                    onClick={() => setLoginTab("login")}
                  >
                    Login
                  </Button>
                </span>
                <span>
                  <Button
                    variant="link"
                    className="menu-btn yellow-btn"
                    onClick={() => setLoginTab("registration")}
                  >
                    SignUp
                  </Button>
                </span>
              </div>
            )}
          </div>
        </Navbar.Collapse>

        <span className="hamb-icon" onClick={handleToggle}>
          <span></span>
        </span>
        <div className={!isActive ? "rightSidebar slide" : "rightSidebar"}>
          <span className="close-btn" onClick={handleToggle}></span>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            {loggedUser && (
              <li>
                <a href="/myorders">Order History</a>
              </li>
             )}           
            <li>
              <a href="/about">About</a>
            </li>

            <li>
              <a href="#" onClick={toggleOrderPopup}>
               Menu
              </a>
            </li>
            <li>
              <a href="/stores">
                Our Stores
              </a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            {/* <li>
              <a href="http://mymammaitalia.com/uae/" target="_blank">
                Mamma Italia
              </a>
            </li> */}
          </ul>
          <div className="clearfix divider py-2">
            <Navbar.Text className="d-block d-lg-none text-right mob-icons">
              <a className="circle-icon mr-2" title="Pre Order" 
              onClick={() => setPreOrderPopup(true)}>
                <i className="far fa-clock"></i>
              </a>       
              <a
                className="circle-icon"
                title="Order Now"
                onClick={toggleOrderPopup}
              >
                <img src="/img/order-icon.png" />
              </a>
            </Navbar.Text>
            <Button
              variant="link"
              className="menu-btn feedback-btn"
              onClick={() => setFeedback(true)}
            >
              Feedback
            </Button>
          </div>
          <div className="menu-ftr">
            <div className="follow-links mb-4">
              Follow us on:
              <a
                href="https://www.facebook.com/Mammas-Pizza-100534368899766/"
                className="link-w" target="_blank"
              >
                <i className="fab fa-facebook-f ml-4"></i>
              </a>
              <a
                href="https://www.instagram.com/mammaspizzadelivers/"
                className="link-w" target="_blank"
              >
                <i className="fab fa-instagram ml-4"></i>
              </a>
            </div>
           {/* <div className="menu-app-links mb-4">
              <a href="" className="mr-2">
                {" "}
                <img src="/img/apple.png" />
              </a>
              <a href="">
                {" "}
                <img src="/img/google-play.png" />
              </a>
            </div> */}
            <div className="menu-ftr-links">
              <a href="/privacy">Privacy Policy</a>|
              <a href="/terms">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </Navbar>

      <SelectLocation {...{ ...showLocationPopup, toggleOrderPopup }} />

      <SelectPreorder show={preOrderPopup} setPreOrder={setPreOrderPopup} />
      <PreOrder openSchedule={openSchedule} setSchedule={setSchedule} />
      
      <LoginWidget tab={loginTab} setTab={setLoginTab} />

      {/* Feedback pop up */}
      <FeedbackWidget show={feedback} setFeedback={setFeedback} />

      <GetApp show={comingApp} setComingApp={setComingApp} />
    </>
  );
};

export default NavBar;
