import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, Image, ScrollView, FlatList, RefreshControl} from 'react-native';
//components

import GameList from './gameScreenList';
import { useNavigation } from 'expo-router';

const GameWrapper = ({allSports, filter, location, reloadGames}) => {
    
    const nav = useNavigation();
    const navigateToGameDetails = () => {
        nav.navigate('GameDetails', {allSports: allSports});
    };

  let filterSports = false;
  let empty = false;

  let filterArray = []

  filterSports = allSports

// State used for tracking refresh 
const [refreshing, setRefreshing] = React.useState(false);

// On refresh, reload faqs from db
const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  reloadGames()
  setTimeout(() => {
    setRefreshing(false);
  }, 500);
}, []);



console.log("Location gameWrapper: ", location)
console.log("Filtered Sports:" ,filterSports)


  return(
    <View>
        <FlatList 
            refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={filterSports}
            renderItem={({item}) => (
                <GameList item={item} location={location}/>
        )}/>
        {empty && <Text>No Sports were fetched</Text>}
    </View>
      
  )
}

export default GameWrapper