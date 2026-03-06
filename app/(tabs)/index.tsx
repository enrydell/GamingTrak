import React from 'react';
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      }}>Bem-vindo ao{'\n'}GamingTrak</Text>
    </View>
  );
}
