import React, { useState } from "react";
import { View, Text, Image, ImageBackground, FlatList } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import colors from "../../utils/colors";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ControlledTrips({ navigation }) {
  const [isBusy, setIsBusy] = useState(false);
  const [hasTrip, setHasTrip] = useState(true);

  const DATA = [
    {
      id: "1947031",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 07, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947032",
      tempo: "00:40",
      end: "Rua Agostinho dos Santos, 2009",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 10, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947033",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 11, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947033",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 12, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947033",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 13, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947033",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 14, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947033",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 17, 2022",
      status: "PENDENTE",
    },
    {
      id: "1947033",
      tempo: "00:40",
      end: "Rua Voluntários da Pátria, 560",
      inicio: "08:30",
      termino: "18:30",
      data: "Jan 18, 2022",
      status: "PENDENTE",
    },
  ];

  return (
    <View style={styles.contents}>
      <View style={styles.header}>
        <Header />
      </View>
      {hasTrip && (
        <View style={styles.body}>
          <View style={styles.rectangle}>
            <Text style={styles.title}>Minhas viagens</Text>
          </View>
          <View style={styles.fundo}></View>
          <View style={styles.list}>
            <View style={{ alignItems: "center" }}>
              <FlatList
                data={DATA}
                // style={{marginHorizontal: 5}}
                keyExtractor={(trip) => String(trip.id)}
                showsVerticalScrollIndicator={false}
                // onEndReachedThreshold={0.2}
                // onEndReached={exibirBotao}
                renderItem={({ item: trip }) => (
                  <View style={styles.background}>
                    <View style={styles.item}>
                      <View style={[styles.status, { marginBottom: 8 }]}>
                        <Text style={styles.textSansRegular}>
                          {trip.status}
                        </Text>
                        <Text style={styles.textSansBold}>{trip.data}</Text>
                      </View>
                      <View style={styles.status}>
                        <Text style={styles.textBold}>Order N.º {trip.id}</Text>
                        <View style={styles.timerContainer}>
                          <Text
                            style={[styles.textSansBold, { color: "white" }]}
                          >
                            {trip.tempo}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.line} />
                      <Text
                        style={[styles.textSansRegular, { marginBottom: 13 }]}
                      >
                        {trip.end}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          <Text
                            style={[
                              styles.textSansBold,
                              { fontSize: 16, marginTop: 10 },
                            ]}
                          >
                            Início previsto: {trip.inicio}
                          </Text>
                          <Text
                            style={[
                              styles.textSansBold,
                              { fontSize: 16, marginTop: 10 },
                            ]}
                          >
                            Término previsto: {trip.termino}
                          </Text>
                        </View>
                        <Image
                          style={styles.logo}
                          source={{
                            uri: "https://media.tarkett-image.com/large/TH_24567080_24594080_24596080_24601080_24563080_24565080_24588080_001.jpg",
                          }}
                        ></Image>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      )}
      {!hasTrip && (
        <View style={styles.bodyEmpty}>
          <View style={styles.containerTitle}>
            <Text style={[styles.title, { color: "#3E3E3E" }]}>
              Minhas viagens
            </Text>
          </View>
          <Image
            style={styles.image}
            source={require("../../assets/images/tripEmpty.png")}
          />
          <Text style={styles.textBody}>Você não possui viagens agendadas</Text>
        </View>
      )}
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
}
