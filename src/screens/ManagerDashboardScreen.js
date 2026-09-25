import React,{useEffect,useState} from "react";
import {Alert,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useOrders} from "../context/OrdersContext";
import {useTheme} from "../context/ThemeContext";

export default function ManagerDashboardScreen(){
  const {colors}=useTheme();
  const {orders,dispatch}=useOrders();
  const [tab,setTab]=useState("orders");
  const [menuEdits,setMenuEdits]=useState({});
  const [reservations,setReservations]=useState([]);
  useEffect(()=>{
    AsyncStorage.getItem("restaurant_reservations").then(v=>v&&setReservations(JSON.parse(v)));
    AsyncStorage.getItem("restaurant_menu_edits").then(v=>v&&setMenuEdits(JSON.parse(v)));
  },[]);
  useEffect(()=>{AsyncStorage.setItem("restaurant_reservations",JSON.stringify(reservations))},[reservations]);
  useEffect(()=>{AsyncStorage.setItem("restaurant_menu_edits",JSON.stringify(menuEdits))},[menuEdits]);

  const statusButtons=["Pending","Preparing","Ready","Served","Cancelled"];
  return <View style={[styles.container,{backgroundColor:colors.background}]}>
    <Text style={[styles.title,{color:colors.text}]}>Manager Dashboard</Text>
    <View style={styles.tabs}>{[["orders","Incoming Orders"],["reservations","Reservations"],["menu","Menu Management"]].map(([v,l])=><Pressable key={v} onPress={()=>setTab(v)}><Text style={{color:tab===v?colors.primary:colors.muted,fontWeight:"800"}}>{l}</Text></Pressable>)}</View>
    <ScrollView>
      {tab==="orders"&&orders.map(o=><View key={o.id} style={[styles.card,{backgroundColor:colors.card}]}>
        <Text style={[styles.name,{color:colors.text}]}>{o.id} • {o.customer}</Text>
        <Text style={{color:colors.text}}>Rs. {o.total.toFixed(0)} • {o.type}</Text>
        <Text style={{color:colors.primary}}>Status: {o.status}</Text>
        <View style={styles.wrap}>{statusButtons.map(s=><Pressable key={s} onPress={()=>dispatch({type:"UPDATE_STATUS",id:o.id,status:s})} style={[styles.small,{backgroundColor:colors.primary}]}><Text style={{color:"#fff"}}>{s}</Text></Pressable>)}</View>
      </View>)}
      {tab==="orders"&&!orders.length&&<Text style={{color:colors.muted}}>No orders yet.</Text>}
      {tab==="reservations"&&<Text style={{color:colors.muted}}>Reservations created in the customer tab can be stored here when connected to shared reservation context.</Text>}
      {tab==="menu"&&<View style={[styles.card,{backgroundColor:colors.card}]}>
        <Text style={[styles.name,{color:colors.text}]}>Menu Management</Text>
        <Text style={{color:colors.muted}}>Demo local menu editing state.</Text>
        {["Chicken Pizza","Beef Burger","Chocolate Cake"].map(name=><View key={name} style={styles.editRow}><Text style={{color:colors.text,flex:1}}>{name}</Text><TextInput placeholder="Price" keyboardType="numeric" placeholderTextColor={colors.muted} onChangeText={v=>setMenuEdits(e=>({...e,[name]:v}))} style={[styles.input,{color:colors.text,borderColor:colors.border}]}/><Pressable onPress={()=>Alert.alert("Saved",`${name} price updated locally.`)}><Text style={{color:colors.primary}}>Save</Text></Pressable></View>)}
      </View>}
    </ScrollView>
  </View>;
}
const styles=StyleSheet.create({
  container:{flex:1,padding:15,paddingTop:55},
  title:{fontSize:28,fontWeight:"900",marginBottom:18},
  tabs:{flexDirection:"row",justifyContent:"space-between",marginBottom:15},
  card:{padding:15,borderRadius:12,marginBottom:10},
  name:{fontSize:18,fontWeight:"900"},
  wrap:{flexDirection:"row",flexWrap:"wrap",gap:6,marginTop:10},
  small:{padding:8,borderRadius:7},
  editRow:{flexDirection:"row",alignItems:"center",gap:8,marginTop:15},
  input:{borderWidth:1,borderRadius:7,padding:8,width:80}
});