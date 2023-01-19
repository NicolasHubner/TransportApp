//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  23.12.22 - TIAKI
//      - alteração da url da api de registrar novo usuario
//
//*************************************************************************** */

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Platform,
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  Dimensions,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import StorageController from "../../../controllers/StorageController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text, HelperText, Snackbar } from "react-native-paper";
import { REGISTER } from "../../../constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Dots from "react-native-dots-pagination";
import yupLocale from "../../../validations";
import fundo from "../image/background.png";
import { api } from "../../../services/api";
import Checkbox from "expo-checkbox";
import styles from "./styles";
import * as Yup from "yup";
import crashlytics from '@react-native-firebase/crashlytics';

Yup.setLocale(yupLocale);
const INITIAL_VALUES = {
  email: [],
  email_confirmation: [],
  password: [],
  password_confirmation: [],
  terms_of_use: [],
};

export default function AccessInformation({ navigation }) {
  const [buttonAvailable, setButtonAvailable] = useState(true);
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [register, setRegister] = useState({});
  const [sending, setSending] = useState(false);
  const [erro, setErro] = useState([]);

  const ref_email_confirmation = useRef();
  const ref_password = useRef();
  const ref_password_confirmation = useRef();
  const onDismissSnackBar = () => setVisible(false);

  // FAZ A MENSAGEM DE ERRO DOS CAMPOS
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("O formato do email é inválido")
      .required("Informe um email")
      .trim(),
    email_confirmation: Yup.string()
      .email("O formato do email é inválido")
      .required("Informe um email")
      .trim(),
    password: Yup.string()
      .required("Informe uma senha")
      .min(8, "A senha deve possuir ao menos 8 caracteres.")
      .trim(),
    password_confirmation: Yup.string()
      .required("Informe uma senha")
      .min(8, "A senha deve possuir ao menos 8 caracteres.")
      .trim(),
    terms_of_use: Yup.boolean("Os termos e condições devem ser aceitos").oneOf(
      [true],
      "Os termos e condições devem ser aceitos"
    ),
  });

  // BUSCA OS DADOS DO REGISTRO DO USUARIO
  async function init() {
    let dadosRegistro = await StorageController.buscarPorChave(REGISTER);
    dadosRegistro = JSON.parse(dadosRegistro);
    try {
      setRegister(dadosRegistro);
      if (dadosRegistro.terms_of_use === "true") {
        setTerms("true");
      } else {
        setTerms("false");
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      console.log(dadosRegistro);
      checkInput(dadosRegistro);
    }
  }

  // CHECA OS INPUTS E LIBERA/BLOQUEIA O BOTÃO "CADASTRAR"
  async function checkInput(data) {
    setVisible(false);
    if (
      data?.email &&
      data?.email_confirmation &&
      data?.password &&
      data?.password_confirmation &&
      data?.terms_of_use === "true" &&
      data?.first_name &&
      data?.last_name &&
      data?.cpf
    ) {
      setButtonAvailable(false);
    } else {
      setButtonAvailable(true);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE A PÁGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // SETA O VALOR NA VARIAVEL REGISTER E VERIFICA OS ERROS
  const onChangeEmail = (text) => {
    setRegister({ ...register, email: text });
    setErrors(INITIAL_VALUES);
    checkInput(register);
  };

  // SETA O VALOR NA VARIAVEL REGISTER E VERIFICA OS ERROS
  const onChangePassword = (text) => {
    setRegister({ ...register, password: text });
    setErrors(INITIAL_VALUES);
    checkInput(register);
  };

  // SETA O VALOR NA VARIAVEL REGISTER E VERIFICA OS ERROS
  const onChangeEmailConfirmation = (text) => {
    setRegister({ ...register, email_confirmation: text });
    setErrors(INITIAL_VALUES);
    checkInput(register);
  };
  const onChangePasswordConfirmation = (text) => {
    setRegister({ ...register, password_confirmation: text });
    setErrors(INITIAL_VALUES);
    checkInput(register);
  };

  // GUARDA O VALOR DE REGISTER NO DISPOSITIVO
  async function changeRegister() {
    await AsyncStorage.setItem(REGISTER, JSON.stringify(register));
  }

  // VERIFICA E ENVIA OS DADOS INSERIDOS E REDIRECIONA PARA A TELA DE LOGIN
  const nextPage = async () => {
    try {
      setSending(true);
      await schema.validate(register, { abortEarly: false });
     const response = await api.post("/user/register", register); //...23.12.2022
     
      // console.log(response.data);
      if (response.data.success) {
        await AsyncStorage.removeItem(REGISTER);
        Alert.alert("", "Cadastro realizado com sucesso", [{ text: "OK" }], {
          cancelable: false,
        });
        navigation.navigate("Login");
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
      } else if (error.response.data.errors) {
        let mensagem = error.response.data.errors;
        let array_erro = [];
        mensagem.forEach((element) => {
          array_erro.push(`* ${element} \n`);
        });
        setErro(array_erro);
        setVisible(!visible);
      } else {
        setErro(error.message);
        setVisible(!visible);
      }
    } finally {
      setSending(false);
    }
  };

  // FAZ A FUNÇÃO CHEKINPUT ASSIM QUE A PAGINA INCIALIZA
  useEffect(() => {
    checkInput();
  }, []);

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
                  onPress={() => {
                    changeRegister(), navigation.navigate("PersonalData");
                  }}
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
              <Text style={styles.text}>Dados de acesso</Text>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              indicatorStyle="white"
            >
              <View style={styles.containerUpper}>
                <Text style={styles.textInput}>E-mail</Text>
                <TextInput
                  allowFontScaling={false}
                  importantForAutofill="noExcludeDescendants"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={register.email}
                  returnKeyType="next"
                  onChangeText={onChangeEmail}
                  onSubmitEditing={() => ref_email_confirmation.current.focus()}
                  placeholder="usuario@email.com.br"
                />
                {errors.email &&
                  errors.email.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
                <Text style={styles.textInput}>Confirmação de e-mail</Text>
                <TextInput
                  allowFontScaling={false}
                  importantForAutofill="noExcludeDescendants"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={register.email_confirmation}
                  returnKeyType="next"
                  onChangeText={onChangeEmailConfirmation}
                  onSubmitEditing={() => ref_password.current.focus()}
                  ref={ref_email_confirmation}
                  placeholder="usuario@email.com.br"
                />
                {errors.email_confirmation &&
                  errors.email_confirmation.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
                <Text style={styles.textInput}>Senha</Text>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  secureTextEntry={true}
                  value={register.password}
                  returnKeyType="next"
                  onChangeText={onChangePassword}
                  onSubmitEditing={() =>
                    ref_password_confirmation.current.focus()
                  }
                  ref={ref_password}
                  placeholder="********"
                />
                {errors.password &&
                  errors.password.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
                <Text style={styles.textInput}>Confirmação de senha</Text>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  secureTextEntry={true}
                  value={register.password_confirmation}
                  onChangeText={onChangePasswordConfirmation}
                  ref={ref_password_confirmation}
                  placeholder="********"
                />
                {errors.password_confirmation &&
                  errors.password_confirmation.map((erro, position) => (
                    <HelperText
                      style={styles.helperText}
                      type="error"
                      visible={true}
                      key={position}
                    >
                      {erro}
                    </HelperText>
                  ))}
                <View style={styles.checkboxView}>
                  <Checkbox
                    style={styles.checkbox}
                    value={register.terms_of_use === "true" ? true : false}
                    // disabled="true"
                    onValueChange={() => {
                      changeRegister(), navigation.navigate("UseTerms");
                    }}
                    color={
                      register.terms_of_use === "true"
                        ? "rgba(0, 85, 124, 0.5)"
                        : "#FFFFFF"
                    }
                  />
                  <Text style={styles.TextConnected}>Aceitar </Text>
                  <Pressable
                    onPress={() => {
                      changeRegister(), navigation.navigate("UseTerms");
                    }}
                  >
                    <Text style={styles.term}>termos de uso</Text>
                  </Pressable>
                </View>
                {errors.terms_of_use &&
                  errors.terms_of_use.map((erro, position) => (
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
                <Dots length={2} active={1} activeColor={"#275D85"} />
                <Button
                  mode="contained"
                  disabled={buttonAvailable || sending}
                  loading={sending}
                  contentStyle={
                    buttonAvailable ? styles.buttonDisabled : styles.button
                  }
                  labelStyle={
                    buttonAvailable
                      ? { color: "rgba(255, 255, 255, 0.4)" }
                      : { color: "white" }
                  }
                  onPress={() => nextPage()}
                >
                  cadastrar
                </Button>
              </View>
            </ScrollView>
          </View>
          <Snackbar
            duration={15000}
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
