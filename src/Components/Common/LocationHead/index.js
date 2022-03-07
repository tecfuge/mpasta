import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

import useQuery from "Hooks/useQuery";
import { useGlobal } from "Contexts/global";

const LocationHead = () => {
  const query = useQuery();
  const [currentLoc, setCurrentLoc] = useState(query.get("location")? query.get("location"): '');
  const { setShowLocationPopup } = useGlobal();
 
  useEffect(() => {
    
    setCurrentLoc(query.get("location")? query.get("location"): '');

  }, [query.get("location")]);


  return (
    <Card border="light" className="loc-block">
      <Card.Header>
        <i className="fas fa-map-marker-alt mr-2"></i>
        {currentLoc? currentLoc.toLowerCase(): 'Add Location'}
        <a
          className="float-right"
          onClick={() =>
            setShowLocationPopup({
              show: true,
              location : null,
              isDelivery : true
            })
          }
        >
        {!currentLoc? 'Choose': 'Change'}
        </a>
      </Card.Header>
    </Card>
  );
};

export default LocationHead;
