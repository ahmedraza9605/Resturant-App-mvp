import React from "react";
import {Pressable,StyleSheet,Switch,Text,View} from "react-native";
import {useAuth} from "../context/AuthContext";
import {useTheme} from "../context/ThemeContext";

export default function ProfileScreen(){
  const {user,logout}=useAuth();
  const {isDark,toggleTheme,colors}=useTheme();
  return <View style={[styles.container,{backgroundColor:colors.background}]}>
    <Text style={[styles.title,{color:colors.text}]}>Profile</Text>
    <View style={[styles.card,{backgroundColor:colors.card,borderColor:colors.border}]}>
      <Text style={[styles.name,{color:colors.text}]}>{user?.name}</Text>
      <Text style={{color:colors.muted}}>{user?.email}</Text>
      <Text style={{color:colors.muted}}>Role: {user?.role}</Text>
    </View>
    <View style={styles.row}><Text style={{color:colors.text,fontSize:17}}>Dark Mode</Text><Switch value={isDark} onValueChange={toggleTheme}/></View>
    <Pressable onPress={logout} style={[styles.button,{backgroundColor:colors.danger}]}><Text style={{color:"#fff",fontWeight:"900"}}>LOGOUT</Text></Pressable>
  </View>;
}
const styles=StyleSheet.create({
  container:{flex:1,padding:20,paddingTop:55},
  title:{fontSize:28,fontWeight:"900",marginBottom:20},
  card:{padding:20,borderWidth:1,borderRadius:14},
  name:{fontSize:23,fontWeight:"900",marginBottom:5},
  row:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:25},
  button:{padding:15,borderRadius:10,alignItems:"center",marginTop:35}
});