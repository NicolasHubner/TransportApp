//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  22.12.22 - TIAKI
//      - adicao do ModalLogoff
//      - adicao do metodo logoutProcess 
//
//*************************************************************************** */

import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, ImageBackground, Modal, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import fundo from "../../assets/images/background.png";
import { REGISTER } from "../../constants/constants";
import { Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import colors from "../../utils/colors";
import styles from "../Begin/styles";

import * as TaskManager from "expo-task-manager";
import ModalLogoff from "../../components/Modals/ModalLogoff";
import crashlytics from '@react-native-firebase/crashlytics';

export default function Begin({ navigation, route }) {

  const [logoffVisible, setLogoffVisible] = useState(false);
  const showModalLogoff = () => setLogoffVisible(true);
  const hideModalLogoff = () => setLogoffVisible(false);

  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [checked, setChecked] = useState(false);

  async function logoutProcess() {
    try {
      TaskManager.unregisterAllTasksAsync();  // Cancela registros
      console.log("Desfez registros de tasks antes de sair da tela de abertura!");
      BackHandler.exitApp();
    } catch (error) {
      console.log("Erro ao desfazer registros de tasks antes de sair da tela de abertura!");
      crashlytics().recordError(error);
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  }

  // REMOVE OS DADOS DE REGISTRO DO CACHE
  async function init() {
    await AsyncStorage.removeItem(REGISTER);

    try {
      const modalLogoff = await route?.params?.back
      console.log(modalLogoff);
      if (modalLogoff) {
        showModalLogoff()
      }

    } catch (erro) {
      console.log("não há parametros na rota erro:", erro);
    }
  }

  ///
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", logoutProcess);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", logoutProcess);
  }, []);
  ///

  const backAction = () => {
    logoutProcess();
    return true;
  };

  // RODA O INIT ASSIM QUE A PÉGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });
    //...

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
      unsubscribe;
    }
    //...

    // return unsubscribe;
  }, [navigation, route.params]);

  return (
    <>
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
      <Modal transparent={true} visible={logoffVisible} dismissable={false}>
        <ModalLogoff
          hideModal={hideModalLogoff}
          logoff={logoutProcess}
        ></ModalLogoff>
      </Modal>
    </>
  );
}