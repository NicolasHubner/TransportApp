//Alterações
//
//  TIAKI - 06.12.2022
//        - alteração da função pickImage
//        - implementação da CameraController
//

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import StorageController from "../../controllers/StorageController";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { TOKEN_KEY, LAST_LOCATION, EVENT_TYPE } from "../../constants/constants";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import colors from "../../utils/colors";
import { api } from "../../services/api";
import { format } from "date-fns";
import crashlytics from '@react-native-firebase/crashlytics';
import CameraController from "../../controllers/CameraController";
import { TravelController } from "../../controllers/TravelController";
import reactotron from "reactotron-react-native";
import { EventsController } from "../../controllers/EventsController";
import { AuthController } from "../../controllers/AuthController";

export default function ModalInsuccess({ func, func2, missionId }) {
  const [motivo, setMotivo] = useState("0");
  const [observation, setObservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [imageInsuccess, setImageInsuccess] = useState(null);
  const [arrayMotivos, setArrayMotivos] = useState([
    {
      label: "Selecione um motivo:",
      value: 0,
    },
  ]);

  const placeholderMotivo = {};

  // FAZ A REQUISIÇÃO DE FAILURE NA API
  const init = async () => {
    try {
      const tokenKey = await AuthController.getToken();
      setToken(tokenKey);
      const response = await TravelController.getInsuccessType(tokenKey, 1);
      
      if (response.length > 0) {
        let motivos = [];
        motivos.push({
          label: "Selecione um motivo:",
          value: 0,
        });
        motivos = motivos.concat(response);

        reactotron.log(response, motivos);
        setArrayMotivos(motivos);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log("Error", error);
    }
  };

  // FAZ O INIT ASSIM QUE O APP INICIALIZA
  useEffect(() => {
    init();
  }, []);

  // QUARDA O MOTIVO SELECIONADO
  function selecionaMotivo(id) {
    setMotivo(id);
    if (id === 0) {
      setObservation(null);
    } else {
      setMotivo(id);
    }
  }

  // GUARDA A OBSERVAÇÃO DIGITADA
  const onChangeObservation = (text) => {
    setObservation(text);
    // checkInput();
    // setErrors(INITIAL_VALUES);
    // setVisible(false);
  };

  //EDIÇÃO TIAKI 06.12.2022 - antigo pickImage - PERMISSAO DE CAMERA E MANIPULACAO DE FOTO
  const pickImage = async () => {
    try {

      const permissao = await CameraController.verificaPermissoes()
      console.log("camera")

      //se a permissao foi concedida e o usuario tirou uma foto, ocorre a manipulacao da foto
      if (permissao) {

        let foto = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.5,
          base64: true,
        });

        const dataCompressed = await ImageManipulator.manipulateAsync(
          foto.uri,
          [{ resize: { width: 600 } }],
          { compress: 0.8 }
        );

        setImageInsuccess(dataCompressed.uri);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log("ModalInsucess", error.message);
    }
  };
  //FIM EDICAO 06.12.2022

  // ENVIA O INSUCESSO PARA A API
  const sendInsuccess = async () => {
    try {
      setLoading(true);

      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      console.log("last",lastLocation);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      console.log("last",lastLocation);

      let data = {data:[]};
      let objData = {
        status: "failed",
        haveImg: imageInsuccess ? "true" : "false",
        lat: lastLocation?.lat || null,
        long: lastLocation?.long || null,
        event_at:  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        img: [],
        failure_reason_id: motivo,
        failure_reason: observation,
        image_type: "insucesso"
      }

      if (imageInsuccess) {
        const imageData = await ImageManipulator.manipulateAsync(imageInsuccess, [], {base64: true});
        objData.img.push({
          uri: imageData.base64 || null,
          name: "img",
          type: "image/jpg",
        })
      }

      data.data.push(objData);
      console.log("send insucesso", JSON.stringify(data));

      const response = await EventsController.postEvent(
        EVENT_TYPE.MISSION_CHANGE_STATUS, 
        token, 
        `/mission/${missionId}/change-status`, 
        data,
        missionId);

      console.log(response.data);
      if (response.data.success) {
        func();
        func2(missionId, token);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log("erro documento", JSON.stringify(error));
      if (error.response) {
        console.log("Erro ao inserir insucesso", error.response.data);
        Alert.alert("Atenção", error.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        if (error.code === "ECONNABORTED") {
          Alert.alert(
            "Tempo excedido",
            "Verifique sua conexão com a internet",
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        } else {
          console.log("Error", error);
          Alert.alert("Atenção", error.message, [{ text: "OK" }], {
            cancelable: false,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Justificativa de insucesso</Text>
          <MaterialCommunityIcons
            name="close"
            size={28}
            color="#3E3E3E"
            onPress={func}
          />
        </View>

        <View style={styles.motivoContainer}>
          <Text style={styles.textBody}>Motivo</Text>
          <View style={styles.pickerSelect}>
            <RNPickerSelect
              doneText="Confirmar"
              placeholder={placeholderMotivo}
              value={motivo}
              onValueChange={(value) => {
                selecionaMotivo(value);
              }}
              items={arrayMotivos}
            />
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.textBody}>Descrição</Text>
          <TextInput
            // keyboardType=""
            // autoCapitalize="none"
            style={styles.textInput}
            multiline={true}
            value={observation}
            maxLength={250}
            // disabled={isSubmit}
            onChangeText={onChangeObservation}
            // onSubmitEditing={solicitarAjuste}
            placeholder="Descreva o motivo que ocasionou o insucesso (opcional)"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            icon="camera"
            contentStyle={styles.button}
            mode="text"
            disabled={loading}
            onPress={pickImage}
          >
            inserir foto
          </Button>
          <Button
            style={{ marginTop: 10 }}
            contentStyle={styles.button}
            disabled={loading}
            loading={loading}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={sendInsuccess}
          >
            inserir justificativa
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "92%",
    // height: '72%',
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  titleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    color: colors.icon,
  },

  motivoContainer: {
    width: "100%",
    marginTop: "5%",
  },

  textBody: {
    color: colors.icon,
    marginBottom: 5,
  },

  pickerSelect: {
    width: "100%",
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    justifyContent: "center",
  },

  descriptionContainer: {
    width: "100%",
    marginTop: "5%",
  },

  textInput: {
    width: "100%",
    // minHeight: '15%',
    padding: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 5,
  },

  buttonContainer: {
    width: "100%",
    marginTop: "8%",
  },

  button: {
    flexDirection: "row-reverse",
    height: 40,
  },
});
