import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import style from './style';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import { StatusBar } from 'expo-status-bar';
import Card from "./Cards";
import { FlatList } from 'react-native-gesture-handler';

const MockUP = [
    {order: 1,
    title: "Pendência 1",
    nome: "Nome do cliente",
    navigation: "Trips",
    },
    {order: 2,
    title: "Pendência 2",
    nome: "Nome do cliente",
    navigation: "Trips",
    },
    {order: 3,
    title: "Pendência 3",
    nome: "Nome do cliente",
    navigation: "Trips",
    },
    {order: 4,
    title: "Pendência 4",
    nome: "Nome do cliente",
    navigation: "Trips",
    },
]

export default function Pendency({ navigation }) {

    const [isBusy, setIsBusy] = useState(false);


    return (
        <>
        <SafeAreaView style={style.safeArea}>
            <View style={style.header}>
                <Header navigation={navigation} rota="Trips" regress="logoff" />
            </View>

            {isBusy && (
                <View style={{ flex: 15 }}>
                    <Loading></Loading>
                </View>
            )}

            <View style={style.body}>
                <View style={style.bodyRectangleTop}>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold"}}>Pendências</Text>
                </View>
                <View style={style.viewScroll}>
                    <View style={style.list}>
                        <FlatList
                            data={MockUP}
                            keyExtractor={item => item.order}
                            renderItem={({ item }) => (
                                <Card
                                    navigation={navigation}
                                    title={item.title}
                                    nome={item.nome}
                                    order={item.order}
                                />
                            )}
                        />
                    </View>
                </View>
            </View>


            <View style={style.footer}>
                <Footer />
            </View>
        </SafeAreaView>
            <StatusBar hidden={true}/>
        </>
    )
}