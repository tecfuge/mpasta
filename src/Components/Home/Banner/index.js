import React, { useEffect, useState } from "react";
import {
  Jumbotron,
  Button,
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Carousel from "react-grid-carousel";
import { timeConvert } from "Data/fooddata";
import { useGlobal } from "Contexts/global";
import { request } from "Helpers/ajax";
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

const Banner = () => {
  const history = useHistory();
  const { setShowLocationPopup, pickupLocations, setComingApp } = useGlobal();
  const [dataGet, dataSet] = useState([]);
  const [getDeals, setDeals] = useState([]);
  // for banner bg align
  const [scroll, setScroll] = useState(false);
  const [area, setArea] = useState("");
  const [isDelivery, setIsDelivery] = useState(true);

  const [appField, setAppField] = useState("Email");
  const setForm = (field, value) => {
    // console.log(field, value);
    setAppField(capitalize(field));
  };

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const showLocationPopup = (location) => {
    setShowLocationPopup({
      show: true,
      location,
      isDelivery,
    });
  };

  useEffect(() => {
    
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 0);
    });

    // for pizza
    const getFoodItems = async () => {
      let postdata = {
        'catid': 2, // only pizza
        'location': ''
      }
      const res = await request("POST", "productscat", postdata, false);
      //const res = await request("GET", `productscat/2`, null, false); 

      if (res.success) {
        dataSet(res.data);
      } else {
        console.log("ERROR");
      }
    };

    // For deals
    const getDeals = async () => {
      let postdata = {
        'catid': 6, // only deals
        'location': '',
        'today': new Date().getDay()
      }
      const res = await request("POST", "productscat", postdata, false);
      if (res.success) {

        setDeals(res.data);
      } else {
        console.log("ERROR");
      }
    };

    getDeals();

    getFoodItems();
  }, []);

  const gotodeals = (offer) => {
    history.push(`/deals?id=${offer.id}`);
  }

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    // should clean up listeners on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const locGet = pickupLocations || [];
  const AutoplaySlider = withAutoplay(AwesomeSlider);
  return (
    <>
    <div className="desktopslider d-md-block d-none">
    <AutoplaySlider
      play={true}
      cancelOnInteraction={false} // should stop playing on user interaction
      interval={4000}
    >
      <div data-src="/img/home-banner-02.jpg"></div>
      <div data-src="/img/home-banner-03.jpg"></div>
    </AutoplaySlider>
    </div>
    <div className="mobileslider d-block d-md-none">
    <AutoplaySlider
      play={true}
      cancelOnInteraction={false} // should stop playing on user interaction
      interval={4000}
    >
      <div data-src="/img/mobile-home-banner.jpg" />
    </AutoplaySlider>
    </div>
      {/* <Jumbotron className={scroll ? "scroll" : null}>
        <Form>
          <Container className="pos-rel">
            <Row>
              <Col> </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                md={{ span: 7, offset: 5 }}
                lg={{ span: 5, offset: 7 }}
              >
              
                <div className="mb-4">&nbsp;</div>
               <div className="mb-4">&nbsp;</div>
                <div className="mb-4">&nbsp;</div>
                <h1 className="title-m">
                  True italian homemade pasta with mammas secret recipes.
                </h1>
                
                <div className="mb-4">&nbsp;</div> */}

              {/* 
                {["radio"].map((type) => (
                  <div
                    key={`custom-inline-${type}`}
                    className="mb-3 radio-group"
                  >
                    <Form.Check
                      custom
                      inline
                      label="Delivery"
                      type={type}
                      className="delivery"
                      name="orderType"
                      id={`custom-inline-${type}-1`}
                      checked={isDelivery}
                      onChange={() => setIsDelivery(true)}
                    />
                    <Form.Check
                      custom
                      inline
                      label="Takeaway"
                      type={type}
                      name="orderType"
                      className="takeaway"
                      id={`custom-inline-${type}-2`}
                      checked={!isDelivery}
                      onChange={() => setIsDelivery(false)}
                    />
                  </div>
                ))}

                <InputGroup className="location-box">
                  <FormControl
                    placeholder="Enter Your Location"
                    aria-label="Enter Your Location"
                    aria-describedby="basic-addon2"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" || e.keyCode === 13
                        ? showLocationPopup(area)
                        : null
                    }
                  />
                  <InputGroup.Append>
                    <Button
                      variant="secondary"
                      onClick={() => showLocationPopup(area)}
                    >
                      LOCATE US
                    </Button>
                  </InputGroup.Append>
                </InputGroup>*/}               
              {/* </Col>
            </Row>
          </Container>
        </Form>
      </Jumbotron> */}

      <div className="slide-skew">
        <div className="slope-hd">
          <Container>
            
            <div
              className={scroll ? "ordernow-bn" : "ordernow-bn"}
              id="orderDelivery"
              onClick={() => showLocationPopup(null)}
              >
              <img src="/img/order-now-button.png" />
             
            </div>
            <h2 className="h2-cat text-center">
              Today's Best Deals
            </h2>
          </Container>
        </div>

        <Container>
          <Row>
             <Col xs={12} sm={12} md={1} lg={6}><div className="text-center mt-4"><h2>Today Offers</h2></div>
             <div className="text-center mt-4">Grab Offers before it ends!</div></Col>
            <Col xs={12} sm={12} md={10} lg={6} className="home-slider">
              <Carousel cols={2} rows={1} gap={10} loop>
               {/* <Carousel.Item>
                    <div className="slide" onClick={() => showLocationPopup(null)}>
                    <img
                      width="100%"
                      src="/img/offer1.png"
                    />
                  </div>              
                </Carousel.Item>*/}      
                {getDeals &&
                  getDeals.map((offer, i) => (
                    <Carousel.Item key={i}>
                      <div className="slide" onClick={() => gotodeals(offer)}>
                        <img
                          width="100%"
                          src={`${process.env.REACT_APP_IMAGE_PATH}${offer.default_image}`}
                        />
                      </div>                      
                    </Carousel.Item>
                  ))}
              </Carousel>
              <div className="text-center mt-4">
              <Button variant="danger" size="lg" onClick={() => showLocationPopup(null)}>View all offers</Button>
              </div>
            </Col>
            {/* <Col xs={12} sm={12} md={1} lg={2}>&nbsp;</Col> */}
          </Row>
        </Container>
      </div>

      {/*<div className="share-app">
        <Container>
          <Row>
            <Col xs={12} md={5} lg={6} className="mammasAppMob">
              <img className="img-fluid" src="/img/mobapp.png" />
            </Col>
            <Col xs={12} md={7} lg={6}>
              <div className="appbox">
                <h2>Get the Mamma's App</h2>
                <h4>
                  We will send you a link, open it on your phone to download the
                  app
                </h4>
                {["radio"].map((type) => (
                  <div key={`custom-inline-${type}`} className="mb-3">
                    <Form.Check
                      custom
                      inline
                      label="Email"
                      defaultChecked
                      type={type}
                      name="shareApp"
                      id={`get-app-${type}-1`}
                      onChange={(e) => setForm("email", e.target.value)}
                    />
                    <Form.Check
                      custom
                      inline
                      label="Phone"
                      type={type}
                      name="shareApp"
                      id={`get-app-${type}-2`}
                      onChange={(e) => setForm("phone", e.target.value)}
                    />
                  </div>
                ))}

                <Row>
                  <Col xs={12} md={7} lg={7} className="pr-0">
                    <FormControl
                      size="lg"
                      placeholder={"Enter Your " + appField}
                      aria-label={"Enter Your " + appField}
                      aria-describedby="basic-addon2"
                    />
                  </Col>
                  <Col xs={12} md={5} lg={5}>
                    <Button
                      variant="danger"
                      onClick={(e) => setComingApp(true)}
                    >
                      Share App Link
                    </Button>
                  </Col>
                </Row>
                <p className="mt-4">Download App From</p>
                <div className="d-inline-block downloadApp">
                  <img src="/img/apple.png" className="mr-2" />
                  <img src="/img/google-play.png" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>*/}
      <div className="bogo-deals">
       <Container>
       <h2 className="h2-cat text-center">Explore Pasta</h2>
             <Row>
            <Col>&nbsp;</Col>
            </Row>
         {/* <Row>
            <Col>
              <h2 className="text-center"> Enjoy Our Mamma's Secret Recipe</h2>
            </Col>
          </Row> */}
           <Row>
            <Col>&nbsp;</Col>
            </Row>
          <Row className="allpasta">
            <Col xs={12} md={12} lg={12} className="home-slider">
              <Carousel cols={5} rows={1} gap={30} loop autoplay={4000}>
                {dataGet &&
                  dataGet.map((food, i) => (
                    <Carousel.Item key={i}>
                      <div className="slide" onClick={() => showLocationPopup(null)}>
                        <img
                          width="100%"
                          src={`${process.env.REACT_APP_IMAGE_PATH}${food.default_image}`}
                        />
                        {(food.prod_type == 'nonveg')? <span className="boxrg red"><span></span></span>:''}
                        {(food.prod_type == 'veg')? <span className="boxrg green"><span></span></span>:''}
                      </div>
                      <h4 className="text-center mt-4 mb-4" onClick={() => showLocationPopup(null)}>
                        {food.name}
                      </h4>
                      <div className="foodprice">{food.price} AED</div>
                    </Carousel.Item>
                  ))}
              </Carousel>
            </Col>
          </Row>

        </Container>
   
      </div>
    
    </>
  );
};

export default Banner;