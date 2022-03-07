// Context for user authentication

import React, { createContext, useContext, useState, useEffect } from "react";
import { setLS, getLS, deleteLS } from "Helpers";
import { request } from "Helpers/ajax";
import { USER_TOKEN_NAME } from "Config/constants";

const AuthContext = createContext();

export default ({ children }) => {
  const { Provider } = AuthContext;
  const [loggedUser, setLoggedUser] = useState(null);
  const [isAPILoading, setIsAPILoading] = useState(true);

  const logIn = (obj) => {
    if (obj.user && obj.token) {
      setLoggedUser(obj.user);
      setLS(USER_TOKEN_NAME, obj.token);
     
    } else {
      console.warn("User & Token missing");
    }
  };

  const logOut = async () => {
    if(loggedUser){
      const res = await request("POST", "logout", null, true);
      if (res.status) {
        setLoggedUser(null);
        deleteLS(USER_TOKEN_NAME);
      } else {
        console.log("Not logOut");
      }
    }   
    
  };

  // Check if valid localstorage token on refresh
  useEffect(() => {
    const checkLogged = async () => {
      const tokenLS = getLS(USER_TOKEN_NAME);

      if (tokenLS) {
        const res = await request("POST", "verifyUser", null, true);

        if (res.status) {
          setIsAPILoading(false);
          setLoggedUser(res.user);
        } else {
          setIsAPILoading(false);
          logOut();
        }
      } else {
        setIsAPILoading(false);
      }
    };

    checkLogged();
  }, []);

  const providerProps = {
    isAPILoading,
    loggedUser,
    logIn,
    logOut,
  };

  return <Provider value={providerProps}>{children}</Provider>;
};

export const useAuth = () => useContext(AuthContext);
