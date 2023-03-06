import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, Pressable, Alert } from "react-native";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Checkbox } from "react-native-paper";
import { TOKEN_KEY } from "../../constants/constants";
import ListItens from "../../components/ListItens";
import Loading from "../../components/Loading";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import colors from "../../utils/colors";
import { api } from "../../services/api";
import styles from "./styles";
import crashlytics from '@react-native-firebase/crashlytics';
import { TravelController } from "../../controllers/TravelController";
import { AuthController } from "../../controllers/AuthController";

export default function ContactLocals({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [hasTrip, setHasTrip] = useState(true);
  const [tripId, setTripId] = useState(null);
  const [rote, setRote] = useState("");
  const [localId, setLocalId] = useState();
  const [token, setToken] = useState();
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);

  // RODA O INIT QUANDO CHAMA A FUNÇÃO "RELOAD LIST "
  const reloadList = async () => {
    init();
  };

  // PEGA OS LOCAIS NÃO CONFIRMADOS
  async function init() {
    try {
      const token = await AuthController.getToken();
      let params = await route.params;
      setLocalId(params.travel_id);
      setToken(token);
      setRote(params.rote);

      // const response = await api.get(
      //   `/travel/locals/${params.travel_id}/not-confirmed`,
      //   { headers: { Authorization: `bearer ${token}` } }
      // );
      const response = await TravelController.getLocalsNotConfirmed(params.travel_id);
      
      if (response) {
        console.log("SUCCESS CONTACT -->  ", response.data.data);
        setData(response.data.data);
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response) {
        if (error.response.status == 404) {
          Alert.alert(
            "Atenção",
            error.response.data.errors[0],
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        } else {
          console.log(error.response.data);
          // navigation.navigate("Trips");
        }
      } else {
        Alert.alert("Atenção", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setIsBusy(false);
    }
  }

  // RODA O INIT ASSIM QUE A PAGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {isBusy && <Loading></Loading>}
      {!isBusy && (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Header navigation={navigation} rota={rote} />
          </View>
          <View style={styles.body}>
            <View style={styles.rectangle}>
              <Text style={styles.title}>Locais de Entrega / Coleta</Text>
              <Text style={styles.title}>Order N.º {localId}</Text>
            </View>
            <View style={styles.fundo}>
              <View style={styles.list}>
                <FlatList
                  data={data}
                  keyExtractor={(trip) => String(trip.id)}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: trip }) => (
                    <View style={{ width: "100%", alignItems: "center" }}>
                      <View style={styles.backgroundCard}>
                        <Text style={[styles.title, { color: "#606060" }]}>
                          {trip.address}
                        </Text>
                        <Text style={{ marginVertical: 8 }}>
                          {trip.qty_delivery
                            ? trip.qty_delivery +
                              (trip.qty_delivery > 1 ? " Entregas" : " Entrega")
                            : ""}
                          {trip.qty_delivery && trip.qty_collect ? " / " : ""}
                          {trip.qty_collect
                            ? trip.qty_collect +
                              (trip.qty_collect > 1 ? " Coletas" : " Coleta")
                            : ""}
                        </Text>
                        {trip.id === tripId && (
                          <FlatList
                            data={trip.missions_not_confirmed_with_contacts}
                            keyExtractor={(mission) => String(mission.id)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: mission }) => {

                              console.log(mission);
                              
                              return (<View style={styles.card}>
                                <ListItens
                                  navigation={navigation}
                                  mission={mission}
                                  rota="TripDetails"
                                  token={token}
                                  func={reloadList}
                                />
                              </View>)
                            }}
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

          <View style={styles.footer}>
            <Footer />
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
