import React, { useState, useEffect } from "react";
import { css, styled, setup } from "goober";
import { request } from "Helpers/ajax";
import useQuery from "Hooks/useQuery";
import { useOrder } from "Contexts/order";
import { useGlobal } from "Contexts/global";

setup(React.createElement);

const Ol = styled("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
  background: #f7f5f5;
  border-radius: 0.25rem;  
`;

const LiClass = (props) => css`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 2rem;
  pointer-events: none;

  color: ${props.state === "todo" ? "silver" : "black"};
  border-bottom: 4px solid ${props.state === "todo" ? "silver" : "#ed3e40"};

  &:before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${props.state === "todo"
    ? 'content: "\u039F";'
    : props.state === "doing"
      ? 'content: "\u2022";'
      : 'content: "\u2713";'}
    color: ${props.state === "todo" ? "silver" : "white"};
    background-color: ${props.state === "todo" ? "white" : "#aaa"};
    width: 1.2em;
    line-height: ${props.state === "todo" ? "1.2em" : "1.4em"};
    border-radius: ${props.state === "todo" ? "2rem" : "1.2em"};
  }
  &:hover,
  &::before {
    color: #ed3e40;
  }
  &:after {
    content: "\\00a0\\00a0";
  }
  span {
    padding: 0 1.5rem;
  }
`;
const getTopNavStyles = (indx, length) => {
  let styles = [];
  for (let i = 0; i < length; i++) {
    if (i <= indx) {
      styles.push("done");
    } else if (i === indx) {
      styles.push("doing");
    } else {
      styles.push("todo");
    }
  }
  return styles;
};

const getButtonsState = (indx, length) => {
  if (indx > 0 && indx < length - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: true,
    };
  } else if (indx === 0) {
    return {
      showPreviousBtn: false,
      showNextBtn: true,
    };
  } else {
    return {
      showPreviousBtn: false,
      showNextBtn: false,
    };
  }
};

export default function MultiStep(props) {
  const query = useQuery();
  //const [validated, setValidated] = useState(false);
  const isTakeAway = query.get("t") == 2;
  const [user, setUser] = useState({
    user_id: 0,
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  let loc = query.get("location")? query.get("location").split('-'): '';
  let ci = loc? loc[0]:'dubai';
  let st = loc? loc[1]:'';
  const [address, setAddress] = useState({
    city: ci,
    area: isTakeAway ? "" : st,
    address: isTakeAway ? st : "",
    delivery_method: isTakeAway ? "pickup" : "delivery",
  });
  const [orderComments, setOrderComments] = useState("");
  const [type, setType] = useState("cod");
  const [orderSummary, setOrderSummary] = useState({});

  const [showError, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [iframe, setIframe] = useState({});

  let showNav = true;
  if (props.showNavigation) showNav = props.showNavigation;

  let prevStyle = {};
  if (props.prevStyle) prevStyle = props.prevStyle;

  let nextStyle = {};
  if (props.nextStyle) nextStyle = props.nextStyle;

  const [stylesState, setStyles] = useState(
    getTopNavStyles(0, props.steps.length)
  );
  const [compState, setComp] = useState(0);
  const [buttonsState, setButtons] = useState(
    getButtonsState(0, props.steps.length)
  );

  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, props.steps.length));
    setComp(indx < props.steps.length ? indx : compState);
    setButtons(getButtonsState(indx, props.steps.length));
  };

  const next = () => setStepState(compState + 1);
  const previous = () =>
    setStepState(compState > 0 ? compState - 1 : compState);
  
  const handleKeyDown = (evt) =>
    evt.which === 13 ? next(props.steps.length) : {};
  
  const handleOnClick = (evt) => {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      return false;
    }
    if (
      evt.currentTarget.value === props.steps.length - 1 &&
      compState === props.steps.length - 1
    ) {
      setStepState(props.steps.length);
    } else {
      setStepState(evt.currentTarget.value);
    }
  };
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm =  (event, isExists) => {
    event.preventDefault();
    event.stopPropagation();

    let ele = Object.assign({}, user, address);
    ele.products = orders;
    //console.log(user);

    if (!ele.products.length) {
      setError("Please check, Your cart is empty");
      scrollTop();
      return false;
    }
    if (!ele.firstname || !ele.lastname) {
      setError("Please enter your name");
      scrollTop();
      return false;
    }
    if (!ele.email) {
      setError("Please enter your email");
      scrollTop();
      return false;
    }else{
      if (isExists.status && isExists.count > 0) {
        setError("Email already exists");
        scrollTop();
        return false;
      }
    }
    if (!ele.phone) {
      setError("Please enter your phone number");
      scrollTop();
      return false;
    }
    
    if(!ele.user_id){
      if (!ele.password) {
        setError("Please enter your password");
        scrollTop();
        return false;
      }     
      if (ele.password.length < 6) {
        setError("Passwords must be at least 6 characters in length");
        scrollTop();
        return false;
      }
      if (!ele.confirmpassword) {
        setError("Please enter your confirm password");
        scrollTop();
        return false;
      }
      if(ele.password != ele.confirmpassword) {
        setError("Passwords Don't Match");
        scrollTop();
        return false;
      }
    }

    switch (ele.delivery_method) {
      case "delivery":
        if (!ele.area) {
          setError("Please select your area of delivery");
          scrollTop();
          return false;
        }
        if (!ele.address) {
          setError("Please enter your address");
          scrollTop();
          return false;
        }
      case "pickup":
        if (!ele.address) {
          setError("Please enter your address");
          scrollTop();
          return false;
        }
    }

    setError("");
    // next();
    return true;
  };
  /********************************************************************************/
  const {preorderDate } = useGlobal();
  const { orders, totalPrice, tax, discount, delivery, emptyCart } = useOrder();

  useEffect(() => {

    const getPaymentIframe = async () => {
      setPaymentLoading(true);
      //console.log(user, address, orderComments);
      let final = Object.assign({}, user, address);
      final.total_amount = totalPrice ? totalPrice : 0;
      final.invoiceno = (Object.keys(orderSummary).length > 0) ? orderSummary.order.invoiceno : 0;
      final.orderid = (Object.keys(orderSummary).length > 0) ? orderSummary.order.id : 0;
      final.currenturl = window.location.href;

      const resp = await request("POST", `requestpayment`, final, false);
      // console.log(resp);

      if (resp.status) {
        setIframe(resp.data);
        setError('');
      } else {
        //console.log("ERROR");
        let errStr = (Object.keys(resp.errors).length > 0) ? resp.errors : '';
        setError(errStr);
        setIframe({});
        scrollTop();
      }
      setPaymentLoading(false);
    };

    if (type == 'card') {
      getPaymentIframe();
    }
  }, [type]);

  const handleOrder = async (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
    let isExists = '';

    if(user.user_id == 0 && user.email){
      isExists = await request(
                "GET",
                `emailExists/` + user.email,
                null,
                false
              );
    }
    if (validateForm(event, isExists)) {

      if ((Object.keys(orderSummary).length > 0)) {
        setError("");
        next();

      } else {

        //console.log(user, address, orderComments);
        let final = Object.assign({}, user, address);
        final.comments = orderComments ? orderComments : "";
        final.coupon_code = discount ? discount.coupon_code : "";
        final.discount = discount ? discount.discount_price : 0;
        final.delivery = delivery ? delivery : 0;
        final.total_amount = totalPrice ? totalPrice : 0;
        final.products = JSON.stringify(orders);
        final.preorder = preorderDate ? preorderDate : "";

        const res = await request("POST", "addorder", final);
        // do login, on success
        if (res.status) {

          let ordsum = {
            order: res.data.order,
            location: res.data.location
          };
          setOrderSummary(ordsum);
          setError("");
          next();
        } else { 
          let errStr = Object.keys(res.errors).length > 0 ? res.errors : "";
          setError(errStr);
          scrollTop();
          previous();
          return false;
        }
        
      }
    }
  };

  const updateOrder = async (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
    if (type !== 'cod') {
      setError("If you are facing any issue while doing online payment, please choose Cash On Delivery to complete your order");
      scrollTop();
      return false;
    }

    let final = {
      order_id: orderSummary.order.id,
      payment_method: type
    }

    const ures = await request("POST", "updateorder", final);
    if (ures.status) {

      // let ordsum = {
      //   order: res.data.order,
      //   location: res.data.location
      // };
      // setOrderSummary(ordsum);
      setError("");
      next();
    } else {
      let errStr = Object.keys(ures.errors).length > 0 ? ures.errors : "";
      setError(errStr);
      scrollTop();
      previous();
      return false;
    }

  };

  const renderSteps = () =>
    props.steps.map((s, i) => (
      <li
        className={LiClass({ state: stylesState[i] })}        
        key={i}
        value={i}
      >
        <span>
          {i + 1 == 1
            ? "Address"
            : i + 1 == 2
              ? "Payment"
              : i + 1 == 3
                ? "Success"
                : ""}
        </span>
      </li>
    ));

  const renderNav = (show) =>
    show && (
      <div className="text-center mt-3 btn-container">
        <button type="button"
          className="btn btn-danger btn-lg"
          style={
            buttonsState.showPreviousBtn ? props.prevStyle : { display: "none" }
          }
          onClick={previous}
        >
          <i className="fas fa-long-arrow-alt-left mr-2"></i> BACK
        </button>

        <button type="button"
          className="btn btn-danger btn-lg "
          style={
            buttonsState.showNextBtn ? props.nextStyle : { display: "none" }
          }
          onClick={compState == 1 ? updateOrder : handleOrder}
        >
          {compState == 1 ? "PROCEED" : "PROCEED"}{" "}
          <i className="fas fa-long-arrow-alt-right ml-2"></i>
        </button>
      </div>
    );

  const stepProps = {
    user,
    setUser,
    address,
    setAddress,
    orderComments,
    setOrderComments,
    orderSummary,
    type,
    setType,
    paymentLoading,
    iframe,
    next
  };

  return (
    <>
      <Ol>{renderSteps()}</Ol>
      {showError && <div className="alert mt-2 alert-danger small">{showError}</div>}
      <div>{props.steps[compState].component({ ...stepProps })}</div>
      <div>{renderNav(showNav)}</div>
    </>
  );
}
