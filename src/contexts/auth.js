//****************************************************** */
//  Alterações:
//  
//  08.12.22 - Bárbara
//             Adicao do Backhandler na funcao signOut para terminar
//             o app.
// 
//  12.12.22 - Márcia
//             Correção na função SignOut() para desfazer registros 
//             de listeners e terminar corretamente o app.
//
//****************************************************** */
import React, { createContext, useState, useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  USER_DATA,
  TOKEN_KEY,
  USER_ID,
  CONNECTED,
} from "../constants/constants";
import { api } from "../services/api";
import crashlytics from '@react-native-firebase/crashlytics';
import * as TaskManager from "expo-task-manager"; // 12.12.22 

const AuthContext = createContext({ signed: false, user: {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // VERIFICA SE O USUARIO ESTÁ LOGADO
  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem(USER_DATA);
      const storageToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storageConnected = await AsyncStorage.getItem(CONNECTED);

      if (storageUser && storageToken && storageConnected) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      } else if (!storageUser && !storageToken) {
        setLoading(false);
      } else if (!storageConnected) {
        setLoading(false);
        signOut();
      }
    }

    loadStorageData();
  }, []);

  // GUARDA OS DADOS DO USER NO CACHE
  async function signIn(token, user, keepConnected) {
    console.log("user", user);
    setLoading(true);
    try {
      if (user && token) {
        await AsyncStorage.setItem(USER_DATA, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_ID, JSON.stringify(user.id));
        const userId = JSON.stringify(user.id);
        console.log("userId", userId);
        crashlytics().setUserId(userId);
        crashlytics().setAttribute("usuario", userId);
        if (keepConnected) {
          await AsyncStorage.setItem(CONNECTED, JSON.stringify(true));
        }
      }
      setUser(user);
    } catch (error) {
      crashlytics().recordError(error);
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      setLoading(false);
    }
  }

  // LOGOUT DO USUÁRIO
  async function signOut() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const res = await api.post(
        `app/logout`,
        {},
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (res.data.success) {
        console.log(res.data.message);
        await AsyncStorage.clear();
        setUser(null);
      }
      // 12.12.22...
      console.log("Vai desfazer registros listeners no SignOut...");
      crashlytics().log("Vai desfazer registros listeners e terminar app no SignOut...");
      TaskManager.unregisterAllTasksAsync();  // Cancela registros
      console.log("Desfez registros de tasks antes de sair!");
      BackHandler.exitApp()                   // Termina a execução do APP
       //...12.12.22
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error);
      await AsyncStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
