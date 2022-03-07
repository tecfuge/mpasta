import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { timeConvert } from "Data/fooddata";
import {
  Modal,
  Button,
  Accordion,
  Card,
  InputGroup,
  FormControl,
  Tabs,
  Tab,
} from "react-bootstrap";

import { useGlobal } from "Contexts/global";

const SelectLocation = ({ toggleOrderPopup, show, location, isDelivery }) => {
  const history = useHistory();
  const { deliveryLocations, pickupLocations } = useGlobal();
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [defaultActiveKey, setDefaultActiveKey] = useState(
    isDelivery ? "delivery" : "takeaway"
  );
  const [time, setTime] = useState("_");
  const [showError, setError] = useState('');
  const [active, setActive] = useState("");

  const gotoMenuPage = (locat, type = 1) => {
    setError("");
    
    let area = locat.city+'-'+locat.name;

    let dt = new Date(),
      h = dt.getHours(),
      m = dt.getMinutes(),
      s = dt.getSeconds(),      
      oh = locat.opening.split(":")[0],
      om = locat.opening.split(":")[1],
      os = locat.opening.split(":")[2], 
      ch = locat.closing.split(":")[0],
      cm = locat.closing.split(":")[1],
      cs = locat.closing.split(":")[2];
      dt = dt.setHours(h, m, s);

      let openTimeObject = new Date(dt);
      let closeTimeObject = new Date(dt); 
      // let today, tomorrow ;
      if(ch < oh){        
        closeTimeObject.setDate(closeTimeObject.getDate() + 1);        
      }   

      closeTimeObject = closeTimeObject.setHours(ch, cm, cs);
      openTimeObject = openTimeObject.setHours(oh,om,os);

      if(dt < openTimeObject || dt > closeTimeObject){  
        //setError("The store available on this location at "+ timeConvert(locat.opening)+' - '+ timeConvert(locat.closing));
        setError("The store available on this location at "+ timeConvert(locat.opening)+' - '+ timeConvert(locat.closing)+". We are taking preorders.");
        return false;

      }else{ 
        setError("");
        toggleOrderPopup();
        history.push(`/menu?location=${area}&t=${type}`);
      }

  };
  // Update state values on props update
  useEffect(() => {
    setDeliveryLocation(location || "");
    setPickupLocation(location || "");   
  }, [location]);

  useEffect(() => {
    setDefaultActiveKey(isDelivery ? "delivery" : "takeaway");
    setTime(new Date().getTime());
  }, [isDelivery]);

  const addActive = () => {
    setActive(active? '': 'active');
  }

  return (
    <Modal
      show={show}
      onHide={toggleOrderPopup}
      backdrop="static"
      keyboard={false}
      className="location-popup"
      key={time}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="modal-hd">
          <img src="/img/modal-logo.jpg" alt="Mammas Italia" />
        </div>
        <Tabs
          defaultActiveKey={defaultActiveKey}
          id="uncontrolled-tab-location"
        >
          <Tab eventKey="delivery" title="Delivery">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter Your Location"
                aria-label="Enter Your Location"
                aria-describedby="basic-addon2"
                onChange={(e) =>
                  setDeliveryLocation(e.target.value.toLowerCase())
                }
                value={deliveryLocation}
              />
              <InputGroup.Append>
                <Button variant="danger">
                  <i className="fas fa-search" />
                </Button>
              </InputGroup.Append>
            </InputGroup>
            {showError && (<div className="alert alert-danger small">{showError}</div>)} 
            <Accordion defaultActiveKey="0" className="mb-2">
              {Object.keys(deliveryLocations).map((city, i) => (
                <Card key={i + "d"}>
                  <Accordion.Toggle as={Card.Header} className={active} eventKey={i + "d"} onClick={addActive}>
                    <span className="text-capitalize"><i class="fas fa-chevron-down mr-2"></i>{city}</span>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={i + "d"}>
                    <Card.Body className="y-scroll">
                      <ul className="list-group">
                        {deliveryLocations[city]
                          .filter(
                            (locat) =>
                              locat.name
                                .toLowerCase()
                                .indexOf(deliveryLocation) !== -1
                          )
                          .map((area, j) => (
                            <li className="list-group-item" key={j}>
                              <a
                                href="#"
                                className="text-capitalize"
                                onClick={() => gotoMenuPage(area, 1)}
                              >
                                {area.name.toLowerCase()}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))}
            </Accordion>
          </Tab>
          <Tab eventKey="takeaway" title="TakeAway">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter Your Location"
                aria-label="Enter Your Location"
                aria-describedby="basic-addon2"
                onChange={(e) =>
                  setPickupLocation(e.target.value.toLowerCase())
                }
                value={pickupLocation}
              />
              <InputGroup.Append>
                <Button variant="danger">
                  <i className="fas fa-search" />
                </Button>
              </InputGroup.Append>
            </InputGroup>
            {showError && (<div className="alert alert-danger small">{showError}</div>)} 
             <Accordion defaultActiveKey="0" className="mb-2">
              {Object.keys(pickupLocations).map((city, j) => (
                <Card key={j + "p"}>
                  <Accordion.Toggle as={Card.Header} className={active} eventKey={j + "p"} onClick={addActive}>
                    <span className="text-capitalize"><i class="fas fa-chevron-down mr-2"></i>{city}</span>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={j + "p"}>
                    <Card.Body className="y-scroll">
                      <ul className="list-group">
                        {pickupLocations[city]
                          .filter(
                            (locat) =>
                              locat.name
                                .toLowerCase()
                                .indexOf(pickupLocation) !== -1
                          )
                          .map((area, j) => (
                            <li className="list-group-item" key={j}>
                              <a
                                href="#"
                                className="text-capitalize"
                                onClick={() => gotoMenuPage(area, 2)}
                              >
                                {area.name.toLowerCase()}
                              </a>
                            </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))}
            </Accordion>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default SelectLocation;
