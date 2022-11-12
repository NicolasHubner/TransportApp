import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Image, Text } from "react-native";
import * as Linking from "expo-linking";
import colors from "../utils/colors";
// import Tooltip from "react-native-walkthrough-tooltip";

export default function Footer({ navigation, rota, radar, localId }) {
  return (
    <View style={styles.container}>
      {radar && (
        <Pressable onPress={() => navigation.navigate(radar, localId)}>
          <Image
            resizeMode="center"
            style={{ width: 20, height: 20 }}
            source={require("./image/radar.png")}
          />
        </Pressable>
      )}
      {!radar && (
        <Pressable onPress={() => console.log("não edita endereço nessa tela")}>
          <Image
            resizeMode="center"
            style={{ width: 20, height: 20 }}
            source={require("./image/radar.png")}
          />
        </Pressable>
      )}
      {/* <Tooltip
        isVisible={tooltipVisible}
        content={
          <>
            <Text>Você chegou ao destino?</Text>
            <Text> Atere o local de entrega!</Text>
          </>
        }
        // displayInsets={{bottom: 100}}
        disableShadow={true}
        placement="left"
        onClose={() => setTooltipVisible(false)}
      ></Tooltip> */}
      <Pressable onPress={() => console.log("bell")}>
        <Image
          resizeMode="center"
          style={{ width: 20, height: 20 }}
          source={require("./image/bell.png")}
        />
      </Pressable>
      <Pressable onPress={() => console.log("message")}>
        <Image
          resizeMode="center"
          style={{ width: 20, height: 20 }}
          source={require("./image/message.png")}
        />
      </Pressable>
      <Pressable onPress={() => console.log("menu")}>
        <Image
          resizeMode="center"
          style={{ width: 20, height: 20 }}
          source={require("./image/menu.png")}
        />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.backgroundFooter,
  },
});
