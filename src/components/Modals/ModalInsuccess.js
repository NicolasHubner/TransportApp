import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import StorageController from "../../controllers/StorageController";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { TOKEN_KEY, LAST_LOCATION } from "../../constants/constants";
import * as ImageManipulator from "expo-image-manipulator";
// import apiFormData from "../../services/apiFormData";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import colors from "../../utils/colors";
import { api, apiFormData } from "../../services/api";
import { format } from "date-fns";

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
      const tokenKey = await StorageController.buscarPorChave(TOKEN_KEY);
      setToken(tokenKey);
      const response = await api.get(`/app/failure/reasons`, {
        params: { type: 1 },
        headers: { Authorization: `bearer ${tokenKey}` },
      });

      if (response.data) {
        const motivos = response.data;
        motivos.unshift({
          label: "Selecione um motivo:",
          value: 0,
        });
        setArrayMotivos(motivos);
      }
    } catch (e) {
      console.log("Error",e);
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

  //GUARDA A IMAGEM
  const pickImage = async () => {
    try {

      let camera = await ImagePicker.getCameraPermissionsAsync();
      let media = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (camera.granted && media.granted) {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });

        if (result.uri) {
          const dataCompressed = await ImageManipulator.manipulateAsync(
            result.uri,
            [{ resize: { width: 600 } }],
            { compress: 0.8 }
          );
          // const visionResp = await RNTextDetector.detectFromUri(result.uri);
          // console.log(visionResp);
          setImageInsuccess(dataCompressed.uri);
        }
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    } catch (error) {
      console.log("ModalInsucess",error.message);
    }
  };

  // ENVIA O INSUCESSO PARA A API
  const sendInsuccess = async () => {
    try {
      setLoading(true);
      // let data = new FormData();

      // if (imageInsuccess) {
      //   data.append("data[0][img]", {
      //     uri: imageInsuccess,
      //     name: 'img',
      //     type: "image/jpg",
      //   });
      // }
      // data.append('data[0][failure_reason_id]', motivo);
      // if (observation) {
      //   data.append('data[0][failure_reason]', observation);
      // }
      // data.append('data[0][image_type]', 'insucesso');

      // const response = await apiFormData.post(
      //   `/app/travel/mission/${missionId}/confirm-failed`,
      //   data, {headers: { Authorization: `bearer ${token}` }}
      // );

      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      let data = new FormData();

      data.append(`data[0][status]`, "failed");
      data.append(`data[0][haveImg]`, imageInsuccess ? "true" : "false");
      data.append(`data[0][lat]`, lastLocation?.lat);
      data.append(`data[0][long]`, lastLocation?.long);
      data.append(
        `data[0][event_at]`,
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      );

      if (imageInsuccess) {
        data.append(`data[0][img]`, {
          uri: imageInsuccess,
          name: "img",
          type: "image/jpg",
        });
      }
      data.append("data[0][failure_reason_id]", motivo);
      data.append("data[0][failure_reason]", observation);
      data.append(`data[0][image_type]`, "insucesso");

      const response = await apiFormData.post(
        `/app/travel/local/${missionId}/changeMission`,
        data,
        { headers: { Authorization: `bearer ${token}` } }
      );

      if (response.data.success) {
        func();
        func2(missionId, token);
      }
    } catch (e) {
      if (e.response) {
        console.log("Erro ao inserir insucesso", e.response.data);
        Alert.alert("Atenção", e.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        if (e.code === "ECONNABORTED") {
          Alert.alert(
            "Tempo excedido",
            "Verifique sua conexão com a internet",
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        } else {
          console.log("Error",e);
          Alert.alert("Atenção", e.message, [{ text: "OK" }], {
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
