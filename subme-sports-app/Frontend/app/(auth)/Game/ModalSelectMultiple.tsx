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

const ModalSelectMultiple = ({ data, onReturn }) => {
  const styles = StyleSheet.create({
    centeredView: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(256,256,256,0.7)",
      // height: "100vh",
      // width: "100vw",
    },

    buttonSubmit: {
      borderRadius: 15,
      paddingVertical: 15,
      elevation: 2,
      backgroundColor: "rgba(256,256,256,0.7)",
      alignItems: "center",
      marginHorizontal: 20,
      marginBottom: 10,
    },
    buttonCancel: {
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
      justifyContent: "center",
      flex: 1,
      flexDirection: "row",
    },
    singleOptionContainerLast: {
      justifyContent: "center",
      flex: 1,
      flexDirection: "row",
    },
    optionsText: {
      color: "rgb(20,126,251)",
      paddingVertical: 20,
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  const handleCancel = (selected) => {
    onReturn(selected);
  };

  const handleSubmit = (selected) => {
    onReturn(selected);
  };

  // var chosen = [];
  const [chosen, setChosen] = useState([]);
  // let chosen = []
  const handleOnSelect = (selected) => {
    setChosen([...chosen, selected]);
    // chosen = [...chosen, selected]
    chosen.push(selected);
    console.log(chosen);
  };

  const handleOnUnselect = (unselected) => {
    // setChosen((state) => state.filter((item) => item !== unselected))

    // setChosen(oldValues => {
    //   return oldValues.filter(item => item !== unselected)
    // })
    const updatedArray = chosen.filter((item) => {
      return item !== unselected;
    });
    console.log(updatedArray);
    setChosen(updatedArray);
    // chosen = updatedArray

    // chosen = chosen.filter((e) => e !== unselected);
  };

  const handleBackgroundColor = (key) => {
    if (chosen.includes(key)) {
      return { backgroundColor: "rgba(0,0,0,0.05)" };
    } else {
      return { backgroundColor: "" };
    }
  };

  const [optionStyle, setOptionStyle] = useState({
    backgroundColor: "rgba(0,0,0,0.05)",
  });

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
              {data.map((item, index) =>
                index !== data.length - 1 ? (
                  <Pressable
                    style={styles.singleOptionContainer}
                    key={item.key}
                    onPress={() => {
                      if (
                        chosen.find((element) => element === item.key) ===
                        item.key
                      ) {
                        handleOnUnselect(item.key);
                      } else {
                        handleOnSelect(item.key);
                      }
                      handleBackgroundColor(item.key);

                      // setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionsText}>
                      {chosen.find((element) => element === item.key) ===
                      item.key
                        ? "✓   "
                        : "   "}
                      {item.value}
                    </Text>
                    {/* <Text style={styles.optionsText}>{item.value}</Text> */}
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.singleOptionContainerLast}
                    key={item.key}
                    onPress={() => {
                      if (
                        chosen.find((element) => element === item.key) ===
                        item.key
                      ) {
                        handleOnUnselect(item.key);
                      } else {
                        handleOnSelect(item.key);
                      }
                      handleBackgroundColor(item.key);

                      // setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionsText}>
                      {chosen.find((element) => element === item.key) ===
                      item.key
                        ? "✓   "
                        : "   "}
                      {item.value}
                    </Text>
                  </Pressable>
                )
              )}
            </ScrollView>
          </View>
          <Pressable
            style={styles.buttonSubmit}
            onPress={() => {
              handleSubmit(chosen);
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
          <Pressable
            style={styles.buttonCancel}
            onPress={() => {
              handleCancel(null);
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ModalSelectMultiple;
