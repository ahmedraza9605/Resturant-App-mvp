import React,{useState} from "react";
import {Alert,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useCart} from "../context/CartContext";
import {useTheme} from "../context/ThemeContext";

export default function CartScreen({navigation}){
  const {colors}=useTheme();
  const {state,dispatch}=useCart();
  const [promo,setPromo]=useState("");
  const subtotal=state.items.reduce((s,i)=>s+i.price*i.quantity,0);
  const apply=()=>{
    const codes={WELCOME10:10,FEAST20:20};
    const p=codes[promo.toUpperCase()];
    if(!p) Alert.alert("Invalid promo","Use WELCOME10 or FEAST20.");
    else dispatch({type:"APPLY_PROMO",code:promo.toUpperCase(),percent:p});
  };
  if(!state.items.length) return <View style={[styles.center,{backgroundColor:colors.background}]}><Text style={{color:colors.text,fontSize:22}}>Your cart is empty.</Text></View>;
  return <ScrollView style={{flex:1,backgroundColor:colors.background}} contentContainerStyle={{padding:15,paddingTop:45}}>
    <Text style={[styles.title,{color:colors.text}]}>Your Cart</Text>
    {state.items.map(i=><View key={i.id} style={[styles.card,{backgroundColor:colors.card,borderColor:colors.border}]}>
      <View style={{flex:1}}><Text style={[styles.name,{color:colors.text}]}>{i.name}</Text><Text style={{color:colors.muted}}>Rs. {i.price} each</Text></View>
      <View style={styles.row}><Pressable onPress={()=>dispatch({type:"DECREMENT",id:i.id})}><Text style={styles.step}>−</Text></Pressable><Text style={{color:colors.text,fontWeight:"800"}}>{i.quantity}</Text><Pressable onPress={()=>dispatch({type:"INCREMENT",id:i.id})}><Text style={styles.step}>+</Text></Pressable></View>
      <Pressable onPress={()=>dispatch({type:"REMOVE_ITEM",id:i.id})}><Text style={{color:colors.danger}}>Remove</Text></Pressable>
      <TextInput placeholder="Special instructions e.g. no onions" placeholderTextColor={colors.muted} value={i.note} onChangeText={note=>dispatch({type:"UPDATE_NOTE",id:i.id,note})} style={[styles.input,{color:colors.text,borderColor:colors.border}]}/>
    </View>)}
    <View style={styles.promo}><TextInput value={promo} onChangeText={setPromo} placeholder="Promo code" placeholderTextColor={colors.muted} style={[styles.input,{flex:1,color:colors.text,borderColor:colors.border}]}/><Pressable onPress={apply} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff"}}>Apply</Text></Pressable></View>
    {state.promoCode&&<Text style={{color:colors.primary}}>Applied: {state.promoCode} ({state.discountPercent}%)</Text>}
    <Text style={[styles.total,{color:colors.text}]}>Subtotal: Rs. {subtotal.toFixed(0)}</Text>
    <Pressable onPress={()=>navigation.navigate("OrderSummary")} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff",fontWeight:"900"}}>CONTINUE TO ORDER</Text></Pressable>
  </ScrollView>;
}
const styles=StyleSheet.create({
  center:{flex:1,alignItems:"center",justifyContent:"center"},
  title:{fontSize:28,fontWeight:"900",marginBottom:15},
  card:{padding:14,borderWidth:1,borderRadius:12,marginBottom:10},
  name:{fontSize:18,fontWeight:"800"},
  row:{flexDirection:"row",alignItems:"center",gap:16,marginVertical:8},
  step:{fontSize:25,fontWeight:"900"},
  input:{borderWidth:1,borderRadius:8,padding:9,marginTop:8},
  promo:{flexDirection:"row",gap:8,alignItems:"center"},
  button:{padding:13,borderRadius:9,alignItems:"center",justifyContent:"center"},
  total:{fontSize:20,fontWeight:"900",marginVertical:15}
});