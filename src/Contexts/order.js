// Context for managing cart

import React, { createContext, useContext, useState, useEffect } from "react";
import { setLS, getLS, deleteLS } from "Helpers";
import { CART_NAME, COUPON_NAME } from "Config/constants";

import { useGlobal } from "./global";

const OrderContext = createContext();

export default ({ children }) => {
  const { Provider } = OrderContext;
  const { vouchers, settings, preorderDate, setPreorderDate } = useGlobal();
  const [hasLoadedOrders, setHasLoadedOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [delivery, setDelivery] = useState(settings.shipping_cost);
  const [couponApplied, setCouponApplied] = useState(null);
  const [isVoucher, setIsVoucher] = useState(true);
  let curdate = new Date(),
    cdate = [curdate.getFullYear(), curdate.getMonth()+1, curdate.getDate()].join('-'),
    ctime = [curdate.getHours(), curdate.getMinutes()].join(':');
  //const [preorderDate, setPreorderDate] = useState(null);
  const [discount, setDiscount] = useState({
    coupon_code: "",
    discount_price: 0,
  });
  const [minLimit, setMinLimit] = useState(settings.min_order);

  const removeOrder = (orderKey) => {
    setOrders((prev) => prev.filter((o) => o.key !== orderKey));
  };

  const updateOrder = (orderKey, count) => {
    setOrders((prev) => {
      let updatedOrders = [...prev];
      const index = updatedOrders.findIndex((o) => o.key === orderKey);
      // update existing item with updated values     
      updatedOrders[index].count = count;
      updatedOrders[index].total = updatedOrders[index].price * count;
      updatedOrders[index].ingredientsPrice = 0;
      if (
        updatedOrders[index].ingredients &&
        updatedOrders[index].ingredients.length > 0
      ) {
        for (let ingredient of updatedOrders[index].ingredients) {
          updatedOrders[index].ingredientsPrice += ingredient.price * count;
        }
      }

      return updatedOrders;
    });
  };

  const addOrder = (newOrder) => {
    if (newOrder) {
      
      // IMP: use spread operator
      // otherwise it's gonna use reference to the previous `order` object
      const order = { ...newOrder };
      if (!order.count) order.count = 1; // default item count
      if (!order.ingredients) order.ingredients = []; // default value
      if (!order.offersubproducts) order.offersubproducts = []; 

      let itemExists = false;
      let existingItem = null;

      const existingItemsWithSameOrderId = orders.filter(
        (o) => o.id === order.id
      );

      const newItemIngredientIds =
        order.ingredients.length > 0 ? order.ingredients.map((o) => o.id) : [];

      const newItemProducts =
        Object.keys(order.offersubproducts).length > 0 ? Object.values(order.offersubproducts).map((o) => o.id) : [];

      // check each items in existing items for ingredients
      for (let item of existingItemsWithSameOrderId) {
      //  console.log(item)
        const existingItemIngredientIds = item.ingredients.map((o) => o.id);
        const existingItemProducts = Object.values(item.offersubproducts).map((o) => o.id);

        // Offer products
        if (existingItemProducts.length > 0 && newItemProducts.length > 0) {
          
          // same item with same ingredients
          itemExists = existingItemProducts.some(
            (r) => newItemProducts.indexOf(r) >= 0
          );

          if (itemExists) { 
            existingItem = item;
            break;
          }

        }else if (newItemIngredientIds.length === existingItemIngredientIds.length) {
          // Item Ingredients
          // same item with no ingredients
          if (newItemIngredientIds.length === 0) {
            itemExists = true;
            existingItem = item;
            break;
          }

          // same item with same ingredients
          itemExists = existingItemIngredientIds.some(
            (r) => newItemIngredientIds.indexOf(r) >= 0
          );

          if (itemExists) {
            existingItem = item;
            break;
          }
        }

      }

      if (itemExists) {  
        // increase count by 1, if item already exist
        updateOrder(existingItem.key, existingItem.count + 1);
      } else {  

        let price = order.discount? order.discount: order.price;
        // add new entry if item does not already exist
        order.total = order.price * order.count;
        order.ingredientsPrice = 0;
        if (order.ingredients && order.ingredients.length > 0) {
          for (let ingredient of order.ingredients) {
            order.ingredientsPrice += ingredient.price * order.count;
          }
        }
        
        // there can be multiple orders of same item, with different ingredients
        // use `key` to fix issue of id duplication
        order.key = `${order.id}_${new Date().getTime()}`;

        setOrders((prev) => [...prev, order]);
      }
    }
  };

  const emptyCart = () => setOrders([]);

  const clearDiscount = () => {
    setCouponApplied(null);
  };

  // Get orders from localStorage on mount
  useEffect(() => {
    const loadOrdersFromLS = () => {
      const ordersLS = getLS(CART_NAME);
      if (ordersLS) {
        setOrders(ordersLS);
      }
      setHasLoadedOrders(true);
    };

    loadOrdersFromLS();
  }, []);

  // Get  coupan from localStorage on mount
  useEffect(() => {
    const loadCoupanFromLS = () => {
      const coupanLS = getLS(COUPON_NAME);
      if (coupanLS && coupanLS !== "null") {
        setCouponApplied(coupanLS);
        
      }
    };

    loadCoupanFromLS();
  }, []);

  // Sync localStorage with the state value
  useEffect(() => setLS(CART_NAME, orders), [orders]);

  // Sync localStorage with the state value
  useEffect(() => {
    if (!couponApplied || couponApplied === "null") {
      deleteLS(COUPON_NAME);
      setDiscount({ coupon_code: "", discount_price: 0 });
    } else {

      setLS(COUPON_NAME, couponApplied);
    }
  }, [couponApplied]);


   // disable voucher if combo deal exists in cart
  useEffect(() => {
     const isDealExists = () => {
        let deals_now = orders.filter(e => (Object.keys(e.offersubproducts).length > 0) );      
        if(deals_now.length > 0){
          setIsVoucher(false);
          clearDiscount();
        }else{
          setIsVoucher(true);
        }
     }
     if(orders){
        isDealExists();
     }
  }, [orders]);

  // delivery cost if deals/offers have different delivery cost
  useEffect(() => {
    const setOfferDelivery = () => {
      let deals_now = orders.filter(e => (Object.keys(e.offersubproducts).length > 0) );  
      if(deals_now.length > 0){

        let delv_of = deals_now.map(off => (off.delivery_cost? off.delivery_cost: 0)  );
        let min = Math.min.apply(Math, delv_of);

        let min_lt = deals_now.map(off => (off.min_amount? off.min_amount: 0)  );
        let limit = Math.min.apply(Math, min_lt);

        setDelivery(min);      
        setMinLimit(limit);

      }else if(couponApplied){ // voucher delivey cost

        setDelivery(vouchers.delivery_cost);
        setMinLimit(settings.min_order);
      }
      else{ 
       
        setDelivery(settings.shipping_cost);
        setMinLimit(settings.min_order);
      }
    }
    if(orders.length >0){ 
      setOfferDelivery();
    }
  }, [orders, couponApplied, vouchers]);


  // Step 1
  // Total price update on orders
  useEffect(() => {
    const updateTotalPrice = () => {
      let total = 0;
      for (let order of orders) {
        let pric = order.discount? order.discount: order.price;
        total += pric * order.count;
        total += order.ingredientsPrice;
      }
      setTotalPrice(total);
    };

    updateTotalPrice();

    // reset coupan if there are no items in the cart
    // make sure it's not first render using `hasLoadedOrders`
    if (hasLoadedOrders && orders.length === 0) {
      clearDiscount();
    }
  }, [orders, hasLoadedOrders]);

  // Step 2
  // Discount price update based on totalPrice & couponApplied
   useEffect(() => {
    const updateDiscount = () => {
        // calculate 
        let disprice = 0;
     
        if (totalPrice >= parseInt(vouchers.max_limit)) {
          disprice = calulateDiscountPrice(totalPrice);
         
          // check for min order >= 100 / any amount
          setDiscount({
            coupon_code: couponApplied,
            discount_price: disprice
          });
        } else if (totalPrice < parseInt(vouchers.max_limit) && totalPrice > vouchers.min_limit && 
          vouchers.min_limit > 0) {
          // check for pending amount < 100 && > 50
          disprice = calulateDiscountPrice(totalPrice);
         
          let d_amt = totalPrice - disprice;
          setDiscount({ coupon_code: couponApplied, discount_price: d_amt });
        } else {
         
          // < 50 - no discount
          setDiscount({ coupon_code: "", discount_price: 0 });
        }
  
    };

    const calulateDiscountPrice = (total) => {
        let discount = 0;
        switch(vouchers.discount_type){
            case 'aed':
              discount = vouchers.discount;
            break;
            case 'percent':            
              discount = total * (vouchers.discount/100);
            break;
        }
        return discount;
    }

    if (couponApplied) {
      updateDiscount();
    }
  }, [couponApplied, totalPrice, vouchers]);

  // Step 3
  // Tax update based on totalPrice & discount
  useEffect(() => {
    if(vouchers && vouchers.groupon == 1){
      // if groupon voucher
      setTax((totalPrice * parseFloat(settings.tax_amount)) / 100); // VAT
    }else{
      // let priceAfterDiscount = totalPrice * 1 - discount.discount_price * 1;      
      
      // if(Math.sign(priceAfterDiscount) < 0){
      //   priceAfterDiscount = 0;
      // }
      setTax((totalPrice * parseFloat(settings.tax_amount)) / 100); // VAT
    }

  }, [discount, totalPrice, settings.tax_amount, couponApplied]);

  // Display total price
  useEffect(() => {

    let total = totalPrice * 1 - discount.discount_price * 1;
    if(Math.sign(total) < 0){
      total = 0;
    }
    total += tax * 1 + delivery * 1;    
    setDisplayTotal(total);

  },[discount, totalPrice, tax, delivery]);

  const providerProps = {
    orders,
    addOrder,
    removeOrder,
    updateOrder,
    emptyCart,
    totalPrice,
    discount,
    tax,
    couponApplied,
    setCouponApplied,
    setDelivery,
    delivery,  
    isVoucher,
    minLimit,
    displayTotal,
    // preorderDate, 
    // setPreorderDate
  };

  return <Provider value={providerProps}>{children}</Provider>;
};

export const useOrder = () => useContext(OrderContext);
