import React,{createContext,useContext,useEffect,useReducer} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrdersContext=createContext(null);

function reducer(state,action){
  switch(action.type){
    case "LOAD": return action.orders;
    case "ADD": return [action.order,...state];
    case "UPDATE_STATUS": return state.map(o=>o.id===action.id?{...o,status:action.status}:o);
    default:return state;
  }
}

export function OrdersProvider({children}){
  const [orders,dispatch]=useReducer(reducer,[]);
  useEffect(()=>{
    AsyncStorage.getItem("restaurant_orders").then(v=>{
      if(v) dispatch({type:"LOAD",orders:JSON.parse(v)});
    });
  },[]);
  useEffect(()=>{
    AsyncStorage.setItem("restaurant_orders",JSON.stringify(orders));
  },[orders]);
  return <OrdersContext.Provider value={{orders,dispatch}}>{children}</OrdersContext.Provider>;
}

export function useOrders(){
  const value=useContext(OrdersContext);
  if(!value) throw new Error("useOrders must be used inside OrdersProvider");
  return value;
}