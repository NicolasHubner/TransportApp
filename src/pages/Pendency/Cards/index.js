import { StyleSheet } from "react-native";
import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../../utils/colors";

export default function Card({ navigation, title, nome, order }) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.order}>{order}</Text>
            <TouchableOpacity onPress={() => console.log('ronaldo')}>
                <View style={[styles.button, {marginTop: 10}]}>
                    <Text style={styles.buttonText}>TIRAR FOTO</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('ronaldo')}>
                <View style={[styles.button, { backgroundColor: 'transparent'}]}>
                    <Text style={[styles.buttonText, { color: colors.primary1}]}>REPORTAR PROBLEMA</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#fff",
        width: '95%',
        height: 260,
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 10,
        // paddingLeft: 20,
        paddingVertical: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        elevation: 5,
    },
    title: {
        fontSize: 20,
        paddingLeft: 20,
        fontWeight: "bold",
        color: "#000",
    },
    nome: {
        fontSize: 16,
        paddingLeft: 20,
        fontWeight: "bold",
        color: "#000",
    },
    order: {
        fontSize: 16,
        paddingLeft: 20,
        fontWeight: "bold",
        color: "#000",
    },
    button: {
        width: "90%",
        height: 40,
        backgroundColor: colors.primary1,
        borderRadius: 50,
        alignSelf: "center",
        margin: 2,
    },
    buttonText: {
        fontSize: 16,
        letterSpacing: 1.5,
        color: "#fff",
        textAlign: "center",
        textAlignVertical: "center",
        height: "100%",
        textTransform: "uppercase",
    },
});