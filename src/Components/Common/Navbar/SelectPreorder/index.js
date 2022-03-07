import React, { useState, useEffect } from "react";
import { Modal, Button} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useGlobal } from "Contexts/global";

const SelectPreorder = ({ show, setPreOrder }) => {
  const closePopup = () => {  setPreOrder(false) };
  const { setShowLocationPopup, openSchedule, setSchedule  } = useGlobal();
  const [storeOpen, setStoreOpen] = useState(false);// close
  const now = new Date().getHours();
  const history = useHistory();

  useEffect(() => {
    if (now >= 11 && now <= 23) {  //open stores
      setStoreOpen(true);   
    }
  }, [now]);

  const toggleOrderPopup = () => {
    setShowLocationPopup((prev) => ({
      show: !prev.show,
      location: "",
      isDelivery: true,
    }));
  };

  const proceedPreorder = () =>{
    closePopup();
    setSchedule(true);
    // if(!storeOpen){      
    // history.push(`/menu`);
    // }else{
    //   toggleOrderPopup();    
    // }
  }

  return (
    <Modal
      show={show !== false}
      onHide={closePopup}
      backdrop="static"
      keyboard={false}
      className="preorder-popup"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <img src="/img/modal-logo.jpg" alt="Mammas Italia" />         
        </div>
        {!storeOpen ?  (
          <div className="mt-4 text-center">
            <h5><b>Reastaurent Not Open Right Now</b></h5>
            <p className="small">Our restaurents are closed at the moment, but they are taking preorders.
            If you want to place an order, choose <b>Proceed</b><br/> or Click close to cancel to go back.</p>
          </div>
        ): (
          <div className="mt-4 text-center">
            <h5><b>PRE ORDER</b></h5>
            <p className="small">Our restaurents are taking preorders at the moment. If you want to place an order, choose <b>Proceed</b><br/> or Click close to cancel to go back.</p>
          </div>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={proceedPreorder}>PROCEED</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectPreorder;