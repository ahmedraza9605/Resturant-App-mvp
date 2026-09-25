import React, {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AuthProvider, useAuth} from "./src/context/AuthContext";
import {ThemeProvider, useTheme} from "./src/context/ThemeContext";
import {CartProvider, useCart} from "./src/context/CartContext";
import {OrdersProvider} from "./src/context/OrdersContext";
import LoginScreen from "./src/screens/LoginScreen";
import MenuScreen from "./src/screens/MenuScreen";
import CartScreen from "./src/screens/CartScreen";
import OrderSummaryScreen from "./src/screens/OrderSummaryScreen";
import ReservationScreen from "./src/screens/ReservationScreen";
import OrderTrackingScreen from "./src/screens/OrderTrackingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ManagerDashboardScreen from "./src/screens/ManagerDashboardScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoadingScreen() {
  return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><ActivityIndicator size="large"/></View>;
}

function CustomerTabs() {
  const {colors} = useTheme();
  const {state} = useCart();
  return (
    <Tab.Navigator screenOptions={{headerShown:false, tabBarActiveTintColor:colors.primary}}>
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Cart" component={CartScreen}
        options={{tabBarBadge: state.items.reduce((n,i)=>n+i.quantity,0) || undefined}} />
      <Tab.Screen name="Reservations" component={ReservationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ManagerTabs() {
  const {colors} = useTheme();
  return (
    <Tab.Navigator screenOptions={{headerShown:false, tabBarActiveTintColor:colors.primary}}>
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const {user, loading} = useAuth();
  const {colors} = useTheme();
  if (loading) return <LoadingScreen />;
  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="Login" component={LoginScreen}/>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={user.role === "manager" ? ManagerTabs : CustomerTabs}
            options={{headerShown:false}}
          />
          <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{title:"Order Summary"}}/>
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{title:"Order Tracking"}}/>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <OrdersProvider>
            <RootNavigator/>
          </OrdersProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}