//TIAKI - CRIAÇÃO DA CAMERACONTROLLER - 30.11.2022

import { Linking, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

function CameraController() {

    // VERIFICA SE O USUARIO DEU PERMISSAO AO USO DE MIDIA E DE CAMERA
    const verificaPermissoes = async () => {

        try {

            console.log("chechando permissoes");
            let camera = await ImagePicker.getCameraPermissionsAsync(); //verifica permissao
            let media = await ImagePicker.getMediaLibraryPermissionsAsync(); //verifica permissao

            console.log(camera);
            console.log(media);

            //caso o usuario aperte para nao perguntar novamente
            if (!camera.canAskAgain && !camera.granted) {
                console.log("proibido, abrir configuracoes");
                Alert.alert("Acesso à camera negado", "Ative nas configurações a permissão para que o aplicativo tenha acesso à câmera do celular", [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => Linking.openSettings() }
                ]);
            }

            else if (!media.canAskAgain && !media.granted) {
                console.log("proibido, abrir configuracoes");
                Alert.alert("Acesso aos arquivos/imagens negado", "Ative nas configurações a permissão para que o aplicativo tenha acesso aos arquivos/imagens gerados durante sua utilização", [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => Linking.openSettings() }
                ]);
            }

            //caso o usuario negue a permissao, solicita-se novamente
            else if (!camera.granted || !media.granted) {
                console.log("esta negado, solicitar novamente");
                camera = await ImagePicker.requestCameraPermissionsAsync();
                media = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            //caso as permissoes estejam ok, abre a camera
            if (camera.granted && camera.granted) {
                console.log("permitido, abre a camera");

                // //caso as permissoes estejam ok, abre a camera
                // let foto = await ImagePicker.launchCameraAsync({
                //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
                //     allowsEditing: true,
                //     quality: 0.5,
                //     base64: true,
                // });
                return true
            }

        } catch (error) {
            console.log("wawaw", error.message);
        }
    };

    return {
        verificaPermissoes
    };
}

export default CameraController();