// Alterações:
//
//   Tiaki - 23.12.2022
//         - adição de parametros (accuracy, altitude, altitudeAccuracy, direction)
//

import * as Location from "expo-location";
import {
  LAST_LOCATION,
  GPS_STATUS,
  LOCAL_ID,
  TRAVEL_ID,
  TOKEN_KEY,
  USER_ID,
} from "../constants/constants";
import * as Battery from "expo-battery";
import StorageController from "./StorageController";
import { format } from "date-fns";
import { api } from "../services/api";
import { LocationDao } from "../daos/LocationDao";
import crashlytics from "@react-native-firebase/crashlytics";

import axios from "axios";

function LocationController() {
  const saveLocationsTask = async (
    lat,
    long,
    speed,
    accuracy,
    altitude,
    altitudeAccuracy,
    direction
  ) => {
    //adicao de parametros
    try {
      const lastLocation = await saveLastLocation(lat, long);
      const arrayLocation = await saveArrayLocations(
        lat,
        long,
        speed,
        accuracy,
        altitude,
        altitudeAccuracy,
        direction
      ); //adicao de parametros

      if (lastLocation && arrayLocation) {
        await StorageController.salvarPorChave(GPS_STATUS, "SUCESSO");
        return { code: "SUCESSO", success: true };
      } else {
        return { code: "FALHOU", success: false };
      }
    } catch (error) {
      crashlytics().recordError(error);
      return { code: error.message, success: false };
    }
  };

  // SALVA A ULTIMA LOCALIZAÇÃO DO USUÁRIO (APENAS LATITUDE E LONGITUDE)
  const saveLastLocation = async (lat, long) => {
    try {
      const atualLocation = {
        lat,
        long,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      await StorageController.salvarPorChave(
        LAST_LOCATION,
        JSON.stringify(atualLocation)
      );
      return true;
    } catch (error) {
      crashlytics().recordError(error);
      return false;
    }
  };

  // SALVA A LOCALIZAÇÃO MAIS DETALHADA DO USUARIO
  const saveArrayLocations = async (
    lat,
    long,
    speed,
    accuracy,
    altitude,
    altitudeAccuracy,
    direction
  ) => {
    //adicao de parametros
    try {
      const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      let battery = await Battery.getBatteryLevelAsync();
      battery = Math.round(battery * 100);

      //adicao de parametros
      await LocationDao.save(
        lat,
        long,
        Math.round(speed),
        battery,
        1,
        "GPRS",
        "first_plane",
        date,
        accuracy,
        altitude,
        altitudeAccuracy,
        direction
      );

      return true;
    } catch (error) {
      crashlytics().recordError(error);
      console.log("saveArrayLocations", error.message);
      return false;
    }
  };

  //23.12.2022...
  // ENVIA A LOCALIZAÇÃO PARA A API
  const sendLocationsTask = async () => {
    try {
      let arrayLocations = await LocationDao.getTop(5);
      arrayLocations = JSON.parse(JSON.stringify(arrayLocations));
      const token = await StorageController.buscarPorChave(TOKEN_KEY);

      let dataEnv = false;

      if (arrayLocations.length > 0) {
        dataEnv = [];
        let dateSend = format(new Date(), "yyyy-MM-dd HH:mm:ss");

        for (let i = 0; i < arrayLocations.length; i++) {
          dataEnv.push({
            // user_id: userId,
            datetimeSent: dateSend,
            datetimeLoc: arrayLocations[i].date,
            lat: arrayLocations[i].lat,
            lng: arrayLocations[i].lng,
            accuracy: arrayLocations[i].accuracy,
            altitude: arrayLocations[i].altitude,
            altitudeAccuracy: arrayLocations[i].altitudeAccuracy,
            direction: arrayLocations[i].direction,
            speed: arrayLocations[i].speed,
            appStatus: arrayLocations[i].appStatus,
            gpsStatus: arrayLocations[i].gpsStatus,
            imei: "99-99-99-99-99-99",
            batteryStatus: arrayLocations[i].batteryStatus,
            networkStatus: arrayLocations[i].networkStatus,
          });
        }
      }

      const positions = { positions: dataEnv };

      if (dataEnv && token) {
        const response = await api.post(`/positions`, positions, {
          headers: { Authorization: `bearer ${token}` },
        });

        console.log("enviou positions!");

        if (response) {
          await LocationDao.deleteList(arrayLocations);
          return { code: "SUCESSO", success: true };
        }
      } else {
        return { code: "FALTA INFO", success: false };
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log("sendLocationsTask", error.message);

      if (error.response) {
        return { code: error.response.data, success: false };
      } else {
        return { code: error.message, success: false };
      }
    }
  };
  //...23.12.2022

  const buscaLocal = async () => {
    let location = null;
    try {
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          LocationActivityType: Location.ActivityType.OtherNavigation,
          maximumAge: 10000,
          timeout: 15000,
        });
      } catch {
        // AJUSTE FEITO PARA FACILITAR A LOCALIZAÇÃO DO DISPOSITIVO - BUSCA A ULTIMA LOCALIZACAO VALIDA EM UM PERIODO DE 5 SEGUNDOS
        location = await Location.getLastKnownPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          LocationActivityType: Location.ActivityType.OtherNavigation,
          maxAge: 5000,
          timeout: 15000,
        });
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      console.log("buscaLocal: ", location);
      saveLocationsTask(
        location.coords.latitude,
        location.coords.longitude,
        location.coords.speed,
        location.coords.accuracy,
        location.coords.altitude,
        location.coords.altitudeAccuracy,
        location.coords.direction
      );      
      return location;
    }
  };

  // BUSCA UM ENDEREÇO A PARTIR DA LATITUDE E LONGITUDE
  const buscaEndereco = async (latitude, longitude) => {
    let endereco = null;
    try {
      endereco = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      });

      // devolve o endereço retornado do GPS
      const [aux] = endereco;
      const { street: rua } = aux;
      endereco = { rua };
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
    return endereco;
  };

  // BUSCA O ENDEREÇO COMPLETO A PARTIR DA LATITUDE E LONGITUDE
  const buscaEnderecoCompleto = async (latitude, longitude) => {
    let endereco = null;
    try {
      endereco = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      });
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
    return endereco;
  };

  // BUSCA A LATITUDE E LONGITUDE A PARTIR DO ENDEREÇO
  const buscaLatLonPorEndereco = async (address) => {
    let latLon = null;
    try {
      latLon = await Location.geocodeAsync(address);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
    return latLon;
  };

  // FUNÇÃO AUXILIAR PARA CALCULAR A DISTÂNCIA
  const deg2rad = async (coord) => {
    var pi = Math.PI;
    return coord * (pi / 180);
  };

  // CALCULA A DISTÂNCIA ENTRE 2 PONTOS
  const calculaDistancia = async (lati1, long1, lati2, long2) => {
    let lat1 = await deg2rad(lati1);
    let lat2 = await deg2rad(lati2);
    let lon1 = await deg2rad(long1);
    let lon2 = await deg2rad(long2);

    let latD = lat2 - lat1;
    let lonD = lon2 - lon1;

    let dist =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(latD / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lonD / 2), 2)
        )
      );

    //"6371" refere-se ao raio da terra utilizado para calculos de coordenadas.
    dist = dist * 6371;

    return dist.toFixed(2);
    // return number_format(dist, 2, '.', '');
  };

  //AUTORIZAÇÃO PARA USO DA LOCALIZAÇÃO
  const verificaAutorizacaoLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return false;
    } else {
      return true;
    }
  };

  //AUTORIZAÇÃO PARA USO DA LOCALIZAÇÃO EM SEGUNDO PLANO
  const verificaAutorizacaoBackgroundLocalizacao = async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      return false;
    } else {
      return true;
    }
  };

  //VERIFICA ATIVAÇÃO DO GPS NO APARELHO
  const verificaAtivacaoLocalizacao = async () => {
    let enable = await Location.hasServicesEnabledAsync();
    if (!enable) {
      return false;
    } else {
      return true;
    }
  };

  return {
    buscaLocal,
    buscaEndereco,
    buscaEnderecoCompleto,
    calculaDistancia,
    saveLocationsTask,
    verificaAutorizacaoLocalizacao,
    verificaAutorizacaoBackgroundLocalizacao,
    verificaAtivacaoLocalizacao,
    buscaLatLonPorEndereco,
    sendLocationsTask,
  };
}

export default LocationController();
