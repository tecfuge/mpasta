// Common helper functions

export const isObjectString = (str) => {
  return (
    (str.indexOf("{") > -1 && str.indexOf("}") > -1) ||
    (str.indexOf("[") > -1 && str.indexOf("]") > -1)
  );
};

export const setLS = (key, value) => {
  localStorage.setItem(
    key,
    typeof value === "object" ? JSON.stringify(value) : value
  );
};

export const getLS = (key) => {
  const itemLS = localStorage.getItem(key);
  if (itemLS) {
    if (isObjectString(itemLS) && Object.keys(itemLS).length > 0) {
      // Object or Array
      return JSON.parse(itemLS);
    } else {
      // String
      return itemLS;
    }
  }
  return null;
};

export const deleteLS = (key) => {
  localStorage.removeItem(key);
};

export const createSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};
