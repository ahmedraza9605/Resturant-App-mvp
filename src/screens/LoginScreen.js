import React,{useState} from "react";
import {ActivityIndicator,Alert,Pressable,StyleSheet,Text,TextInput,View} from "react-native";
import {users} from "../data/users";
import {useAuth} from "../context/AuthContext";
import {useTheme} from "../context/ThemeContext";

export default function LoginScreen(){
  const {login}=useAuth();
  const {colors}=useTheme();
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [confirm,setConfirm]=useState("");
  const [role,setRole]=useState("customer");
  const [errors,setErrors]=useState({});
  const [showPassword,setShowPassword]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);

  const validate=()=>{
    const e={};
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email="Enter a valid email.";
    if(!/^(?=.*\d).{8,}$/.test(password)) e.password="Minimum 8 characters and at least one digit.";
    if(mode==="signup"){
      if(!name.trim()) e.name="Name is required.";
      if(password!==confirm) e.confirm="Passwords do not match.";
    }
    setErrors(e); return Object.keys(e).length===0;
  };

  const submit=()=>{
    if(!validate()) return;
    setIsSubmitting(true);
    setTimeout(async()=>{
      if(mode==="login"){
        const found=users.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);
        if(found) await login(found);
        else Alert.alert("Login failed","Incorrect email or password.");
      }else{
        const exists=users.some(u=>u.email.toLowerCase()===email.toLowerCase());
        if(exists) Alert.alert("Signup failed","This email already exists.");
        else{
          const newUser={id:String(Date.now()),name,email,password,role};
          users.push(newUser);
          await login(newUser);
        }
      }
      setIsSubmitting(false);
    },1000);
  };

  const field=(label,value,setter,key,secure=false)=>(
    <View style={{marginBottom:10}}>
      <Text style={[styles.label,{color:colors.text}]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={v=>{setter(v);setErrors(e=>({...e,[key]:""}));}}
        secureTextEntry={secure}
        autoCapitalize="none"
        style={[styles.input,{backgroundColor:colors.card,color:colors.text,borderColor:errors[key]?colors.danger:colors.border}]}
      />
      {!!errors[key]&&<Text style={{color:colors.danger}}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <Text style={[styles.title,{color:colors.primary}]}>🍽 Restaurant App</Text>
      <Text style={[styles.subtitle,{color:colors.text}]}>{mode==="login"?"Welcome back":"Create your account"}</Text>
      {mode==="signup"&&field("Full Name",name,setName,"name")}
      {field("Email",email,setEmail,"email")}
      {field("Password",password,setPassword,"password",!showPassword)}
      {mode==="signup"&&field("Confirm Password",confirm,setConfirm,"confirm",true)}
      <Pressable onPress={()=>setShowPassword(v=>!v)}><Text style={{color:colors.primary,marginBottom:12}}>{showPassword?"Hide password":"Show password"}</Text></Pressable>
      {mode==="signup"&&(
        <View style={{marginBottom:12}}>
          <Text style={[styles.label,{color:colors.text}]}>Role</Text>
          <View style={styles.row}>
            {["customer","manager"].map(r=><Pressable key={r} onPress={()=>setRole(r)} style={[styles.role,{borderColor:role===r?colors.primary:colors.border}]}>
              <Text style={{color:colors.text}}>{role===r?"●":"○"} {r}</Text>
            </Pressable>)}
          </View>
        </View>
      )}
      <Pressable disabled={isSubmitting} onPress={submit} style={[styles.button,{backgroundColor:colors.primary}]}>
        {isSubmitting?<ActivityIndicator color="#fff"/>:<Text style={styles.buttonText}>{mode==="login"?"LOGIN":"SIGN UP"}</Text>}
      </Pressable>
      <Pressable onPress={()=>{setMode(mode==="login"?"signup":"login");setErrors({});}}>
        <Text style={[styles.switch,{color:colors.primary}]}>{mode==="login"?"Don't have an account? Sign Up":"Already have an account? Login"}</Text>
      </Pressable>
      <Text style={{color:colors.muted,marginTop:20,textAlign:"center"}}>Demo: ahmed@gmail.com / Ahmed123{"\n"}Manager: manager@gmail.com / Manager123</Text>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,padding:24,justifyContent:"center"},
  title:{fontSize:30,fontWeight:"900",textAlign:"center"},
  subtitle:{fontSize:20,fontWeight:"700",textAlign:"center",marginBottom:20},
  label:{fontWeight:"700",marginBottom:5},
  input:{borderWidth:1,borderRadius:10,padding:12,fontSize:16},
  button:{padding:15,borderRadius:10,alignItems:"center"},
  buttonText:{color:"#fff",fontWeight:"900"},
  switch:{textAlign:"center",marginTop:18,fontWeight:"700"},
  row:{flexDirection:"row",gap:8},
  role:{padding:10,borderWidth:1,borderRadius:8,flex:1}
});