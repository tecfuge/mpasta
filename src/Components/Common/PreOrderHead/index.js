import React, { useState } from "react";
import { Card } from "react-bootstrap";

import { useGlobal } from "Contexts/global";

const PreOrderHead = () => {
	const { setSchedule, preorderDate } = useGlobal();
	
	return (
		<>
		<Card border="light" className="loc-block">
		  <Card.Header>
		    <i className="fas fa-clock mr-2"></i>
		   	Pre Order Time {preorderDate && (<i>{preorderDate}</i>)}
		    <a
		      className="float-right"
		      onClick={() => setSchedule(true)}>
		    Change
		    </a>
		  </Card.Header>
		</Card>

		</>
	);
};

export default PreOrderHead;