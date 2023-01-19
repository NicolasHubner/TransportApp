//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  23.12.22 - TIAKI
//      - alteração da url da api de redefinicao de nova senha
//
//*************************************************************************** */

import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TextInputComponent,
} from "react-native";
import { Button, Text, HelperText, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import yupLocale from "../../../validations";
import { api } from "../../../services/api";
import fundo from "../../../assets/images/background.png";
import styles from "./styles";
import * as Yup from "yup";
import crashlytics from '@react-native-firebase/crashlytics';

Yup.setLocale(yupLocale);
const INITIAL_VALUES = { password: [], confirmPassword: [] };

export default function ResetPassword({ navigation, route }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [erro, setErro] = useState("");
  const [visible, setVisible] = useState(false);
  const [passwordToken, setPasswordToken] = useState("");
  const [loading, setLoading] = useState(false);

  const ref_confirmPassword = useRef();
  const onDismissSnackBar = () => setVisible(false);

// FAZ A MENSAGEM DE ERRO DOS CAMPOS
  const schema = Yup.object().shape({
    password: Yup.string()
      .required("Informe uma senha")
      .min(8, "A senha deve possuir ao menos 8 caracteres.")
      .trim(),
    confirmPassword: Yup.string()
      .required("Informe uma senha")
      .min(8, "A senha deve possuir ao menos 8 caracteres.")
      .oneOf([Yup.ref("password"), null], "As senhas não correspondem")
      .trim(),
  });

  // GUARDA TOKEN PASSADO ATRAVES DA ROTA
  async function init() {
    try {
      let params = await route.params;
      setPasswordToken(params);
    } catch (error) {
      crashlytics().recordError(error);
      console.log(e.message);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE A PÁGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // SETA O VALOR NA VARIAVEL PASSWORD E VERIFICA OS ERROS
  const onChangePassword = (text) => {
    setPassword(text);
    setErrors(INITIAL_VALUES);
  };

  // SETA O VALOR NA VARIAVEL CONFIRMPASSWORD E VERIFICA OS ERROS
  const onChangeConfirmPassword = (text) => {
    setConfirmPassword(text);
    setErrors(INITIAL_VALUES);
  };

  // FAZ A VALIDAÇÃO E A REQUISIÇÃO DE NOVA SENHA
  const nextPage = async () => {
    try {
      setLoading(true);
      let validPassword = { password, confirmPassword };
      await schema.validate(validPassword, { abortEarly: false });

      const sendPassword = {
        password: validPassword.password,
        password_confirmation: validPassword.confirmPassword,
        password_token: JSON.stringify(passwordToken),
      };
      console.log(validPassword);

      const res = await api.post("/user/new-password", sendPassword); //...23.12.2022
      if (res.data.success) {
        navigation.navigate("Login");
        Alert.alert("", "Senha alterada com sucesso!", [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
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
      setLoading(false);
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
                  onPress={() => navigation.navigate("CodeRecover")}
                  name="arrow-left"
                  size={25}
                  color="white"
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={styles.logo}
                  source={require("../../../assets/images/logo.png")}
                />
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              indicatorStyle="white"
            >
              <View style={styles.containerUpper}>
                <Text style={styles.titleText}>Recuperação de senha</Text>
                <Text style={styles.text}>Insira uma nova senha</Text>
                <Text style={styles.textInput}>Senha</Text>
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry={true}
                  style={styles.input}
                  value={password}
                  onChangeText={onChangePassword}
                  returnKeyType="next"
                  placeholder="***********"
                  onSubmitEditing={() => ref_confirmPassword.current.focus()}
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
                  autoCapitalize="none"
                  secureTextEntry={true}
                  style={styles.input}
                  value={confirmPassword}
                  ref={ref_confirmPassword}
                  returnKeyType="next"
                  onChangeText={onChangeConfirmPassword}
                  placeholder="***********"
                />
                {errors.confirmPassword &&
                  errors.confirmPassword.map((erro, position) => (
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
                <Button
                  mode="contained"
                  disabled={!confirmPassword || !password || loading}
                  loading={loading}
                  contentStyle={
                    !confirmPassword || !password
                      ? styles.buttonDisabled
                      : styles.button
                  }
                  labelStyle={
                    !confirmPassword || !password
                      ? { color: "rgba(255, 255, 255, 0.4)" }
                      : { color: "white" }
                  }
                  onPress={() => nextPage()}
                >
                  salvar nova senha
                </Button>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <Snackbar
          style={styles.snackbar}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {erro}
        </Snackbar>
      </SafeAreaView>
    </ImageBackground>
  );
}
