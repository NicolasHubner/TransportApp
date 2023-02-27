import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  Image,
  Alert,
  TextInput,
  ImageBackground,
  Keyboard,
  Linking,
  Pressable,
  Modal,
} from "react-native";
// import ModalArrivedDestine from "../../../components/Modals/ModalArrivedDestine";
import ModalFinishTravel from "../../../components/Modals/ModalFinishTravel";
import LocationController from "../../../controllers/LocationController";
import StorageController from "../../../controllers/StorageController";
import {
  APP_NAVIGATION,
  ARRIVAL_NOTIFICATION,
  DESTINY_PAGE,
  EVENT_TYPE,
  LOCAL_COORD,
  TOKEN_KEY,
} from "../../../constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import MapViewDirections from "react-native-maps-directions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Loading from "../../../components/Loading";
import { Button } from "react-native-paper";
import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { api } from "../../../services/api";
import { format } from "date-fns";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";
import { TravelController } from "../../../controllers/TravelController";
import { EventsController } from "../../../controllers/EventsController";

export default function ExpandedMap({ navigation, route }) {
  const [activeDestineChange, setActiveDestineChange] = useState(false);
  const [newLocalVisible, setNewLocalVisible] = useState(false);
  const [hasMission, setHasMission] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [distance, setDistance] = useState(null);
  const [isBusy, setIsBusy] = useState(true);
  const [local, setLocal] = useState("");
  const [travel, setTravel] = useState("");
  const [token, setToken] = useState();
  const [data, setData] = useState({});
  const [arriviedDestine, setArrivedDestine] = useState(false);
  const [initialLocation, setInitialLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [atualLocation, setAtualLocation] = useState({
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

  const showModalArrivedDestine = () => setArrivedDestine(true);
  const hideModalArrivedDestine = () => setArrivedDestine(false);

  async function init() {
    try {
      // PEGA E GUARDA AS COORDENADAS DO DESTINO
      let localCoords = await StorageController.buscarPorChave(LOCAL_COORD);
      localCoords = JSON.parse(JSON.parse(localCoords));
      console.log(localCoords);
      setDestineLocation(localCoords);

      setTimeout(() => {
        setActiveDestineChange(true);
      }, 10000);

      // PEGA E GUARDA AS COORDENADAS ATUAL DO USER
      let atualLocation = await getLocation();
      setAtualLocation(atualLocation);
      setRefresh(!refresh);

      // PEGA E GUARDA AS COORDENADAS INICIAL DO USER
      if (initialLocation.latitudeDelta === 0) {
        setInitialLocation(atualLocation);
      }
      // let map = await StorageController.buscarPorChave(APP_NAVIGATION);

      // PEGA E GUARDA O TOKEN DE AUTENTICAÇÃO PARA FAZER AS REQUISIÇÕES
      const tokenKey = await StorageController.buscarPorChave(TOKEN_KEY);
      setToken(tokenKey);

      // PEGA E GUARDA OS PARAMETROS DA ROTA COMO 'TRAVEL', 'PLATFORM' E 'LOCAL'
      const params = await route.params;
      let idLocal = "";
      if (params?.local) {
        setLocal(params.local);
        idLocal = params.local;
      } else {
        setLocal(params);
        idLocal = params;
      }
      // if (!map && params.platform) {
      //   map = params.platform;
      // }

      // FAZ A REQUISIÇÃO PARA PEGAR E GUARDAR OS DADOS DO LOCAL DE DESTINO
      const response = await TravelController.getLocalNavigation(
        tokenKey,
        idLocal
      );

      console.log("has_mission", response.has_mission);
      if (response) {
        setTravel(response.data.travel_id);
        setHasMission(response.has_mission);
        // if (map && map === "waze") {
        //   Linking.openURL(response.data.data.wazer);
        // } else if (map && map === "android") {
        //   Linking.openURL(response.data.data.google_maps);
        // } else if (map && map === "ios") {
        //   Linking.openURL(response.data.data.apple_maps);
        // }
        if (destineLocation.latitude === 0) {
          const location = {
            latitude: JSON.parse(response.data.location_latitud),
            longitude: JSON.parse(response.data.location_longitud),
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          setDestineLocation(location);
        }
        setData(response.data);
        setRefresh(!refresh);
      }
    } catch (error) {
      crashlytics().recordError(error);
      // VERIFICAÇÃO E TRATAMENTO DE ERROS
      if (error.response) {
        Alert.alert("Aviso", error.response.data.errors[0], [{ text: "OK" }], {
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
      interval();
      setIsBusy(false);
    }
  }

  const interval = async () => {
    try {
      console.log(`Destino: ${destineLocation.latitude} ${destineLocation.longitude}`);
      // CALCULA A DISTÂNCIA DO LOCAL ATUAL E DO LOCAL DO DESTINO
      const newLocation = await getLocation();
      if (newLocation && destineLocation) {
        const arrivedDestine = await LocationController.calculaDistancia(
          newLocation.latitude,
          newLocation.longitude,
          destineLocation.latitude,
          destineLocation.longitude
        );

        setDistance(arrivedDestine);
        setAtualLocation(newLocation);
        console.log(`Destino: ${destineLocation.latitude} ${destineLocation.longitude}`);
        console.log(`Distancia: ${arrivedDestine}`);

        // let endereco = await LocationController.buscaEndereco(
        //   newLocation.latitude,
        //   newLocation.longitude
        // );

        //O RAIO DEVERÁ VIR DA API TROUW - NO MOMENTO ESTA SETADO EM 50m (0.05km)
        // SE A DISTÃNCIA FOR MENOR QUE 50M VAI GUARDAR AS INFORMAÇÕES DA VIAGEM NA VARIÁVEL EVENT
        if (arrivedDestine < 0.05) {
          let event = {
            travel_id: travel,
            local_id: local,
            event_id: 8,
            event_latitude: newLocation.latitude,
            event_longitude: newLocation.longitude,
            event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            // metadata: {
            //   address: endereco,
            // },
          };

          //INCLUI A VERIFICAÇÃO DE MISSÔES PARA O LOCAL
          if (hasMission) {
            const responseEvent = await EventsController.postEvent(
              EVENT_TYPE.NO_ACTION,
              token,
              `/travel/event/${travel}`,
              event,
              0
            );
            if (responseEvent) {
              setNewLocalVisible(true); // DIZ QUE TEM UM NOVO LOCAL DISPONIVEL
            }
          } else {
            // FAZ A REQUISIÇÃO DE MUDAR O STATUS DO LOCAL PARA CONCLUIDO
            const response = await EventsController.postEvent(
              EVENT_TYPE.LOCAL_CHANGE_STATUS,
              token,
              `/local/${local}/change-status`,
              { status: "CONCLUIDO", uuid_group: true },
              local
            );

            if (response) {
              let objSend = {
                status: "CONCLUIDO",
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
                event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
              };

              // FAZ A REQUISIÇÃO DE MUDAR O STATUS DA VIAGEM PARA CONCLUIDO
              const responseTravel = await EventsController.postEvent(
                EVENT_TYPE.TRAVEL_CHANGE_STATUS,
                token,
                `/travel/${travel}/change-status`,
                objSend,
                travel
              );

              if (responseTravel) {
                const responseEvent = await EventsController.postEvent(
                  EVENT_TYPE.NO_ACTION,
                  token,
                  `/travel/event/${travel}`,
                  event,
                  0
                );
                if (responseEvent) {
                  //MOSTRA O MODAL DE CHEGADA NO DESTINO
                  showModalArrivedDestine();
                  await StorageController.removePorChave(DESTINY_PAGE);
                }
              }
            }
          }
        } else {
          setRefresh(!refresh);
        }
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.response.data);
      Alert.alert("Atenção", error.response.data.message, [{ text: "OK" }], {
        cancelable: false,
      });

      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    console.log("VERIFICA SE O USUÁRIO CHEGOU AO LOCAL A CADA 10 SEGUNDOS");
    console.log("refresh", refresh);
    // VERIFICA SE O USUÁRIO CHEGOU AO LOCAL A CADA 10 SEGUNDOS
    setTimeout(() => {
      interval();
    }, 10000);
  }, [refresh]);

  //roda o init sempre que navegar para esta tela
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // PEGA A LOCALIZAÇÃO ATUAL DO USUÁRIO
  async function getLocation() {
    try {
      await LocationController.verificaAtivacaoLocalizacao();
      await LocationController.verificaAutorizacaoLocalizacao();

      const location = await LocationController.buscaLocal();
      if (location) {
        const { latitude, longitude } = location.coords;
        const atualLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        return atualLocation;
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  }

  // FUNÇÃO DE REDIRECIONAMENTO PARA A TELA DE MISSÕES
  const navigationMissions = async () => {
    await StorageController.removePorChave(ARRIVAL_NOTIFICATION);
    await StorageController.removePorChave(LOCAL_COORD);
    setNewLocalVisible(false);
    navigation.navigate("Missions", data.id);
  };

  // NAVEGA PARA A TELA DE NOVO ENDEREÇO
  async function toolTip() {
    try {
      navigation.navigate("NewAddress", local);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header
            navigation={navigation}
            rota="SelectNavigation"
            parameter={{ localId: local }}
          />
        </View>
        {isBusy && (
          <View style={{ flex: 15 }}>
            <Loading></Loading>
          </View>
        )}
        {!isBusy && (
          <View style={styles.body}>
            {/* <View style={styles.overMap}> */}
            <View style={styles.informations}>
              <Text style={styles.textInformation}>Viagem em andamento</Text>
              <Text style={styles.textInformation}>
                Order N.º {data.travel_id}
              </Text>
            </View>
            {/* </View> */}
            {/* COMPONENTE VISUAL DO MAPA */}
            <MapView
              initialRegion={initialLocation}
              style={styles.map}
              // region={location}
              // provider={"google"}
              rotateEnabled={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
            >
              {/* {markers.map((marker, index) => ( */}
              {/* MARCADOR DO LOCAL INCIAL */}
              <Marker coordinate={initialLocation}>
                <View style={styles.circle}>
                  <Text style={styles.pinText}>0</Text>
                </View>
              </Marker>
              {/* MARCADOR DA LOCALIZAÇÃO ATUAL */}
              <Marker coordinate={atualLocation}>
                <Image
                  style={styles.mapMarker}
                  source={require("../image/marker.png")}
                ></Image>
              </Marker>
              {/* MARCADOR DO LOCAL DE DESTINO */}
              <Marker coordinate={destineLocation}>
                <View style={styles.circle}>
                  <Text style={styles.pinText}>1</Text>
                </View>
              </Marker>
              {/* ))} */}
              {/* LINHA DE MARCAÇÃO DA ROTA DE DIREÇÃO */}
              <MapViewDirections
                lineCap="square"
                lineDashPattern={[1]}
                strokeWidth={3}
                strokeColor="#275D85"
                origin={initialLocation}
                // waypoints={markers}
                destination={destineLocation}
                apikey={GOOGLE_MAPS_APIKEY}
              />
            </MapView>
            {/* <View style={styles.viewButton}> */}
            <Pressable
              style={styles.atualizar}
              android_ripple={{ color: "white" }}
              onPress={() => console.log("relatar problema")}
            >
              <MaterialCommunityIcons
                name="alert-octagon-outline"
                size={20}
                color="white"
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 12,
                  textAlign: "center",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Relatar problema
              </Text>
            </Pressable>
            {/* </View> */}
          </View>
        )}
        <View style={styles.footer}>
          <Footer
            navigation={navigation}
            radar="NewAddress"
            localId={data.id}
          />
        </View>
        {!newLocalVisible && activeDestineChange && (
          <>
            <Pressable onPress={toolTip} style={styles.tooltipModal}>
              <Text style={styles.textTooltip}>
                Você chegou ao destino? Altere o local de entrega/coleta!
              </Text>
            </Pressable>
            <Pressable style={styles.tooltip} onPress={toolTip}></Pressable>
            <View style={styles.arrow} />
          </>
        )}
      </SafeAreaView>
      {/* MODAL DE CONFIRMAÇÃO DE CHEGADA NO LOCAL */}
      <Modal transparent={true} visible={newLocalVisible} dismissable={false}>
        <View style={styles.modal}>
          {/* <View style={{ alignItems: "center" }}> */}
          <View style={styles.modalLocal}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textModal}>Você chegou no seu </Text>
              <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                local?
              </Text>
            </View>
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={require("../image/local.png")}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={navigationMissions}
              >
                confirmar chegada
              </Button>
              <Button
                style={styles.buttonReport}
                contentStyle={{ height: 40, width: "100%" }}
                mode="text"
                labelStyle={{ color: "#275D85" }}
                onPress={() => {
                  setNewLocalVisible(false);
                  navigation.navigate("NewAddress", data.id);
                }}
              >
                alteração de local
              </Button>
            </View>
          </View>
          {/* </View> */}
        </View>
      </Modal>
      {/* MODAL DE FINALIZAÇÃO DE VIAGEM */}
      <Modal transparent={true} visible={arriviedDestine} dismissable={false}>
        <ModalFinishTravel
          navigation={navigation}
          hideModal={hideModalArrivedDestine}
        ></ModalFinishTravel>
      </Modal>
    </>
  );
}
