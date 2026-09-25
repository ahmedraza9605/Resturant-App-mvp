import React,{useEffect,useMemo,useRef,useState} from "react";
import {Alert,FlatList,Pressable,RefreshControl,StyleSheet,Text,TextInput,View} from "react-native";
import MenuItemCard from "../components/MenuItemCard";
import {categories,menuItems} from "../data/menu";
import {useCart} from "../context/CartContext";
import {useTheme} from "../context/ThemeContext";
import useDebounce from "../hooks/useDebounce";

export default function MenuScreen(){
  const {colors}=useTheme();
  const {dispatch}=useCart();
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [category,setCategory]=useState("All");
  const [query,setQuery]=useState("");
  const debouncedQuery=useDebounce(query,400);
  const [sort,setSort]=useState("none");
  const [refreshing,setRefreshing]=useState(false);
  const [favourites,setFavourites]=useState([]);
  const [history,setHistory]=useState([]);
  const [showHistory,setShowHistory]=useState(false);
  const [showTop,setShowTop]=useState(false);
  const inputRef=useRef(null);
  const listRef=useRef(null);
  const previousQuery=useRef("");
  const renderCount=useRef(0);
  renderCount.current++;

  const load=()=>{
    setLoading(true);setError("");
    const timer=setTimeout(()=>{setItems(menuItems);setLoading(false)},1500);
    return ()=>clearTimeout(timer);
  };

  useEffect(()=>load(),[]);

  const filtered=useMemo(()=>{
    let result=items.filter(i=>(category==="All"||i.category===category)&&i.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
    if(sort==="low") result=[...result].sort((a,b)=>a.price-b.price);
    if(sort==="high") result=[...result].sort((a,b)=>b.price-a.price);
    if(sort==="name") result=[...result].sort((a,b)=>a.name.localeCompare(b.name));
    return result;
  },[items,category,debouncedQuery,sort]);

  useEffect(()=>{
    if(debouncedQuery&&debouncedQuery!==previousQuery.current){
      setHistory(h=>[debouncedQuery,...h.filter(x=>x!==debouncedQuery)].slice(0,5));
      previousQuery.current=debouncedQuery;
    }
  },[debouncedQuery]);

  const onRefresh=()=>{
    setRefreshing(true);
    setTimeout(()=>{setItems(menuItems);setRefreshing(false)},800);
  };

  const add=item=>{
    dispatch({type:"ADD_ITEM",item});
    Alert.alert("Added",`${item.name} added to cart.`);
  };

  if(loading) return <View style={styles.center}><Text style={{color:colors.text}}>Loading menu...</Text></View>;
  if(error) return <View style={styles.center}><Text>{error}</Text><Pressable onPress={load}><Text>Retry</Text></Pressable></View>;

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title,{color:colors.text}]}>🍽 Menu</Text>
        <Text style={{color:colors.muted}}>{filtered.length} items</Text>
      </View>
      <View style={[styles.search,{backgroundColor:colors.card,borderColor:colors.border}]}>
        <Text style={{fontSize:18}}>🔍</Text>
        <TextInput ref={inputRef} value={query} onChangeText={setQuery} onFocus={()=>setShowHistory(true)} placeholder="Search food..." placeholderTextColor={colors.muted} style={{flex:1,color:colors.text}}/>
        {query!==""&&<Pressable onPress={()=>{setQuery("");inputRef.current?.focus()}}><Text>✕</Text></Pressable>}
      </View>
      {showHistory&&query===""&&history.length>0&&<View style={[styles.history,{backgroundColor:colors.card}]}>{history.map(x=><Pressable key={x} onPress={()=>{setQuery(x);setShowHistory(false)}}><Text style={{padding:7,color:colors.text}}>🕘 {x}</Text></Pressable>)}</View>}
      <FlatList
        ref={listRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={x=>x}
        style={{maxHeight:55}}
        renderItem={({item})=><Pressable onPress={()=>setCategory(item)} style={[styles.chip,{backgroundColor:category===item?colors.primary:colors.card,borderColor:colors.border}]}><Text style={{color:category===item?"#fff":colors.text}}>{item}</Text></Pressable>}
      />
      <View style={styles.sortRow}>
        {[
          ["none","Default"],["low","Price ↑"],["high","Price ↓"],["name","A-Z"]
        ].map(([v,label])=><Pressable key={v} onPress={()=>setSort(v)}><Text style={{color:sort===v?colors.primary:colors.muted,fontWeight:sort===v?"800":"400"}}>{label}</Text></Pressable>)}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item=>item.id}
        renderItem={({item})=><MenuItemCard item={item} onAdd={add} favourite={favourites.includes(item.id)} onFavourite={id=>setFavourites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id])}/>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        onScroll={e=>setShowTop(e.nativeEvent.contentOffset.y>300)}
        scrollEventThrottle={16}
        ListEmptyComponent={<View style={styles.center}><Text style={{color:colors.text}}>No food matches your search.</Text></View>}
      />
      {showTop&&<Pressable onPress={()=>listRef.current?.scrollToOffset({offset:0,animated:true})} style={[styles.top,{backgroundColor:colors.primary}]}><Text style={{color:"#fff",fontWeight:"900"}}>↑ Top</Text></Pressable>}
      <Text style={{color:colors.muted,textAlign:"center",fontSize:11}}>Render count: {renderCount.current}</Text>
    </View>
  );
}
const styles=StyleSheet.create({
  container:{flex:1,paddingTop:45},
  header:{paddingHorizontal:14,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  title:{fontSize:28,fontWeight:"900"},
  search:{margin:10,borderWidth:1,borderRadius:12,paddingHorizontal:12,flexDirection:"row",alignItems:"center",gap:8},
  history:{marginHorizontal:10,padding:6,borderRadius:8},
  chip:{paddingHorizontal:15,paddingVertical:10,borderWidth:1,borderRadius:20,marginHorizontal:4},
  sortRow:{flexDirection:"row",justifyContent:"space-around,padding:8",padding:10},
  center:{flex:1,alignItems:"center",justifyContent:"center"},
  top:{position:"absolute",right:20,bottom:50,padding:14,borderRadius:30}
});