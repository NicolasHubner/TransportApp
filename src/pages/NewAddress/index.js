import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LocationController from "../../controllers/LocationController";
import StorageController from "../../controllers/StorageController";
import {
  TOKEN_KEY,
  LOCAL_COORD,
  ARRIVAL_NOTIFICATION,
} from "../../constants/constants";
import * as Location from "expo-location";
import { Button } from "react-native-paper";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { api } from "../../services/api";
import styles from "./styles";
import crashlytics from '@react-native-firebase/crashlytics';

export default function NewAddress({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(false);
  const [address, setAddress] = useState("");
  // const [endereco, setEndereco] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [token, setToken] = useState("");
  const [local, setLocal] = useState("");
  const [coords, setCoords] = useState({});

  // const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  // VERIFICA A AUTORIZAÇÃO DE LOCALIZAÇÃO E QUARDA O TOKEN E ID ENVIADO ATRAVES DO ROUTE.PARAMS
  async function init() {
    try {
      await LocationController.verificaAtivacaoLocalizacao();
      await LocationController.verificaAutorizacaoLocalizacao();
      const tokenKey = await StorageController.buscarPorChave(TOKEN_KEY);
      setToken(tokenKey);
      const id = await route.params;
      setLocal(id);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE O APP INICIALIZA
  useEffect(() => {
    init();
  }, []);

  // GUARDA O VALOR DO ENDEREÇO DIGITADO PELO USUARIO
  const onChangeAddress = (text) => {
    setAddress(text);
  };

  // BUSCA O ENDEREÇO COMPLETO, FAZ A REQUISIÇÃO DE MUDANÇA DE LOCALIZAÇÃO E REDIRECIONA PARA O EXPANDED MAP
  async function changeGpsLocation() {
    setButtonLoading(true);
    try {
      await LocationController.verificaAtivacaoLocalizacao();
      const tokenKey = await StorageController.buscarPorChave(TOKEN_KEY);
      const id = await route.params;

      let e;
      let endereco_completo = "";

      let location = await LocationController.buscaLocal();
      if (location) {
        const { latitude, longitude } = location.coords;
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        //BUSCA ENDEREÇO
        if (latitude && longitude) {
          e = await LocationController.buscaEnderecoCompleto(
            latitude,
            longitude
          );
          if (e) {
            const { street, name, district } = e[0];
            endereco_completo = street + ", " + name + " - " + district;
            setAddress(endereco_completo);
          }
        }

        const coords = {
          address: endereco_completo,
          location_latitud: JSON.stringify(latitude),
          location_longitud: JSON.stringify(longitude),
        };
        setCoords(coords);

        const response = await api.put(
          `/local/${id}/change-location`,
          coords,
          { headers: { Authorization: `bearer ${tokenKey}` } }
        );
        
        if (response) {
          const coord = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          console.log(coord);
          await StorageController.salvarPorChave(
            LOCAL_COORD,
            JSON.stringify(coord)
          );
          await StorageController.removePorChave(ARRIVAL_NOTIFICATION);
          navigation.navigate("ExpandedMap");
        }
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
      setButtonLoading(false);
    }
  }

  // BUSCA A LATITUDE E A LONGITUDE PELO ENDEREÇO INSERIDO, FAZ A REQUISIÇÃO DE MUDANÇA DE LOCALIZAÇÃO E REDIRECIONA PARA O EXPANDED MAP
  async function changeAddressLocation() {
    setButtonLoading(true);
    try {
      const tokenKey = await StorageController.buscarPorChave(TOKEN_KEY);
      
      const id = await route.params;
      const latLon = await LocationController.buscaLatLonPorEndereco(address);
      
      if (latLon.length > 0) {
        const endereco = {
          address: address,
          location_latitud: JSON.stringify(latLon[0].latitude),
          location_longitud: JSON.stringify(latLon[0].longitude),
        };

        const response = await api.put(
          `/local/${id}/change-location`,
          endereco,
          { headers: { Authorization: `bearer ${tokenKey}` } }
        );
        if (response) {
          const coord = {
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          await StorageController.salvarPorChave(
            LOCAL_COORD,
            JSON.stringify(coord)
          );
          await StorageController.removePorChave(ARRIVAL_NOTIFICATION);
          navigation.navigate("ExpandedMap");
        }
      } else {
        Alert.alert("Atenção", "Informe um endereço válido", [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } catch (error) {
      crashlytics().recordError(error);
      if (error.response.data.message) {
        Alert.alert("AVISO", error.response.data.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("AVISO", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setButtonLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Header navigation={navigation} rota="ExpandedMap" />
      </View>
      {isBusy && <Loading></Loading>}
      {!isBusy && (
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.title}>Inserir novo endereço manualmente</Text>
            <TextInput
              placeholder="Rua, nº, Bairro - Cidade"
              style={styles.input}
              onChangeText={onChangeAddress}
              value={address}
            />
            <Button
              style={styles.styleButton}
              contentStyle={styles.button}
              mode="contained"
              disabled={buttonLoading}
              loading={buttonLoading}
              labelStyle={{ color: "white" }}
              onPress={changeAddressLocation}
            >
              inserir localização
            </Button>
            <View style={styles.line}></View>
            <Text style={{ marginBottom: 20, fontSize: 16, color: "#6C6C6C" }}>
              ou
            </Text>
            <Button
              style={styles.styleButton}
              icon="radar"
              contentStyle={styles.button}
              mode="contained"
              disabled={buttonLoading}
              loading={buttonLoading}
              labelStyle={{ color: "white" }}
              onPress={changeGpsLocation}
            >
              estou no novo local
            </Button>
          </View>
        </View>
      )}
      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
