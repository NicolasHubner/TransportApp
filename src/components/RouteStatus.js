import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { windowWidth } from "../utils/metrics";

export default function RouteStatus({ locais, completo }) {
  const [quantidade, setQuantidade] = useState([]);

  useEffect(() => {
    let array = [];
    for (let i = 0; i <= locais; i++) {
      array = [...array, i];
    }
    setQuantidade(array);
  }, []);

  return (
    <>
      {locais > 0 && (
        <View style={styles.container}>
          <View style={styles.containerPoint}>
            {quantidade?.map((index) => (
              <View key={index} style={index == completo ? styles.point : ""}>
                {index == completo && (
                  <Text style={index == completo ? styles.font : ""}>
                    {completo}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View style={styles.line}>
            {quantidade?.map((index) => (
              <View key={index} style={styles.dot}>
                <Text>{index}</Text>
              </View>
            ))}
            <View
              style={[
                styles.completed,
                { width: (windowWidth / 2.5 / locais) * completo },
              ]}
            ></View>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  point: {
    backgroundColor: "#000000",
    height: 15,
    width: 15,
    borderTopStartRadius: 7,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    transform: [{ rotateZ: "45deg" }],
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  font: {
    fontSize: 9,
    textAlign: "center",
    color: "#FFFFFF",
    transform: [{ rotateZ: "-45deg" }],
  },

  containerPoint: {
    width: windowWidth / 2.3,
    // height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  line: {
    width: windowWidth / 2.5,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.26)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  completed: {
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
  },

  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(0, 0, 0, 0.60)",
  },
});
