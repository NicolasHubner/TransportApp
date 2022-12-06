import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ModalVisitMission from "./Modals/ModalVisitMission";
import { CommonActions } from "@react-navigation/native";
import ModalContact from "./Modals/ModalContact";
import { Button } from "react-native-paper";
import colors from "../utils/colors";
import crashlytics from '@react-native-firebase/crashlytics';
// import ModalTipe from "./Modal";

export default function ListItens({
  navigation,
  mission,
  travelId,
  insucesso,
  token,
  func,
}) {
  let local = mission;
  // console.log("mission", mission);
  let contact = null;

  if (local?.contact) {
    contact = local?.contact;
  }

  const [modalContatoVisible, setModalContatoVisible] = useState(false);
  const [modalVisitMission, setModalVisitMission] = useState(false);

  const showModalVisit = () => setModalVisitMission(true);
  const hideModalVisit = () => setModalVisitMission(false);

  const showModalContato = () => setModalContatoVisible(true);
  const hideModalContato = () => setModalContatoVisible(false);

  // REDIRECIONA PARA A TELA "LOCALS"
  const goToDestine = async () => {
    try {
      // await StorageController.saveNewLocal(local.travel_local_id);
      console.log('LOCAL -------->', travelId);
      hideModalVisit();
      navigation.dispatch(
        CommonActions.navigate({
          name: "Locals",
          params: travelId,
        })
      );
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: "20%",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={
              local.type === "collect"
                ? require("../pages/Missions/image/collect.png")
                : require("../pages/Missions/image/delivery.png")
            }
          />
          <Text style={styles.text}>
            {local.type === "collect" ? "Coleta" : "Entrega"}
          </Text>
        </View>
        <View style={{ width: "60%" }}>
          <Text style={[styles.subTitle, { color: "#3E3E3E" }]}>
            {local.contact?.name}
          </Text>
          <Text style={styles.text}>{local.address}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>
              NF{" "}
              {local.document?.map(
                (value, index) => (index > 0 ? ", " : "") + value.invoiceNumber
              )}
            </Text>
            <Text style={styles.text}>Quantidade: {local.quantity}</Text>
          </View>
        </View>
        {insucesso && (
          <View
            style={{
              width: "20%",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={25}
              color={"#E23E5C"}
            />
            <Text style={styles.text}>Insucesso</Text>
          </View>
        )}
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
        }}
      >
        <View style={{ width: "80%" }}>
          <Text style={styles.text}>{local.description ? '"'+local.description+'"' : ''}</Text>
        </View>
      </View>
      <View style={{ width: "60%", margin: 10 }}>
        <Button
          contentStyle={styles.button}
          mode="contained"
          labelStyle={{ color: "white", fontSize: 10 }}
          onPress={showModalContato}
        >
          contatar
        </Button>
      </View>
      <Modal
        transparent={true}
        visible={modalContatoVisible}
        dismissable={false}
      >
        <ModalContact
          func={func}
          func2={showModalVisit}
          local={local}
          token={token}
          insucesso={insucesso}
          hideModal={hideModalContato}
        ></ModalContact>
      </Modal>
      <Modal transparent={true} visible={modalVisitMission} dismissable={false}>
        <ModalVisitMission func={goToDestine}></ModalVisitMission>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  header: {
    flex: 1,
    width: "100%",
  },

  body: {
    flex: 15,
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },

  rectangle: {
    width: "100%",
    height: "15%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%",
    backgroundColor: colors.primary1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.backgroundHeader,
  },

  text: {
    fontSize: 10,
    fontWeight: "400",
    color: colors.text,
    margin: 1,
  },

  fundo: {
    height: "85%",
    width: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  list: {
    top: "-8%",
    position: "absolute",
    zIndex: 1,
    height: "108%",
    width: "95%",
  },

  backgroundCard: {
    width: "95%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginVertical: 10,
  },

  card: {
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginVertical: 5,
    padding: 5,
  },

  image: {
    width: 46,
    height: 34,
  },

  button: {
    height: 30,
  },

  button2: {
    height: 40,
  },
});
