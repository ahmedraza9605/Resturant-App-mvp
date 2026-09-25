import React,{createContext,useContext,useState} from "react";

const light={background:"#f7f7f7",card:"#ffffff",text:"#171717",muted:"#666666",primary:"#d35400",border:"#dddddd",danger:"#c62828"};
const dark={background:"#111111",card:"#1e1e1e",text:"#ffffff",muted:"#bbbbbb",primary:"#ff8a3d",border:"#444444",danger:"#ff6b6b"};

const ThemeContext=createContext(null);

export function ThemeProvider({children}){
  const [isDark,setIsDark]=useState(false);
  const colors=isDark?dark:light;
  return <ThemeContext.Provider value={{isDark,colors,toggleTheme:()=>setIsDark(v=>!v)}}>{children}</ThemeContext.Provider>;
}

export function useTheme(){
  const value=useContext(ThemeContext);
  if(!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}