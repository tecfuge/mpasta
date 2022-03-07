import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import { useAuth } from "Contexts/auth";
import { request } from "Helpers/ajax";

const SocialLogin = ({ closePopup }) => {
  const { logIn } = useAuth();

  const doRegister = async (response) => {
    const formData = {
      type: response.type,
      email: response.email,
      social_id: response.social_id,
      name: response.name,
      image: response.image,
    };

    const res = await request("GET", "user/register.json", formData);
    // do login, after successful registration
    if (res.status) {
      logIn({
        user: res.user,
        token: res.token,
      });
      closePopup();
    }
  };

  const responseFacebook = (response) => {
    if (response) {
      if (response.email && response.userID) {
        doRegister({
          email: response.email,
          social_id: response.userID,
          name: response.name,
          image: response.picture.data.url,
          type: 2,
        });
      }
    }
  };

  const responseGoogle = (response) => {
    if (response) {
      if (response.googleId) {
        doRegister({
          email: response.profileObj.email,
          social_id: response.googleId,
          name: response.profileObj.name,
          image: response.profileObj.imageUrl,
          type: 1,
        });
      }
    }
  };

  return (
    <>
      <div className="a-divider a-divider-break">
        <h5>OR</h5>
      </div>
      <Row>
        <Col xs={12} md={6} lg={6}>
          <div className="social-media">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <Button
                  variant="light"
                  type="button"
                  className="google-btn"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <i className="fab fa-google mr-2"></i>Google
                </Button>
              )}
              buttonText="Login"
              onSuccess={responseGoogle}
              // onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </Col>
        <Col xs={12} md={6} lg={6}>
          <div className="social-media">
            <Button variant="light" type="button" className="facebook-btn">
              <i className="fab fa-facebook-f mr-2"></i>Facebook
            </Button>
            {/* <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              cssClass="facebook-btn"
              icon={
                <Button variant="light" type="button" className="facebook-btn">
                  <i className="fab fa-facebook-f mr-2"></i>Facebook
                </Button>
              }
              textButton=""
            /> */}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SocialLogin;
