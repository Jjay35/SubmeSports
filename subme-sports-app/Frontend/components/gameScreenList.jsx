import { useNavigation } from 'expo-router';
import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native'
import proximityCalculator from '../app/(auth)/Game/proximityCalculator';
import moment from 'moment'

export default function GameList({item , location}) {
   

    const sportsList = {"Flag Football" : require("../images/football.jpeg"), "Soccer" : require("../images/soccer.jpeg"), "Basketball" : require("../images/basketball.jpeg"), "Bowling" : require("../images/bowling.jpeg"), "Dodgeball" : require("../images/dodgeball.jpeg"), "Golf" : require("../images/golf.jpeg"), "Kickball" : require("../images/kickball.jpeg"), "Volleyball" : require("../images/volleyball.jpeg")}
    const genderImages = {"C" : require("../images/coed.jpeg") , "M" : require("../images/male.jpeg"), "F" : require("../images/female.jpeg")}
    
    const navigation = useNavigation()
    const handlePress = () => {
        navigation.navigate("GameDetails", { gameData: item , currentScreen: navigation.getState().routeNames[navigation.getState().index]}); // Added currentScreen information to enable group chatting ONLY for active games
    }
    const teamGender = {"C" : "Coed", "M" : "Male", "F" : "Female"}
    const competitiveLevel = {"R" : "Recreational", "I" : "Intramural", "C" : "Competitive"}
    const gameTypes = {"S" : "Sub Needed", "P" : "Pick up game", "N" : "New Team", "C" : "Class"}
    

    // setInterval(distance, 1000)
    let distance;
    if(location && location.coords ){
        distance = proximityCalculator({latitude:location.coords.latitude, longitude:location.coords.longitude}, {latitude:Number(item.location[1]), longitude:Number(item.location[2])})
    }

    const utcDateTimeString = item.startTime
    const utcDateTime = new Date (utcDateTimeString)

    const localDateString = utcDateTime.toLocaleDateString();
    const localTimeString = utcDateTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    let gameValue;
    if(item.isPrivate == true){
        gameValue = "Private"
    }
    else{
        gameValue = "Public"
    }

    return (
        <View>
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Text className='text-xl flex-1 justify-center items-center'>{item.sport}</Text>
                
                <Image source={sportsList[item.sport]} style={styles.image}/>
            <View style={styles.box2}>
                <View style={styles.row2item1}>
                    <Text className='text-m'>{localDateString}</Text>
                    <Text className='font-light'>Date</Text>
                    
                </View>
               
                <View style={styles.row2item1}>
                    <Text className='text-m'>{localTimeString}</Text>
                    <Text className='font-light'>Time</Text>
                </View>

                <View style={styles.row2item1}>
                    <Text>{distance}</Text>
                    <Text>Distance</Text>
                </View>
            </View>
            <View style={styles.box2}>
                <View style={styles.row2item1}>
                    <Image source={genderImages[item.teamGender]} style={styles.genderImage} />
                    <Text className='font-light'>{teamGender[item.teamGender]}</Text>
                </View>
                <View style={styles.row2item1}>
                    <Text className='text-xl'>{item.playersNeeded}</Text>
                    <Text className='font-light'>Players Needed</Text>
                   
                </View>
                <View style={styles.row2item1}>
                    <Text className='text-sm'>{competitiveLevel[item.competitiveness]}</Text>
                    <Text className='font-light'>Level</Text>
                </View>
            </View>
            <View style={styles.box2}>
                <View style={styles.row2item1}>
                    <Text className='text-xl'>{gameTypes[item.gameType]}</Text>
                    <Text className='font-light'>Game type</Text>
                </View>
                <View style={styles.row2item1}>
                    <Text className='text-xl'>{gameValue}</Text>
                    <Text className='font-light'>Open/Closed</Text>
                </View>
            </View>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: 'aliceblue',

    },
    genderImage:{
        resizeMode: "contain",
        height: 20,
        width: 20
    },
    image:{
        resizeMode: "stretch",
        height: 150,
        width: 200,
    },
    box1: {
        paddingTop: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 1,
        borderRadius: 10,
    },
    box2:{
        paddingTop: 0,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 1,
        borderRadius: 0,
    },
    row2item1:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    box4:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        borderColor: '#bbb',
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 1,
        borderRadius: 0,
    }
  });