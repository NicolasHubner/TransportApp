import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import {
  ARRIVAL_NOTIFICATION,
  LOCAL_COORD,
  LOCAL_ID,
  TOKEN_KEY,
  TRAVEL_ID,
  LAST_LOCATION,
  EVENT_TYPE,
} from "../constants/constants";
import AuthContext from "../contexts/auth";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-paper";
import colors from "../utils/colors";
import { api } from "../services/api";
import StorageController from "../controllers/StorageController";
import ModalReopen from "./Modals/ModalReopen";
import ModalLogoff from "./Modals/ModalLogoff";
import { expo } from "../../app.config.json";
import { format } from "date-fns";
import NetInfo from "@react-native-community/netinfo";
import crashlytics from "@react-native-firebase/crashlytics";
import { EventsController } from "../controllers/EventsController";
import { AuthController } from "../controllers/AuthController";
import ModalNoConnectionInternet from "./Modals/NewModals/NoConnectionInternet";

export default function Header({
  navigation,
  rota,
  regress,
  id,
  parameter,
  travelId,
  localRegress,
  returnAlert,
  destiny,
}) {
  const [logoffVisible, setLogoffVisible] = useState(false);
  const [navigationVisible, setNavigationVisible] = useState(false);
  const [localsVisible, setLocalsVisible] = useState(false);
  const [tokenKey, setTokenKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [noNetwork, setNoNetwork] = useState(false);

  //Modal de conexão de internet
  const [modalNoConnection, setModalNoConnection] = useState(false);


  const { signOut } = useContext(AuthContext);

  const showModalLogoff = () => setLogoffVisible(true);
  const hideModalLogoff = () => setLogoffVisible(false);

  const showModalNavigation = () => setNavigationVisible(true);
  const hideModalNavigation = () => setNavigationVisible(false);

  const showModalLocals = () => setLocalsVisible(true);
  const hideModalLocals = () => setLocalsVisible(false);

  // SETA O VALOR DO TOKEN
  async function init() {
    crashlytics().log("Updating user count.");
    try {
      const token = await AuthController.getToken();
      setTokenKey(token);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  }

  useEffect(() => {
    getInternetStatus();
    init();
  }, []);

  useEffect(() => {
    if (noNetwork) {
      setModalNoConnection(true);
    } else {
      setModalNoConnection(false);
    }
  }, [noNetwork]);

  async function logoutProcess() {
    try {
      signOut();
    } catch (error) {
      crashlytics().recordError(error);
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  }

  async function cancelLocalProcess() {
    try {
      setLoading(true);
      await StorageController.removePorChave(LOCAL_COORD);
      await StorageController.removePorChave(ARRIVAL_NOTIFICATION);

      const response = await EventsController.postEvent(
        EVENT_TYPE.LOCAL_CHANGE_STATUS,
        tokenKey,
        `/local/${id}/change-status`,
        { status: "PENDENTE", uuid_group: true },
        id
      );

      if (response.data.success) {
        await StorageController.removePorChave(LOCAL_ID);
        if (regress === "LocalDetails") {
          navigation.navigate("LocalDetails", id);
        } else if (regress === "Locals") {
          navigation.navigate("Locals", travelId);
        }
        hideModalNavigation();
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        Alert.alert("AVISO", error.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("AVISO", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function cancelTravelProcess() {
    try {
      setLoading(true);
      const token = await AuthController.getToken();
      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      let objSend = {
        status: "PENDENTE",
        event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        latitude: lastLocation?.lat,
        longitude: lastLocation?.long,
      };

      const response = await EventsController.postEvent(
        EVENT_TYPE.TRAVEL_CHANGE_STATUS,
        token,
        `/travel/${id}/change-status`,
        objSend,
        id
      );

      if (response.data.success) {
        await StorageController.removePorChave(TRAVEL_ID);
        navigation.navigate("TripDetails", id);
        hideModalLocals();
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response.data.message) {
        Alert.alert("AVISO", error.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } else if (error.response.data.errors[0]) {
        Alert.alert("AVISO", error.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("AVISO", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function showModals() {
    if (regress === "logoff") {
      showModalLogoff();
    } else if (regress === "LocalDetails") {
      showModalNavigation();
    } else if (regress === "Locals") {
      showModalNavigation();
    } else if (regress === "TripDetails") {
      showModalLocals();
    }
  }

  const functionReturn = async () => {
    if (!returnAlert) {
      if (regress) {
        showModals();
      } else {
        parameter
          ? navigation.navigate(rota, parameter)
          : navigation.navigate(rota);
      }
    } else {
      Alert.alert(
        "Aviso",
        "Não é possível retornar após ter inciado a entrega/coleta.\nFinalize ou registre um insucesso",
        [{ text: "OK" }],
        {
          cancelable: false,
        }
      );
    }
  };

  const getInternetStatus = () => {
    try {
      NetInfo.addEventListener((networkState) => {
        console.log("Connection type - ", networkState?.type);
        console.log("Is connected? - ", networkState?.isConnected);
        console.log(
          "isInternetReachable? - ",
          networkState?.isInternetReachable
        );
        setNoNetwork(!networkState?.isInternetReachable);
      });
    } catch (error) {
      crashlytics().recordError(error);
      console.log("getInternetStatus:err", error);
    }
  };

  return (
    <>
      <StatusBar
        hidden={false}
        backgroundColor={colors.primary1}
        style="light"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.goBack}>
            {!destiny && (
              <Pressable onPress={functionReturn}>
                <MaterialCommunityIcons
                  onPress={functionReturn}
                  name={regress === "logoff" ? "logout" : "arrow-left"}
                  size={25}
                  color={colors.black}
                />
              </Pressable>
            )}
          </View>
          <Image
            style={styles.stretch}
            source={require("../assets/images/logo_transparente.png")}
          />
          <Text style={{ color: "#ababab" }}>v {expo.version}</Text>
        </View>
      </View>
      {noNetwork && (
        <View style={styles.internetStatusNotification}>
          <Feather
            name="wifi-off"
            size={15}
            color='white'
          />
          <Text style={styles.internetStatusNotificationText}>Sem conexão</Text>
        </View>
      )}

      <Modal transparent={true} visible={logoffVisible} dismissable={false}>
        <ModalLogoff
          hideModal={hideModalLogoff}
          logoff={logoutProcess}
        ></ModalLogoff>
      </Modal>
      <Modal transparent={true} visible={navigationVisible} dismissable={false}>
        <ModalReopen
          type="local"
          hideModal={hideModalNavigation}
          reopen={cancelLocalProcess}
          loading={loading}
          localRegress={localRegress}
        ></ModalReopen>
      </Modal>
      <Modal transparent={true} visible={localsVisible} dismissable={false}>
        <ModalReopen
          type="travel"
          hideModal={hideModalLocals}
          reopen={cancelTravelProcess}
          loading={loading}
          travelId={travelId}
          token={tokenKey}
        ></ModalReopen>
      </Modal>
      <Modal transparent={true} visible={modalNoConnection} dismissable={false}>
        <ModalNoConnectionInternet
        setModalNoConnection={setModalNoConnection}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: colors.backgroundHeader,
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#3E3E3E",
    fontFamily: "Roboto",
  },

  header: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  goBack: {
    width: "15%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  stretch: {
    marginLeft: 18,
    height: 31,
    width: 229,
    resizeMode: "stretch",
  },
  internetStatusNotification: {
    height: 20,
    width: "100%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    zIndex: 1000,
    flexDirection: "row",
  },
  internetStatusNotificationText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
