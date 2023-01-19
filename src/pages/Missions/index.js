import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  Alert,
  BackHandler,
  Modal,
} from "react-native";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalReopen from "../../components/Modals/ModalReopen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  IMAGE_PHOTO,
  IMAGE_RECEIPT,
  MERGED_LOCALS,
  TOKEN_KEY,
} from "../../constants/constants";
import { Button } from "react-native-paper";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { api } from "../../services/api";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";
import { TravelController } from "../../controllers/TravelController";

export default function Missions({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [trip, setTrip] = useState({});
  const [locals, setLocals] = useState([]);
  const [sucesso, setSucesso] = useState(true);
  const [travelId, setTravelId] = useState("");
  const [local, setLocal] = useState({});
  const [missions, setMissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [localId, setLocalId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [reopenVisible, setReopenVisible] = useState(false);

  const showModalReopen = () => setReopenVisible(true);
  const hideModalReopen = () => setReopenVisible(false);

  // VERICA SE O BOTÃO DE VOLTAR FOI ACIONADO
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  // SE O BOTÃO DE VOLTAR FOI ACIONADO O MODAL É MOSTRADO
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      showModalReopen
    );

    return () => backHandler.remove();
  }, []);

  // FAZ A REQUISIÇÃO PRA PEGAR AS MISSÕES
  async function init() {
    try {
      await StorageController.removePorChave(IMAGE_RECEIPT);
      await StorageController.removePorChave(IMAGE_PHOTO);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);

      const id = await route.params;
      setLocalId(id);

      const response = await TravelController.getLocalMissions(token, id);

      if (response) {
        // console.log('MISSIONS ---->', response.data.data.missions);
        setTravelId(response.travel_id);
        setLocal(response.local);
        setMissions(response.missions);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
      if (error.response.data) {
        Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
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
      }
    } finally {
      setIsBusy(false);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE A PÁGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focus");
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // MUDA O STATUS DO LOCAL PARA PENDENTE E REDIRECIONA PARA A PÁGINA LOCALS
  async function cancelLocalProcess() {
    try {
      setLoading(true);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      const response = await api.post(
        `/local/${localId}/change-status`,
        { status: "PENDENTE", uuid_group: true },
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (response.data.success) {
        navigation.navigate("Locals", travelId);
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        Alert.alert("AVISO", error.response.data.message, [{ text: "OK" }], {
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

  // FUNÇÃO DE REFRESH DA PÁGINA
  const onRefresh = async () => {
    setIsFetching(true);
    init();
    setIsFetching(false);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header
            navigation={navigation}
            rota="Locals"
            regress="Locals"
            id={localId}
            travelId={travelId}
            localRegress={true}
          />
        </View>
        {isBusy && (
          <View style={{ flex: 15 }}>
            <Loading></Loading>
          </View>
        )}
        {!isBusy && (
          <View style={styles.body}>
            <View style={styles.rectangle}>
              <View style={styles.marginRectangle}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Order N.º {travelId}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <View
                    style={{ justifyContent: "space-between", width: "75%" }}
                  >
                    <View>
                      <Text numberOfLines={2} style={styles.textBold}>
                        {local.address}
                      </Text>
                      {local.observation && (
                        <Text style={styles.textRegular}>
                          "{local.observation}"
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={styles.textRegular}>
                        Quantidade / Itens total: {local.total_missions}
                      </Text>
                      <Text style={styles.textBold}>
                        Inicio / Fim: {local.start} às {local.end}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      width: "25%",
                    }}
                  >
                    <Image
                      style={styles.logo}
                      // resizeMode="contain"
                      source={{
                        // uri: "https://t.ctcdn.com.br/tjgerGWE6Cit6CAi0o3PEcSXJ7M=/400x400/smart/filters:format(webp)/i489991.jpeg",
                        // uri: "https://media.tarkett-image.com/large/TH_24567080_24594080_24596080_24601080_24563080_24565080_24588080_001.jpg",
                        uri: local.icon,
                      }}
                    ></Image>
                    <Text style={styles.textSemiBold}>{local.date}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* <View style={styles.fundo}></View> */}
            <View style={styles.list}>
              <View style={{ height: "28%", width: "100%" }}></View>
              <View style={{ height: "72%", alignItems: "center" }}>
                <FlatList
                  data={missions}
                  onRefresh={onRefresh}
                  refreshing={isFetching}
                  // style={{marginHorizontal: 5}}
                  keyExtractor={(data) => String(data.id)}
                  showsVerticalScrollIndicator={false}
                  // onEndReachedThreshold={0.2}
                  // onEndReached={exibirBotao}
                  renderItem={({ item: data }) => (
                    <View style={styles.background}>
                      <Pressable
                        disabled={data.status !== "pending"}
                        onPress={() =>
                          navigation.navigate("DeliveryProcess", {
                            missionId: data.id,
                            localId: data.travel_local_id,
                          })
                        }
                        // onPress={() => console.log("apertou")}
                      >
                        <View style={styles.item}>
                          {data.status !== "pending" && (
                            <View style={styles.shadow}></View>
                          )}
                          {/* <View style={styles.margin}> */}
                          <View style={styles.imageContainer}>
                            <Image
                              style={styles.image}
                              // resizeMode="center"
                              source={
                                data.type === "collect"
                                  ? require("./image/collect.png")
                                  : require("./image/delivery.png")
                              }
                            />
                            <Text style={styles.text12}>
                              {data.type === "collect" ? "Coleta" : "Entrega"}
                            </Text>
                          </View>

                          <View style={styles.rightCard}>
                            <View style={styles.dataContainer}>
                              <View style={styles.nameContainer}>
                                <Text numberOfLines={1} style={styles.text16}>
                                  {data.contact.name}
                                </Text>
                                <Text style={styles.text12}>
                                  {data.complement}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View style={{ width: "75%" }}>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.text12}
                                    >
                                      {"NF "}
                                      {data.document?.map(
                                        (value, index) =>
                                          (index > 0 ? ", " : "") +
                                          value.invoiceNumber
                                      )}
                                    </Text>
                                  </View>
                                  <Text style={styles.text12}>
                                    Itens: {data.quantity}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.statusContainer}>
                                {data.status !== "pending" && (
                                  <>
                                    {data.status === "success" && (
                                      <View
                                        style={{
                                          width: "85%",
                                          alignItems: "center",
                                          // backgroundColor: "pink"
                                        }}
                                      >
                                        <MaterialCommunityIcons
                                          name="check-circle-outline"
                                          size={40}
                                          color="#4FB438"
                                        />
                                        <Text style={styles.text12}>
                                          Sucesso
                                        </Text>
                                      </View>
                                    )}
                                    {data.status === "failed" && (
                                      <View
                                        style={{
                                          width: "85%",
                                          alignItems: "center",
                                        }}
                                      >
                                        <MaterialCommunityIcons
                                          name="close-circle-outline"
                                          size={40}
                                          color="#E23E5C"
                                        />
                                        <Text style={styles.text12}>
                                          Insucesso
                                        </Text>
                                      </View>
                                    )}
                                  </>
                                )}
                              </View>
                            </View>
                            <View style={styles.obsContainer}>
                              {data.description && (
                                <Text style={styles.text12}>
                                  {data.description
                                    ? `"${data.description}"`
                                    : ""}
                                </Text>
                              )}
                            </View>
                          </View>
                          {/* </View> */}
                        </View>
                      </Pressable>
                    </View>
                  )}
                />
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
          type="local"
          hideModal={hideModalReopen}
          reopen={cancelLocalProcess}
          loading={loading}
          localRegress={true}
        ></ModalReopen>
      </Modal>
    </>
  );
}
