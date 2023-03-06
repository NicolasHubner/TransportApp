import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { APP_NAVIGATION, EVENT_TYPE, LOCAL_ID, TOKEN_KEY } from "../../constants/constants";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "react-native-paper";
// import colors from "../../utils/colors";
import { api } from "../../services/api";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";
import { TravelController } from "../../controllers/TravelController";
import { EventsController } from "../../controllers/EventsController";
import { AuthController } from "../../controllers/AuthController";

export default function LocalDetails({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [local, setLocal] = useState();
  const [token, setToken] = useState();
  const [data, setData] = useState({});
  const [goToDestine, setGoToDestine] = useState(false);
  const [locationType, setLocationType] = useState("");
  const [map, setMap] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // FAZ AS REQUISIÇÕES DE PEGAR OS DETALHES DO LOCAL POR ID
  async function init() {
    try {
      const token = await AuthController.getToken();
      const nav = await StorageController.buscarPorChave(APP_NAVIGATION);
      let routeParams = await navigation.getState();

      setToken(token);
      if (nav) {
        setMap(nav);
      }

      let id = null;
      let arrayRoutes = routeParams.routes;
      arrayRoutes.map((value, index) => {
        if (value.name === "LocalDetails") {
          id = value.params;
        }
      });
      setLocal(id);
      const response = await TravelController.getLocalNavigation(token, id);
      if (response) {
        setLocationType(response.data.location_type_description);
        if (response.data.location_type_description === "DESTINO") {
          const responseDestine = await TravelController.checkLocalsPendent(
            response.data.travel_id
          );
          console.log(responseDestine);
          if (responseDestine) {
            setGoToDestine(true);
          }
        }
        setData(response.data);
      }
    } catch (error) {
      crashlytics().recordError(error);
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

  // FAZ A FUNÇÃO INIT ASSIN QUE O APP INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // FAZ A REQUISIÇÃO PARA MUDAR O STATUS DO LOCAL PARA "EM ANDAMENTO"
  async function startLocal() {
    try {
      setIsLoading(true);
      if (locationType === "DESTINO") {
        if (goToDestine) {
          const status = {
            status: "EM ANDAMENTO",
            uuid_group: true,
          };

          const response = await EventsController.postEvent(
            EVENT_TYPE.LOCAL_CHANGE_STATUS,
            token,
            `/local/${data.id}/change-status`,
            status,
            data.id
          );

          if (response) {
            await StorageController.salvarPorChave(LOCAL_ID, data.id);
            goNavigation();
          }
        } else {
          Alert.alert(
            "Atenção",
            "Não é possível ir para o destino pois ainda existem locais pendentes.\nFinalize todos os locais e tente novamente.",
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        }
      } else {
        const status = {
          status: "EM ANDAMENTO",
          uuid_group: true,
        };

        const response = await EventsController.postEvent(
          EVENT_TYPE.LOCAL_CHANGE_STATUS,
          token,
          `/local/${data.id}/change-status`,
          status,
          data.id
        );

        if (response) {
          await StorageController.salvarPorChave(LOCAL_ID, data.id);
          goNavigation();
        }
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // REDIRECIONA PARA A PÁGINA SELECTNAVIGATION
  async function goNavigation() {
    try {
      // if (map) {
      //   navigation.navigate("ExpandedMap", local);
      // } else {
      navigation.navigate("SelectNavigation", { localId: local });
      // }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Header navigation={navigation} rota="Locals" />
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
              <Text style={styles.title}>
                Detalhes do local de Entrega / Coleta
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.margin}>
              <View style={styles.topContainer}>
                <View style={styles.status}>
                  <Text style={styles.textSansRegular}>{data.status}</Text>
                  <Text style={styles.textSansBold}>{data.date}</Text>
                </View>
                <Text style={styles.textSansBold}>
                  Order N.º {data.travel_id}
                </Text>
                <View style={styles.line}></View>
                <View style={styles.status}>
                  <View style={styles.address}>
                    <Text style={[styles.textSansRegular, { fontSize: 18 }]}>
                      Endereço {data.location_sequence} / {data.total_missions}
                    </Text>
                    <Text
                      style={[
                        styles.textSansBold,
                        { color: "#606060", marginTop: 5 },
                      ]}
                    >
                      {data.address}
                    </Text>
                  </View>
                  <View style={styles.mapContainer}>
                    <Pressable
                      style={styles.place}
                      onPress={() =>
                        navigation.navigate("ContainedMap", {
                          travel_id: data.travel_id,
                          local_id: data.id,
                          rote: "LocalDetails",
                        })
                      }
                    >
                      <MaterialCommunityIcons
                        name="map-outline"
                        size={25}
                        color="#B98D04"
                      />
                      <Text style={[styles.textSansRegular, { marginLeft: 8 }]}>
                        Ver mapa
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.middleContainer}>
                <View style={styles.statusDelivery}>
                  <View style={{ width: "25%" }}>
                    {(data.qty_delivery > 0 || data.qty_collect > 0) && (
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={55}
                        color="#1C1C1C"
                      />
                    )}
                  </View>
                  <View style={{ width: "50%", justifyContent: "center" }}>
                    {data.qty_delivery > 0 && (
                      <View style={styles.place}>
                        <MaterialCommunityIcons
                          name="truck"
                          size={20}
                          color="#B98D04"
                        />
                        <Text style={[styles.textSansBold, { marginLeft: 8 }]}>
                          {data.qty_delivery}{" "}
                          {data.qty_delivery > 1 ? "Entregas" : "Entrega"}
                        </Text>
                      </View>
                    )}
                    {data.qty_collect > 0 && (
                      <View style={[styles.place, { marginTop: 5 }]}>
                        <MaterialCommunityIcons
                          name="archive"
                          size={20}
                          color="#B98D04"
                        />
                        <Text style={[styles.textSansBold, { marginLeft: 8 }]}>
                          {data.qty_collect}{" "}
                          {data.qty_collect > 1 ? "Coletas" : "Coleta"}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ width: "25%", alignItems: "center" }}>
                    {/* <MaterialCommunityIcons
                      name="check"
                      size={30}
                      color="#275D85"
                    />
                    <Text>Confirmado</Text> */}
                  </View>
                </View>
                {/* {data.not_confirmed === 0 && ( */}
                <View style={styles.confirmed}>
                  <View
                    style={
                      data.not_confirmed === 0
                        ? styles.dotConfirmed
                        : styles.dotUnconfirmed
                    }
                  ></View>
                  <Text style={styles.textConfirmed}>
                    {data.not_confirmed === 0
                      ? "Confirmadas"
                      : "Não confirmadas"}
                  </Text>
                </View>
                {/* )} */}
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  icon="play-outline"
                  contentStyle={styles.button}
                  mode="contained"
                  loading={isLoading}
                  disabled={isLoading}
                  labelStyle={{ color: "white" }}
                  onPress={startLocal}
                >
                  iniciar
                </Button>
                <Button
                  style={styles.buttonReport}
                  contentStyle={{ height: 40 }}
                  mode="outlined"
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
  );
}
