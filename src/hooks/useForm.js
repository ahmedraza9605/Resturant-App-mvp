import {useState} from "react";

export default function useForm(initialValues,validate){
  const [values,setValues]=useState(initialValues);
  const [errors,setErrors]=useState({});
  const handleChange=(name,value)=>{
    setValues(v=>({...v,[name]:value}));
    setErrors(e=>({...e,[name]:""}));
  };
  const handleSubmit=callback=>{
    const next=validate(values);
    setErrors(next);
    if(Object.keys(next).length===0) callback(values);
  };
  const reset=()=>{setValues(initialValues);setErrors({});};
  return {values,errors,handleChange,handleSubmit,reset,isValid:Object.keys(errors).length===0};
}