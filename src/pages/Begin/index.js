import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageBackground, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import fundo from "../../assets/images/background.png";
import { REGISTER } from "../../constants/constants";
import { Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import colors from "../../utils/colors";
import styles from "../Begin/styles";

export default function Begin({ navigation }) {
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [checked, setChecked] = useState(false);

  // REMOVE OS DADOS DE REGISTRO DO CACHE
  async function init() {
    await AsyncStorage.removeItem(REGISTER);
  }

  // RODA O INIT ASSIM QUE A PÉGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <StatusBar hidden={false} style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contents}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.stretch}
              source={require("../../assets/images/logo.png")}
            />
            <Text style={styles.text}>Bem Vindo</Text>
          </View>
          <View style={styles.loginButton}>
            <Button
              mode="contained"
              labelStyle={{ color: "white" }}
              contentStyle={{ height: 65 }}
              // onPress={() =>
              //   Linking.openURL(
              //     `whatsapp://send?text=${"teste de mensagem"}&phone=${"5545984054915"}`
              //   )
              // }
              onPress={() => navigation.navigate("Login")}
            >
              entrar
            </Button>
            <Button
              mode="text"
              contentStyle={{ height: 65 }}
              style={{ marginTop: 15 }}
              labelStyle={{ color: colors.secondary0 }}
              onPress={() => navigation.navigate("PersonalData")}
            >
              primeiro acesso
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
