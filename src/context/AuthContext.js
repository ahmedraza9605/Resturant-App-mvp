import React,{createContext,useContext,useEffect,useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext=createContext(null);

export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    AsyncStorage.getItem("restaurant_user").then(value=>{
      if(value) setUser(JSON.parse(value));
      setLoading(false);
    });
  },[]);

  const login=async u=>{
    setUser(u);
    await AsyncStorage.setItem("restaurant_user",JSON.stringify(u));
  };

  const logout=async()=>{
    setUser(null);
    await AsyncStorage.removeItem("restaurant_user");
  };

  return <AuthContext.Provider value={{user,login,logout,loading}}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const value=useContext(AuthContext);
  if(!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}