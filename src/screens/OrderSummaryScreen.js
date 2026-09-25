import React,{useMemo,useState} from "react";
import {Alert,Pressable,StyleSheet,Text,View} from "react-native";
import {useCart} from "../context/CartContext";
import {useOrders} from "../context/OrdersContext";
import {useAuth} from "../context/AuthContext";
import {useTheme} from "../context/ThemeContext";

const SERVICE_RATE=.05;
const TAX_RATE=.15;

export default function OrderSummaryScreen({navigation}){
  const {colors}=useTheme();
  const {state,dispatch}=useCart();
  const {dispatch:ordersDispatch}=useOrders();
  const {user}=useAuth();
  const [type,setType]=useState("Dine-in");

  const totals=useMemo(()=>{
    const subtotal=state.items.reduce((s,i)=>s+i.price*i.quantity,0);
    const discount=subtotal*(state.discountPercent/100);
    const service=(subtotal-discount)*SERVICE_RATE;
    const tax=(subtotal-discount)*TAX_RATE;
    return {subtotal,discount,service,tax,total:subtotal-discount+service+tax};
  },[state.items,state.discountPercent]);

  const place=()=>{
    if(!state.items.length) return;
    const order={id:"ORD"+Date.now().toString().slice(-6),items:state.items,total:totals.total,type,status:"Pending",timestamp:Date.now(),customer:user.name};
    ordersDispatch({type:"ADD",order});
    dispatch({type:"CLEAR_CART"});
    navigation.replace("OrderTracking",{orderId:order.id});
  };

  return <View style={[styles.container,{backgroundColor:colors.background}]}>
    <Text style={[styles.title,{color:colors.text}]}>Order Summary</Text>
    <Text style={{color:colors.text}}>Subtotal: Rs. {totals.subtotal.toFixed(0)}</Text>
    <Text style={{color:colors.text}}>Service Charge (5%): Rs. {totals.service.toFixed(0)}</Text>
    <Text style={{color:colors.text}}>Sales Tax (15%): Rs. {totals.tax.toFixed(0)}</Text>
    <Text style={{color:colors.text}}>Promo Discount: -Rs. {totals.discount.toFixed(0)}</Text>
    <Text style={[styles.total,{color:colors.text}]}>Grand Total: Rs. {totals.total.toFixed(0)}</Text>
    <Text style={[styles.heading,{color:colors.text}]}>Order Type</Text>
    <View style={styles.row}>
      {["Dine-in","Takeaway"].map(x=><Pressable key={x} onPress={()=>setType(x)} style={[styles.type,{borderColor:type===x?colors.primary:colors.border}]}><Text style={{color:colors.text}}>{type===x?"●":"○"} {x}</Text></Pressable>)}
    </View>
    <Pressable onPress={place} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff",fontWeight:"900"}}>PLACE ORDER</Text></Pressable>
  </View>;
}
const styles=StyleSheet.create({
  container:{flex:1,padding:20,paddingTop:55},
  title:{fontSize:28,fontWeight:"900",marginBottom:25},
  heading:{fontSize:18,fontWeight:"800",marginTop:25,marginBottom:10},
  total:{fontSize:22,fontWeight:"900",marginTop:20},
  row:{flexDirection:"row",gap:10},
  type:{padding:12,borderWidth:1,borderRadius:10,flex:1},
  button:{padding:15,borderRadius:10,alignItems:"center",marginTop:30}
});