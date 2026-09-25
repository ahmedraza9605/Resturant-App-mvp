import React,{useEffect,useState} from "react";
import {StyleSheet,Text,View} from "react-native";
import {useOrders} from "../context/OrdersContext";
import {useTheme} from "../context/ThemeContext";

const statuses=["Pending","Preparing","Ready","Served"];

export default function OrderTrackingScreen({route}){
  const {colors}=useTheme();
  const {orders,dispatch}=useOrders();
  const order=orders.find(o=>o.id===route.params?.orderId);
  const [elapsed,setElapsed]=useState(0);

  useEffect(()=>{
    if(!order) return;
    const timer=setInterval(()=>{
      const seconds=Math.floor((Date.now()-order.timestamp)/1000);
      setElapsed(seconds);
      const next=seconds>=30?"Served":seconds>=20?"Ready":seconds>=10?"Preparing":"Pending";
      if(next!==order.status) dispatch({type:"UPDATE_STATUS",id:order.id,status:next});
    },1000);
    return ()=>clearInterval(timer);
  },[order?.id,order?.status]);

  if(!order) return <View style={styles.center}><Text>Order not found.</Text></View>;
  const current=statuses.indexOf(order.status);
  return <View style={[styles.container,{backgroundColor:colors.background}]}>
    <Text style={[styles.title,{color:colors.text}]}>Order #{order.id}</Text>
    {statuses.map((s,i)=><View key={s} style={styles.step}>
      <Text style={{fontSize:25,color:i<=current?colors.primary:colors.muted}}>{i<=current?"●":"○"}</Text>
      <Text style={{color:colors.text,fontSize:18,fontWeight:i===current?"900":"500"}}>{s}</Text>
    </View>)}
    <Text style={{color:colors.text,marginTop:25}}>Elapsed: {elapsed}s</Text>
    <Text style={{color:colors.muted,marginTop:15}}>Demo timings: Preparing at 10s, Ready at 20s, Served at 30s.</Text>
  </View>;
}
const styles=StyleSheet.create({
  container:{flex:1,padding:25,paddingTop:55},
  title:{fontSize:28,fontWeight:"900",marginBottom:30},
  step:{flexDirection:"row",alignItems:"center",gap:15,marginVertical:10},
  center:{flex:1,alignItems:"center",justifyContent:"center"}
});