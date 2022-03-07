import React from "react";
import { Col, Container, Row, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useGlobal } from "Contexts/global";


const menus = [
  { name: "Home", link: "/" },
  { name: "Stores", link: "/stores" },
  { name: "About", link: "/about" },
  { name: "Terms", link: "/terms" },
  { name: "Privacy", link: "/privacy" },
  { name: "Contact", link: "/contact" },
];

const Footer = () => {
  const history = useHistory();
  const { setShowLocationPopup, footr } = useGlobal();

  const gotoLink = (link) => {

    if(link == '/menu'){
     setShowLocationPopup({
        show: true,
        location: "",
      });
    }else{
        history.push(link);
    }
  }

  return (
    <>
      <div className="footer" id="foot" ref={footr}>
        <Container>
          <Row>
            <Col xs={12} md={4} lg={3} className="logobox">
              <div className="footer-logo">
                <img width="50%" src="/img/logo.png" />
              </div>
            </Col>
            <Col xs={12} md={4} lg={5} className="menuboxfooter">
              <Nav className="">
                {menus.map((menu, i) => (
                  <Nav.Link key={i} onClick={() => gotoLink(menu.link)}>
                    {menu.name}
                  </Nav.Link>
                ))}
              </Nav>
            </Col>
            <Col xs={12} md={4} lg={4} className="socialbox">
              <div className="follow-us">
                <p>
                  {" "}
                  Follow us on : <a href="https://www.facebook.com/Mammas-Pizza-100534368899766/" target="_blank" className="social-ft"><i className="fab fa-facebook-f ml-4"></i></a>
                  <a href="https://www.instagram.com/mammaspizzadelivers/" target="_blank" className="social-ft"><i className="fab fa-instagram ml-4"></i></a>
                </p>
                {/*<div className="d-inline-block">
                  <img src="/img/apple.png" width="40%" className="mr-2" />
                  <img width="35%" src="/img/google-play.png" />
                </div>*/}

              </div>

            </Col>
          </Row>
        </Container>
      </div>
      <div className="copyright">
        <p>Copyright © 2022 <a href="https://www.tecfuge.com/">Mammas Pasta</a> @ All Rights Reserved  <img src="/img/cards.png" width="4%" className="ml-1"/></p>
      </div>
    </>
  );
};

export default Footer;
