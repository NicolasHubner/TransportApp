//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  23.12.22 - TIAKI
//      - correção dos termos de uso
//
//*************************************************************************** */

import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Image, Alert, ImageBackground, Pressable } from "react-native";
import StorageController from "../../../controllers/StorageController";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { REGISTER } from "../../../constants/constants";
import { Button, Text } from "react-native-paper";
import fundo from "../image/background.png";
import { StatusBar } from "expo-status-bar";
import { api } from "../../../services/api";
import Checkbox from "expo-checkbox";
import styles from "./styles";
import crashlytics from '@react-native-firebase/crashlytics';

export default function UseTerms({ navigation }) {
  const [checked, setChecked] = useState(false);
  const [register, setRegister] = useState({});
  const [term, setTerm] = useState("");

  // FUNÇÃO INICIAL PARA PEGAR TODAS AS INFORMAÇÕES PARA A RENDERIZAÇÃO DA TELA
  // PEGA OS DADOS DO REGISTRO E VERIFICA SE OS TERMOS DE USO FORAM ACEITOS
  
  async function init() {
    try {
      const response = await api.get("/terms-of-use");
      //23.12.2022...
      if (response.data.success === true) {
        setTerm(response.data.data.terms_of_use);
      }
      //...23.12.2022
      
      let dadosRegistro = await StorageController.buscarPorChave(REGISTER);
      dadosRegistro = JSON.parse(dadosRegistro);
      setRegister(dadosRegistro);
      if (dadosRegistro.terms_of_use === "true") {
        setChecked(true);
      }

    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log("erro interno ->", error.message);
      }
    }
  }

  // CHAMA O INIT ASSIM QUE A PAGINA INICIALIZA
  useEffect(() => {
    init();
  }, []);

  // VERIFICA O STATUS DE ACEITO DO TERMOS DE USO, GUARDA A INFORMAÇÃO E
  // NAVEGA PARA A TELA "ACCESSINFORMATION"
  async function changeTermsOfUser() {
    let dadosRegistro = "";
    if (checked) {
      dadosRegistro = { ...register, terms_of_use: "true" };
    } else {
      dadosRegistro = { ...register, terms_of_use: "false" };
    }
    setRegister(dadosRegistro);

    // await StorageController.removeItem(REGISTER);
    await AsyncStorage.setItem(REGISTER, JSON.stringify(dadosRegistro));
    navigation.navigate("AccessInformation");
  }

  return (
    <View style={styles.fixed}>
      <StatusBar hidden={false} style="light" />
      <ImageBackground
        source={fundo}
        resizeMode="cover"
        style={styles.ImageContainer}
      >
        <View style={styles.background}>
          <View style={styles.margem}>
            <View style={styles.containerUpper}>
              <View style={styles.goBack}>
                <MaterialCommunityIcons
                  onPress={changeTermsOfUser}
                  name="arrow-left"
                  size={25}
                  color="white"
                />
              </View>
              <View style={{ alignItems: "center", height: "5%" }}>
                <Image
                  style={styles.logo}
                  source={require("../image/logo.png")}
                />
              </View>
              <View style={styles.modal}>
                <View style={styles.modalMargin}>
                  <View style={{ height: "8%" }}>
                    <Text style={styles.title}>Termos de uso</Text>
                  </View>
                  <View style={{ height: "95%" }}>
                    <ScrollView>
                      <Text>{term}</Text>
                    </ScrollView>
                  </View>
                </View>
              </View>
              <View style={styles.checkboxView}>
                <Checkbox
                  style={styles.checkbox}
                  value={checked}
                  // disabled="true"
                  onValueChange={() => setChecked(!checked)}
                  color={checked ? "rgba(0, 85, 124, 0.5)" : "#FFFFFF"}
                />
                <Text style={styles.TextConnected}>Aceitar termos de uso</Text>
              </View>
            </View>
            <View style={styles.containerBotton}>
              <Button
                mode="contained"
                disabled={!checked}
                contentStyle={!checked ? styles.buttonDisabled : styles.button}
                labelStyle={
                  !checked
                    ? { color: "rgba(255, 255, 255, 0.4)" }
                    : { color: "white" }
                }
                onPress={changeTermsOfUser}
              >
                próximo
              </Button>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
