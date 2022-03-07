import React, { useState } from "react";
import { Col, Row, Tab, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import MenuDetailPopup from "./menuDetailPopup";
import { request } from "Helpers/ajax";
import { formatPrice } from "Data/fooddata";
import useQuery from "Hooks/useQuery";

const disabledClass = {
  pointerEvents: "none",
  opacity: "0.8",
  backgroundImage: "url('/img/loader.gif')",
  backgroundRepeat: "no-repeat",
  backgroundSize: "30px 30px",
  backgroundPosition: "center"
};


const MenuBody = ({ items, categoryIdx, loading, currentLoc }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredients, setingredients] = useState(null);
  const [subitems, setSubitems] = useState(null);

  const history = useHistory();
  const query = useQuery();

  const closePopup = () => {
    setSelectedItem(null);
    setingredients(null);
  };

  const itemView = (food) => {

    if(!food.is_offer){
      // View Product Popup
      getIngredients(food);
      getSubItems(food);
    }else{
      // View deal page
      let params = `?id=${food.id}`;
      if(query.get("location") || query.get("t"))
        params += '&location='+query.get("location")+'&t='+query.get("t");

      history.push(
       `/deals` + params
      );
    }
    
  }

  const getIngredients = async (food) => {
    const res = await request(
      "GET",
      `ingredient/` + food.category_id,
      null,
      false
    );

    if (res.success) {
      // for ingredients
      setingredients(res.data);
      setSelectedItem(food);
    } else {
      console.log("ERROR");
    }
  };

  const getSubItems = async (food) => {

    let postdata = {
        'parentid': food.id
    }
    if(currentLoc){
      postdata.location = currentLoc.split('-')[1];
    }
    const subres = await request("POST", "subproducts", postdata, false);

    if (subres.success) {
      // for sub products
      setSubitems(subres.data);
      setSelectedItem(food);
    } else {
      console.log("ERROR");
    }
  };


  return (
    <>
      <Row style={loading ? disabledClass : {}}>
        <Col>
          <Tab.Content>
            <Tab.Pane eventKey={categoryIdx.cat_id}>
              <Row>
                {items && items.map((food, i) => (

                  <Col xs={6} sm={6} md={6} lg={4} xl={4} key={i}>
                    <div className={(currentLoc && !food.storeid)? 'menu-item  notavailable':  'menu-item'}>               
                      {(food.discount)? <span className="disc-flag">{ formatPrice(food.discount)}</span>: ''}
                      {(food.prod_type == 'nonveg')? <span className="item-label red"><span></span></span>:''}
                      {(food.prod_type == 'veg')? <span className="item-label green"><span></span></span>:''}
                      <div className="item-image">
                        <img className="img-fluid" src={`${process.env.REACT_APP_IMAGE_PATH}${food.default_image}`} />
                      </div>
                      <div className="item-desc">
                        <h4>{food.name}</h4>
                        <small>{(food.discount) ? <s>{formatPrice(food.price)}</s> : (food.price > 0)?formatPrice(food.price): ''}</small>
                        <p>{food.description}</p>
                        {((!currentLoc && !food.storeid) || (currentLoc && food.storeid))? 
                        <Button
                          variant="danger"
                          onClick={() => itemView(food)}>
                          ADD
                        </Button>: ''}
                      </div>
                     
                      {(currentLoc && !food.storeid) && ( 
                        <div className="overlay"><div className="text"><i className="fas fa-ban"></i><br/>Not available</div></div>
                      )}
                    </div>
                  </Col>

                ))}
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>

      {selectedItem && (ingredients || subitems) && (
        <MenuDetailPopup
          item={selectedItem}
          ingredient={ingredients}
          subitems={subitems}
          closePopup={closePopup}
        />
      )}
    </>
  );
};

export default MenuBody;
