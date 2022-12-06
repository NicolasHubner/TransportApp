import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AuthContext from "../../contexts/auth";
import { Button } from "react-native-paper";
import crashlytics from '@react-native-firebase/crashlytics';

export default function ModalFinishTravel({ hideModal, navigation }) {
  const { signOut } = useContext(AuthContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  // CHAMA A FUNÇÃO DE LOGOUT DO USUÁRIO
  async function logoutProcess() {
    setButtonLoading(true);
    try {
      signOut();
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      hideModal();
    }
  }
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.textModal}>
            Você
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              {" "}
              finalizou{" "}
            </Text>
            <Text>sua viagem!</Text>
          </Text>
        </View>
        <View style={styles.containerImage}>
          <Image style={styles.imageModal} source={require("../image/endTrip.png")} />
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button}
            mode="contained"
            disabled={buttonLoading}
            labelStyle={{ color: "white" }}
            onPress={() => {hideModal(), navigation.navigate("Trips")}}
          >
            voltar para a lista de viagens
          </Button>
          <Button
            contentStyle={[styles.button, { marginTop: 10 }]}
            mode="text"
            disabled={buttonLoading}
            loading={buttonLoading}
            // labelStyle={{ color: "white" }}
            onPress={logoutProcess}
          >
            sair do aplicativo
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContainer: {
    alignItems: "center",
    justifyContent:"space-around",
    width: '92%',
    height: '72%',
    backgroundColor: "white",
    padding: '5%',
    elevation: 5,
    borderRadius: 5,
  },

  textModal: {
    fontSize: 22,
  },

  imageModal: {
    resizeMode: "contain",
    width: 187,
    height: 145
  },

  buttonModal: {
    width: "100%",
  },

  button: {
    height: 40,
  },
});
