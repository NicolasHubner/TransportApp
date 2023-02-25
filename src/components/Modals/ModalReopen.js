import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Loading from "../Loading";
import { api } from "../../services/api";
import crashlytics from '@react-native-firebase/crashlytics';
import { TravelController } from "../../controllers/TravelController";

export default function ModalReopen({
  type,
  hideModal,
  reopen,
  loading,
  travelId,
  token,
  localRegress
}) {
  const [regress, setRegress] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  // PEGA OS LOCAIS PENDENTES 
  async function init() {
    try {
      if (localRegress) {
        setRegress(false);
      }
      if (travelId) {
        const response = await TravelController.checkLocalsPendent(travelId);
        console.log(response);
        if (!response) {
            setRegress(false);
Í        }
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.response.data);
    } finally {
      setisLoading(false);
    }
  }

  // FAZ O INIT ASSIM QUE PÁGINA INICIALIZA
  useEffect(() => {
    init();
  });

  return (
    <View style={styles.modal}>
      {isLoading && <Loading />}
      {!isLoading && regress && (
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.textModal}>
              Ao voltar, você torna {type === "travel" ? "a viagem" : "o local"}{" "}
              novamente
              <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                {" "}
                pendente
              </Text>
              <Text>, deseja voltar?</Text>
            </Text>
          </View>
          <View style={styles.containerImage}>
            <Image
              style={styles.image}
              source={require("../image/return.png")}
            />
          </View>
          <View style={styles.buttonModal}>
            <Button
              loading={loading}
              disabled={loading}
              contentStyle={styles.button}
              mode="contained"
              labelStyle={{ color: "white" }}
              onPress={() => {
                reopen();
              }}
            >
              {type === "travel" ? "voltar" : "voltar para lista de locais"}
            </Button>
            <Button
              disabled={loading}
              contentStyle={[styles.button, { marginTop: 10 }]}
              mode="text"
              onPress={() => {
                hideModal();
              }}
            >
              {type === "travel" ? "continuar viagem" : "continuar"}
            </Button>
          </View>
        </View>
      )}
      {!isLoading && !regress && (
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.textModal}>
              Não é possivel retornar pois {type === "travel" ? "a viagem" : "o local"} já está
              <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                {" "}
                em andamento!
              </Text>
            </Text>
          </View>
          <View style={styles.containerImage}>
            <Image
              style={styles.image}
              source={require("../image/return.png")}
            />
          </View>
          <View style={styles.buttonModal}>
            <Button
              disabled={loading}
              contentStyle={styles.button}
              mode="contained"
              onPress={() => {
                hideModal();
              }}
            >
              {type === "travel" ? "continuar viagem" : "continuar"}
            </Button>
          </View>
        </View>
      )}
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
    justifyContent: "space-around",
    width: "92%",
    height: "72%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  textModal: {
    fontSize: 22,
  },

  image: {
    resizeMode: "contain",
    width: 187,
    height: 145,
  },

  buttonModal: {
    width: "100%",
  },
});
