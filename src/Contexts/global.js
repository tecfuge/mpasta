// Context for global functionalities

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { request } from "Helpers/ajax";
import { setLS, getLS } from "Helpers";
import { SITE_SETTINGS} from "Config/constants";
const GlobalContext = createContext();

export default ({ children }) => {
  const { Provider } = GlobalContext;
  const [showLocationPopup, setShowLocationPopup] = useState({
    show: false,
    location: "",
    isDelivery: true,
  });
  const [openSchedule, setSchedule] = useState(false);
  const [loginTab, setLoginTab] = useState(null);
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [feedback, setFeedback] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [comingApp, setComingApp] = useState(false);
  const [preOrderPopup, setPreOrderPopup] = useState(false);
  // const [voucherEnable, setVoucherEnable] = useState(false);
  const [settings, setSettings] = useState([]);
  const footr = useRef();
  const [preorderDate, setPreorderDate] = useState(null);

  // for site settings to LS
  useEffect(() => {
    const siteSettings = async () => {
      const res = await request("GET", `settings`, null, false); // all
      if (res.success) {        
        //setLS(SITE_SETTINGS, res.data);
        setSettings(res.data);
      } else {
        console.log("ERROR");
      }
    };
    siteSettings();
  }, []);

  // load settings from LS
  // useEffect(() => {
  //     const loadSettingsFromLS = () => {
  //     const settingsLS = getLS(SITE_SETTINGS);
  //     if (settingsLS) {
  //       setSettings(settingsLS);
  //     }
  //   };

   // loadSettingsFromLS();
 // }, []);

  // for all vouchers
  // useEffect(() => {
  //   const allVouchers = async () => {
  //     const res = await request("GET", `voucher`, null, false); // all

  //     if (res.success) {
  //       setVouchers(res.data);
  //     } else {
  //       console.log("ERROR");
  //     }
  //   };

  //   allVouchers();
  // }, []);

  // Fetch delivery & pickup locations on mount
  useEffect(() => {
    const getDeliveryLocations = async () => {
      const result = await request("GET", `locations/delivery`, null, false);

      if (result.success) {
        setDeliveryLocations(result.data);
      } else {
        console.log("ERROR", result);
      }
    };

    const getPickupLocations = async () => {
      const result = await request("GET", `locations/pickup`, null, false);

      if (result.success) {
        setPickupLocations(result.data);
      } else {
        console.log("ERROR", result);
      }
    };

    getDeliveryLocations();
    getPickupLocations();
  }, []);

  const providerProps = {
    showLocationPopup,
    setShowLocationPopup,
    loginTab,
    setLoginTab,
    deliveryLocations,
    pickupLocations,
    feedback,
    setFeedback,
    vouchers,
    setVouchers,
    comingApp,
    setComingApp,
    footr,
    settings,
    preOrderPopup, 
    setPreOrderPopup,
    openSchedule, 
    setSchedule,
    preorderDate, 
    setPreorderDate
  };

  return <Provider value={providerProps}>{children}</Provider>;
};

export const useGlobal = () => useContext(GlobalContext);
