import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image } from "react-native";
import StorageController from "../../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IMAGE_RECEIPT } from "../../../constants/constants";
import Loading from "../../../components/Loading";
import * as ImagePicker from "expo-image-picker";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Button } from "react-native-paper";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";

export default function ReceiptGallery({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [data, setData] = useState({});
  const [imagesReceipt, setImagesReceipt] = useState([]);
  const [largerImage, setLargerImage] = useState(null);

  // PEGA A IMAGEM ARMAZENADA NO CACHE
  async function init() {
    try {
      let imagesReceipt = await StorageController.buscarPorChave(IMAGE_RECEIPT);
      let images = JSON.parse(imagesReceipt);
      if (!largerImage) {
        setLargerImage(images[0]);
      }
      setImagesReceipt(images);
      let data = await route.params;
      console.log('DATA DATA', data);
      setData(data);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  // INICIALIZA A CAMERA PARA CAPTURAR A IMAGEM
  async function newImage() {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // base64: true,
      });

      if (result.uri) {
        setLargerImage(result.uri);
        let images = imagesReceipt;
        images.push(result.uri);

        await StorageController.imageReceiptSave(images);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log("Erro ao salvar nova imagem", error.message);
    } finally {
      init();
    }
  }

  // EXCLUI UMA IMAGEM
  async function deleteImage(number) {
    try {
      let images = imagesReceipt;
      images.splice(number, 1);

      await StorageController.imageReceiptSave(images);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      init();
    }
  }

  // EXCLUI TODAS AS IMAGENS
  async function deleteAllImages() {
    try {
      let images = [];

      await StorageController.imageReceiptSave(images);
      setLargerImage(null);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      init();
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE O APP INICIALIZA
  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Header navigation={navigation} rota="DeliveryProcess" />
      </View>
      {isBusy && <Loading></Loading>}
      {!isBusy && (
        <View style={styles.body}>
          <View style={styles.nameContainer}>
            <View style={styles.name}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={35}
                color="#B98D04"
              />
              <Text style={styles.textName}>{data.name}</Text>
            </View>
            <Text style={styles.textData}>Itens: {data.quantity}</Text>
            <Text style={styles.textData}>NF: {data.nf}</Text>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.card}>
              <View style={styles.images}>
                <Image style={styles.image} source={{ uri: largerImage }} />
              </View>
              <View style={styles.listImages}>
                <Pressable
                  onPress={() => {
                    imagesReceipt[0]
                      ? setLargerImage(imagesReceipt[0])
                      : newImage();
                  }}
                  style={
                    imagesReceipt[0] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesReceipt[0] && (
                    <>
                      <Pressable style={styles.imagePosition}>
                        <MaterialCommunityIcons
                          onPress={() => deleteImage(0)}
                          name="close-circle"
                          size={20}
                          color="#E23E5C"
                        />
                      </Pressable>
                      <Image
                        style={styles.preview}
                        source={{
                          uri: imagesReceipt[0],
                        }}
                      />
                    </>
                  )}
                  {!imagesReceipt[0] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesReceipt[1]
                      ? setLargerImage(imagesReceipt[1])
                      : newImage();
                  }}
                  style={
                    imagesReceipt[1] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesReceipt[1] && (
                    <>
                      <Pressable style={styles.imagePosition}>
                        <MaterialCommunityIcons
                          onPress={() => deleteImage(1)}
                          name="close-circle"
                          size={20}
                          color="#E23E5C"
                        />
                      </Pressable>
                      <Image
                        style={styles.preview}
                        source={{
                          uri: imagesReceipt[1],
                        }}
                      />
                    </>
                  )}
                  {!imagesReceipt[1] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesReceipt[2]
                      ? setLargerImage(imagesReceipt[2])
                      : newImage();
                  }}
                  style={
                    imagesReceipt[2] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesReceipt[2] && (
                    <>
                      <Pressable style={styles.imagePosition}>
                        <MaterialCommunityIcons
                          onPress={() => deleteImage(2)}
                          name="close-circle"
                          size={20}
                          color="#E23E5C"
                        />
                      </Pressable>
                      <Image
                        style={styles.preview}
                        source={{
                          uri: imagesReceipt[2],
                        }}
                      />
                    </>
                  )}
                  {!imagesReceipt[2] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesReceipt[3]
                      ? setLargerImage(imagesReceipt[3])
                      : newImage();
                  }}
                  style={
                    imagesReceipt[3] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesReceipt[3] && (
                    <>
                      <Pressable style={styles.imagePosition}>
                        <MaterialCommunityIcons
                          onPress={() => deleteImage(3)}
                          name="close-circle"
                          size={20}
                          color="#E23E5C"
                        />
                      </Pressable>
                      <Image
                        style={styles.preview}
                        source={{
                          uri: imagesReceipt[3],
                        }}
                      />
                    </>
                  )}
                  {!imagesReceipt[3] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesReceipt[4]
                      ? setLargerImage(imagesReceipt[4])
                      : newImage();
                  }}
                  style={
                    imagesReceipt[4] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesReceipt[4] && (
                    <>
                      <Pressable style={styles.imagePosition}>
                        <MaterialCommunityIcons
                          onPress={() => deleteImage(4)}
                          name="close-circle"
                          size={20}
                          color="#E23E5C"
                        />
                      </Pressable>
                      <Image
                        style={styles.preview}
                        source={{
                          uri: imagesReceipt[4],
                        }}
                      />
                    </>
                  )}
                  {!imagesReceipt[4] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              disabled={!imagesReceipt[0]}
              contentStyle={styles.button}
              mode="contained"
              labelStyle={{ color: "white" }}
              onPress={() => navigation.navigate("DeliveryProcess")}
              // onPress={() => console.log("concluir")}
            >
              concluir
            </Button>
            <Button
              disabled={!imagesReceipt[0]}
              style={styles.buttonReport}
              contentStyle={{ height: 40 }}
              mode="text"
              labelStyle={{ color: "#275D85" }}
              onPress={() => deleteAllImages()}
              // onPress={() => console.log("limpar tudo")}
            >
              limpar tudo
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
