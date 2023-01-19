//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações:
//
//  08.12.22 - TIAKI 
//        - olho magico no input senha
//        - modificação e adição de estilos nos inputs
//
//  22.12.22 - TIAKI
//        - alteração na função do onpress do botao de voltar
//
//*************************************************************************** */

import React, { useRef, useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  ImageBackground,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageController from "../../controllers/StorageController";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText, Snackbar } from "react-native-paper";
import fundo from "../../assets/images/background.png";
import NetInfo from "@react-native-community/netinfo";
import { LOGGED } from "../../constants/constants";
import Loading from "../../components/Loading";
import AuthContext from "../../contexts/auth";
import { StatusBar } from "expo-status-bar";
import yupLocale from "../../validations";
import styles from "../Login/styles";
import { api } from "../../services/api";
import * as Yup from "yup";
import crashlytics from '@react-native-firebase/crashlytics';

Yup.setLocale(yupLocale);
const INITIAL_VALUES = { email: [], password: [], api_error: [] };

export default function Login({ navigation }) {
  const [buttonAvailable, setButtonAvailable] = useState(true);
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [isConnected, setIsConnected] = useState();
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState();
  const [erro, setErro] = useState([]);

  //adicao
  const [hidePass, setHidePass] = useState(true)
  //fim

  const { signIn } = useContext(AuthContext);
  const ref_password = useRef();

  const onDismissSnackBar = () => setVisible(false);

  //ATUALIZA O STATUS DA INTERNET CONECTADO/DESCONECTADO
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (isConnected !== state.isInternetReachable) {
      setIsConnected(state.isInternetReachable);
    }
  });

  // VERIFICA SE O USUÁRIO ESTÁ LOGADO
  async function init() {
    try {
      const logged = await StorageController.buscarPorChave(LOGGED);
      checkInput();
      if (logged === "true") {
        setChecked(true);
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  // FAZ A FUNÇÃO CHECKINPUT ASSIM QUE O APP INICIALIZA 
  useEffect(() => {
    checkInput();
  }, [password, email]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // GUARDA A INFO QUE O USUARIO ESTÁ LOGADO
  async function keepLogged(check) {
    try {
      await AsyncStorage.setItem(LOGGED, check ? "true" : "false");
      setChecked(check);
    } catch (error) {
      crashlytics().recordError(error);
      Alert.alert("AVISO", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  }

  // FAZ AS MENSAGENS DE VERIFICAÇÃO DOS CAMPOS
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("O formato do email é inválido")
      .required("Informe um email")
      .trim(),
    password: Yup.string()
      .required("Informe uma senha")
      .min(8, "A senha deve possuir ao menos 8 caracteres.")
      .trim(),
  });

  // GUARDA O EMAIL DIGITADO E TRATA OS ERROS
  const onChangeEmail = (text) => {
    setEmail(text);
    // checkInput();
    setErrors(INITIAL_VALUES);
    setVisible(false);
  };

  // GUARDA A SENHA DIGITADA E TRATA OS ERROS
  const onChangeSenha = (text) => {
    setPassword(text);
    // checkInput();
    setErrors(INITIAL_VALUES);
    setVisible(false);
  };

  // CHECA SE OS INPUTS DE SENHA E EMAIL TEM ERRO PARA LIBERAR OU BLOQUEAR OS BOTÕES
  const checkInput = async () => {
    if (email && password) {
      setButtonAvailable(false);
    } else {
      setButtonAvailable(true);
    }
  };

  // FAZ A REQUISIÇÃO DE LOGIN
  const handleSubmit = async () => {
    // VALIDA O USUARIO E SENHA, CASO SEJA VALIDO GRAVA OS DADOS DO USUÁRIO NO STORAGE
    try {
      setLoading(true);
      setSubmit(true);
      checkInput();
      if (!isConnected) {
        Alert.alert(
          "AVISO",
          "Para efetuar o login é necessário conexão com internet",
          [{ text: "OK" }],
          {
            cancelable: false,
          }
        );
        return;
      }
      let ignore_expiration = "false";
      if (checked) {
        ignore_expiration = "true";
      }
      const dadosAcesso = { email, password, ignore_expiration };
      await schema.validate(dadosAcesso, { abortEarly: false });

      const res = await api.post("/login", dadosAcesso);
      if (res.data.success) {
        console.log(res.data.data.access_token);
        const token = res.data.data.access_token;
        const user = res.data.data.user;
        await signIn(token, user, checked);
      } else {
        setErro(res.data.mensagem);
        setVisible(true);
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
      } else if (error.response.data.message) {
        setErro(error.response.data.message);
        setVisible(!visible);
      } else {
        setErro(error.message);
        setVisible(!visible);
      }
    } finally {
      setSubmit(false);
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      {loading && <Loading></Loading>}
      {!loading && (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.backgroundImage}
          >
            <StatusBar hidden={false} style="light" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.contents}>
                <View style={styles.header}>
                  <View style={styles.goBack}>
                    <MaterialCommunityIcons
                      onPress={() => navigation.navigate({
                        name: 'Begin',
                        params: { back: true },
                      })}
                      name="arrow-left"
                      size={25}
                      color="white"
                    />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      style={styles.stretch}
                      resizeMethod="scale"
                      source={require("../../assets/images/logo.png")}
                    />
                    <Text style={[styles.text, { marginTop: 10 }]}>
                      Bem Vindo
                    </Text>
                  </View>
                </View>
                <View style={styles.loginInput}>
                  <ScrollView
                    contentContainerStyle={{
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.text}>E-mail</Text>
                    <View style={styles.inputArea}>
                      <TextInput
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        value={email}
                        disabled={isSubmit}
                        onChangeText={onChangeEmail}
                        returnKeyType="next"
                        onSubmitEditing={() => ref_password.current.focus()}
                        placeholder="usuario@email.com.br"
                      />
                      {errors.email &&
                        errors.email.map((erro, position) => (
                          <HelperText type="error" visible={true} key={position}>
                            {erro}
                          </HelperText>
                        ))}
                    </View>
                    <Text style={[styles.text, { marginTop: 15 }]}>Senha</Text>
                    <View style={styles.inputArea}>
                      <TextInput
                        secureTextEntry={hidePass}
                        style={styles.input}
                        value={password}
                        disabled={isSubmit}
                        ref={ref_password}
                        onChangeText={onChangeSenha}
                        placeholder="*************"
                      />
                      <TouchableOpacity style={styles.icon} onPress={() => setHidePass(!hidePass)}>
                        {hidePass ?
                          <Ionicons name="eye-off" color="black" size={25} />
                          :
                          <Ionicons name="eye" color="black" size={25} />
                        }
                      </TouchableOpacity>
                      {errors.password &&
                        errors.password.map((erro, position) => (
                          <HelperText type="error" visible={true} key={position}>
                            {erro}
                          </HelperText>
                        ))}
                    </ View>
                    <View style={styles.checkboxView}>
                      <Checkbox
                        style={styles.checkbox}
                        value={checked}
                        // disabled="true"
                        onValueChange={() => keepLogged(!checked)}
                        color={checked ? "rgba(0, 85, 124, 0.5)" : "#FFFFFF"}
                      />
                      <Pressable onPress={() => keepLogged(!checked)}>
                        <Text style={styles.TextConnected}>
                          Mantenha-me conectado
                        </Text>
                      </Pressable>
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.loginButton}>
                  <Button
                    mode="contained"
                    disabled={buttonAvailable || isSubmit}
                    contentStyle={
                      buttonAvailable ? styles.buttonDisabled : styles.button
                    }
                    labelStyle={
                      buttonAvailable
                        ? { color: "rgba(255, 255, 255, 0.4)" }
                        : { color: "white" }
                    }
                    onPress={() => handleSubmit()}
                  >
                    entrar
                  </Button>
                  <Text
                    style={[
                      styles.text,
                      { textAlign: "center", marginTop: 30 },
                    ]}
                    onPress={() => navigation.navigate("EmailRecover")}
                    disabled={isSubmit}
                  >
                    Esqueci minha senha
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Snackbar
              style={styles.snackbar}
              visible={visible}
              onDismiss={onDismissSnackBar}
            >
              {erro}
            </Snackbar>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </ImageBackground>
  );
}