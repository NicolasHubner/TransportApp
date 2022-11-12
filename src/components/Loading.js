import React from "react";
import { ActivityIndicator, StyleSheet, View, Image, ImageBackground } from "react-native";
import fundo from "../assets/images/background.png";
export default function Loading() {
  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.background}>
        <Image
          resizeMode="cover"
          style={styles.stretch}
          source={require("../assets/images/logo.png")}
        />
        <ActivityIndicator size="large" color="white" />
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  stretch: {
    height: 33,
    width: 252,
    marginBottom: 40,
  },
});
