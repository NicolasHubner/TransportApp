import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  Pressable,
  Alert,
  Modal,
  BackHandler,
} from "react-native";
import {
  TOKEN_KEY,
  APP_NAVIGATION,
  MERGED_LOCALS,
  LAST_LOCATION,
  DESTINY_PAGE,
} from "../../constants/constants";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalReopen from "../../components/Modals/ModalReopen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Checkbox } from "react-native-paper";
import Loading from "../../components/Loading";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { api } from "../../services/api";
import { format } from "date-fns";
import styles from "./styles";
import crashlytics from '@react-native-firebase/crashlytics';

export default function Locals({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [travel, setTravel] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reopenVisible, setReopenVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [tokenKey, setTokenKey] = useState("");

  const showModalReopen = () => setReopenVisible(true);
  const hideModalReopen = () => setReopenVisible(false);

  // VERIFICA SE O BOTÃO DE VOLTAR FOI ACIONADO
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  // SE O BOTÃO DE VOLTAR FOI ACIONADO MOSTRA UM MODAL
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      showModalReopen
    );

    return () => backHandler.remove();
  }, []);

  // FAZ A REQUISIÇÃO PARA PEGAR TODOS OS LOCAIS POR ID
  async function init() {
    try {
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      setTokenKey(token);
      // const nav = await StorageController.buscarPorChave(APP_NAVIGATION);
      const id = await route.params;
      if (id) {
        setTravel(id);
      }
      const response = await api.get(`/app/travel/${id ? id : travel}/locals`, {
        headers: { Authorization: `bearer ${token}` },
      });
      // console.log("quando chega na lista de locais --->", response);
      if (response) {
        let destiny = await StorageController.buscarPorChave(DESTINY_PAGE);
        if (destiny) {
          destiny = JSON.parse(destiny);
          navigation.navigate("SelectNavigation", {
            localId: destiny.data.localId,
            destiny: true,
          });
        } else {
          let arrayTrips = response.data.data;
          // console.log("lista de locais --->", arrayTrips);
          arrayTrips.map(function (item) {
            if (item.status == "EM ANDAMENTO") {
              // if (nav) {
              //   navigation.navigate("ExpandedMap", item.id);
              // } else {
              navigation.navigate("SelectNavigation", { localId: item.id });
              // }
            }
          });
        }
        setData(response.data.data);
      }
      // console.log(travelId.id);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.response.data);
      if (error.response.status == "404") {
        Alert.alert(
          "Aviso",
          error.response.data.data.message,
          [{ text: "OK" }],
          {
            cancelable: false,
          }
        );
      } else if (error.message) {
        if (error.code === "ECONNABORTED") {
          Alert.alert(
            "Tempo excedido",
            "Verifique sua conexão com a internet",
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        } else {
          Alert.alert("AVISO", error.message, [{ text: "OK" }], {
            cancelable: false,
          });
        }
      } else {
        navigation.navigate("Trips");
      }
    } finally {
      setIsBusy(false);
    }
  }

  // FUNÇÃO PARA MUDAR O STATUS DA VIAGEM PARA "PENDENTE" E REDIRECIONA PARA TRIP DETAILS
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
      crashlytics().recordError(error);
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

  // FAZ A FUNÇÃO INIT ASSIN QUE O APP INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // REDIRECIONA PARA A TELA DE CONTACTLOCALS
  async function openContact() {
    let data = { travel_id: travel, rote: "Locals" };
    // travel = [...travel, {rote: "Missions"}];
    navigation.navigate("ContactLocals", data);
  }

  // SALVA OS LOCAIS E REDIRECIONA PARA O LOCALDETAILS
  const saveMergedLocal = async (merge, id) => {
    try {
      await StorageController.removePorChave(MERGED_LOCALS);
      await StorageController.salvarPorChave(MERGED_LOCALS, merge);

      navigation.navigate("LocalDetails", id);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onRefresh = async () => {
    setIsFetching(true);
    init();
    setIsFetching(false);
  };

  return (
    <>
      {isBusy && <Loading></Loading>}
      {!isBusy && (
        <>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Header
                navigation={navigation}
                rota="Trips"
                regress="TripDetails"
                id={travel}
                travelId={travel}
                token={tokenKey}
              />
            </View>
            <View style={styles.body}>
              <View style={styles.rectangle}>
                <View style={styles.marginRectangle}>
                  <Text style={styles.title}>Locais de Entrega / Coleta</Text>
                  <Text style={styles.title}>Order N.º {travel}</Text>
                </View>
              </View>
              <View style={styles.fundo}></View>
              <View style={styles.list}>
                <View style={{ height: "7%", width: "100%" }}></View>
                <View style={{ height: "93%", alignItems: "center" }}>
                  <FlatList
                    data={data}
                    onRefresh={onRefresh}
                    refreshing={isFetching}
                    style={{ marginHorizontal: 3 }}
                    keyExtractor={(data) => String(data.id)}
                    showsVerticalScrollIndicator={false}
                    // onEndReachedThreshold={0.2}
                    // onEndReached={exibirBotao}
                    renderItem={({ item: data }) => (
                      <View style={styles.background}>
                        <Pressable
                          style={{ marginVertical: 8 }}
                          disabled={
                            data.status != "PENDENTE" &&
                            data.status != "EM ANDAMENTO"
                          }
                          onPress={() => saveMergedLocal(data.merged, data.id)}
                        >
                          <View style={styles.item}>
                            {data.status != "PENDENTE" &&
                              data.status != "EM ANDAMENTO" && (
                                <View style={styles.shadow}></View>
                              )}
                            <View
                              style={{
                                justifyContent: "space-between",
                                width: "75%",
                              }}
                            >
                              <View style={{ width: "96%", height: 40 }}>
                                <Text style={styles.endereco}>
                                  {data.address}
                                </Text>
                              </View>
                              <Text>
                                {!data.qty_delivery
                                  ? ""
                                  : data.qty_delivery > 1
                                  ? `${data.qty_delivery} Entregas`
                                  : `${data.qty_delivery} Entrega`}
                                {data.qty_delivery && data.qty_collect
                                  ? " / "
                                  : ""}
                                {!data.qty_collect
                                  ? ""
                                  : data.qty_collect > 1
                                  ? `${data.qty_collect} Coletas`
                                  : `${data.qty_collect} Coleta`}
                              </Text>
                            </View>
                            <View
                              style={{
                                justifyContent: "flex-end",
                                width: "25%",
                              }}
                            >
                              {data.status_missions === "success" && (
                                <Pressable
                                  onPress={openContact}
                                  style={styles.statusGreen}
                                >
                                  <Text style={styles.textStatus}>
                                    Confirmadas
                                  </Text>
                                </Pressable>
                              )}
                              {data.status_missions === "warning" && (
                                <Pressable
                                  onPress={openContact}
                                  style={styles.statusYellow}
                                >
                                  <Text style={styles.textStatus}>
                                    {data.confirmed_missions}/
                                    {data.total_missions}
                                  </Text>
                                  <Text style={styles.textStatus}>
                                    Confirmadas
                                  </Text>
                                </Pressable>
                              )}
                              {data.status_missions === "danger" && (
                                <Pressable
                                  onPress={openContact}
                                  style={styles.statusRed}
                                >
                                  <Text style={styles.textStatus}>
                                    {data.confirmed_missions}/
                                    {data.total_missions}
                                  </Text>
                                  <Text style={styles.textStatus}>
                                    Confirmadas
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Footer />
            </View>
          </SafeAreaView>
          <Modal transparent={true} visible={reopenVisible} dismissable={false}>
            <ModalReopen
              type="travel"
              hideModal={hideModalReopen}
              reopen={cancelTravelProcess}
              loading={loading}
              travelId={travel}
              token={tokenKey}
            ></ModalReopen>
          </Modal>
        </>
      )}
    </>
  );
}
