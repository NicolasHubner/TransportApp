import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  USER_DATA,
  TOKEN_KEY,
  USER_ID,
  CONNECTED,
} from "../constants/constants";
import { api } from "../services/api";
import crashlytics from '@react-native-firebase/crashlytics';

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
    setLoading(true);
    try {
      if (user && token) {
        await AsyncStorage.setItem(USER_DATA, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_ID, JSON.stringify(user.id));
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
