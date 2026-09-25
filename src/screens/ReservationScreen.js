import React,{useState} from "react";
import {Alert,Modal,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useTheme} from "../context/ThemeContext";
import useReservation from "../hooks/useReservation";

export default function ReservationScreen(){
  const {colors}=useTheme();
  const r=useReservation();
  const [modal,setModal]=useState(false);
  const [selected,setSelected]=useState(null);

  const book=()=>{
    if(r.date<new Date(new Date().setHours(0,0,0,0))) return Alert.alert("Invalid date","Date cannot be in the past.");
    if(r.partySize<1||r.partySize>12) return Alert.alert("Invalid party size","Choose 1 to 12 guests.");
    const result=r.createReservation();
    if(!result.ok) return Alert.alert("Reservation",result.message);
    setSelected(result.reservation);setModal(true);
  };

  return <ScrollView style={{flex:1,backgroundColor:colors.background}} contentContainerStyle={styles.container}>
    <Text style={[styles.title,{color:colors.text}]}>Reserve a Table</Text>
    <Text style={{color:colors.text}}>Date: {r.date.toDateString()}</Text>
    <View style={styles.row}>
      <Pressable onPress={()=>r.setDate(new Date(Date.now()+86400000))} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff"}}>Tomorrow</Text></Pressable>
      <Pressable onPress={()=>r.setDate(new Date())} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff"}}>Today</Text></Pressable>
    </View>
    <Text style={[styles.heading,{color:colors.text}]}>Time</Text>
    <View style={styles.wrap}>{Array.from({length:11},(_,i)=>12+i).map(h=>{
      const time=`${String(h).padStart(2,"0")}:00`;
      const disabled=!r.availableTables.length;
      return <Pressable key={time} disabled={disabled} onPress={()=>r.setTime(time)} style={[styles.slot,{borderColor:r.time===time?colors.primary:colors.border,opacity:disabled?.5:1}]}><Text style={{color:colors.text}}>{time}</Text></Pressable>
    })}</View>
    <Text style={[styles.heading,{color:colors.text}]}>Guests</Text>
    <View style={styles.row}><Pressable onPress={()=>r.setPartySize(Math.max(1,r.partySize-1))}><Text style={[styles.step,{color:colors.text}]}>−</Text></Pressable><Text style={{color:colors.text,fontSize:20}}>{r.partySize}</Text><Pressable onPress={()=>r.setPartySize(Math.min(12,r.partySize+1))}><Text style={[styles.step,{color:colors.text}]}>+</Text></Pressable></View>
    <Text style={[styles.heading,{color:colors.text}]}>Available Tables</Text>
    {r.availableTables.map(t=><Pressable key={t.id} onPress={()=>r.setTable(t)} style={[styles.table,{borderColor:r.table?.id===t.id?colors.primary:colors.border}]}><Text style={{color:colors.text}}>{r.table?.id===t.id?"●":"○"} {t.name} - {t.seats} seats</Text></Pressable>)}
    <TextInput value={r.phone} onChangeText={r.setPhone} keyboardType="phone-pad" placeholder="03XX-XXXXXXX" placeholderTextColor={colors.muted} style={[styles.input,{color:colors.text,borderColor:colors.border}]}/>
    <Pressable onPress={book} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff",fontWeight:"900"}}>RESERVE TABLE</Text></Pressable>
    <Text style={[styles.heading,{color:colors.text}]}>My Reservations</Text>
    {r.reservations.map(x=><View key={x.id} style={[styles.card,{backgroundColor:colors.card}]}><Text style={{color:colors.text}}>{x.date} • {x.time} • {x.partySize} guests • {x.tableId}</Text><Pressable onPress={()=>r.cancelReservation(x.id)}><Text style={{color:colors.danger}}>Cancel</Text></Pressable></View>)}
    <Modal visible={modal} transparent animationType="slide" onRequestClose={()=>setModal(false)}><View style={styles.overlay}><View style={[styles.modal,{backgroundColor:colors.card}]}><Text style={[styles.title,{color:colors.text}]}>Reservation Confirmed</Text><Text style={{color:colors.text}}>Table: {selected?.tableId}</Text><Text style={{color:colors.text}}>Time: {selected?.time}</Text><Text style={{color:colors.text}}>Guests: {selected?.partySize}</Text><Pressable onPress={()=>setModal(false)} style={[styles.button,{backgroundColor:colors.primary}]}><Text style={{color:"#fff"}}>Done</Text></Pressable></View></View></Modal>
  </ScrollView>;
}
const styles=StyleSheet.create({
  container:{padding:20,paddingTop:55},
  title:{fontSize:28,fontWeight:"900",marginBottom:20},
  heading:{fontSize:18,fontWeight:"800",marginTop:20,marginBottom:10},
  row:{flexDirection:"row",alignItems:"center",gap:15},
  wrap:{flexDirection:"row",flexWrap:"wrap",gap:8},
  slot:{padding:10,borderWidth:1,borderRadius:8},
  table:{padding:13,borderWidth:1,borderRadius:10,marginBottom:8},
  step:{fontSize:32,fontWeight:"900"},
  input:{borderWidth:1,borderRadius:9,padding:12,marginTop:15},
  button:{padding:14,borderRadius:9,alignItems:"center",marginTop:12},
  card:{padding:12,borderRadius:10,marginBottom:8},
  overlay:{flex:1,backgroundColor:"rgba(0,0,0,.5)",justifyContent:"center",padding:25},
  modal:{padding:25,borderRadius:15}
});