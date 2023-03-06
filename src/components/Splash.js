import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from "react-native";
import fundo from "../assets/images/background.png";
import { Button } from "react-native-paper";
import LocationController from "../controllers/LocationController";
import BackgroundTaskController from "../controllers/BackgroundTaskController";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export default function Splash({ setIsLoading = () => {}, opening }) {
  const [showModal, setShowModal] = useState(false);

  async function getPermissions() {
    await BackgroundTaskController.unregisterAllTasksAsync();
    const a =
      await LocationController.verificaAutorizacaoBackgroundLocalizacao();
    const b = await LocationController.verificaAtivacaoLocalizacao();
    const c = await BackgroundTaskController.requestBackgroundPermissions();
    console.log(`permissions: a:${a} - b:${b} - c:${c}`);
    // //ENVIA OS DADOS DA LOCALIZAÇÃO A CADA 30S
    if (a && b && c) {
      console.log("Splash vai iniciar pedido e envio posições...");

      const locationService =
        await BackgroundTaskController.startLocationTracking();
      const sendService = await BackgroundTaskController.startLocationSending();
      console.log(
        `locationService: ${locationService}, sendService: ${sendService}`
      );
    }
  }

  // Define o estado 'isLoading' no index como false para ir na tela de login
  async function goLogin() {
    await getPermissions();
    setIsLoading(false);
  }

  //  Ao clicar em 'Ativar a localização' no modal o sistema pede a autorização e vai para o login
  async function closeModal() {
    setShowModal(false);
    goLogin();
  }

  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted) {
        const background = await Location.requestBackgroundPermissionsAsync();
        if (background.granted) {
          const camera = await ImagePicker.requestCameraPermissionsAsync(); //verifica PERMISSAO
          if (camera.granted) {
            const media = await ImagePicker.requestMediaLibraryPermissionsAsync(); //verifica permissao
            if (media.granted) goLogin();
          }
        }
      }
    };
    requestPermissions();
  }, []);

  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.background}>
        <Image
          style={styles.stretch}
          source={require("../assets/images/logo.png")}
        />
        <ActivityIndicator size="large" color="white" />
        <Modal transparent={true} visible={showModal} dismissable={false}>
          <View style={styles.modal}>
            <View style={styles.modalLocal}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.textModal}>
                  A Trouw coleta dados da localização para ativar o recurso de
                  monitoramento e rastreio de entregas/coletas, mesmo quando o
                  app está em segundo plano ou em uso.
                </Text>
              </View>
              <View>
                <Image source={require("../assets/images/alert_gps.png")} />
              </View>
              <View>
                <Button
                  contentStyle={styles.buttonContent}
                  style={styles.button}
                  mode="contained"
                  labelStyle={{ color: "white" }}
                  onPress={() => closeModal()}
                >
                  ATIVAR PERMISSÃO
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
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
    resizeMode: "stretch",
    marginBottom: 40,
  },
  modalLocal: {
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    height: "70%",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 5,
  },
  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  textModal: {
    fontSize: 22,
    padding: "10%",
    marginBottom: "-10%",
  },
  buttonContent: {
    height: 40,
    width: "100%",
    backgroundColor: "#275D85",
    borderColor: "#275D85",
  },
  button: {
    borderRadius: 50,
    width: "100%",
    marginBottom: "10%",
  },
  buttonReport: {
    marginTop: 15,
    backgroundColor: "white",
  },
});
