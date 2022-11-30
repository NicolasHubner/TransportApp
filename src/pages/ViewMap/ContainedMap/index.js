import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StorageController from "../../../controllers/StorageController";
import LocationController from "../../../controllers/LocationController";
import MapViewDirections from "react-native-maps-directions";
import RouteStatus from "../../../components/RouteStatus";
import { LAST_LOCATION, TOKEN_KEY } from "../../../constants/constants";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { api } from "../../../services/api";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import crashlytics from '@react-native-firebase/crashlytics';

export default function ContainedMap({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [token, setToken] = useState();
  const [local, setLocal] = useState();
  const [travel, setTravel] = useState();
  const [rote, setRote] = useState();
  const [data, setData] = useState({});
  const [markers, setMarkers] = useState([]);
  const [initialLocation, setInitialLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [destineLocation, setDestineLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const GOOGLE_MAPS_APIKEY = "AIzaSyCNcKvd7ez5gZp5FuWgplYmaBTJag72c8I";


  async function init() {
    try {

      // BUSCA O TOKEN PARA AS REQUISIÇÕES
      const tokenKey = await StorageController.buscarPorChave(TOKEN_KEY);

      // BUSCA A ULTIMA LOCALIZAÇÃO DO USER
      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (!lastLocation) {
        const Location = await LocationController.buscaLocal();
        lastLocation = {
          lat: Location.coords.latitude,
          latitudeDelta: 0.02,
          long: Location.coords.longitude,
          longitudeDelta: 0.02,
        };
      } else {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      setToken(tokenKey);

      // PEGA E GUARDA OS PARAMETROS PASSADOS PELA ROTA: 'LOCAL', 'TRAVEL' E 'ROUTE'
      const params = await route.params;
      if (params.local_id) {
        setLocal(params.local_id);
      }
      setTravel(params.travel_id);
      setRote(params.rote);

      let responseTrip = null;
      let responseLocal = null;

      // PEGA OS DETALHES DA VIAGEM OU DO LOCAL DE DESTINO
      if (params.rote === "TripDetails") {
        responseTrip = await api.get(
          `/app/travel/local/${params.travel_id}/navigation/all`,
          { headers: { Authorization: `bearer ${tokenKey}` } }
        );
      } else {
        responseLocal = await api.get(
          `/app/travel/local/${params.local_id}/navigation`,
          { headers: { Authorization: `bearer ${tokenKey}` } }
        );
      }

      //DEFINE O LOCAL DE DESTINO E O LOCAL ATUAL DO USUARIO E FAZ A ROTA ENTRE OS DOIS
      let arrayCoords = [];
      // SE A TELA ANTERIOR FOI A 'TRIPDETAILS'
      if (responseTrip) {
        let data = {
          travel_id: responseTrip.data.travel.id,
          totalCollect: responseTrip.data.totalCollect,
          totalDelivery: responseTrip.data.totalDelivery,
          totalEstimatedTime: responseTrip.data.totalEstimatedTime,
          origin_name: responseTrip.data.travel.origin_name,
          qty_local: responseTrip.data.travel.qty_local,
          start_schedule: responseTrip.data.travel.start_schedule,
          exit_schedule: responseTrip.data.travel.exit_schedule,
          finish_schedule: responseTrip.data.travel.finish_schedule,
          status: responseTrip.data.travel.status.toLowerCase(),
        };
        setData(data);

        arrayCoords = responseTrip.data.travelsLocal;
        let lastLocationTrip = arrayCoords.slice(-1)[0];
        setDestineLocation({
          latitude: JSON.parse(lastLocationTrip.lat),
          longitude: JSON.parse(lastLocationTrip.long),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        let markers = [];
        arrayCoords.map((value, index) => {
          if (index == 0) {
            setInitialLocation({
              latitude: JSON.parse(value.lat),
              longitude: JSON.parse(value.long),
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            });
          }
          let obj = {
            latitude: JSON.parse(value.lat),
            longitude: JSON.parse(value.long),
          };
          markers.push(obj);
        });
        // console.log(markers);
        setMarkers(markers);
      } else if (responseLocal) {
        // SE A TELA ANTERIOR FOI A "LOCALDETAILS"
        let data = {
          travel_id: responseLocal.data.data.travel_id,
          totalCollect: responseLocal.data.data.collect,
          totalDelivery: responseLocal.data.data.delivery,
          totalEstimatedTime: responseLocal.data.data.estimated_time,
          origin_name: responseLocal.data.data.address,
          qty_local: responseLocal.data.data.total,
          start_schedule: responseLocal.data.data.start,
          exit_schedule: responseLocal.data.data.end,
          finish_schedule: responseLocal.data.data.end,
          status: responseLocal.data.data.status.toLowerCase(),
        };
        setData(data);

        let markers = [
          {
            latitude: lastLocation?.lat,
            longitude: lastLocation?.long,
          },
          {
            latitude: JSON.parse(responseLocal.data.data.lat),
            longitude: JSON.parse(responseLocal.data.data.long),
          },
        ];

        setInitialLocation({
          latitude: lastLocation?.lat,
          longitude: lastLocation?.long,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        setDestineLocation({
          latitude: responseLocal.data.data.lat,
          longitude: responseLocal.data.data.long,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        // console.log(markers);
        setMarkers(markers);
      }
    } catch (error) {
      crashlytics().recordError(error);
      // TRATAMENTO DE ERROS
      if (error.response) {
        Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
        console.log("ERRO AQUI ->", error.response.data);
      } else if (error.message) {
        Alert.alert("Aviso", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
        console.log(error.message);
      } else {
        navigation.navigate("Trips");
      }
    } finally {
      setIsBusy(false);
    }
  }

  //roda o init sempre que navegar para esta tela
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {local && (
          <Header navigation={navigation} parameter={local} rota={rote} />
        )}
        {!local && <Header navigation={navigation} rota={rote} />}
      </View>
      {isBusy && (
        <View style={{ flex: 15 }}>
          <Loading></Loading>
        </View>
      )}
      {!isBusy && (
        <View style={styles.body}>
          <View style={styles.informations}>
            <Text style={styles.textInformation}>
              {rote === "TripDetails" ? "Viagem " : "Local "}
              {data.status}
            </Text>
            <Text style={styles.textInformation}>
              Order N.º {data.travel_id}
            </Text>
          </View>
          <View style={styles.mapContainer}>
            <View style={styles.status}>
              {data.totalDelivery > 0 && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    width: "40%",
                    // backgroundColor: "grey",
                  }}
                >
                  <View style={styles.place}>
                    <MaterialCommunityIcons
                      name="truck"
                      size={25}
                      color="#B98D04"
                    />
                    <Text style={[styles.textSansBold, { marginLeft: 15 }]}>
                      {data.totalDelivery}
                      {data.totalDelivery > 1 ? " Entregas" : " Entrega"}
                    </Text>
                  </View>

                  <View style={{ height: "5%", marginVertical: 20 }}>
                    <RouteStatus
                      quantidade={data.totalDelivery}
                      locais={data.totalDelivery}
                      completo={0}
                    />
                  </View>
                </View>
              )}
              {data.totalCollect > 0 && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    width: "40%",
                    // backgroundColor: "red",
                  }}
                >
                  <View style={styles.place}>
                    <MaterialCommunityIcons
                      name="archive"
                      size={25}
                      color="#B98D04"
                    />
                    <Text style={[styles.textSansBold, { marginLeft: 15 }]}>
                      {data.totalCollect}
                      {data.totalCollect > 1 ? " Coletas" : " Coleta"}
                    </Text>
                  </View>

                  <View style={{ height: "5%", marginVertical: 20 }}>
                    <RouteStatus
                      quantidade={data.totalCollect}
                      locais={data.totalCollect}
                      completo={0}
                    />
                  </View>
                </View>
              )}
            </View>
            <View style={styles.dataContainer}>
              <Text style={{ fontSize: 10 }}>
                Tempo estimado:{" "}
                {data.totalEstimatedTime ? data.totalEstimatedTime : "00:00"}
              </Text>
              <View style={styles.line}></View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "60%" }}>
                  <Text style={{ fontSize: 12, marginBottom: 5 }}>
                    {rote === "TripDetails" ? "Local de inicio:" : "Local:"}
                  </Text>
                  <Text style={{ fontSize: 12 }}>{data.origin_name}</Text>
                </View>
                <View style={{ alignItems: "flex-end", width: "40%" }}>
                  <Text
                    style={{ fontSize: 10, marginBottom: 5, fontWeight: "700" }}
                  >
                    Chegada prevista: {data.start_schedule}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: "700" }}>
                    Saída prevista: {data.exit_schedule}
                  </Text>
                </View>
              </View>
            </View>
            <MapView
              initialRegion={initialLocation}
              style={styles.map}
              // region={location}
              // provider={"google"}
              rotateEnabled={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
            >
              {markers.length > 0 &&
                markers.map((marker, index) => (
                  <Marker coordinate={marker}>
                    <Image
                      style={styles.mapMarker}
                      source={require("../image/marker.png")}
                    ></Image>
                  </Marker>
                ))}
              <MapViewDirections
                lineCap="square"
                lineDashPattern={[1]}
                strokeWidth={3}
                strokeColor="#275D85"
                origin={initialLocation}
                waypoints={markers}
                destination={destineLocation}
                apikey={GOOGLE_MAPS_APIKEY}
              />
            </MapView>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.atualizar}
                android_ripple={{ color: "white" }}
                onPress={() => console.log("relatar problema")}
              >
                <MaterialCommunityIcons
                  name="alert-octagon-outline"
                  size={20}
                  color="#606060"
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 12,
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#606060",
                  }}
                >
                  Relatar problema
                </Text>
              </Pressable>
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
