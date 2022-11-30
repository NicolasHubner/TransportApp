import * as Location from "expo-location";
import {
  LAST_LOCATION,
  GPS_STATUS,
  LOCAL_ID,
  TRAVEL_ID,
  TOKEN_KEY,
  USER_ID,
} from "../constants/constants";
import * as Battery from 'expo-battery';
import StorageController from "./StorageController";
import { format } from "date-fns";
import { api } from "../services/api";
import { LocationDao } from "../daos/LocationDao";
import crashlytics from '@react-native-firebase/crashlytics';

function LocationController() {
  const saveLocationsTask = async (lat, long, speed) => {
    try {
      
      const lastLocation = await saveLastLocation(lat, long);
      const arrayLocation = await saveArrayLocations(lat, long, speed);
      
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
  const saveArrayLocations = async (lat, long, speed) => {
    try {
      const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      let battery = await Battery.getBatteryLevelAsync();
      battery = Math.round(battery*100);

      await LocationDao.save(lat, long, Math.round(speed), battery, 1, "GPRS", "first_plane", date);
      
      return true;
    } catch (error) {
      crashlytics().recordError(error);
      console.log("saveArrayLocations", error.message);
      return false;
    }
  };

  // ENVIA A LOCALIZAÇÃO PARA A API
  const sendLocationsTask = async () => {
    try {

      crashlytics().recordError(new Error("aaaaa"));
      let arrayLocations = await LocationDao.getTop(5);
      console.log("getLocations", arrayLocations);
      const token = await StorageController.buscarPorChave(TOKEN_KEY);
      let localId = await StorageController.buscarPorChave(LOCAL_ID);
      let travelId = await StorageController.buscarPorChave(TRAVEL_ID);
      let userId = await StorageController.buscarPorChave(USER_ID);

      
      let dataEnv = false;
      if (arrayLocations) {
        
        let dateSend = format(new Date(), "yyyy-MM-dd HH:mm:ss");

        dataEnv = {
          user_id: userId,
          localizations: arrayLocations,
          mac_address: "99-99-99-99-99-99",
          datetime_sent: dateSend,
          battery_status: 0,
          gps_status: true,
          network_status: "GPRS",
          app_status: "first_plane",
          speed: 0,
        };

        if (travelId) {
          dataEnv = { ...dataEnv, travel_id: travelId };
          if (localId) {
            dataEnv = { ...dataEnv, travel_local_id: localId };
          }
        }
      }

      if (dataEnv && token) {
        const response = await api.post(`/app/travel/local/location`, dataEnv, {
          headers: { Authorization: `bearer ${token}` },
        });
        if (response) {
          await LocationDao.deleteList(arrayLocations);
          return { code: "SUCESSO", success: true };
        }
      } else {
        return { code: "FALTA INFO", success: false };
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log("sendLocationsTask", e.message);

      if (error.response) {
        return { code: error.response.data, success: false };
      } else {
        return { code: error.message, success: false };
      }
    }
  };

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
