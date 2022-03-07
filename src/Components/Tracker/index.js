import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Card, Link, Form } from "react-bootstrap";
import { request } from "Helpers/ajax";
import useQuery from "Hooks/useQuery";

const Tracker = () => {
	const query = useQuery();
	const [id, setId] = useState(query.get("id")? query.get("id"): 0);
	const [getStatus, setStatus] = useState([]);

	useEffect(() => {
		// Get Offer details
		const orderTracking = async(id) => {
			
			const ofres = await request("GET", "tracking/"+id, null, false);

			if (ofres.status) {
				setStatus(ofres.tracking);
			 
			} else {
				console.log("ERROR");
			}
		};

		if(id){orderTracking(id);}
	}, [id]);

	return (
		<> 
		<Container style={{minHeight: '550px'}}>
			<Row>
				<Col> &nbsp;</Col>
			</Row>
			<Row>
				<Col><h1 className="track-hd">Track Order</h1></Col>
			</Row>
			<Row>
				<Col><hr/></Col>
			</Row>
			<Row>
				<Col> &nbsp;</Col>
			</Row>
			<Row>
				<Col xs={12} sm={12} md={4} lg={4} xl={4}></Col>
				<Col xs={6} sm={6} md={6} lg={6} xl={4}>ORDER ID : #{getStatus.invoiceno}</Col>
				<Col xs={6} sm={6} md={4} lg={4} xl={4}>DATE : {getStatus.created_at}</Col>
				<Col xs={12} sm={12} md={4} lg={4} xl={4}></Col>
			</Row>
			<Row>
				<Col> &nbsp;</Col>
			</Row>
			<Row>
				<Col> 
				 <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
				{getStatus && getStatus.status && Object.values(getStatus.status).map((status, i) => (	              
              		<div className={status.completed? "step completed": "step"} key={i}>
		                <div className="step-icon-wrap">
		                  <div className="step-icon">
		                  <img src={status.completed? "/img/" + status.name + "_Active.png": "/img/" + status.name + ".png"} /></div>
		                </div>
		                <h4 className="step-title">{status.name}</h4>
		             </div>
              		))
	              }	 	 	          
	            </div>
				</Col>
			</Row>
			<Row>
				<Col> &nbsp;</Col>
			</Row>
		</Container>
		</>
	);
};


export default Tracker;