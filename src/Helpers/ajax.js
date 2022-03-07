// Ajax helper functions using `fetch`

import { getLS } from "./index";
import { USER_TOKEN_NAME } from "Config/constants";

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*"
};

// below config may make issues while sending data as FormData
// "Content-Type": "application/json"

export const request = async (type = "GET", uri, jsonData, withToken) => {
  try {
    // Pass authorization token in the header
    if (withToken) {
      const token = getLS(USER_TOKEN_NAME);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const obj = {
      method: type.toUpperCase(),
      headers: headers,
    };

    // Allow only POST/GET methods
    if (obj.method !== "POST") {
      obj.method = "GET";
    }

    if (jsonData) {
      if (obj.method === "POST") {
        let formData = new FormData();
        for (let key in jsonData) {
          formData.append(key, jsonData[key]);
        }
        obj.body = formData;
      } else {
        let paramArr = [];
        for (let key in jsonData) {
          paramArr.push(`${key}=${jsonData[key]}`);
        }
        uri += `?${paramArr.join("&")}`;
      }
    }
    
    const res = await fetch(`${process.env.REACT_APP_API_PATH}${uri}`, obj);
    let resOK = res && res.ok;
    if (resOK) {   
      let data = await res.json();
      return data;
    } else {
      let error = await res.json();
      return error;
    }
  } catch (error) {
    console.error({ message: "AJAX error occured", error });
    return {
      status: false,
      error,
    };
  }
};
