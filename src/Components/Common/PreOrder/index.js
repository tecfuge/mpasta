import React, { useState, useEffect } from "react";
import { Card, Modal, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useQuery from "Hooks/useQuery";
import { populateTime } from "Data/fooddata";
import { useGlobal } from "Contexts/global";

const PreOrder = ({ openSchedule, setSchedule }) => {
	const {preorderDate, setPreorderDate } = useGlobal();
	const [ordernow, setOrderNow] = useState(false);
	const [weekday, setWeekday] = useState([]);
	const [daytime, setDaytime] = useState([]);
	const today = new Date();	
	const [formData, setFormData] = useState({
		day: [today.getFullYear(), today.getMonth()+1, today.getDate()].join('-'),
		time: "",
	});
	const [showError, setError] = useState('');
	const history = useHistory();
	const closePopup = () => { 
		setError('');
	    setSchedule((prev) => !prev);
	    history.push(`/menu`);
	};

	useEffect(() => {

		const loadWeekdays = () => {
			let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			let y  	= today.getFullYear(), 
				m 	= today.getMonth()+1, 
				d   = today.getDate();
			
			let days = [{"date" : [y,m,d].join('-'), "label" : week[today.getDay()]+ ' (Today)' }];
			
			let next= today;

			for(let n = 1; n< 7; n++){
				next.setDate(next.getDate() + 1);

				let ny  = next.getFullYear(), 
					nm 	= next.getMonth()+1, 
					nd  = next.getDate(),
					nw  = next.getDay();

				days.push({"date": [ny,nm,nd].join('-'), "label": week[next.getDay()] }); 
			}			
			setWeekday(days);
		};

		const loadDayTime = () => {		
			let timee = populateTime();
	
			setDaytime(timee);
		};

		loadWeekdays();
		loadDayTime();
	}, []);

	const setField = (field, value) => {		
		setFormData((prev) => ({
	      ...prev,
	      [field]: value,
	    }));
	};

	const handlePreorder = async (event) => {
		event.preventDefault();
      	event.stopPropagation();
      	let frmt = null;
      	if(ordernow){ // now
      		//console.log(today);
   //    		let dat = [today.getFullYear(), today.getMonth()+1, today.getDate()].join('-'); 
			// let tim = [today.getHours(), today.getMinutes(), today.getSeconds()].join(':');
   //    		frmt = [dat, tim].join(' ');

      	}else{ // later
      		if(!formData.time){
      			setError('Time is empty');
      			return;
      		}  
      		let later = new Date(formData.day+' '+formData.time);
      		if(later < today){
      			setError('Scheduled time should be greater than current datetime');
      			return;
      		}

      		let dat = [later.getFullYear(), later.getMonth()+1, later.getDate()].join('-'); 
			let tim = [later.getHours(), later.getMinutes(), later.getSeconds()].join(':');
      		frmt = [dat, tim].join(' ');

      	}

		setPreorderDate(frmt);

		closePopup();
	};


	return (

		<Modal
	      show={openSchedule !== false}
	      onHide={closePopup}
	      backdrop="static"
	      keyboard={false}
	      className="preorder-popup"
	    >
	      <Modal.Header closeButton style={{borderBottom: '1px solid #cecece', padding: '1em'}}><b>Choose an Order Time</b></Modal.Header>
	      <Modal.Body>
	      	{showError && (<div className="alert alert-danger small">{showError}</div>)} 
	      	
	      	<div className="shceduleblk">
	        {["radio"].map((type) => (
                  <div
                    key={`custom-inline-${type}`}
                    className="mb-3 radio-group"
                  >
                    <Form.Check
                      custom
                      inline
                      label="Now"
                      type={type}
                      className="preorder-options "
                      name="preordertype"
                      id={`custom-inline-${type}-1`}
                      checked={ordernow}
                      onChange={() => setOrderNow(true)}
                    />
                    <Form.Check
                      custom
                      inline
                      label="Schedule Later"
                      type={type}
                      name="preordertype"
                      className="preorder-options"
                      id={`custom-inline-${type}-2`}
                      checked={!ordernow}
                      onChange={() => setOrderNow(false)}
                    />
                  </div>
                ))}
                {!ordernow && (
                	<>
	                <Form.Group controlId="day">
	                  <Form.Control
	                    as="select"
	                    custom
	                    name="orderdate"
	                    onClick={(e) => setField("day", e.target.value)}
	                  >
	                  {Object.keys(weekday).map((day, i) => (
	                  <option value={weekday[day].date} key={i}>{weekday[day].label}</option>
	                  ))}
	                  </Form.Control>
	                </Form.Group>

	                <Form.Group controlId="time">
	                  <Form.Control
	                    as="select"
	                    custom
	                    name="ordertime"
	                    onClick={(e) => setField("time", e.target.value)}
	                  >
	                  <option value="">-- Time --</option>
	                  {Object.keys(daytime).map((tim, i) => (
	                  	<option value={daytime[tim].time} key={i}>{daytime[tim].label}</option>
	                  ))}
	                  </Form.Control>
	                </Form.Group>
                	</>
                )
                }
                </div>
	      </Modal.Body>
	       <Modal.Footer>
		    <Button variant="danger" onClick={handlePreorder}>CONTINUE</Button>
		  </Modal.Footer>
	    </Modal>
		
	);
};

export default PreOrder;