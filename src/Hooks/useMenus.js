import {useState} from 'react';

export function useMenus() {
  const [openMenu, setOpenMenu] = useState();
  return {
  	openMenu, 
  	setOpenMenu
  };
}  