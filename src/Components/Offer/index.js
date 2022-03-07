import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Container, Row, Button, Card, Link, Form } from "react-bootstrap";
import { request } from "Helpers/ajax";
import useQuery from "Hooks/useQuery";
import { useOrder } from "Contexts/order";

const disabledClass = {
  pointerEvents: "none",
  opacity: "0.8",
  backgroundImage: "url('/img/loader.gif')",
  backgroundRepeat: "no-repeat",
  backgroundSize: "30px 30px",
  backgroundPosition: "center"
};
const ItemRow = ({ idx, offers, selectItem, productlist }) => {
	
	const [isOptional, setIsOptional] = useState(0);

	return (
		  offers.map((offer, j) => (
            <Card key={idx+j}>
		        <Card.Body>
		          <Card.Title>{idx+j+1}. {offer.title}
		          {offer.is_optional == 1? 
		          	(<Form.Check inline label="Choose Any" type="radio" id={`inline-radio-${idx+j}`} 
		          		checked={(isOptional == offer.category_id)? true: false} 
		          		onChange={() => {setIsOptional(offer.category_id); productlist(offer.category_id, idx+j, offer.category_id) }} />): 
					(<Button variant="danger" size="sm" className="float-right" 
						onClick={() => productlist(offer.category_id, idx+j)}>
						{(selectItem && selectItem[idx+j])? 'CHANGE':'ADD'}</Button>)}
		          </Card.Title>

		          {(selectItem && selectItem[idx+j])? <Card.Text className="text-danger">{selectItem[idx+j].name}</Card.Text>: offer.text}

		        </Card.Body>
		    </Card>
          ))
	
	);
}
const OfferDetails = () => {
	const history = useHistory();
	const query = useQuery();
	const { orders, setDelivery, addOrder } = useOrder();
	const [loading, setLoading] = useState(false);
	const [dloading, setDloading] = useState(false);
	const [currentLoc, setCurrentLoc] = useState(query.get("location")? query.get("location"): '');
	const [showMenu, setShowMenu] = useState(false); 
  	const [offeritem, setOfferitem] = useState(null);  
  	const [currentindex, setCurrentIndex] = useState(null); 
  	const [products, setProducts] = useState([]);	
  	const [selectItem, setSelectItem] = useState([]); 
  	const [rowCounter, setRowCounter] = useState(1); 
  	const [id, setId] = useState(query.get("id")? query.get("id"): 0);
  	const [isOpt, setOpt] = useState(false);
  	const [disableCartBtn, setDisableCartBtn] = useState(0);
  	const isTakeAway = query.get("t") == 2;

  	useEffect(() => {
		// Get Offer details
		const offerDetails = async(id) => {
			
			const ofres = await request("GET", "offers/"+id, null, false);

			if (ofres.success) {
			  setOfferitem(ofres.data);
			 
			} else {
			  console.log("ERROR");
			}
			setDloading(false);
		};

		if(id){setDloading(true); offerDetails(id);}
	}, [id]);

	const productlist = async(catid, indx, isOptional) =>{
		setLoading(true);
		setShowMenu(true);

		// optional params
		if(isOptional){			
			setOpt(true);
		}else{
			setOpt(false);
		}

		let postdata = {
	        'catid': catid,	        
	        'isoffer': 1
      	}
      	if(currentLoc){
      		postdata.location =  currentLoc.split('-')[1];
      	}      
      	
      	setCurrentIndex(indx);

		const resp = await request("POST", "productscat", postdata, false);

		if(resp.success){
			setProducts(resp.data);
		}else{
			console.log("ERR");
		}

		setLoading(false);
	}

	const addDealItem = (item) =>{
		setShowMenu(false);

		// set optional param for items
 		item.is_optional = isOpt;
		
		if(isOpt == true){	
			// check for optional data exists in arr
			for (const [key, value] of Object.entries(selectItem)) {
				if(value.is_optional == true){
					delete selectItem[key]; // delete prev optional
				}
			}
		}

		setSelectItem(prev => ({...prev, [currentindex]: item}));
	}
	
	const addDealToCart = async() => {	
		setDloading(true);			
		let dealitem = {};

		dealitem = offeritem;
		//delete dealitem.itemList;
		dealitem.ingredients = [];
		dealitem.count = 1;	   
    	if (Object.keys(selectItem).length > 0) {
	    	dealitem.offersubproducts = selectItem;
	    }
	    
	    (!isTakeAway)? setDelivery(dealitem.shipping_cost): setDelivery(0); 

	    if(!dealitem.is_combo){
	    	
	    	const postdata = dealitem; 
	    	postdata.offersubproducts = JSON.stringify(postdata.offersubproducts);
	    	// for other days offers - check for cart item price
	    	const res = await request("POST", "offerprice", postdata, false);	    	
	    	if(res.success){

				dealitem.price = 1 * res.data;
				dealitem.totprice = 1 * res.data;
				dealitem.offersubproducts = selectItem;
				addOrder(dealitem);

				setDloading(false);
		    	goBack();

			}else{
				console.log("ERR");
			}

	    }else{ 
	    	// for combo items
	    	dealitem.totprice = 1 * offeritem.price;
	    	addOrder(dealitem);

	    	setDloading(false);
		    goBack();
	    }
	   
	}	

	const goBack = () => {

		if(showMenu){
			setShowMenu(false);
		}else{
			let params = '';
			if(query.get("location") && query.get("t")){
				params += '?location='+query.get("location")+'&t='+query.get("t");
			}
			
			history.push(
	        `/menu` + params
	    	); 
		}
	}

	const handleNewRow = (e) => {
		if(offeritem && offeritem.itemList){
			setRowCounter((prev) => prev +1);

			setCurrentIndex((prev) => prev +1)
			e.preventDefault();
		}//		
	}

	useEffect(() => {		
		// for cart button
		const enableCartBtn = () => {

			if(offeritem.is_discount == 0)
			{			
				let optCnt = offeritem.itemList.filter(e => e.is_optional == 1);
				optCnt =  optCnt.length;

				if(optCnt > 0){ // optional items
					let icnt = offeritem.itemList.length - (optCnt/2);
					setDisableCartBtn(icnt);

				}else{ // combo or conditional items
					setDisableCartBtn(offeritem.itemList.length);
				}
				
			}else{ // add more items
				setDisableCartBtn(rowCounter);	
			}
		}

		if(offeritem){ enableCartBtn(); }

	}, [offeritem, rowCounter]);


  return (
  	<>
	<div style={{ backgroundColor: '#e3ffef8a'}}>    
		<div className="wrapper">
			<Button variant="link" className="hd-back" onClick={goBack}>
	    <i className="fas fa-chevron-circle-left mr-2"></i>Back</Button>
		</div>         
	</div>	
	<Container fluid>    
	  <div className={!showMenu ? "offerdetails" : "offerdetails d-none"} style={dloading ? disabledClass : {}}>
	    {offeritem && (
	    <Row>
	      <Col xs={12} sm={12} md={12} lg={12} xl={12}>         	
	        <div className="offerjumbo" >   
	          <div className="wrapper">
	          	<h3>{offeritem.name}</h3>
	            <p>{offeritem.description}</p>
	          </div>
	        </div>
	      </Col>
	         
	    </Row>
	    )}
	    <div className="wrapper">
	      <Row>
	        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
	      </Row>
	      <Row>
	        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
			{offeritem && new Array(rowCounter).fill(0).map((val, i) => (

				<ItemRow key={i} idx={i} offers={offeritem.itemList} selectItem={selectItem} 
				productlist={productlist}  />
			))}
	         
	          {offeritem && offeritem.is_discount == 1 && (
	           <Button variant="link" className="float-right" onClick={handleNewRow}><i className="fas fa-plus-circle mr-2"></i>ADD MORE</Button>
	          )}
	        </Col>
	      </Row>
	      <Row>
	        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
	          <div className="text-center">
	          	{offeritem && (
					<Button variant="danger" className="addcart"
					onClick={() => addDealToCart()} 
					disabled={offeritem && 
						(Object.keys(selectItem).length != disableCartBtn )}>
					ADD TO CART
					</Button>
				)}	         
	          </div>
	        </Col>
	      </Row>
	    </div>
	  </div>
	  <div className="wrapper">
	    <div className={showMenu ? "offerproducts" : "offerdetails d-none"} style={loading ? disabledClass : {}}>
	      <Row>
	        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
	      </Row>
	      <Row>
	        {products && products.map((item, k) => (
	        <Col xs={12} sm={6} md={3} lg={3} xl={3} key={k}>
	          <Card>
	            <Card.Img variant="top" src={`${process.env.REACT_APP_IMAGE_PATH}${item.default_image}`} />
	            <Card.Body className="text-center">
	              <Card.Title>{item.name}</Card.Title>	
	              <p className="small">{item.description}</p>			    
	              <Button variant="danger" onClick={() => addDealItem(item)}>ADD</Button>
	            </Card.Body>
	          </Card>
	        <br/>
	        </Col>
	        ))}
	      </Row>
	    </div>
	  </div>
	</Container>	
    </>
  );
};

export default OfferDetails;