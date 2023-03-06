import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Modal,
  BackHandler,
} from "react-native";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalLogoff from "../../components/Modals/ModalLogoff";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TOKEN_KEY, LAST_LOCATION, EVENT_TYPE } from "../../constants/constants";
import ListItens from "../../components/ListItens";
import Loading from "../../components/Loading";
import AuthContext from "../../contexts/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "react-native-paper";
import { api } from "../../services/api";
import { format } from "date-fns";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";
import { EventsController } from "../../controllers/EventsController";
import { AuthController } from "../../controllers/AuthController";

export default function Insuccess({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [tripId, setTripId] = useState(null);
  const [trip, setTrip] = useState({});
  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [logoffVisible, setLogoffVisible] = useState(false);
  const [finishTravelVisible, setFinishTravelVisible] = useState(false);

  const { signOut } = useContext(AuthContext);

  const showModalLogoff = () => setLogoffVisible(true);
  const hideModalLogoff = () => setLogoffVisible(false);

  const showModalFinishTravel = () => setFinishTravelVisible(true);
  const hideModalFinishTravel = () => setFinishTravelVisible(false);

  // FAZ O LOGOUT DO APP
  async function logoutProcess() {
    setButtonLoading(true);
    try {
      signOut();
    } catch (error) {
      crashlytics().recordError(error);
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      hideModalLogoff();
      setButtonLoading(false);
    }
  }

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
      showModalLogoff
    );

    return () => backHandler.remove();
  }, []);

  // PEGA OS DADOS PASSADOS POR PARAMETROS, COMO O ID DA VIAGEM E O TOKEN
  async function init() {
    try {
      const token_key = await AuthController.getToken();
      setToken(token_key);
      let insuccess = await route.params;
      setData(insuccess);
      setTrip(insuccess[0].travel_id);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  // FAZ O INIT ASSIM QUE INICIALIZA A PÁGINA
  useEffect(() => {
    init();
  }, []);

  // FAZ A REQUISIÇÃO PARA MUDAR O STATUS DA VIAGEM PARA "CONCLUIDO" E FINALIZAR A VIAGEM
  const finishTravel = async () => {
    setButtonLoading(true);
    try {
      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      let objSend = {
        status: "CONCLUIDO",
        event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        latitude: lastLocation?.lat,
        longitude: lastLocation?.long,
      };

      const response = await EventsController.postEvent(
        EVENT_TYPE.TRAVEL_CHANGE_STATUS,
        token,
        `/travel/${trip}/change-status`,
        objSend,
        trip
      );
      if (response) {
        navigation.navigate("Trips");
        hideModalFinishTravel();
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const Footer_Component = () => {
    return (
      <View style={{ width: "100%", alignItems: "center", marginTop: 15 }}>
        <View style={styles.footerStyle}>
          <Button
            // disabled={!imagePhoto || !imageReceipt || buttonLoading}
            contentStyle={styles.biggerButton}
            mode="contained"
            labelStyle={{ color: "white" }}
            // loading={buttonLoading}
            onPress={showModalFinishTravel}
          >
            finalizar
          </Button>
          <Button
            // disabled={buttonLoading}
            style={{ marginTop: 10 }}
            contentStyle={styles.biggerButton}
            mode="text"
            onPress={showModalLogoff}
          >
            sair
          </Button>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header navigation={navigation} rota="Trips" regress="logoff" />
        </View>
        {isBusy && <Loading></Loading>}
        {!isBusy && (
          <View style={styles.body}>
            <View style={styles.rectangle}>
              <Text style={styles.title}>Insucessos</Text>
              <Text style={styles.subTitle}>Order Nº {trip}</Text>
            </View>
            <View style={styles.fundo}>
              <View style={styles.list}>
                <FlatList
                  data={data}
                  keyExtractor={(trip) => String(trip.id)}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={Footer_Component}
                  // ListFooterComponentStyle={styles.footerStyle}
                  renderItem={({ item: trip }) => (
                    <View style={{ width: "100%", alignItems: "center" }}>
                      <View style={styles.backgroundCard}>
                        <Text style={[styles.title, { color: "#606060" }]}>
                          {trip.address}
                        </Text>
                        <Text style={{ marginVertical: 8 }}>
                          {trip.entregas} Entregas / {trip.coletas} Coletas
                        </Text>
                        {trip.id === tripId && (
                          <FlatList
                            data={trip.missions_failed_with_contacts}
                            keyExtractor={(mission) => String(mission.id)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: mission }) => (
                              <View style={styles.card}>
                                <ListItens
                                  navigation={navigation}
                                  mission={mission}
                                  travelId={trip.travel_id}
                                  token={token}
                                  insucesso={true}
                                />
                              </View>
                            )}
                          />
                        )}
                        <Pressable
                          onPress={() => {
                            tripId ? setTripId(null) : setTripId(trip.id);
                          }}
                          style={{ marginTop: 10, alignItems: "center" }}
                        >
                          {trip.id !== tripId && (
                            <>
                              <Text style={styles.text}>Não confirmados</Text>
                              <MaterialCommunityIcons
                                name="chevron-down"
                                size={25}
                                color={"black"}
                              />
                            </>
                          )}
                          {trip.id === tripId && (
                            <MaterialCommunityIcons
                              name="chevron-up"
                              size={25}
                              color={"black"}
                            />
                          )}
                        </Pressable>
                      </View>
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
      <Modal transparent={true} visible={logoffVisible} dismissable={false}>
        <ModalLogoff
          hideModal={hideModalLogoff}
          logoff={logoutProcess}
        ></ModalLogoff>
      </Modal>
      <Modal
        transparent={true}
        visible={finishTravelVisible}
        dismissable={false}
      >
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.textModal}>
                Ainda existem entregas/coletas
                <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                  {" "}
                  pendentes,{" "}
                </Text>
                <Text>deseja finalizar a viagem?</Text>
              </Text>
            </View>
            <Image
              style={styles.imageModal}
              source={require("../../assets/images/finishWithInsuccess.png")}
            />
            <View style={styles.buttonModal}>
              <Button
                disabled={buttonLoading}
                contentStyle={styles.biggerButton}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={() => hideModalFinishTravel()}
              >
                voltar para a lista de insucesso
              </Button>
              <Button
                disabled={buttonLoading}
                loading={buttonLoading}
                style={{ marginTop: 10 }}
                contentStyle={styles.biggerButton}
                mode="text"
                onPress={finishTravel}
              >
                finalizar viagem
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
