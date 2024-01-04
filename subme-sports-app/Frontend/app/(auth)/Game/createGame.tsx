import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import hideDoubleHeader from "../hideDoubleHeader";
import { router } from "expo-router";
import gameService from "./gameService";
import userService from "../User/userService";
import profileService from "../Profile/profileService";
import { Button, Switch } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { SUBME_COLOR } from "../../../constants/constants";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { Icon } from "react-native-elements";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalSelector from "react-native-modal-selector";
import ModalSelect from "./ModalSelect";
import ModalSelectMultiple from "./ModalSelectMultiple";
import friendsService from "../Friends/friendsService";

const CreateGame = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  // Shows or hide modal during location searching session
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  hideDoubleHeader(navigation, "Create Game");
  const [openGender, setOpenGender] = useState(false);
  const [openSport, setOpenSport] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openCompetitiveness, setOpenCompetitiveness] = useState(false);
  const [openPrivateMembersList, setOpenPrivateMembersList] = useState(false);

  const [valueGender, setValueGender] = useState("");
  const [valueSport, setValueSport] = useState("");
  const [valueType, setValueType] = useState("");
  const [valueCompetitiveness, setValueCompetitiveness] = useState("");
  const [valuePrivateMembersList, setValuePrivateMembersList] = useState([]);

  const [playersNeededError, setPlayersNeededError] = useState("");
  const [noPlayersError, setNoPlayersError] = useState("");
  const [errorExist, setErrorExist] = useState(false);

  // const [itemsGender, setItemsGender] = useState([
  //   { label: "Coed", value: "C" },
  //   { label: "Male", value: "M" },
  //   { label: "Female", value: "F" },
  // ]);

  const itemsGender = [
    { key: "C", value: "Coed" },
    { key: "M", value: "Male" },
    { key: "F", value: "Female" },
  ];

  // const [itemsSport, setItemsSport] = useState([
  //   { key: "Basketball", value: "Basketball" },
  //   { key: "Bowling", value: "Bowling" },
  //   { key: "Dodgeball", value: "Dodgeball" },
  //   { key: "Flag Football", value: "Flag Football" },
  //   { key: "Kickball", value: "Kickball" },
  //   { key: "Golf", value: "Golf" },
  //   { key: "Volleyball", value: "Volleyball" },
  //   { key: "Soccer", value: "Soccer" },
  // ]);

  const itemsSport = [
    { key: "Basketball", value: "Basketball" },
    { key: "Bowling", value: "Bowling" },
    { key: "Dodgeball", value: "Dodgeball" },
    { key: "Flag Football", value: "Flag Football" },
    { key: "Kickball", value: "Kickball" },
    { key: "Golf", value: "Golf" },
    { key: "Volleyball", value: "Volleyball" },
    { key: "Soccer", value: "Soccer" },
  ];

  const updateValueGender = (key) => {
    if (key) {
      setValueGender(key);
    }
    setOpenGender(false);
  };

  const updateValueSport = (key) => {
    if (key) {
      setValueSport(key);
    }
    setOpenSport(false);
  };

  const updateValueType = (key) => {
    if (key) {
      setValueType(key);
    }
    setOpenType(false);
  };

  const updateValueCompetitiveness = (key) => {
    if (key) {
      setValueCompetitiveness(key);
    }
    setOpenCompetitiveness(false);
  };

  const updateValuePrivateMembersList = (keys) => {
    if (keys) {
      setPrivateMembersSelected(keys);
    }
    console.log("keys: ", keys);
    console.log("keys? :", keys ? "yes" : "no");
    console.log("privateMembersSelected: ", privateMembersSelected);
    setOpenPrivateMembersList(false);
  };

  const itemsType = [
    { key: "S", value: "Sub Needed" },
    { key: "P", value: "Pick Up Game" },
    { key: "N", value: "New Team" },
    { key: "C", value: "Class" },
  ];

  const itemsCompetitiveness = [
    { key: "R", value: "Recreational" },
    { key: "I", value: "Intramural" },
    { key: "C", value: "Competitive" },
  ];

  const [itemsPrivateMembersList, setItemsPrivateMembersList] = useState([]);

  const [isPrivate, setIsPrivate] = useState(false);
  const toggleIsPrivate = () => setIsPrivate((prev) => !prev);

  const [duration, setDuration] = useState(0);
  const [playersNeeded, setPlayersNeeded] = useState(0);
  const [gameDetails, setGameDetails] = useState("");
  const [noPlayers, setNoPlayers] = useState(0);

  const [createSuccess, setCreateSuccess] = useState(false);

  const { isLoaded, user } = useUser();

  const sendBack = () => {
    router.replace("../");
  };

  const [location, setLocation] = useState([]);
  const [privateMembersSelected, setPrivateMembersSelected] = useState([]);

  // modal-datetime-picker
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  // const [date, setDate] = useState(null)

  const [isStartDateTimePickerVisible, setStartDateTimePickerVisibility] =
    useState(false);

  const [isEndDateTimePickerVisible, setEndDateTimePickerVisibility] =
    useState(false);

  const showStartDateTimePicker = () => {
    setStartDateTimePickerVisibility(true);
  };
  const hideStartDateTimePicker = () => {
    setStartDateTimePickerVisibility(false);
  };
  const showEndDateTimePicker = () => {
    setEndDateTimePickerVisibility(true);
  };
  const hideEndDateTimePicker = () => {
    setEndDateTimePickerVisibility(false);
  };

  const handleConfirmStartDateTime = (date) => {
    // console.warn("A start date has been picked: ", date);
    setStartDateTime(date);
    hideStartDateTimePicker();
  };

  const handleConfirmEndDateTime = (date) => {
    // console.warn("A end date has been picked: ", date);
    setEndDateTime(date);
    hideEndDateTimePicker();
  };

  // const styles = StyleSheet.create({
  //   dateTimePicker: {
  //     height: 50,
  //     marginBottom: 20,
  //   },
  //   dropDownPickerGender: {
  //     backgroundColor: "background: rgba(0,0,0,0)",
  //     borderWidth: 2,
  //     borderColor: "#52525b",
  //     zIndex: 200,
  //     marginVertical: 8,
  //   },
  //   dropDownPickerSport: {
  //     backgroundColor: "background: rgba(0,0,0,0)",
  //     borderWidth: 2,
  //     borderColor: "#52525b",
  //     zIndex: 1,
  //     marginVertical: 8,
  //   },
  //   dropDownPickerType: {
  //     backgroundColor: "background: rgba(0,0,0,0)",
  //     borderWidth: 2,
  //     borderColor: "#52525b",
  //     zIndex: 1,
  //     marginVertical: 8,
  //   },
  //   dropDownPickerCompetitiveness: {
  //     backgroundColor: "background: rgba(0,0,0,0)",
  //     borderWidth: 2,
  //     borderColor: "#52525b",
  //     zIndex: 1,
  //     marginVertical: 8,
  //   },
  //   dropDownPickerPrivateMembersList: {
  //     backgroundColor: "background: rgba(0,0,0,0)",
  //     borderWidth: 2,
  //     borderColor: "#52525b",
  //     zIndex: 1,
  //     marginVertical: 8,
  //   },
  // });

  // const testPayload = {
  //   gameCreator: "Noah",
  //   sport: "volleyball",
  //   location: "Noah's house",
  //   gameType: "A",
  //   duration: "1 hour",
  //   startTime: "5.00 pm",
  //   teamGender: "C",
  //   playersNeeded: 5,
  //   competitiveness: "R",
  //   gameDetails: "Come have fun",
  //   isPrivate: 1,
  //   privateMembersList: ["FFF"],
  //   playersJoined: [],
  // };

  const modalStyles = StyleSheet.create({
    sportsButtonContainer: {
      backgroundColor: SUBME_COLOR.DARK_BLUE,
      display: "flex",
      borderRadius: 25,
    },
    sportsButton: {
      borderColor: "black",
      borderWidth: 2,
    },
    sportsButtonText: {
      color: "red",
      backgroundColor: "red",
    },
  });

  const getProfileName = () => {
    profileService
      .getProfileById(user.id)
      .then((response) => {
        console.log(response.data.name);
        setProfileName(response.data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [profileName, setProfileName] = useState("");
  let friendNames = [];

  const setPrivateMembersListNames = () => {
    friendsService
      .getAllFriends(user.id)
      .then((response) => {
        response.data.map((friend) => {
          friendNames.push({ key: friend.userID, value: friend.name });
        });
        setItemsPrivateMembersList(friendNames);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setPrivateMembersListNames();
    }, [])
  );

  const realPayload = {
    gameCreator: user.id,
    sport: valueSport,
    location: location,
    gameType: valueType,
    duration: duration,
    startTime: startDateTime,
    teamGender: valueGender,
    playersNeeded: playersNeeded,
    competitiveness: valueCompetitiveness,
    gameDetails: gameDetails,
    isPrivate: isPrivate ? 1 : 0,
    privateMembersList: privateMembersSelected,
    playersJoined: [],
    isExpired: false,
    gamePlayerNo: noPlayers,
    waitList: [],
  };

  const sendPayload = () => {
    gameService
      .createGame(realPayload)
      .then((response) => {
        console.log("Real payload sent");
      })
      .catch((error) => {
        console.log("Error sending real payload");
        console.log(error);
      });
    Alert.alert("Success!", "Game created!", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  function convertMilliseconds(milliseconds) {
    // Calculate days, hours, minutes, and remaining milliseconds
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    milliseconds %= 24 * 60 * 60 * 1000;

    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    milliseconds %= 60 * 60 * 1000;

    const minutes = Math.floor(milliseconds / (60 * 1000));

    return {
      days,
      hours,
      minutes,
    };
  }

  useEffect(() => {
    if (
      startDateTime === null ||
      endDateTime === null ||
      startDateTime.getTime() >= endDateTime.getTime()
    ) {
      setErrorExist(true);
    } else if (startDateTime.getTime() <= new Date().getTime()) {
      setErrorExist(true);
    } else {
      var diff = Math.abs(endDateTime - startDateTime);
      setDuration(diff);

      const converted = convertMilliseconds(diff);

      setDays(converted.days);
      setHours(converted.hours);
      setMinutes(converted.minutes);
      setErrorExist(false);
    }
  }, [startDateTime, endDateTime]);

  useEffect(() => {
    if (
      valueSport === "" ||
      location.length === 0 ||
      valueType === "" ||
      valueGender === "" ||
      playersNeeded === 0 ||
      noPlayers === 0 ||
      valueCompetitiveness === "" ||
      gameDetails === "" ||
      (isPrivate === true && privateMembersSelected.length === 0) ||
      duration === 0
    ) {
      setErrorExist(true);
    } else {
      setErrorExist(false);
    }
  }, [
    valueSport,
    location,
    valueType,
    valueGender,
    playersNeeded,
    noPlayers,
    valueCompetitiveness,
    gameDetails,
    isPrivate,
    duration,
  ]);

  useEffect(() => {
    if (Number(playersNeeded) < 1) {
      setPlayersNeededError("Players needed must be more than 0");
      setErrorExist(true);
      return;
    } else {
      setPlayersNeededError("");
      setErrorExist(false);
    }

    if (Number(noPlayers) < 1) {
      setNoPlayersError("No. players must be more than 0");
      setErrorExist(true);
      return;
    } else {
      setNoPlayersError("");
      setErrorExist(false);
    }

    if (Number(noPlayers) < Number(playersNeeded)) {
      setNoPlayersError("No. players must be more than players needed");
      setErrorExist(true);
    } else {
      setNoPlayersError("");
      setErrorExist(false);
    }
  }, [noPlayers, playersNeeded]);

  useEffect(() => {
    if (isPrivate) {
      if (privateMembersSelected.length === 0) {
        setErrorExist(true)
      }
      else {
        setErrorExist(false);
      }
    }
  }, [isPrivate, privateMembersSelected])

  return (
    <View
      className="w-full h-full mb-32 items-center"
      style={{ backgroundColor: SUBME_COLOR.LIGHT_BLUE }}
    >
      <View className="w-4/5 h-full ">
        <ScrollView
          nestedScrollEnabled
          className=" h-screen"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-10 z-[1000] pt-5">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Sport
            </Text>

            <Pressable
              className="text-2xl font-bold mb-2 p-3 rounded-lg"
              style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
              onPress={() => setOpenSport(true)}
            >
              <Text className="text-white text-center font-semibold">
                {valueSport !== "" ? valueSport : "None"}
              </Text>
            </Pressable>

            {openSport ? (
              <ModalSelect data={itemsSport} onReturn={updateValueSport} />
            ) : (
              <></>
            )}
          </View>

          <View className="mb-10 z-[999]">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Location
            </Text>
            {location && (
              <Text
                className="text-lg text-center mb-2"
                style={{ color: SUBME_COLOR.DARK_BLUE }}
              >
                {location[0]}
              </Text>
            )}
            <Button
              textColor="white"
              className="w-full"
              style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
              onPress={showModal}
            >
              Set Location
            </Button>
          </View>

          <View className="mb-10 z-[999]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Game Type
            </Text>

            <Pressable
              className="text-2xl font-bold mb-2 p-3 rounded-lg"
              style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
              onPress={() => setOpenType(true)}
            >
              <Text className="text-white text-center font-semibold">
                {valueType !== "" ? valueType : "None"}
              </Text>
            </Pressable>

            {openType ? (
              <ModalSelect data={itemsType} onReturn={updateValueType} />
            ) : (
              <></>
            )}
          </View>

          <View className="mb-10 z-[997]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Gender
            </Text>
            <Pressable
              className="text-2xl font-bold mb-2 p-3 rounded-lg"
              style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
              onPress={() => setOpenGender(true)}
            >
              <Text className="text-white text-center font-semibold">
                {valueGender !== "" ? valueGender : "None"}
              </Text>
            </Pressable>

            {openGender ? (
              <ModalSelect data={itemsGender} onReturn={updateValueGender} />
            ) : (
              <></>
            )}
          </View>

          <View className="mb-10 z-[996]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Players Needed
            </Text>
            <TextInput
              placeholder="Players needed"
              keyboardType={"number-pad"}
              inputMode="numeric"
              className="border-2 border-zinc-600 rounded-md px-4 py-2 w-full h-12"
              onChangeText={(newPlayersNeeded) =>
                setPlayersNeeded(Number(newPlayersNeeded))
              }
            />
            <Text className="text-red-500 mt-2">{playersNeededError}</Text>
          </View>

          <View className="z-[991] mb-10">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              No. Players in Game
            </Text>
            <TextInput
              placeholder="Number of players"
              keyboardType={"number-pad"}
              inputMode="numeric"
              className="border-2 border-zinc-600 rounded-md px-4 py-2 w-full h-12"
              onChangeText={(newNoPlayers) => {
                setNoPlayers(Number(newNoPlayers));
              }}
            />
            <Text className="text-red-500 mt-2">{noPlayersError}</Text>
          </View>

          <View className="mb-10 z-[995]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Competitiveness
            </Text>

            <Pressable
              className="text-2xl font-bold mb-2 p-3 rounded-lg"
              style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
              onPress={() => setOpenCompetitiveness(true)}
            >
              <Text className="text-white text-center font-semibold">
                {valueCompetitiveness !== "" ? valueCompetitiveness : "None"}
              </Text>
            </Pressable>

            {openCompetitiveness ? (
              <ModalSelect
                data={itemsCompetitiveness}
                onReturn={updateValueCompetitiveness}
              />
            ) : (
              <></>
            )}
          </View>

          <View className="mb-10 z-[994]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Game Details
            </Text>
            <TextInput
              placeholder="Game Details"
              className="border-2 border-zinc-600 rounded-md px-4 py-2 w-full h-32"
              onChangeText={(newDetails) => setGameDetails(newDetails)}
              multiline={true}
            />
          </View>

          <View className="flex flex-row justify-between mb-10 z-[993]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Private Game
            </Text>
            <Switch
              onValueChange={toggleIsPrivate}
              value={isPrivate}
              color={SUBME_COLOR.DARK_BLUE}
            />
          </View>

          {/* <View className="mb-10 z-[992]">
               <ModalSelectMultiple
                data={itemsPrivateMembersList}
                onReturn={updateValuePrivateMembersList}
              />
            </View> */}

          {/* {
            setItemsPrivateMembersList(userService.getAllUsers)
          } */}

          {isPrivate && (
            <View className="mb-10 z-[995]">
              <Text
                className="text-2xl font-bold"
                style={{ color: SUBME_COLOR.DARK_BLUE }}
              >
                Private Members
              </Text>

              <Pressable
                className="text-2xl font-bold mb-2 p-3 rounded-lg"
                style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
                onPress={() => setOpenPrivateMembersList(true)}
              >
                <Text className="text-white text-center font-semibold">
                  {privateMembersSelected.length !== 0
                    ? privateMembersSelected.length + " members"
                    : "No members"}
                </Text>
              </Pressable>

              {openPrivateMembersList ? (
                <ModalSelectMultiple
                  data={itemsPrivateMembersList}
                  onReturn={updateValuePrivateMembersList}
                />
              ) : (
                <></>
              )}
            </View>
          )}

          <View className="mb-10 z-[992]">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              Start Time
            </Text>
            <View className="flex-row w-full justify-center">
              <DateTimePickerModal
                isVisible={isStartDateTimePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmStartDateTime}
                onCancel={hideStartDateTimePicker}
              />
              <Pressable
                className="text-2xl font-bold mb-2 p-3 rounded-lg w-full"
                style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
                onPress={showStartDateTimePicker}
              >
                <Text className="text-white text-center font-semibold">
                  {startDateTime
                    ? startDateTime.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                    : "Select a time"}
                </Text>
              </Pressable>
            </View>

            <Text className="text-red-500">
              {startDateTime !== null &&
              startDateTime.getTime() <= new Date().getTime()
                ? "start time must be after current time"
                : ""}
            </Text>
          </View>

          <View className="mb-10 z-[992]">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              End Time
            </Text>
            <View className="flex-row w-full justify-center">
              <DateTimePickerModal
                isVisible={isEndDateTimePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmEndDateTime}
                onCancel={hideEndDateTimePicker}
              />
              <Pressable
                className="text-2xl font-bold mb-2 p-3 rounded-lg w-full"
                style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
                onPress={showEndDateTimePicker}
              >
                <Text className="text-white text-center font-semibold">
                  {endDateTime
                    ? endDateTime.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                    : "Select a time"}
                </Text>
              </Pressable>
            </View>
            <Text className="text-red-500">
              {startDateTime !== null &&
              endDateTime !== null &&
              startDateTime.getTime() >= endDateTime.getTime()
                ? "end time must be before start time"
                : ""}
            </Text>

          </View>

          <View className="mb-10 z-[998]">
            <Text
              className="text-2xl font-bold"
              style={{ color: SUBME_COLOR.DARK_BLUE }}
            >
              {"Duration: "}
              {days > 0 && <Text>{days} days </Text>}
              {days == 0 && hours > 0 && <Text>{hours} hours </Text>}
              {hours == 0 && days > 0 && (
                <Text>
                  {days} days {hours} hours
                </Text>
              )}
              {minutes > 0 && <Text>{minutes} minutes</Text>}
            </Text>
          </View>

          {!errorExist ? (
            <View className="pb-64">
              <Button
                textColor="white"
                className="w-full"
                style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
                onPress={() => {
                  console.log(realPayload);
                  sendPayload();
                }}
              >
                Create Game
              </Button>
            </View>
          ) : (
            <View className="pb-64">
              <Button
                textColor="white"
                className="w-full"
                style={{ backgroundColor: "#4c4c4c" }}
              >
                Create Game
              </Button>
              <Text className="text-red-500 mt-2">Fix errors to submit</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {visible && (
        <View
          className="h-screen w-full absolute top-0 items-center"
          style={{ backgroundColor: SUBME_COLOR.DARK_BLUE }}
        >
          <View className="w-full items-end mr-2">
            <Pressable
              onPress={() => {
                hideModal();
                setLocation([]);
              }}
            >
              <Icon color={"white"} name="close" size={40} />
            </Pressable>
          </View>

          <View className="w-4/5 items-center ">
            <Text className="text-white text-2xl mb-10">
              Enter location details
            </Text>
          </View>

          <View className="w-4/5 h-full justify-center">
            <GooglePlacesAutocomplete
              placeholder="Location"
              fetchDetails={true}
              styles={{ width: "80%" }}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                setLocation([
                  data.description.toString(),
                  details.geometry.location.lat.toString(),
                  details.geometry.location.lng.toString(),
                ]);
                hideModal();
              }}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: "en",
              }}
            />
          </View>
        </View>
      )}

      {/* {isPrivate ? (
        <DropDownPicker
          placeholder="Private Members"
          open={openPrivateMembersList}
          value={valuePrivateMembersList}
          items={itemsPrivateMembersList}
          setOpen={setOpenPrivateMembersList}
          setValue={setValuePrivateMembersList}
          setItems={setItemsPrivateMembersList}
          style={styles.dropDownPickerPrivateMembersList}
          // dropDownContainerStyle = {{backgroundColor: "background: rgba(0,0,0,1)"}}
        />
      ) : (
        <></>
      )} */}

      {/* <Pressable
        className="bg-blue-500 rounded-md w-full h-12 items-center justify-center hover:bg-blue-600"
        onPress={() => {
          setCreateSuccess(!createSuccess);
          setTimeout(sendBack, 300);
        }}
      >
        <Text className="text-xl text-white font-bold">
          {!createSuccess ? "Create" : "Created"}
        </Text>
      </Pressable> */}

      {/* <Pressable
        className="bg-blue-500 rounded-md w-full h-12 items-center justify-center hover:bg-blue-600"
        onPress={() => {
          //   sendPayload()
          console.log(realPayload);
          getAllProfileNames();
          setTimeout(() => {
            console.log("allProfileNames: ", allProfileNames);
          }, 1000);

          // console.log(profileName)
        }}
      >
        <Text>test button</Text>
      </Pressable> */}
    </View>
  );
};

export default CreateGame;
