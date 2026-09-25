import React,{memo} from "react";
import {Image,Pressable,StyleSheet,Text,View} from "react-native";
import {useTheme} from "../context/ThemeContext";

function MenuItemCard({item,onAdd,favourite,onFavourite}){
  const {colors}=useTheme();
  return (
    <View style={[styles.card,{backgroundColor:colors.card,borderColor:colors.border,opacity:item.isAvailable?1:.55}]}>
      <Image source={{uri:item.image}} style={styles.image}/>
      <View style={{flex:1,padding:12}}>
        {item.isSpecial&&<Text style={[styles.special,{color:colors.primary}]}>DAILY SPECIAL</Text>}
        <Text style={[styles.name,{color:colors.text}]}>{item.name}</Text>
        <Text style={[styles.desc,{color:colors.muted}]}>{item.description}</Text>
        <Text style={[styles.price,{color:colors.text}]}>Rs. {item.price}</Text>
        <View style={styles.row}>
          <Pressable onPress={()=>onFavourite(item.id)}><Text style={{fontSize:24}}>{favourite?"♥":"♡"}</Text></Pressable>
          <Pressable disabled={!item.isAvailable} onPress={()=>onAdd(item)} style={[styles.button,{backgroundColor:colors.primary}]}>
            <Text style={{color:"#fff",fontWeight:"700"}}>{item.isAvailable?"Add to Cart":"Unavailable"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
export default memo(MenuItemCard);

const styles=StyleSheet.create({
  card:{margin:8,borderWidth:1,borderRadius:14,overflow:"hidden",flexDirection:"row"},
  image:{width:115,height:150},
  special:{fontWeight:"800",fontSize:11},
  name:{fontSize:18,fontWeight:"800",marginTop:3},
  desc:{marginVertical:5},
  price:{fontSize:16,fontWeight:"700"},
  row:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:8},
  button:{paddingVertical:9,paddingHorizontal:12,borderRadius:8}
});