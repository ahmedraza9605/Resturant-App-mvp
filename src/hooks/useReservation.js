import {useMemo,useState} from "react";
import {mockTables,mockReservations} from "../data/tables";

export default function useReservation(){
  const [date,setDate]=useState(new Date());
  const [time,setTime]=useState("19:00");
  const [partySize,setPartySize]=useState(2);
  const [table,setTable]=useState(null);
  const [phone,setPhone]=useState("");
  const [reservations,setReservations]=useState(mockReservations);

  const availableTables=useMemo(()=>{
    return mockTables.filter(t=>t.seats>=partySize && !reservations.some(r=>r.date===date.toDateString()&&r.time===time&&r.tableId===t.id));
  },[date,time,partySize,reservations]);

  const createReservation=()=>{
    if(!table) return {ok:false,message:"Please select a table."};
    if(!/^03\d{2}-\d{7}$/.test(phone)) return {ok:false,message:"Use format 03XX-XXXXXXX."};
    const reservation={id:String(Date.now()),date:date.toDateString(),time,partySize,tableId:table.id,phone,status:"Pending"};
    setReservations(r=>[...r,reservation]);
    return {ok:true,reservation};
  };

  const cancelReservation=id=>setReservations(r=>r.filter(x=>x.id!==id));

  return {date,setDate,time,setTime,partySize,setPartySize,table,setTable,phone,setPhone,availableTables,createReservation,cancelReservation,reservations};
}