import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image } from "react-native";
import StorageController from "../../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IMAGE_PHOTO } from "../../../constants/constants";
import * as ImageManipulator from "expo-image-manipulator";
import Loading from "../../../components/Loading";
import * as ImagePicker from "expo-image-picker";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Button } from "react-native-paper";
import styles from "./styles";
import crashlytics from "@react-native-firebase/crashlytics";

export default function PhotoGallery({ navigation, route }) {
  const [isBusy, setIsBusy] = useState(true);
  const [data, setData] = useState({});
  const [imagesPhoto, setImagesPhoto] = useState([]);
  const [largerImage, setLargerImage] = useState(null);

  // PEGA AS IMAGENS GUARDADAS NO CACHE
  async function init() {
    try {
      let imagesPhoto = await StorageController.buscarPorChave(IMAGE_PHOTO);
      let images = [];
      if (imagesPhoto) {
        images = JSON.parse(imagesPhoto);
      }
      if (!largerImage) {
        setLargerImage(images[0]);
      }
      setImagesPhoto(images);
      let data = await route.params;
      setData(data);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  // SALVA AS FOTOS SELECIONADAS
  async function newImage() {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // base64: true,
      });

      if (result.uri) {
        setLargerImage(result.api);
        let images = imagesPhoto;

        const dataCompressed = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { width: 600 } }],
          { compress: 0.8 }
        );

        images.push(dataCompressed.uri);

        await StorageController.imagePhotoSave(images);
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
      let images = imagesPhoto;
      images.splice(number, 1);

      await StorageController.imagePhotoSave(images);
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
      await StorageController.removePorChave(IMAGE_PHOTO);
      setLargerImage(null);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      init();
    }
  }

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
                    imagesPhoto[0]
                      ? setLargerImage(imagesPhoto[0])
                      : newImage();
                  }}
                  style={
                    imagesPhoto[0] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesPhoto[0] && (
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
                          uri: imagesPhoto[0],
                        }}
                      />
                    </>
                  )}
                  {!imagesPhoto[0] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesPhoto[1]
                      ? setLargerImage(imagesPhoto[1])
                      : newImage();
                  }}
                  style={
                    imagesPhoto[1] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesPhoto[1] && (
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
                          uri: imagesPhoto[1],
                        }}
                      />
                    </>
                  )}
                  {!imagesPhoto[1] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesPhoto[2]
                      ? setLargerImage(imagesPhoto[2])
                      : newImage();
                  }}
                  style={
                    imagesPhoto[2] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesPhoto[2] && (
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
                          uri: imagesPhoto[2],
                        }}
                      />
                    </>
                  )}
                  {!imagesPhoto[2] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesPhoto[3]
                      ? setLargerImage(imagesPhoto[3])
                      : newImage();
                  }}
                  style={
                    imagesPhoto[3] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesPhoto[3] && (
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
                          uri: imagesPhoto[3],
                        }}
                      />
                    </>
                  )}
                  {!imagesPhoto[3] && (
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={35}
                      color="#C4C4C4"
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    imagesPhoto[4]
                      ? setLargerImage(imagesPhoto[4])
                      : newImage();
                  }}
                  style={
                    imagesPhoto[4] ? styles.imageEdit : styles.imageEmpty
                  }
                >
                  {imagesPhoto[4] && (
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
                          uri: imagesPhoto[4],
                        }}
                      />
                    </>
                  )}
                  {!imagesPhoto[4] && (
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
              disabled={!imagesPhoto[0]}
              contentStyle={styles.button}
              mode="contained"
              labelStyle={{ color: "white" }}
              onPress={() => navigation.navigate("DeliveryProcess")}
              // onPress={() => console.log("concluir")}
            >
              concluir
            </Button>
            <Button
              disabled={!imagesPhoto[0]}
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
