import 'react-native-gesture-handler';
import {  Redirect, router, useFocusEffect, useRouter } from "expo-router"
import { StyleSheet, View, Text, FlatList,Pressable } from 'react-native'
import React, { useEffect, useState}from 'react'
import GameList from '../../../components/gameScreenList'
import BarButton from '../../../components/barButtons'
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Button } from 'react-native-paper';
import { Link } from '@react-navigation/native';
import GameWrapper from '../../../components/gameWrapper';
import CustomModal from '../../../components/modal';
import { initialFilter } from '../../../constants/initialFilter';
import gameService from './gameService';
import * as Location from 'expo-location'
import { useUser } from '@clerk/clerk-expo';
import proximityCalculator from './proximityCalculator';

const ActiveGame = () => {
  const nav = useNavigation();
  const { isLoaded, user } = useUser();
  
  useFocusEffect(
    React.useCallback(() => {
      getTheActiveGames(user)
    }, [])
  );
  
  const [location, setLocation] = useState<Location.LocationObject|null>(null);

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync()

      if(status == 'granted'){
        console.log('Permission successful')
      } else {
        console.log('Permission not granted')
      }

      const loc = await Location.getCurrentPositionAsync()
      console.log(loc)
      setLocation(loc)
    })();
  }, [])

  const initGame = [{"id": 12,
  "gameCreator": "Andy",
  "sport": "football",
  "location": "Beyer",
  "gameType": "A",
  "duration": "1 hour",
  "startTime": "8.00 pm",
  "teamGender": "C",
  "playersNeeded": 6,
  "competitiveness": "R",
  "gameDetails": "This is a intramural football league",
  "isPrivate": 0,
  "privateMembersList": [
      "FFF",
      "GGG"
  ],
  "playersJoined": [],
  "isExpired":false,
  "gamePlayerNo": 10,
  "waitList":[]
  }]


  
    const getTheActiveGames = (user) => {

        if(user){
            gameService
            .getActiveGames(user.id)
            .then((response) => {
                setActiveGames(response.data)
                setFilterGames(response.data)
                // console.log("Past games: ", response.data)
            }).catch((error) => {
                console.log("Error fetching past games data")
            })
        }
     
    }

    
  const [activeGames, setActiveGames] = useState(initGame)
  // const [games, setGames] = useState(initGame)
  const [filterGames, setFilterGames] = useState(initGame)
  const [filter, setFilter] = useState(initialFilter)
  const [intermediateFilter, setIntermediateFilter] = useState(initialFilter)
  const [modalVisible, setModalVisible] = useState(false)

  const [filteredSport, setFilteredSport] = useState(null);
  const [filteredDistance, setFilteredDistance] = useState(null);
  const [filteredGameType, setFilteredGameType] = useState(null);
  const [filteredGender, setFilteredGender] = useState(null);

  const applyFilter = (sport, distance, gameType, gender) => {
    setFilteredSport(sport);
    setFilteredDistance(distance);
    setFilteredGameType(gameType);
    setFilteredGender(gender);
    

    const theGameTypes = {"S" : "Sub Needed", "P": "Pick Up Game", "N" : "New Team", "C": "Class"}
    const theGenders = {"M" : "Male", "F" : "Female", "C" : "Coed"}

      
    // ));
    const filteredGames = activeGames.filter((activeGame) => {
      const isSportMatch = !sport || sport.length === 0 || sport.includes(activeGame.sport);
      let actualDistance;
      if (location && location.coords){
        actualDistance = proximityCalculator(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          { latitude: activeGame.location[1], longitude: activeGame.location[2] }
        );
      }
      const isWithinDistance = !distance || actualDistance < distance;
      const isGameType = !gameType || gameType.length === 0 || gameType.includes(theGameTypes[activeGame.gameType])
      const isGender = !gender || gender.length === 0 || gender.includes(theGenders[activeGame.teamGender])

      return isSportMatch && isWithinDistance && isGameType && isGender;
    });

    if(filteredGames != null){
      setFilterGames(filteredGames);
    }
  };

  const clearFilter = () => {
    setFilteredSport(null);
    setFilteredDistance(null);
    setFilteredGameType(null);
    setFilteredGender(null);
    setFilterGames(activeGames);
    
  };
 

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View className='mb-5'>
          <BarButton setModalVisible={setModalVisible} modalVisible={modalVisible}/>
           <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} onApplyFilter={applyFilter} onClearFilter={clearFilter} games={activeGames} filterGames={filterGames}/>
        </View>
        <View className="h-full">
          <GameWrapper allSports={filterGames} filter={filter} location={location} reloadGames={getTheActiveGames}/>
        </View>
      </View>

          

      </View>
  )
}

export default ActiveGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 40,
  },
  list: {
    marginTop: 20,
  },
})



