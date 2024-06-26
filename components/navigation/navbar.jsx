import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

const Navbar = () => {
  const navigation = useNavigation();
  return (
    <View
      style={tw`h-16 bg-blue-600 flex-row justify-between items-center px-4`}
    >
      <Text style={tw`text-white text-lg font-bold`}>The Pirate</Text>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Auth")}
          style={tw`mx-2`}
        >
          <Text style={tw`text-white`}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;
