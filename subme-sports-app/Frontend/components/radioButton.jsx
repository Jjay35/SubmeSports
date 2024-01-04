import React, { Component } from "react";
import {
  Text,
} from 'react-native';

import { View, TouchableOpacity, StyleSheet } from "react-native";

const RadioButton = (props) => {
  return (
    <View>
      <View
        style={{
          flexWrap: "wrap",
          height: 300,
          paddingHorizontal: 10,
          width: '100%',
          alignContent: "space-between",
        }}
      >
        {props.sportsResult.map((res) => {
          return (
            <View key={res} style={styles.container}>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => props.handleChange(res)}
                activeOpacity={0.8}
              >
                <View style={styles.radioCircle}>
                  {props.selected === res && (
                    <View style={styles.selectedRb} />
                  )}
                </View>
                <Text style={styles.radioText}>{res}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    marginHorizontal: 5,
    paddingVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  radioText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000000",
    fontWeight: "500",
    flexWrap: "wrap",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#000000",
  },
  result: {
    marginTop: 20,
    color: "white",
    fontWeight: "600",
    backgroundColor: "#000000",
  },
});
