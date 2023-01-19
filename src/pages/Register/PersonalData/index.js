//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  23.12.22 - TIAKI
//      - alteração da url da api de verificação de cpf
//
//*************************************************************************** */

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  TextInput,
  Platform,
  Keyboard,
  BackHandler,
  KeyboardAvoidingView,
} from "react-native";
import { REGISTER, REGISTER_STRUCT } from "../../../constants/constants";
import StorageController from "../../../controllers/StorageController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text, HelperText, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Dots from "react-native-dots-pagination";
import MaskInput from "react-native-mask-input";
import yupLocale from "../../../validations";
import fundo from "../image/background.png";
import { api } from "../../../services/api";
import styles from "./styles";
import * as Yup from "yup";
import crashlytics from '@react-native-firebase/crashlytics';

// DEFINIÇÃO DAS MASCARAS, VALIDAÇÕES E REGEX DOS CAMPOS
Yup.setLocale(yupLocale);
const INITIAL_VALUES = { first_name: [], last_name: [], cpf: [] };
const CPF_MASK = [
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];
const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;

export default function PersonalData({ navigation }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [cpf, setCpf] = useState("");
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [visible, setVisible] = useState(false);
  const [erro, setErro] = useState("");
  const [buttonAvailable, setButtonAvailable] = useState(true);
  const [register, setRegister] = useState(null);
  const [sending, setSending] = useState(false);

  const ref_last_name = useRef();
  const ref_cpf = useRef();

  const onDismissSnackBar = () => setVisible(false);

  // PEGA OS DADOS DO REGISTRO
  async function init() {
    let dadosRegistro = await StorageController.buscarPorChave(REGISTER);
    try {
      if (dadosRegistro) {
        dadosRegistro = JSON.parse(dadosRegistro);
        setRegister(dadosRegistro);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE A PÁGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // FAZ A MENSAGEM DE ERRO DOS CAMPOS
  const schema = Yup.object().shape({
    first_name: Yup.string()
      .required('O campo "Nome" é um campo obrigatório')
      .trim()
      .matches(
        regex,
        "Não é permitido utilização de números e caracteres especiais"
      ),
    last_name: Yup.string()
      .required('O campo "Sobrenome" é um campo obrigatório.')
      .trim()
      .matches(
        regex,
        "Não é permitido utilização de números e caracteres especiais"
      ),
    cpf: Yup.string()
      .required('O campo "CPF" é um campo obrigatório.')
      .trim()
      .min(14, "O cpf deve conter 11 caracteres"),
  });

  // SETA O VALOR NA VARIAVEL NAME E VERIFICA OS ERROS
  const onChangeName = (text) => {
    setFirstName(text);
    setErrors(INITIAL_VALUES);
    checkInput();
  };

  // SETA O VALOR NA VARIAVEL SURNAME E VERIFICA OS ERROS
  const onChangeSurname = (text) => {
    setLastName(text);
    setErrors(INITIAL_VALUES);
    checkInput();
  };

  // SETA O VALOR NA VARIAVEL CPF E VERIFICA OS ERROS
  const onChangeCpf = (text) => {
    setCpf(text);
    setErrors(INITIAL_VALUES);
    checkInput();
  };

  // VERIFICA O PREENCHIMENTO DOS CAMPOS PARA LIBERAR O BOTÃO "PROÓXIMO"
  const checkInput = async () => {
    if (first_name && last_name && cpf) {
      setButtonAvailable(false);
    } else {
      setButtonAvailable(true);
    }
  };

  // VERIFICA E ENVIA OS DADOS INFORMADOS NA TELA PELO O USUÁRIO
  const nextAccessInformation = async () => {
    try {
      Keyboard.dismiss();
      setSending(true);
      let dadosPessoais = { first_name, last_name, cpf };
      await schema.validate(dadosPessoais, { abortEarly: false });
      let cpfReplace = cpf.replace(/[\D]+/g, "");

      //  23.12.22...
      const response = await api.post(`/check-cpf/${cpfReplace}`);

      if (response && response.data.success === true) {
      //  ...23.12.22
        if (register) {
          dadosPessoais = {
            ...register,
            first_name: first_name,
            last_name: last_name,
            cpf: cpfReplace,
          };

          await AsyncStorage.setItem(REGISTER, JSON.stringify(dadosPessoais));
        } else {
          const struct = {
            ...REGISTER_STRUCT,
            first_name: first_name,
            last_name: last_name,
            cpf: cpfReplace,
          };

          await AsyncStorage.setItem(REGISTER, JSON.stringify(struct));
        }

        navigation.navigate("AccessInformation");
      } else {
        setErro(response.data.data);
        setVisible(!visible);
      }
    } catch (error) {
      crashlytics().recordError(error);
      const errorMessages = {};
      if (error && error.inner) {
        const errorItems = error.inner.map((i) => {
          const name = i.path;

          if (!errorMessages[name]) {
            errorMessages[name] = [i.message];
          } else {
            errorMessages[name].push(i.message);
          }

          return errorMessages;
        });
        setErrors(errorMessages);
      } else if (error.response.data) {
        setErro(error.response.data.data);
        setVisible(!visible);
      } else {
        setErro(error.message);
        setVisible(!visible);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.ImageContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.ImageContainer}
        >
          <View style={styles.margem}>
            <View style={styles.header}>
              <View style={styles.goBack}>
                <MaterialCommunityIcons
                  onPress={() => navigation.navigate("Begin")}
                  name="arrow-left"
                  size={25}
                  color="white"
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={styles.logo}
                  source={require("../image/logo.png")}
                />
              </View>
              <View>
                <Text style={styles.text}>Dados pessoais</Text>
              </View>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.containerUpper}>
                <Text style={styles.textInput}>Primeiro nome</Text>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  value={first_name}
                  returnKeyType="next"
                  onChangeText={onChangeName}
                  onSubmitEditing={() => ref_last_name.current.focus()}
                  placeholder="digite seu nome"
                />
                {errors.first_name &&
                  errors.first_name.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
                <Text style={styles.textInput}>Sobrenome</Text>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  value={last_name}
                  returnKeyType="next"
                  onChangeText={onChangeSurname}
                  onSubmitEditing={() => ref_cpf.current.focus()}
                  ref={ref_last_name}
                  placeholder="digite seu sobrenome"
                />
                {errors.last_name &&
                  errors.last_name.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
                <Text style={styles.textInput}>CPF</Text>
                <MaskInput
                  allowFontScaling={false}
                  keyboardType="numeric"
                  value={cpf}
                  style={styles.input}
                  onChangeText={onChangeCpf}
                  ref={ref_cpf}
                  mask={(text) => {
                    if (text.replace(/\D+/g, "").length <= 11) {
                      return CPF_MASK;
                    } else {
                      return CPF_MASK;
                    }
                  }}
                />
                {errors.cpf &&
                  errors.cpf.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
              </View>
              <View style={styles.containerBotton}>
                <Dots length={2} active={0} activeColor={"#275D85"} />
                <Button
                  mode="contained"
                  disabled={buttonAvailable}
                  loading={sending}
                  contentStyle={
                    buttonAvailable ? styles.buttonDisabled : styles.button
                  }
                  labelStyle={
                    buttonAvailable
                      ? { color: "rgba(255, 255, 255, 0.4)" }
                      : { color: "white" }
                  }
                  onPress={() => nextAccessInformation()}
                >
                  próximo
                </Button>
              </View>
            </ScrollView>
          </View>
          <Snackbar
            style={styles.snackbar}
            visible={visible}
            onDismiss={onDismissSnackBar}
          >
            {erro}
          </Snackbar>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
