import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Container, Row, Tab, Button } from "react-bootstrap";
import { useGlobal } from "Contexts/global";
import { useOrder } from "Contexts/order";
//import { foodItems } from "Data/fooddata";
import MenuHead from "./menuHead";
import MenuBody from "./menuBody";
import PreOrderHead from "Components/Common/PreOrderHead";
import LocationHead from "Components/Common/LocationHead";
import Cart from "Components/Common/Cart";
import useQuery from "Hooks/useQuery";
import { request } from "Helpers/ajax";

const List = () => {
  const { orders, totalPrice, minLimit, couponApplied } = useOrder();
  const history = useHistory();
  const query = useQuery();
  const { footr, settings,setShowLocationPopup } = useGlobal();
  //const categories = Object.keys(foodItems);
  //const [category, setCategory] = useState(categories[0]);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categoryIdx, setCategoryIdx] = useState({
    cat_id: '',
    is_deal: 0,
  }); //categories.indexOf(categories)
  const [loading, setLoading] = useState(true);
  const [currentLoc, setCurrentLoc] = useState(query.get("location")? query.get("location"): '');
  const [validErr, setValidErr]  = useState('');
  const [noData, setNoData]  = useState('');

  useEffect(() => {
    const getCategory = async () => {
      const res = await request("GET", `categories`, null, false);
      if (res.success) {
        setCategories(res.data);
        setCategoryIdx({
          cat_id: res.data[0].id,
          is_deal: res.data[0].is_deal
        });
      } else {
        console.log("ERROR");
      }
    };

    getCategory();
  }, []);

  useEffect(() => {
      // const showLocationPopup = (location) => {
      //   setShowLocationPopup({
      //     show: true,
    
      //   });
      // };
      // if(!query.get("location")){
      //   showLocationPopup();
      // }
      setCurrentLoc(query.get("location")? query.get("location"): '');

   }, [query.get("location")]);
  
  useEffect(() => {

    const getMenuItems = async (catarg) => {
      setLoading(true);
      setNoData('');
      let postdata = {
        'catid': catarg.cat_id
      }
      if(currentLoc){
        postdata.location = currentLoc.split('-')[1];
      }

      let resp ={};
      if(catarg.is_deal == 1){
        // deals
        resp = await request("POST", "offerproducts", postdata, false);
      }else{
        // products
        resp = await request("POST", "productscat", postdata, false);
      }
      
      if (resp.success) {
        setItems(resp.data);
      } else {
        setNoData('No Data Available');
       // console.log("ERROR");
      }
      setLoading(false);
    };

    if(categoryIdx.cat_id){  
      getMenuItems(categoryIdx);
    }

  }, [categoryIdx, currentLoc]);

  const gotoCheckout = () => {
    //let min_limit = settings.min_order;
   
    if(totalPrice < minLimit && !couponApplied){    
      setValidErr('You must order amount above '+ minLimit +' AED');
      return false;
    }else{
      let params = '';
      if(query.get("location") && query.get("t")){
         params += '?location='+query.get("location")+'&t='+query.get("t");
      }
      
      history.push(
          `/checkout` + params
        );           
    } 
  };

  // ordersummary fix on scroll
  const [fixDiv, fixRightDiv] = useState(false);
  useEffect(() => {

    window.addEventListener("scroll", () => {

      let offFoot = footr.current.offsetTop;
      if ((window.scrollY + window.innerHeight) >= offFoot) {
        // console.log('SCROLL', window.scrollY + window.innerHeight);
        // console.log('FOOTER OFFSET', offFoot);
        fixRightDiv(true);
      }
      else {
        fixRightDiv(false);
      }
    });
  }, []);

  return (
    <Container fluid className={fixDiv ? "fix-order" : null} style={{ minHeight: '850px' }}>
      <div className="wrapper">
        <Row>
          <Col xs={12} sm={12} md={8} lg={8} xl={8} className="border-rt leftDiv">
            {categoryIdx.cat_id && (
              <Tab.Container id="top-tabs-menu" defaultActiveKey={categoryIdx.cat_id}>
                <MenuHead setCategory={setCategoryIdx} categories={categories} />
                {noData && (<div className="alert alert-danger mt-4 mb-4">{noData}</div>)}  
                <MenuBody {...{ items, categoryIdx, loading, currentLoc }} />
              </Tab.Container>
            )}
          </Col>
          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
            <div className="rightDiv">
              <LocationHead />  
              <PreOrderHead /> 

              <Cart />
              {orders.length > 0 && (
                <>
                  <div className="text-center btn-container">

                    {validErr && (<div className="alert alert-danger small">{validErr}</div>)}  
                    <Button variant="danger" onClick={gotoCheckout} className="mb-2">
                      CHECKOUT
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Col>
          {/* <Col xs={12} sm={0} md={0} lg={1}></Col> */}
        </Row>
      </div>

    </Container>
  );
};

export default List;
