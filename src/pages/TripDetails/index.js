import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, Modal, Alert } from "react-native";
import StorageController from "../../controllers/StorageController";
import { TOKEN_KEY, TRAVEL_ID, LAST_LOCATION, EVENT_TYPE } from "../../constants/constants";
import LocationController from "../../controllers/LocationController";
import ModalOrigin from "../../components/Modals/ModalOrigin";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ModalLate from "../../components/Modals/ModalLate";
import RouteStatus from "../../components/RouteStatus";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "react-native-paper";
import { api } from "../../services/api";
import { format } from "date-fns";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";
import { TravelController } from "../../controllers/TravelController";
import { EventsController } from "../../controllers/EventsController";
import { AuthController } from "../../controllers/AuthController";

export default function TripDetails({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [lateVisible, setLateVisible] = useState(false);
  const [goToOriginVisible, setGoToOriginVisible] = useState(false);
  const [data, setData] = useState({});
  const [travelId, setTravelId] = useState();
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [lastLocate, setLastLocate] = useState({});
  const [originType, setOriginType] = useState("");

  // DEFINE O ESTADO DOS MODAIS
  const showModalAtraso = () => setLateVisible(true);
  const hideModalAtraso = () => setLateVisible(false);

  // DEFINE O ESTADO DOS MODAIS
  const showModalOrigin = () => setGoToOriginVisible(true);
  const hideModalOrigin = () => setGoToOriginVisible(false);

  // FUNÇÃO PADRÃO PARA A REDENRIZAÇÃO DAS INFORMAÇÕES NA TELA
  // PEGA AS LOCALIZAÇÕES E TODAS AS INFORMAÇÕES DA VIAGEM
  async function init() {
    try {
      const token = await AuthController.getToken();
      const id = await route.params;

      setTravelId(id);
      setToken(token);
      const response = await TravelController.getTravelsDetails(token, id);

      let lastLocation = {};
      lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      } else {
        const newLocation = await LocationController.buscaLocal();
        if (newLocation) {
          const { latitude, longitude } = newLocation.coords;
          lastLocation = {
            lat: latitude,
            long: longitude,
          };
        }
      }

      setLastLocate(lastLocation);
      if (response) {
        setOriginType(response.origin_type);
        setData(response);

        if (response.is_late) {
          showModalAtraso();
        }
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response.status == "404") {
        Alert.alert(
          "Aviso",
          error.response.data.data.message,
          [{ text: "OK" }],
          {
            cancelable: false,
          }
        );
      } else if (error.response.status == "500") {
        Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
        navigation.navigate("Trips");
      } else {
        navigation.navigate("Trips");
      }
    } finally {
      setIsBusy(false);
    }
  }

  //RODA O INIT SEMPRE QUE NAVEGAR PARA ESSA TELA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // MUDA O STATUS DA VIAGEM PARA "EM ANDAMENTO" E LEVA PARA A TELA DE SELEÇÃO DE MAPA
  const goMapNavigation = async () => {
    try {
      setIsLoading(true);
      setIsLoadingModal(true);
      hideModalOrigin();

      await StorageController.salvarPorChave(TRAVEL_ID, data.id);

      let objSend = {
        status: "EM ANDAMENTO",
        event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        latitude: lastLocate.lat,
        longitude: lastLocate.long,
      };

      const response = await EventsController.postEvent(
        EVENT_TYPE.TRAVEL_CHANGE_STATUS,
        token,
        `/travel/${travelId}/change-status`,
        objSend,
        travelId
      );

      if (response) {
        navigation.navigate("SelectNavigation", {
          localId: data.origin_id,
          originType: originType,
          goBack: data.id,
        });
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingModal(false);
      hideModalAtraso();
    }
  };

  // VERIFICA A DISTANCIA DO LOCAL ATUAL PARA O LOCAL LOCAL DE ORIGEM
  // SE JÁ ESTIVER NO LOCAL DE ORIGEM INICIA VIAGEM SE NÃO, PERGUNTA SE QUER IR PARA A ORIGEM
  const goToOrigin = async () => {
    try {
      setIsLoading(true);

      let dist = await LocationController.calculaDistancia(
        lastLocate.lat,
        lastLocate.long,
        data.origin_latitude,
        data.origin_longitude
      );

      if (dist > 0.05) {
        console.log("distancia até o local de origem -->", dist);
        showModalOrigin();
      } else {
        aceptTrip();
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  };

  // FUNÇÃO DE ACEITAMENTO DA VIAGEM, MUDA O STATUS DA VIAGEM PARA "EM ANDAMENTO"
  // E REDIRECIONA PARA A TELA "LOCALS"
  async function aceptTrip() {
    try {
      setIsLoading(true);
      setIsLoadingModal(true);
      await StorageController.salvarPorChave(TRAVEL_ID, data.id);

      let objSend = {
        status: "EM ANDAMENTO",
        event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        latitude: lastLocate.lat,
        longitude: lastLocate.long,
      };

      const response = await EventsController.postEvent(
        EVENT_TYPE.TRAVEL_CHANGE_STATUS,
        token,
        `/travel/${travelId}/change-status`,
        objSend,
        travelId
      );

      if (response) {
        navigation.navigate("Locals", data.id);
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        if (error.response.data.errors[0]) {
          Alert.alert(
            "Aviso",
            error.response.data.errors[0],
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        } else {
          Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
            cancelable: false,
          });
        }
      } else {
        Alert.alert("Aviso", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setIsLoading(false);
      setIsLoadingModal(false);
      hideModalAtraso();
      hideModalOrigin();
    }
  }

  // REDIRECIONA PARA A TELA "CONTACTLOCALS"
  async function redirectPage() {
    const dados = {
      travel_id: data.id,
      rote: "TripDetails",
    };
    // trip = [...trip, {rote: "Missions"}];
    navigation.navigate("ContactLocals", dados);
  }

  return (
    // TELA DE DETALHES DA VIAGEM
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header navigation={navigation} rota="Trips" />
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
                <Text style={styles.title}>Detalhes da viagem</Text>
                <Text style={styles.title}>Rota Livre</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.margin}>
                <View>
                  <View style={styles.status}>
                    <Text style={styles.textSansRegular}>{data.status}</Text>
                    <Text style={styles.textSansBold}>{data.date}</Text>
                  </View>
                  <View style={styles.order}>
                    <View
                      style={{ justifyContent: "space-between", width: "75%" }}
                    >
                      <Text style={styles.textSansBold}>
                        Order N.º {data.id}
                      </Text>
                      <View style={styles.line} />
                      <View>
                        <Text style={[styles.textSansBold, { fontSize: 16 }]}>
                          Local de inicio:
                        </Text>
                      </View>
                    </View>
                    <Image
                      style={styles.logo}
                      source={{
                        uri: data.icon,
                      }}
                    />
                  </View>
                  {/* <View style={{ flexDirection: "row", marginTop: 10 }}> */}
                  <View style={{ width: "70%" }}>
                    <Text style={[styles.textSansRegular, { fontSize: 16 }]}>
                      {data.origin_name}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Pressable
                      onPress={() => {
                        data.not_confirmed > 0 ? redirectPage() : "";
                      }}
                      style={
                        data.not_confirmed > 0
                          ? styles.statusContainer
                          : styles.statusContainerNull
                      }
                    >
                      {data.not_confirmed > 0 && (
                        <Text style={styles.textStatus}>
                          {data.not_confirmed}
                        </Text>
                      )}
                      <Text style={styles.textStatus}>
                        {data.not_confirmed > 0
                          ? "Não confirmadas"
                          : "Confirmadas"}
                      </Text>
                    </Pressable>
                  </View>
                  {/* </View> */}
                </View>

                <View>
                  <Text
                    style={[styles.textSansRegular, { marginVertical: 25 }]}
                  >
                    Obs.:{" "}
                    {data.observation
                      ? data.observation
                      : "sem observações complementares."}
                  </Text>
                  <View style={styles.viewMap}>
                    <View style={styles.place}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={25}
                        color="#B98D04"
                      />
                      <Text style={styles.textSansBold}>
                        {data.completed_locals}/{data.total_locals} Locais
                      </Text>
                    </View>
                    {/* <Pressable style={{width: '30%'}} onPress={() => navigation.navigate("ViewMap")}> */}
                    <Pressable
                      style={{ width: "30%" }}
                      onPress={() =>
                        navigation.navigate("ContainedMap", {
                          travel_id: data.id,
                          rote: "TripDetails",
                        })
                      }
                    >
                      <View style={[styles.place, { width: "100%" }]}>
                        <MaterialCommunityIcons
                          name="map-outline"
                          size={25}
                          color="#B98D04"
                        />
                        <Text style={styles.textSansRegular}>Ver mapa</Text>
                      </View>
                    </Pressable>
                  </View>
                  <View
                    style={{ width: "50%", height: "5%", marginVertical: 20 }}
                  >
                    <RouteStatus
                      locais={data.total_locals}
                      completo={data.completed_locals}
                    />
                  </View>
                </View>

                <View>
                  <Button
                    contentStyle={styles.button}
                    mode="contained"
                    labelStyle={{ color: "white" }}
                    loading={isLoading}
                    disabled={isLoading}
                    onPress={goToOrigin}
                  >
                    aceitar viagem
                  </Button>
                  <Button
                    style={styles.buttonReport}
                    contentStyle={{ height: 40 }}
                    mode="outlined"
                    loading={isLoading}
                    disabled={isLoading}
                    labelStyle={{ color: "#275D85" }}
                    onPress={() => console.log("apertou o segundo")}
                  >
                    reportar problema
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={styles.footer}>
          <Footer />
        </View>
      </SafeAreaView>
      {/* MODAL DE ATRASO */}
      <Modal transparent={true} visible={lateVisible} dismissable={false}>
        <ModalLate hideModal={hideModalAtraso}></ModalLate>
      </Modal>
      {/* MODAL PERGUNTANDO SE QUR IR PARA A ORIGEM */}
      <Modal transparent={true} visible={goToOriginVisible} dismissable={false}>
        <ModalOrigin
          selectNavigation={goMapNavigation}
          hideModal={hideModalOrigin}
          nextPage={aceptTrip}
          isLoading={isLoadingModal}
        ></ModalOrigin>
      </Modal>
    </>
  );
}
