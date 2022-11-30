import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { ARRIVAL_NOTIFICATION } from "../constants/constants";
import * as Notifications from "expo-notifications";
import StorageController from "./StorageController";
import crashlytics from '@react-native-firebase/crashlytics';

// SETA AS CONFIGURAÇÕES DAS NOTIFICAÇÕES
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// NOTIFICAÇÃO DE CHEGADA AO DESTINO
function NotificationsController() {
  const arrivalNotification = async () => {
    try {
      let notification = await StorageController.buscarPorChave(
        ARRIVAL_NOTIFICATION
      );

      if (notification !== "true") {
        console.log("chega onde cria a notificação de destino");
        await StorageController.salvarPorChave(ARRIVAL_NOTIFICATION, true);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Atenção",
            body: "Você chegou ao seu destino, retorne ao aplicativo para finalizar a entrega/coleta",
          },
          trigger: null,
        });
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  };

  // NOTIFICAÇÃO DE CHEGADA A ORIGEM
  const originNotification = async () => {
    try {
      console.log("chega onde cria a notificação de origem");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Atenção",
          body: "Você chegou ao local de início, retorne ao aplicativo para iniciar as entregas/coletas",
        },
        trigger: null,
      });
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  };

  return {
    arrivalNotification,
    originNotification,
  };
}

export default NotificationsController();
