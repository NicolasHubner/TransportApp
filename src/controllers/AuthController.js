import crashlytics from "@react-native-firebase/crashlytics";
import StorageController from "./StorageController";
import { TOKEN_KEY } from "../constants/constants";
import { api } from "../services/api";
import reactotron from "reactotron-react-native";

export class AuthController {
  static keyStorageResponse = "LOGIN_RESPONSE";
  static keyStorageRequest = "LOGIN_REQUEST";

  static async doLogin(email, password, ignore_expiration) {
    let result = {
      data: {
        code: 401,
        message: "Problema com o usuário informado",
        errors: ["Senha incorreta ou usuário não encontrado, favor revisar"],
        success: false,
        data: {},
      },
    };
    //tenta requisitar api
    try {
      const dadosAcesso = { email, password, ignore_expiration };
      await StorageController.salvarPorChave(
        this.keyStorageRequest,
        dadosAcesso
      );
      console.log(dadosAcesso);
      const response = await api.post("/login", dadosAcesso);
      if (response.data.success) {
        await StorageController.salvarPorChave(
          this.keyStorageResponse + email,
          response.data.data
        );

        return response;
      }
    } catch (error) {
      console.log(`AuthController.doLogin:error -> ${JSON.stringify(error)}`);
      crashlytics().recordError(error);
      //throw error;
    }

    //busca token no local storage
    let data = await StorageController.buscarPorChave(
      this.keyStorageResponse + email
    );

    if (data) {
      data = JSON.parse(data);
      result.code = 200;
      result.message = "";
      result.errors = [];
      result.data.success = true;
      result.data.data = data;
    }

    return result;
  }

  static async getToken() {
    let token = await StorageController.buscarPorChave(TOKEN_KEY);
    console.log('bbbb', token);
    //token = JSON.parse(token);
    const valid = await this.validateToken(token);

    if (valid) return token;

    let loginRequest = await StorageController.buscarPorChave(
      this.keyStorageRequest
    );
    if (loginRequest) {
      loginRequest = JSON.parse(loginRequest);
      const response = await this.doLogin(
        loginRequest.email,
        loginRequest.password,
        loginRequest.ignore_expiration
      );
      if (response.data.success) {
        await StorageController.salvarPorChave(
          TOKEN_KEY,
          response.data.data.access_token
        );
        return response.data.data.access_token;
      }
    }

    const tokenRes = await StorageController.buscarPorChave(TOKEN_KEY);
    return tokenRes;
  }

  static async validateToken(token) {
    try {
        const responseReason = await api.get(`/insuccess/types`, {
            params: { type: 1 },
            headers: { Authorization: `bearer ${token}` },
          });

      console.log(`Token valid: ${token}`);
      return true;
    } catch (error) {
      console.log(`Token error: ${error}`);
      console.log(`Token invalid: ${token}`);
      return false;
    }
  }
}
