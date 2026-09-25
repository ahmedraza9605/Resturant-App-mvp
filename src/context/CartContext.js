import React,{createContext,useContext,useReducer} from "react";
import {cartReducer,initialCartState} from "../reducers/cartReducer";

const CartContext=createContext(null);

export function CartProvider({children}){
  const [state,dispatch]=useReducer(cartReducer,initialCartState);
  return <CartContext.Provider value={{state,dispatch}}>{children}</CartContext.Provider>;
}

export function useCart(){
  const value=useContext(CartContext);
  if(!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}