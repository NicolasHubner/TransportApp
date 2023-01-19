import { View, Text, StyleSheet } from "react-native";

export default function hideModalValidatindImages({validating}) {

    return (
        <View style={styles.modal}>
            <View style={styles.modalContainer}>
                <View>
                    <Text style={[styles.textModal, { fontWeight: "bold" }]}>Aguarde! </Text>
                    <Text style={styles.textModal}>Estamos validando as imagens pendentes de confirmação.</Text>
                    <Text >Validando: {validating} de ...</Text>
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
        justifyContent: "space-around",
        width: "92%",
        height: "50%",
        backgroundColor: "white",
        padding: "5%",
        elevation: 5,
        borderRadius: 5,
    },

    textModal: {
        fontSize: 22,
        marginBottom: "10%"
    },

});
