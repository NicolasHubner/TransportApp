import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  Alert,
  TextInput,
  BackHandler,
  LogBox,
} from "react-native";
import ModalLeavingMission from "../../components/Modals/ModalLeavingMission";
import LocationController from "../../controllers/LocationController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageController from "../../controllers/StorageController";
import ModalInsuccess from "../../components/Modals/ModalInsuccess";
import ModalContact from "../../components/Modals/ModalContact";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { CommonActions } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ModalOcr from "../../components/Modals/ModalOcr";
import RNPickerSelect from "react-native-picker-select";
import NetInfo from "@react-native-community/netinfo";
// import apiFormData from "../../services/apiFormData";
import * as ImagePicker from "expo-image-picker";
// import RouteStatus from "../../components/RouteStatus";
// import {removeAllTasks} from "../../backgroundTasks";
import Loading from "../../components/Loading";
import Spinner from "../../components/Spinner";
import AuthContext from "../../contexts/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "react-native-paper";
// import apiOcr from "../../services/apiOcr";
import { api, apiFormData, apiOcr } from "../../services/api";
import {
  IMAGE_RECEIPT,
  IMAGE_PHOTO,
  TOKEN_KEY,
  LAST_LOCATION,
  TRAVEL_ID,
  LOCAL_ID,
  DESTINY_PAGE,
} from "../../constants/constants";
import { format } from "date-fns";
import styles from "./styles";

export default function DeliveryProcess({ navigation, route }) {
  const [address, setAddress] = useState("");
  const [isBusy, setIsBusy] = useState(true);
  // const [hasTrip, setHasTrip] = useState(true);
  const [returnPage, setReturnPage] = useState(false);
  const [localId, setLocalId] = useState("");
  const [destinyId, setDestinyId] = useState("");
  const [newMissionVisible, setNewMissionVisible] = useState(false);
  const [newLocationVisible, setNewLocationVisible] = useState(false);
  const [goDestineVisible, setGoDestineVisible] = useState(false);
  const [contatoVisible, setContatoVisible] = useState(false);
  const [endTripVisible, setEndTripVisible] = useState(false);
  const [insuccessVisible, setInsuccessVisible] = useState(false);
  const [mission, setMission] = useState({});
  const [imageReceipt, setImageReceipt] = useState(null);
  const [imagePhoto, setImagePhoto] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [dataFlag, setDataFlag] = useState({});
  const [travelId, setTravelId] = useState("");
  const [missionId, setMissionId] = useState(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [tokenKey, setTokenKey] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [locationInterval, setLocationInterval] = useState(false);
  const [missionLocation, setMissionLocation] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [documentsLength, setDocumentsLength] = useState(0);
  const [imageQuantity, setImageQuantity] = useState(0);
  const [isConnected, setIsConnected] = useState();
  const [ocrVisible, setOcrVisible] = useState(false);
  const [currentNf, setCurrentNf] = useState({});
  const [attempt, setAttempt] = useState([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrInsuccess, setOcrInsuccess] = useState(false);
  const [motivo, setMotivo] = useState("0");
  const [observation, setObservation] = useState(null);
  const [currentNfReport, setCurrentNfReport] = useState(null);
  const [arrayMotivos, setArrayMotivos] = useState([
    {
      label: "Selecione um motivo:",
      value: "0",
    },
  ]);

  const placeholderMotivo = {};
  LogBox.ignoreAllLogs();

  const showModalMission = () => setNewMissionVisible(true);
  const hideModalMission = () => setNewMissionVisible(false);

  const showModalLocation = () => setNewLocationVisible(true);
  const hideModalLocation = () => setNewLocationVisible(false);

  const showModalTrip = () => setEndTripVisible(true);
  const hideModalTrip = () => setEndTripVisible(false);

  const showModalInsuccess = () => setInsuccessVisible(true);
  const hideModalInsuccess = () => setInsuccessVisible(false);

  const showModalContato = () => setContatoVisible(true);
  const hideModalContato = () => setContatoVisible(false);

  const showModalReport = () => setReportVisible(true);
  const hideModalReport = () => setReportVisible(false);

  const showDestine = () => setGoDestineVisible(true);
  const hideDestine = () => setGoDestineVisible(false);

  const showModalLeavingMission = () => setAlertVisible(true);
  const hideModalLeavingMission = () => setAlertVisible(false);

  const showModalOcr = () => setOcrVisible(true);
  const hideModalOcr = () => setOcrVisible(false);

  const showModalOcrInsuccess = () => setOcrInsuccess(true);
  const hideModalOcrInsuccess = () => setOcrInsuccess(false);

  const { signOut } = useContext(AuthContext);

  //ATUALIZA O STATUS DA INTERNET CONECTADO/DESCONECTADO
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (isConnected !== state.isInternetReachable) {
      setIsConnected(state.isInternetReachable);
    }
  });

  // VERIFICA SE O BOTÃO DE VOLTAR DO APP FOI ACIONADO
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, [returnPage]);

  // SE O BOTÃO DE VOLTAR FOI ACIONADO ACIONA A FUNÇÃO "validateReturnFunction"
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      validateReturnFunction
    );

    return () => backHandler.remove();
  }, [returnPage]);

  // PEGA OS DADOS DO LOCAL E DA MISSÃO
  async function init() {
    try {
      // await StorageController.removePorChave(IMAGE_RECEIPT);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      setTokenKey(token);
      let params = await route.params;
      let missionId = null;
      let localId = null;
      if (params?.missionId) {
        missionId = params.missionId;
      }
      if (params?.localId) {
        localId = params.localId;
      }
      setLocalId(localId);
      let imagesReceipt = await StorageController.buscarPorChave(IMAGE_RECEIPT);
      let images = JSON.parse(imagesReceipt);
      let imagesPhoto = await StorageController.buscarPorChave(IMAGE_PHOTO);
      let photos = JSON.parse(imagesPhoto);
      let cont = 0;
      images?.map((value, index) => {
        if (value !== null) {
          if (value.verified === true || value.verified === false) {
            cont++;
          }
        }
      });
      setImageQuantity(cont);
      setImageReceipt(images);
      setImagePhoto(photos);
      setMissionId(missionId);

      if (localId && missionId) {
        const response = await api.get(
          `/app/travel/local/${localId}/missions/${missionId}`,
          { headers: { Authorization: `bearer ${token}` } }
        );
        if (response) {
          // console.log("########### ->", response.data.data.travel_documents);
          setDocumentsLength(response.data.data.travel_documents.length);
          setTravelId(response.data.data.travel_id);
          setDocuments(response.data.data.travel_documents);
          setAddress(response.data.data.address);
          setMission(response.data.data.mission);
          setMissionLocation({
            latitude: JSON.parse(response.data.data.latitud),
            longitude: JSON.parse(response.data.data.longitud),
          });
        }
      }
      const responseReason = await api.get(`/app/failure/reasons`, {
        params: { type: 2 },
        headers: { Authorization: `bearer ${token}` },
      });
      if (responseReason) {
        const motivos = responseReason.data;
        motivos.unshift({
          label: "Selecione um motivo:",
          value: 0,
        });
        setArrayMotivos(motivos);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        // Alert.alert("Aviso", error.response.data.message, [{ text: "OK" }], {
        //   cancelable: false,
        // });
      } else {
        Alert.alert("Aviso", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setIsBusy(false);
      const interval = setInterval(() => {
        checkLocation();
      }, 10000);
      setLocationInterval(interval);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE O APP INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // GUARDA O VALOR DE OBSERVAÇÃO
  const onChangeObservation = (text) => {
    setObservation(text);
    // checkInput();
    // setErrors(INITIAL_VALUES);
    // setVisible(false);
  };

  // QUARDA O VALOR DE MOTIVO
  function selecionaMotivo(id) {
    setMotivo(id);
    if (id === 0) {
      setObservation(null);
    } else {
      setMotivo(id);
    }
  }

  // FUNÇÃO DE LOGOUT
  async function logoutProcess() {
    setButtonLoading(true);
    try {
      signOut();
    } catch (error) {
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      hideModalTrip();
      setButtonLoading(false);
    }
  }

  // CALCULA A DISTANCIA DA ULTIMA LOCALIZAÇÃO COM A LOCALIZAÇÃO DA MISSÃO
  const checkLocation = async () => {
    try {
      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      if (lastLocation && missionLocation) {
        const arrivedDestine = await LocationController.calculaDistancia(
          lastLocation?.latitude,
          lastLocation?.longitude,
          missionLocation.latitude,
          missionLocation.longitude
        );

        if (arrivedDestine > 0.05) {
          showModalLeavingMission();
        } else {
          hideModalLeavingMission();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // PEGA A IMAGEM DA CÂMERA
  const pickImageReceipt = async (nfId, nf) => {
    try {
      // setReturnPage(true);
      let tentativa = attempt ? attempt : [];
      if (!tentativa[nfId] || tentativa[nfId] < 3) {
        setCurrentNf({ nf: nf, nfId: nfId });
        let nf_images = imageReceipt ? imageReceipt : [];
        if (
          nf_images[nfId] &&
          nf_images[nfId].image &&
          nf_images[nfId].verified === true
        ) {
          Alert.alert("Atenção", "Canhoto já inserido", [{ text: "OK" }], {
            cancelable: false,
          });
        } else {
          let camera = await ImagePicker.getCameraPermissionsAsync();
          let media = await ImagePicker.getMediaLibraryPermissionsAsync();

          if (camera.granted && media.granted) {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              base64: true,
            });

            if (result.uri) {
              const dataCompressed = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 600 } }],
                { compress: 0.8 }
              );

              if (dataCompressed.uri) {
                const ocr = await validateOcr(result.base64, nf, nfId);
                if (ocr) {
                  nf_images[nfId] = {
                    image: dataCompressed.uri,
                    verified: true,
                  };
                  let quantity = imageQuantity + 1;
                  setImageQuantity(quantity);
                } else {
                  nf_images[nfId] = {
                    image: dataCompressed.uri,
                    verified: "",
                  };
                }
                console.log("data ->", nf_images[nfId].verified);
                await StorageController.imageReceiptSave(nf_images);
              }
            }
          } else {
            await ImagePicker.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          }
        }
      } else {
        showModalOcrInsuccess();
      }
    } catch (error) {
      console.log("DeliveredProcess.pickImageReceipt",error.message);
    } finally {
      init();
    }
  };

  // PEGA A IMAGEM DA GALERIA
  const pickImagePhoto = async () => {
    try {
      setReturnPage(true);
      if (imagePhoto) {
        navigation.navigate("PhotoGallery", mission);
      } else {
        let camera = await ImagePicker.getCameraPermissionsAsync();
        let media = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (camera.granted && media.granted) {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            // base64: true,
          });

          const dataCompressed = await ImageManipulator.manipulateAsync(
            result.uri,
            [{ resize: { width: 600 } }],
            { compress: 0.8 }
          );

          if (dataCompressed) {
            let imagesPhoto = [dataCompressed.uri];
            await StorageController.imagePhotoSave(imagesPhoto);
          }
        } else {
          await ImagePicker.requestCameraPermissionsAsync();
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
      }
    } catch (error) {
      console.log("DeliveryProcess.pickImagePhoto",error.message);
    } finally {
      init();
    }
  };

  // CONCLUI A MISSÃO
  async function finishDelivery() {
    try {
      setButtonLoading(true);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      let data = new FormData();

      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      console.log(lastLocation);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      data.append(`data[0][status]`, "success");
      data.append(`data[0][haveImg]`, "true");
      data.append(`data[0][lat]`, lastLocation?.lat || null);
      data.append(`data[0][long]`, lastLocation?.long || null);
      data.append(
        `data[0][event_at]`,
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      );

      let cont = 0;
      if (imageReceipt) {
        imageReceipt.map((value, index) => {
          if (value) {
            data.append(`data[${cont}][img]`, {
              uri: value.image,
              name: `data[${cont}][img]`,
              type: "image/jpg",
            });
            data.append(`data[${cont}][image_type]`, "canhoto");
            data.append(`data[${cont}][documentId]`, index);
            cont++;
          }
        });
      }

      imagePhoto.map((value, index) => {
        data.append(`data[${cont}][img]`, {
          uri: value,
          name: `data[${cont}][img]`,
          type: "image/jpg",
        });
        data.append(`data[${cont}][image_type]`, "fachada");
        cont++;
      });

      if (isConnected) {
        const response = await apiFormData.post(
          `/app/travel/local/${mission.id}/changeMission`,
          data,
          { headers: { Authorization: `bearer ${token}` } }
        );
        if (response) {
          AsyncStorage.removeItem(IMAGE_RECEIPT);
          AsyncStorage.removeItem(IMAGE_PHOTO);

          nextAction(mission.id, token);
          clearInterval(locationInterval);
        }
      } else {
        Alert.alert(
          "AVISO",
          "Você precisa estar conectado para finalizar uma entrega/coleta",
          [{ text: "OK" }],
          {
            cancelable: false,
          }
        );
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      setButtonLoading(false);
    }
  }

  // VERIFICA A PRÓXIMA AÇÃO APÓS FINALIZAR A MISSÃO
  const nextAction = async (missionId, token) => {
    try {
      const response = await api.post(
        `/app/travel/mission/${missionId}/next-step?token=${token}`,
        {},
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (response) {
        await StorageController.removePorChave(LOCAL_ID);
        setDataFlag(response.data.data);
        if (response.data.data.nextAction === "local") {
          showModalLocation();
        } else if (response.data.data.nextAction === "mission") {
          showModalMission();
        } else if (response.data.data.nextAction === "missionFailed") {
          showModalInsuccess();
        } else if (response.data.data.nextAction === "destiny") {
          setDestinyId(response.data.data.local.id);
          showDestine();
        } else if (response.data.data.nextAction === "travel") {
          await StorageController.removePorChave(TRAVEL_ID);
          showModalTrip();
        }
      }
    } catch (e) {
      if (e.response) {
        console.log("erro na flag");
        Alert.alert("Atenção", e.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
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
          Alert.alert("Atenção", error.message, [{ text: "OK" }], {
            cancelable: false,
          });
        }
      }
    } finally {
      setButtonLoading(false);
    }
  };

  // TERMINA A VIAGEM
  const finishTravel = async () => {
    try {
      setButtonLoading(true);
      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      let objSend = {
        status: "CONCLUIDO",
        event_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        latitude: lastLocation?.lat || null,
        longitude: lastLocation?.long || null,
      };

      const responseTravel = await api.post(
        `/app/travel/${travelId}/change-status`,
        objSend,
        { headers: { Authorization: `bearer ${tokenKey}` } }
      );
      if (responseTravel) {
        hideModalInsuccess();
        hideDestine();
        navigation.navigate("Trips");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  // FAZ A VALIDAÇÃO DA OCR
  const validateOcr = async (base64, nf, nfId) => {
    try {
      setOcrLoading(true);
      let tentativa = attempt ? attempt : [];

      tentativa[nfId] = tentativa[nfId] ? tentativa[nfId] + 1 : 1;

      if (tentativa[nfId] <= 3) {
        setAttempt(tentativa);
        const request = {
          requests: [
            {
              features: [
                {
                  type: "DOCUMENT_TEXT_DETECTION",
                },
              ],
              image: {
                content: base64,
              },
            },
          ],
        };

        const response = await apiOcr.post(
          "/v1/images:annotate?key=AIzaSyCNcKvd7ez5gZp5FuWgplYmaBTJag72c8I",
          request
        );

        if (response.data.responses[0].textAnnotations) {
          let stringResultado =
            response.data.responses[0].textAnnotations[0].description;
          stringResultado = stringResultado
            .replace(/,/g, "")
            .replace(/\./g, "");

          let buscaPelaNota = stringResultado.indexOf(nf) != -1;
          if (buscaPelaNota) {
            console.log("a nota enviada esta correta");
            return true;
          } else {
            setOcrLoading(false);
            console.log("a nota enviada não condiz com a entrega");
            showModalOcr();
            return false;
          }
        } else {
          setOcrLoading(false);
          console.log("erro ao validar ocr");
          showModalOcr();
          return false;
        }
      } else {
        showModalOcrInsuccess();
      }
    } catch (e) {
      console.log(e.response);
      console.log("mensagem do ocr->", e.message);
    } finally {
      setOcrLoading(false);
    }
  };

  // MOSTRA O MODAL DE INSUCESSO
  const showReport = async (nfId) => {
    try {
      hideModalOcr();
      showModalOcrInsuccess();
      setCurrentNfReport(nfId);
    } catch (e) {
      console.log(e.message);
    }
  };

  // ENVIA O REPORT
  const sendReport = async () => {
    try {
      setButtonLoading(true);
      let report = {
        status: "FALHADO",
        document_id: currentNfReport,
        failure_reasons_id: motivo,
      };

      if (observation) {
        report = { ...report, failure_reasons: observation };
      }

      const response = await api.put(
        `/app/travel/local/${localId}/document`,
        report,
        { headers: { Authorization: `bearer ${tokenKey}` } }
      );

      if (response.data.success) {
        let nf_images = imageReceipt;
        nf_images[currentNfReport].verified = false;
        let quantity = imageQuantity + 1;
        setImageQuantity(quantity);
        setImageReceipt(nf_images);
        await StorageController.imageReceiptSave(nf_images);
      } else {
        Alert.alert("Atenção", response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } catch (e) {
      if (e.response) {
        Alert.alert("Atenção", e.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("Atenção", e.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setMotivo("0");
      setObservation(null);
      hideModalOcrInsuccess();
      setButtonLoading(false);
    }
  };

  //valida se pode ou não retornar para a tela anterior (lista de missões)
  const validateReturnFunction = async () => {
    console.log("chega aqui --->", returnPage);
    if (returnPage) {
      Alert.alert(
        "Aviso",
        "Não é possível retornar após ter inciado a entrega/coleta.\nFinalize ou registre um insucesso",
        [{ text: "OK" }],
        {
          cancelable: false,
        }
      );
    } else {
      navigation.navigate("Missions", localId);
    }
  };

  //Define a navegação para o destino como padrão
  const setDestinyPage = async () => {
    let destinyPage = {
      page: "SelectNavigation",
      data: {
        localId: destinyId,
        destiny: true,
      }
    }
    await StorageController.salvarPorChave(DESTINY_PAGE, destinyPage);

    navigation.dispatch(
      CommonActions.navigate({
        name: "SelectNavigation",
        params: {
          localId: destinyId,
          destiny: true,
        },
      })
    );
    hideDestine();
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Header
            navigation={navigation}
            rota="Missions"
            parameter={localId}
            returnAlert={returnPage}
          />
        </View>
        {isBusy && (
          <View style={{ flex: 15 }}>
            <Loading></Loading>
          </View>
        )}
        {!isBusy && (
          <View style={styles.body}>
            {mission && (
              <>
                <View style={styles.rectangle}>
                  <View style={styles.marginRectangle}>
                    <Text style={styles.title}>Viagem em andamento</Text>
                    <Text style={styles.title}>Order.º {travelId}</Text>
                  </View>
                </View>
                <View style={styles.card}>
                  <View style={styles.margin}>
                    <View style={styles.infoContainer}>
                      <View>
                        <View style={styles.nameContainer}>
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={25}
                            color="#B98D04"
                          />
                          <Text style={styles.name}>
                            {mission.contact?.name}
                          </Text>
                        </View>
                        {mission.description && (
                          <Text style={{ marginLeft: 15 }}>
                            {mission.description
                              ? `"${mission.description}"`
                              : ""}
                          </Text>
                        )}
                      </View>
                      <View style={styles.dataContainer}>
                        <View style={{ width: "65%" }}>
                          <Text
                            numberOfLines={1}
                            style={{ fontSize: 14, fontWeight: "700" }}
                          >
                            {address}
                          </Text>
                          <Text numberOfLines={1}>{mission.complement}</Text>
                        </View>
                        <Pressable
                          disabled={buttonLoading}
                          onPress={showModalContato}
                          style={styles.contato}
                        >
                          <Image
                            style={styles.contatoImage}
                            source={require("./image/contato.png")}
                          />
                          <Text style={{ fontSize: 14, fontWeight: "700" }}>
                            Contato
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.cardContainer}>
                      <ScrollView showsVerticalScrollIndicator={true}>
                        {documents?.map((value, index) => (
                          <Pressable
                            key={index}
                            disabled={
                              buttonLoading ||
                              (imageReceipt &&
                                imageReceipt[value.id]?.verified === false)
                            }
                            onPress={() =>
                              pickImageReceipt(value.id, value.invoiceNumber)
                            }
                            style={styles.cardButton}
                          >
                            <View
                              style={{ width: "35%", alignItems: "center" }}
                            >
                              <Image
                                style={styles.houseImage}
                                source={require("./image/camera.png")}
                              />
                            </View>
                            <View
                              style={{ width: "40%", flexDirection: "column" }}
                            >
                              <Text
                                style={[styles.titleCard, { marginBottom: 5 }]}
                              >
                                Foto do canhoto
                              </Text>
                              <Text>
                                NF {value.invoiceNumber} - {value.quantity}{" "}
                                {value.quantity > 1 ? "Itens" : "Item"}
                              </Text>
                            </View>
                            {imageReceipt &&
                              imageReceipt[value.id]?.verified === true && (
                                <View
                                  style={{
                                    width: "25%",
                                    alignItems: "center",
                                  }}
                                >
                                  <MaterialCommunityIcons
                                    name={"check-circle"}
                                    size={35}
                                    color={"#4FB438"}
                                  />
                                </View>
                              )}
                            {imageReceipt &&
                              imageReceipt[value.id]?.verified === false && (
                                <View
                                  style={{
                                    width: "25%",
                                    alignItems: "center",
                                  }}
                                >
                                  <MaterialCommunityIcons
                                    name={"alert-circle"}
                                    size={35}
                                    color={"#F1C525"}
                                  />
                                </View>
                              )}
                            {/* <View style={{ width: "25%" }} /> */}
                          </Pressable>
                        ))}
                        <Pressable
                          disabled={buttonLoading}
                          onPress={pickImagePhoto}
                          style={styles.cardButton}
                        >
                          <View style={{ width: "35%", alignItems: "center" }}>
                            <Image
                              style={styles.cameraImage}
                              source={require("./image/casa.png")}
                            />
                          </View>
                          <View
                            style={{ width: "40%", flexDirection: "column" }}
                          >
                            <Text style={styles.titleCard}>Fotos</Text>
                          </View>
                          {imagePhoto && (
                            <View
                              style={{
                                width: "25%",
                                alignItems: "center",
                              }}
                            >
                              <MaterialCommunityIcons
                                name="check-circle"
                                size={35}
                                color="#4FB438"
                              />
                            </View>
                          )}
                          {!imagePhoto && <View style={{ width: "25%" }} />}
                        </Pressable>
                      </ScrollView>
                    </View>

                    <View style={styles.finishContainer}>
                      <Button
                        disabled={
                          !imagePhoto ||
                          buttonLoading ||
                          (imageReceipt
                            ? imageQuantity < documentsLength
                            : documentsLength > 0)
                        }
                        contentStyle={styles.button}
                        mode="contained"
                        labelStyle={{ color: "white" }}
                        loading={buttonLoading}
                        // onPress={() => navigation.navigate("LocalDetails", trip)}
                        onPress={finishDelivery}
                      >
                        finalizar entrega / coleta
                      </Button>
                      <Button
                        disabled={buttonLoading}
                        style={styles.buttonReport}
                        contentStyle={{ height: 40 }}
                        mode="outlined"
                        labelStyle={{ color: "#275D85" }}
                        onPress={showModalReport}
                      >
                        insucesso
                      </Button>
                    </View>
                  </View>
                </View>
              </>
            )}
            {!mission && <Text>Não há dados para o destinatário</Text>}
          </View>
        )}
        <View style={styles.footer}>
          <Footer />
        </View>
      </SafeAreaView>
      <Modal transparent={true} visible={newMissionVisible} dismissable={false}>
        <View style={styles.modal}>
          <View style={styles.modalLocal}>
            <Text style={styles.textModal}>
              Entrega/coleta para destinatário realizado com
              <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                {" "}
                sucesso!
              </Text>
            </Text>
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={require("./image/nextMission.png")}
              />
            </View>
            <View style={styles.buttonModal}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={() =>
                  navigation.navigate(
                    "Missions",
                    dataFlag.mission.travel_local_id
                  )
                }
              >
                ir para próximo destinatário
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={newLocationVisible}
        dismissable={false}
      >
        <View style={styles.modal}>
          <View style={styles.modalLocal}>
            <View>
              <Text style={styles.textModal}>
                Todas as entregas/coletas realizadas,
              </Text>
              <Text style={styles.textModal}>
                ir para o próximo
                <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                  {" "}
                  local!
                </Text>
              </Text>
            </View>
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={require("./image/nextLocation.png")}
              />
            </View>
            <View style={styles.buttonModal}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={() =>
                  navigation.navigate("Locals", dataFlag.local.travel_id)
                }
              >
                ir para próximo local
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={goDestineVisible} dismissable={false}>
        <View style={styles.modal}>
          <View style={styles.modalLocal}>
            <View>
              <Text style={styles.textModal}>
                Você realizou suas coletas/entregas, deseja ir para o
              </Text>
              <Text style={styles.textModal}>
                <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                  {" "}
                  local de fim?
                </Text>
              </Text>
            </View>
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={require("./image/nextLocation.png")}
              />
            </View>
            <View style={styles.buttonModal}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={setDestinyPage}
              >
                ir para o local de fim
              </Button>
              <Button
                contentStyle={[styles.button, { marginTop: 10 }]}
                mode="text"
                labelStyle={{ color: "#275D85" }}
                onPress={finishTravel}
              >
                encerrar viagem
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={endTripVisible} dismissable={false}>
        <View style={styles.modal}>
          <View style={styles.modalLocal}>
            <View>
              <Text style={styles.textModal}>
                Você
                <Text style={[styles.textModal, { fontWeight: "bold" }]}>
                  {" "}
                  finalizou{" "}
                </Text>
                <Text>sua viagem!</Text>
              </Text>
            </View>
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={require("./image/endTrip.png")}
              />
            </View>
            <View style={styles.buttonModal}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={() => navigation.navigate("Trips")}
              >
                voltar para a lista de viagens
              </Button>
              <Button
                contentStyle={[styles.button, { marginTop: 10 }]}
                mode="text"
                // labelStyle={{ color: "white" }}
                onPress={logoutProcess}
                loading={buttonLoading}
                disabled={buttonLoading}
              >
                sair do aplicativo
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={contatoVisible} dismissable={false}>
        <ModalContact
          local={mission}
          token={tokenKey}
          hideModal={hideModalContato}
        ></ModalContact>
      </Modal>
      <Modal transparent={true} visible={insuccessVisible} dismissable={false}>
        <View style={styles.modal}>
          <View style={styles.modalLocal}>
            <View>
              <Text style={styles.textModal}>
                Existem entregas/coletas com insucesso, gostaria de
                revisita-las?
              </Text>
            </View>
            <View style={styles.containerImage}>
              <Image style={styles.image} source={require("./image/van.png")} />
            </View>
            <View style={styles.buttonModal}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                labelStyle={{ color: "white" }}
                onPress={() => {
                  hideModalInsuccess(),
                    navigation.navigate("Insuccess", dataFlag.travel.locals);
                }}
              >
                revistar locais
              </Button>
              <Button
                contentStyle={[styles.button, { marginTop: 10 }]}
                mode="text"
                // labelStyle={{ color: "white" }}
                loading={buttonLoading}
                disabled={buttonLoading}
                onPress={finishTravel}
              >
                finalizar viagem
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={reportVisible} dismissable={false}>
        <ModalInsuccess
          func={hideModalReport}
          func2={nextAction}
          missionId={missionId}
        ></ModalInsuccess>
      </Modal>
      <Modal transparent={true} visible={alertVisible} dismissable={false}>
        <ModalLeavingMission
          hideModal={hideModalLeavingMission}
        ></ModalLeavingMission>
      </Modal>
      <Modal transparent={true} visible={ocrVisible} dismissable={false}>
        <ModalOcr
          hideModal={hideModalOcr}
          attempt={attempt}
          showReport={showReport}
          nf={currentNf}
          tryAgain={pickImageReceipt}
        ></ModalOcr>
      </Modal>
      <Modal transparent={true} visible={ocrLoading} dismissable={false}>
        <View style={styles.modal}>
          <View style={styles.modalOcr}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Aguarde enquanto a nota fiscal é identificada...
            </Text>
            <View style={{ height: "20%" }}>
              <Spinner color={"black"}></Spinner>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={ocrInsuccess} dismissable={false}>
        <View style={styles.modal}>
          <View style={styles.modalOcrInsuccess}>
            <View style={styles.titleContainer}>
              <Text style={styles.ocrTitle}>Reportar problema</Text>
              <MaterialCommunityIcons
                name="close"
                size={28}
                color="#3E3E3E"
                onPress={hideModalOcrInsuccess}
              />
            </View>

            <View style={styles.motivoContainer}>
              <Text style={styles.textBody}>Motivo</Text>
              <View style={styles.pickerSelect}>
                <RNPickerSelect
                  doneText="Confirmar"
                  placeholder={placeholderMotivo}
                  value={motivo}
                  onValueChange={(value) => {
                    selecionaMotivo(value);
                  }}
                  items={arrayMotivos}
                />
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.textBody}>Descrição</Text>
              <TextInput
                // keyboardType=""
                // autoCapitalize="none"
                style={styles.textInput}
                multiline={true}
                value={observation}
                maxLength={250}
                // disabled={isSubmit}
                onChangeText={onChangeObservation}
                // onSubmitEditing={solicitarAjuste}
                placeholder="Descreva o motivo que ocasionou a falha no reconhecimento da imagem."
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                contentStyle={styles.button}
                mode="contained"
                disabled={buttonLoading}
                loading={buttonLoading}
                onPress={sendReport}
              >
                enviar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
