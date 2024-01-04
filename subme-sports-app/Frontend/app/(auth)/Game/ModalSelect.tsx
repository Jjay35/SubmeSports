import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";

const ModalSelect = ({data, onReturn}) => {
  const styles = StyleSheet.create({
    centeredView: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(256,256,256,0.7)",
      // height: "100vh",
      // width: "100vw",
    },

    button: {
      borderRadius: 15,
      paddingVertical: 15,
      elevation: 2,
      backgroundColor: "rgba(256,256,256,0.7)",
      alignItems: "center",
      marginHorizontal: 20,
    },
    buttonText: {
      color: "rgb(20,126,251)",
      fontSize: 20,
      fontWeight: "bold",
    },
    optionsContainer: {
      borderRadius: 15,
      marginBottom: 10,
      marginHorizontal: 20,
      maxHeight: "45%",
      minHeight: "10%",
    },
    optionsContainerScroll: {
      borderRadius: 15,
      backgroundColor: "rgba(255,255,255,0.7)",
    },
    singleOptionContainer: {
      borderBottomWidth: 2,
      borderStyle: "solid",
      borderColor: "rgba(0,0,0,0.05)",
      justifyContent: "center"
    },
    singleOptionContainerLast: {
      justifyContent: "center",
    },
    optionsText: {
      color: "rgb(20,126,251)",
      paddingVertical: 20,
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center"
    },
  });


  const handleOnSelect = (selected) => {
    onReturn(selected)
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.optionsContainer}>
          <ScrollView style={styles.optionsContainerScroll}>
            {data.map((item, index) => (
              index !== data.length - 1 ? (
                <Pressable
                style={({ pressed }) => [
                  { backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "" },
                  styles.singleOptionContainer,
                ]}
                key={item.key}
                onPress={() => {
                  handleOnSelect(item.key);
                  // setModalVisible(false);
                }}
              >
                <Text style={styles.optionsText}>{item.value}</Text>
              </Pressable>
              ) :
              (
                <Pressable
                style={({ pressed }) => [
                  { backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "" },
                  styles.singleOptionContainerLast,
                ]}
                key={item.key}
                onPress={() => {
                  handleOnSelect(item.key);
                  // setModalVisible(false);
                }}
              >
                <Text style={styles.optionsText}>{item.value}</Text>
              </Pressable>
              )
            ))}
          </ScrollView>
          </View>
          <Pressable
            style={styles.button}
            onPress={() => {
              handleOnSelect(null)
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
      </View>
  );
};

export default ModalSelect;
