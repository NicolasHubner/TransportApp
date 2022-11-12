import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import ModalLocationRefused from "../../components/Modals/ModalLocationRefused";
import ModalLocationDisabled from "../../components/Modals/ModalLocationDisabled";
import LocationController from "../../controllers/LocationController";
import StorageController from "../../controllers/StorageController";
import { TOKEN_KEY, USER_ID } from "../../constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../components/Loading";
import { Ionicons } from "@expo/vector-icons";
import AuthContext from "../../contexts/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import * as Location from "expo-location";
import { api } from "../../services/api";
import styles from "./styles";

export default function Trips({ navigation }) {
  const [isBusy, setIsBusy] = useState(true);
  const [hasTrip, setHasTrip] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [data, setData] = useState({});
  const [locationRefusedVisible, setLocationRefusedVisible] = useState(false);
  const [locationDisabledVisible, setLocationDisabledVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // DEFINE O ESTADO DOS MODAIS
  const showModalLocationRefused = () => setLocationRefusedVisible(true);
  const hideModalLocationRefused = () => setLocationRefusedVisible(false);
  
  // DEFINE O ESTADO DOS MODAIS
  const showModalLocationDisabled = () => setLocationDisabledVisible(true);
  const hideModalLocationDisabled = () => setLocationDisabledVisible(false);

  const { signOut } = useContext(AuthContext);

  //Função padrão para renderização de informações na tela
  async function init() {
    try {
      setIsBusy(true);
      await LocationController.verificaAutorizacaoLocalizacao();
      await LocationController.verificaAtivacaoLocalizacao();
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      const userId = await StorageController.buscarPorChave(USER_ID);
      if (token) {
        const response = await api.get("/app/travels", {
          headers: { Authorization: `bearer ${token}` },
        });
        if (response.data.success && response.data.data.length > 0) {
          setData(response.data.data);
          setHasTrip(true);
          let arrayTrips = response.data.data;
          arrayTrips.map(function (item) {
            if (item.status == "EM ANDAMENTO") {
              navigation.navigate("Locals", item.id);
            }
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        if (error.response.status == "401" || error.response.status == "403") {
          signOut();
        } else if (error.response.status == "404") {
          setData(null);
        } else {
          Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
            cancelable: false,
          });
        }
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
        signOut();
      }
    } finally {
      setIsBusy(false);
    }
  }

  //Verifica se o gps esta ativo e autorizado, se estiver, navega para a tela de detalhes da viagem
  const goToTripDetails = async (id) => {
    let background =
      await LocationController.verificaAutorizacaoBackgroundLocalizacao();
    if (background) {
      let gps = await LocationController.verificaAtivacaoLocalizacao();
      if (gps) {
        navigation.navigate("TripDetails", id);
      } else {
        showModalLocationDisabled();
      }
    } else {
      showModalLocationRefused();
    }
  };

  //roda o init sempre que navegar para esta tela
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  //efetua um refresh (atualização) na lista de viagens da tela
  const refreshPage = async () => {
    try {
      setRefreshLoading(true);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      if (token) {
        const response = await api.get("/app/travels", {
          headers: { Authorization: `bearer ${token}` },
        });
        if (response.data.success && response.data.data.length > 0) {
          console.log("setou");
          setData(response.data.data);
          setHasTrip(true);
        }
      }
    } catch (e) {
      if (e.response) {
        Alert.alert("Aviso", e.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("Aviso", e.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setRefreshLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header navigation={navigation} rota="Trips" regress="logoff" />
        </View>
        {isBusy && (
          <View style={{ flex: 15 }}>
            <Loading></Loading>
          </View>
        )}
        {!isBusy && hasTrip && (
          <View style={styles.body}>
            <View style={styles.rectangle}>
              <Text style={styles.title}>Minhas viagens</Text>
            </View>
            <View style={styles.fundo}></View>
            <View style={styles.list}>
              <View style={{ alignItems: "center" }}>
                <FlatList
                  data={data}
                  onRefresh={refreshPage}
                  refreshing={refreshLoading}
                  // style={{marginHorizontal: 5}}
                  keyExtractor={(trip) => String(trip.id)}
                  showsVerticalScrollIndicator={false}
                  // onEndReachedThreshold={0.2}
                  // onEndReached={exibirBotao}
                  renderItem={({ item: trip }) => (
                    <View style={styles.background}>
                      <Pressable
                        disabled={
                          trip.status != "PENDENTE" &&
                          trip.status != "EM ANDAMENTO"
                        }
                        onPress={() => goToTripDetails(trip.id)}
                      >
                        <View style={styles.item}>
                          {trip.status != "PENDENTE" &&
                            trip.status != "EM ANDAMENTO" && (
                              <View style={styles.shadow}></View>
                            )}
                          <View style={styles.status}>
                            <Text style={styles.textSansRegular}>
                              {trip.status.toUpperCase()}
                            </Text>
                            <Text style={styles.textSansBold}>{trip.date}</Text>
                          </View>
                          <View style={styles.blocks}>
                            <View style={{ width: "70%" }}>
                              <Text style={styles.textSansBold}>
                                Order N.º {trip.id}
                              </Text>
                              <View style={styles.line}></View>
                              <Text
                                style={[
                                  styles.textSansRegular,
                                  { marginTop: 10 },
                                ]}
                              >
                                {trip.origin}
                              </Text>
                            </View>
                            <View
                              style={{ alignItems: "center", width: "30%" }}
                            >
                              <Image
                                style={styles.logo}
                                source={{
                                  uri: trip.icon,
                                }}
                              ></Image>
                            </View>
                          </View>
                          <View style={styles.blocks}>
                            <View
                              style={{ flexDirection: "row", width: "70%" }}
                            >
                              <View>
                                <Text style={styles.textSansRegular}>
                                  Início previsto:
                                </Text>
                                <Text
                                  style={[
                                    styles.textSansBold,
                                    { fontSize: 16, fontWeight: "bold" },
                                  ]}
                                >
                                  {trip.start_schedule}
                                </Text>
                                {/* 
                              INFORMAÇÃO NÃO CONSTARÁ EM VIAGENS LIVRES, APENAS EM VIAGENS CONTROLADAS
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.textSansRegular,
                                  { marginTop: 6 },
                                ]}
                              >
                                Término previsto:
                              </Text>
                              <Text
                                style={[styles.textSansBold, { fontSize: 16, fontWeight: "bold" }]}
                              >
                                {trip.finish_schedule}
                              </Text> */}
                              </View>
                            </View>
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: "30%",
                              }}
                            >
                              {trip.not_confirmed > 0 && (
                                <>
                                  <View style={styles.statusContainer}>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        fontSize: 10,
                                      }}
                                    >
                                      {trip.not_confirmed}
                                    </Text>
                                  </View>
                                  <Text style={{ fontSize: 10 }}>
                                    Não Confirmadas
                                  </Text>
                                </>
                              )}
                              {trip.not_confirmed === 0 && (
                                <>
                                  <View
                                    style={[
                                      styles.statusContainer,
                                      { backgroundColor: "#4FB438" },
                                    ]}
                                  />
                                  <Text style={{ fontSize: 10 }}>
                                    confirmado
                                  </Text>
                                </>
                              )}
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        )}
        {!isBusy && !hasTrip && (
          <View style={styles.bodyEmpty}>
            <View style={styles.rectangleEmpty}>
              <Text style={styles.title}>Minhas viagens</Text>
            </View>
            <View style={{ marginTop: -50 }}>
              <Image
                style={styles.image}
                source={require("../../assets/images/tripEmpty.png")}
              />
            </View>
            <Text style={styles.textBody}>
              Você não possui viagens agendadas
            </Text>
            {!refreshLoading && (
              <Pressable style={styles.refresh} onPress={refreshPage}>
                <Pressable style={styles.circle} onPress={refreshPage}>
                  <Ionicons
                    onPress={refreshPage}
                    name="refresh"
                    size={40}
                    color={"#000000"}
                  />
                </Pressable>
                <Text style={{ fontWeight: "500" }}>Atualizar lista</Text>
              </Pressable>
            )}
            {refreshLoading && (
              <View style={styles.refresh}>
                <ActivityIndicator size="large" color="#000000" />
              </View>
            )}
          </View>
        )}
        <View style={styles.footer}>
          <Footer />
        </View>
      </SafeAreaView>
      <Modal
        transparent={true}
        visible={locationRefusedVisible}
        dismissable={false}
      >
        <ModalLocationRefused
          hideModal={hideModalLocationRefused}
        ></ModalLocationRefused>
      </Modal>
      <Modal
        transparent={true}
        visible={locationDisabledVisible}
        dismissable={false}
      >
        <ModalLocationDisabled
          hideModal={hideModalLocationDisabled}
        ></ModalLocationDisabled>
      </Modal>
    </>
  );
}
