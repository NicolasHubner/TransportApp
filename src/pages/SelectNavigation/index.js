import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  Pressable,
  Alert,
  BackHandler,
  Modal,
  Linking,
} from "react-native";
import {
  APP_NAVIGATION,
  TOKEN_KEY,
  LOCAL_COORD,
  LAST_LOCATION,
} from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalReopen from "../../components/Modals/ModalReopen";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Loading from "../../components/Loading";
import { api } from "../../services/api";
import Checkbox from "expo-checkbox";
import { format } from "date-fns";
import styles from "./styles";

export default function SelectNavigation({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [checkedWaze, setCheckedWaze] = useState(false);
  const [checkedAndroid, setCheckedAndroid] = useState(false);
  const [checkedIos, setCheckedIos] = useState(false);
  const [local, setLocal] = useState();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [reopenVisible, setReopenVisible] = useState(false);
  const [navigationRoutes, setNavigationRoutes] = useState({});
  const [originType, setOriginType] = useState('');
  const [map, setMap] = useState();
  const [destiny, setDestiny] = useState(false);
  const [travel, setTravel] = useState(null);
  const [tokenKey, setTokenKey] = useState("");

  // DEFINE O ESTADO DO MODAL
  const showModalReopen = () => setReopenVisible(true);
  const hideModalReopen = () => setReopenVisible(false);

  // VERIFICA SE O USUARIO APERTOU O BOTÃO DE VOLTAR
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  // SE O USUARIO APERTOU O BOTÃO DE VOLTAR APARECERÁ O MODAL
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      showModalReopen
    );

    return () => backHandler.remove();
  }, []);

  // FUNÇÃO INICIAL PARA PEGAR TODAS AS INFORMAÇÕES PARA A RENDERIZAÇÃO DA TELA
  // VERIFICANDO E TRATANDO AS INFORMAÇÕES PASSADAS ATRAVES DO ROUTE.PARAMS
  async function init() {
    try {
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      setTokenKey(token);
      const nav = await StorageController.buscarPorChave(APP_NAVIGATION);
      let routeParams = await navigation.getState();
      if (nav) {
        if (nav === "android") {
          setCheckedAndroid(true);
        } else if (nav === "waze") {
          setCheckedWaze(true);
        } else if (nav === "ios") {
          setCheckedIos(true);
        }
        setMap(nav);
      }

      if (route?.params?.localId) {
        let id = route.params.localId;
      }

      let arrayRoutes = routeParams.routes;
      arrayRoutes.map((value, index) => {
        if (value.name === "SelectNavigation") {
          if (value?.params?.localId) {
            id = value.params.localId;
          }
          if (value?.params?.destiny) {
            setDestiny(true);
          }
        }
      });
      if (route?.params?.goBack) {
        console.log("tem goBack");
        let travelId = route.params.goBack;
        setTravel(travelId);
        if (route?.params?.originType) {
          let originType = route.params.originType;
          setOriginType(originType);
        }
      }
      setLocal(id);

      const response = await api.get(`/app/travel/local/${id}/navigation`, {
        headers: { Authorization: `bearer ${token}` },
      });

      if (response) {
        setNavigationRoutes(response.data.data);
        const coord = {
          latitude: JSON.parse(response.data.data.lat),
          longitude: JSON.parse(response.data.data.long),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        StorageController.salvarPorChave(LOCAL_COORD, JSON.stringify(coord));
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status == "404") {
        Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } else if (error.message) {
        Alert.alert("Aviso", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        navigation.navigate("Trips");
      }
    } finally {
      setIsBusy(false);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE INICIALIZA A TELA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // ALTERA O STATUS DO LOCAL PARA "PENDENTE"
  async function cancelLocalProcess() {
    try {
      setLoading(true);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      const response = await api.post(
        `/app/travel/local/${local}/change-status`,
        { status: "PENDENTE", uuid_group: true },
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (response.data.success) {
        navigation.navigate("LocalDetails", local);
      }
    } catch (error) {
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
      hideModalReopen();
      setLoading(false);
    }
  }

  // ALTERA O STATUS DA VIAGEM PARA "PENDENTE"
  async function cancelTravelProcess() {
    try {
      setLoading(true);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
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

      const response = await api.post(
        `/app/travel/${travel}/change-status`,
        objSend,
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (response.data.success) {
        navigation.navigate("TripDetails", travel);
      }
    } catch (error) {
      console.log(error.response);
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
      hideModalReopen();
    }
  }

  //  REDIRECIONA PARA O MAPA ESCOLHIDO
  async function goNavigation(platform) {
    try {
      let option = null;
      if (checkedAndroid) {
        option = "android";
      } else if (checkedWaze) {
        option = "waze";
      } else if (checkedIos) {
        option = "ios";
      }

      if (option) {
        await StorageController.salvarPorChave(APP_NAVIGATION, option);
      } else {
        await StorageController.removePorChave(APP_NAVIGATION);
      }

      let params = {
        local: local,
        platform: platform,
      };

      if (travel) {
        params = { ...params, travel: travel };
      }

      if (option === null) {
        option = platform;
      }

      if (option === "waze") {
        Linking.openURL(navigationRoutes.wazer);
      } else if (option === "android") {
        Linking.openURL(navigationRoutes.google_maps);
      } else if (option === "ios") {
        Linking.openURL(navigationRoutes.apple_maps);
      }

      if (travel && originType === 'ORIGEM') {
        navigation.navigate("OriginMap", params);
      } else {
        navigation.navigate("ExpandedMap", params);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header
            navigation={navigation}
            rota={travel ? "TripDetails" : "LocalDetails"}
            regress={travel ? "TripDetails" : "LocalDetails"}
            id={travel ? travel : local}
            destiny={destiny}
          />
        </View>
        {isBusy && (
          <View style={{ flex: 15 }}>
            <Loading></Loading>
          </View>
        )}
        {!isBusy && (
          <View style={styles.body}>
            <View style={styles.margin}>
              <View style={styles.order}>
                <Text style={styles.textOrder}>Order N.º {data.travel_id}</Text>
                <Text>Obs: {data.obs}</Text>
              </View>
              <View style={styles.image}>
                <View style={{ justifyContent: "space-between" }}>
                  <View>
                    <Text style={styles.textBold}>
                      Inicio / Fim: {data.start} às {data.end}
                    </Text>
                  </View>
                </View>
                <Image
                  style={styles.logo}
                  source={{
                    uri: data.icon,
                  }}
                ></Image>
              </View>
              <View style={styles.address}>
                <Text numberOfLines={2} style={styles.textAddress}>
                  {data.address}
                </Text>
                <Text
                  style={{ width: "35%", color: "#2F2F2F", textAlign: "right" }}
                >
                  {" "}
                  Qtd. / Itens: {data.total}
                </Text>
              </View>
              <View style={styles.maps}>
                <Pressable
                  style={styles.card}
                  onPress={() => goNavigation("waze")}
                >
                  <Image
                    style={styles.logoNavigation}
                    source={require("./Images/waze.png")}
                  />
                  <Text style={styles.fontLocation}>Waze</Text>
                  <View style={styles.checkboxView}>
                    <Checkbox
                      style={styles.checkbox}
                      value={checkedWaze}
                      onValueChange={() => {
                        setCheckedWaze(!checkedWaze),
                          setCheckedAndroid(false),
                          setCheckedIos(false);
                      }}
                      color={checkedWaze ? "#275D85" : "#2E2E2E"}
                    />
                    <Text style={{ fontSize: 10 }}>Definir padrão</Text>
                  </View>
                </Pressable>
                {Platform.OS === "android" && (
                  <Pressable
                    style={styles.card}
                    onPress={() => goNavigation("android")}
                  >
                    <Image
                      style={styles.logoNavigation}
                      source={require("./Images/gmaps.png")}
                    />
                    <Text style={styles.fontLocation}>Google Maps</Text>
                    <View style={styles.checkboxView}>
                      <Checkbox
                        style={styles.checkbox}
                        value={checkedAndroid}
                        // disabled="true"
                        onValueChange={() => {
                          setCheckedAndroid(!checkedAndroid),
                            setCheckedWaze(false),
                            setCheckedIos(false);
                        }}
                        color={checkedAndroid ? "#275D85" : "#2E2E2E"}
                      />
                      <Text style={{ fontSize: 10 }}>Definir padrão</Text>
                    </View>
                  </Pressable>
                )}
                {Platform.OS === "ios" && (
                  <Pressable
                    style={styles.card}
                    onPress={() => goNavigation("ios")}
                  >
                    <Image
                      style={styles.logoNavigation}
                      source={require("./Images/imaps.png")}
                    />
                    <Text style={styles.fontLocation}>Apple Maps</Text>
                    <View style={styles.checkboxView}>
                      <Checkbox
                        style={styles.checkbox}
                        value={checkedIos}
                        onValueChange={() => {
                          setCheckedIos(!checkedIos),
                            setCheckedAndroid(false),
                            setCheckedWaze(false);
                        }}
                        color={checkedIos ? "#275D85" : "#2E2E2E"}
                      />
                      <Text style={{ fontSize: 10 }}>Definir padrão</Text>
                    </View>
                  </Pressable>
                )}
              </View>
              <View style={styles.noNavigation}>
                <Button
                  mode="text"
                  labelStyle={{ color: "#275D85", fontSize: 16 }}
                  onPress={() => goNavigation(null)}
                >
                  NÃO USAR NAVEGADOR
                </Button>
              </View>
            </View>
          </View>
        )}
        <View style={styles.footer}>
          <Footer />
        </View>
      </SafeAreaView>
      <Modal transparent={true} visible={reopenVisible} dismissable={false}>
        <ModalReopen
          type={travel ? "travel" : "local"}
          hideModal={hideModalReopen}
          reopen={travel ? cancelTravelProcess : cancelLocalProcess}
          loading={loading}
          travelId={travel ? travel : null}
          token={tokenKey}
        ></ModalReopen>
      </Modal>
    </>
  );
}
