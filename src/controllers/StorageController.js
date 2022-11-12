import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMAGE_RECEIPT, IMAGE_PHOTO } from "../constants/constants";

function StorageController() {
  // const buscarToken = async () => {
  //   return await AsyncStorage.getItem(TOKEN_KEY);
  // };

  // BUSCA OS ITENS DO ASYNCSTORAGE POR CHAVE
  const buscarPorChave = async (chave) => {
    return await AsyncStorage.getItem(chave);
  };

  // REMOVE OS ITENS DO ASYNCSTORAGE POR CHAVE
  const removePorChave = async (chave) => {
    return await AsyncStorage.removeItem(chave);
  };

  // SALVA OS ITENS DO ASYNCSTORAGE POR CHAVE
  const salvarPorChave = async (chave, value) => {
    return await AsyncStorage.setItem(chave, JSON.stringify(value));
  };
  
  // SALVA IMAGENS NO ASYNCSORAGE "IMAGE_RECEIPT"
  const imageReceiptSave = async (photo) => {
    await AsyncStorage.setItem(IMAGE_RECEIPT, JSON.stringify(photo));
  };

  // SALVA IMAGENS NO ASYNCSOTRAGE "IMAGE_PHOTO"
  const imagePhotoSave = async (photo) => {
    await AsyncStorage.setItem(IMAGE_PHOTO, JSON.stringify(photo));
  };

  // const saveNewLocal= async (localId) => {
  //   await AsyncStorage.setItem(LOCAL_ID, JSON.stringify(localId));
  // };

  return {
    buscarPorChave,
    removePorChave,
    salvarPorChave,
    imageReceiptSave,
    imagePhotoSave,
  };
}

export default StorageController();
