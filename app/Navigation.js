// Navigation.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./auth";
import Messague from "./src/message";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Form">
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Form" component={Messague} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
