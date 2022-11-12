import { LogBox, Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import LocationController from "./LocationController";
import NotificationsController from "./NotificationsController";
import * as BackgroundFetch from "expo-background-fetch";
import StorageController from "./StorageController";
import { LOCAL_COORD } from "../constants/constants";

LogBox.ignoreLogs(["Setting a timer"]);

const LOCATION_TRACKING = "location-tracking";
const LOCATION_SENDING = "location-sending";

// TAREFA DE SALVAR A LOCALIZAÇÃO E MOSTRA A NOTIFICAÇÃO
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    let speed = locations[0].coords.speed;
    speed = (locations[0].coords.speed) * (60*60)/1000

    saveLocations(lat, long, speed);
    showNotification(lat, long);
  }
});

TaskManager.defineTask(LOCATION_SENDING, async () => {
  await LocationController.sendLocationsTask();
});

const saveLocations = async (lat, long, speed) => {
  await LocationController.saveLocationsTask(lat, long, speed);
};

// MOSTRA A NOTIFICAÇÃO DE CHEGADA AO DESTINO
const showNotification = async (lat, long) => {
  let localCoords = await StorageController.buscarPorChave(LOCAL_COORD);
  localCoords = JSON.parse(JSON.parse(localCoords));

  if (localCoords) {
    const arrivedDestine = await LocationController.calculaDistancia(
      lat,
      long,
      localCoords.latitude,
      localCoords.longitude
    );

    //O RAIO DEVERÁ VIR DA API TROUW - NO MOMENTO ESTA SETADO EM 50m (0.05km)
    if (arrivedDestine < 0.05) {
      //CRIA O PUSH NOTIFICATION
      await NotificationsController.arrivalNotification();
    }
  }
};

// VERIFICA SE O USUÁRIO AUTORIZOU O USO DA LOCALIZAÇÃO EM SEGUNDO PLANO
function BackgroundTaskController() {
  TaskManager.unregisterAllTasksAsync();

  const requestBackgroundPermissions = async () => {
    
    let { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("AVISO", 'Para o funcionamento correto do aplicativo, altere o uso da localização para a opção "Permitir o tempo todo"', [{ text: "OK" }], {
        cancelable: false,
      });
      return false;
    } else {
      return true;
    }
  };

  // INICIA O ENVIO DA LOCALIZAÇÃO
  const startLocationSending = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_SENDING
    );

    if (!isRegistered) {
      return BackgroundFetch.registerTaskAsync(LOCATION_SENDING, {
        minimumInterval: 30, // 30 seconds
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
      });
    } else {
      return;
    }
  };

  // INICIA A TAREFA DE PEGAR A LOCALIZAÇÃO EM SEGUNDO PLANO A CADA 10 SEGUNDOS
  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 10000,
      foregroundService: {
        notificationTitle: "Trouw",
        notificationBody: "consultando sua localização",
        notificationColor: "#AA1111",
      },
      deferredUpdatesInterval: 100,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log("tracking started?", hasStarted);
  };

  return {
    requestBackgroundPermissions,
    startLocationTracking,
    startLocationSending
  };
}

export default BackgroundTaskController();
