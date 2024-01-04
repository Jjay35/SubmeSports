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

const Game = () => {

  const nav = useNavigation();
  const { isLoaded, user } = useUser();
  const initialGames = [{text: 'game1', key:'1', distance: '5' ,sport: 'football', picture: require("../../../images/soccer.jpeg")},
  {text: 'game2', key:'2', distance: '10', sport: 'football', picture: require("../../../images/soccer.jpeg")},
  {text: 'game3', key:'3', distance: '5', sport: 'basketball', picture: require("../../../images/basketball.jpeg")},]


  const getGames = (user) => {
    if(user){
      gameService
      .getAllGame(user.id)
      .then((response) => {
        setGames(response.data);
        setFilterGames(response.data)
        console.log("Return game data from DB")
        
      }).catch((error) => {
        console.log("Error fetching game data from DB");
      })
    }
    
  }

  
  useFocusEffect(
    React.useCallback(() => {
      getGames(user)
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

      Location.getCurrentPositionAsync({})
      .then((location) => {
        console.log(location)
        setLocation(location)
      })
    
     
    })();
  }, [])

  

  const initGame = [{"id": 12,
  "gameCreator": "Andy",
  "sport": "football",
  "location": ["hi", "-3.56", "-34.2"],
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



  const [games, setGames] = useState(initGame)
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

    const filteredGames = games.filter((game) => {
      const isSportMatch = !sport || sport.length === 0 || sport.includes(game.sport);
      let actualDistance;
      if (location && location.coords){
        actualDistance = proximityCalculator(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          { latitude: game.location[1], longitude: game.location[2] }
        );
      }
      const isWithinDistance = !distance || actualDistance < distance;
      const isGameType = !gameType || gameType.length === 0 || gameType.includes(theGameTypes[game.gameType])
      const isGender = !gender || gender.length === 0 || gender.includes(theGenders[game.teamGender])

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
    setFilterGames(games)
  };
 

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View className='mb-5'>
          <BarButton setModalVisible={setModalVisible} modalVisible={modalVisible}/>
           <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} onApplyFilter={applyFilter} onClearFilter={clearFilter} games={games} filterGames={filterGames}/>
        </View>
        <View>
          <GameWrapper allSports={filterGames} filter={filter} location={location} reloadGames={getGames}/>
        </View>
      </View>
    </View>
  )
}

export default Game;

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



