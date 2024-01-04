import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import {View} from 'react-native'
import Game from './game';
import CreateGame from './createGame';
import { useNavigation } from 'expo-router';
import GameDetails from './gameDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SUBME_COLOR } from '../../../constants/constants';
import ActiveGame from './activeGame';
import PastGame from './pastGames';

const Tab = createMaterialTopTabNavigator();

const TabGameNavigator = () => {
  return (
      <View className='w-full h-full' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}> 

      <Tab.Navigator initialRouteName='Friends' 
        screenOptions={{tabBarStyle:{
            marginTop:20,
            marginBottom:20,
            width:'80%',
            alignSelf:'center',
            elevation: 5, // shadow on Android
                shadowOpacity: .10, // shadow on iOS,
                shadowRadius: 4, // shadow blur on iOS
            borderRadius: 100,
          }, 
          tabBarActiveTintColor:'white', 
          tabBarInactiveTintColor:'black',

         
          tabBarIndicatorStyle:{
                height: "100%",
               
            
                borderRadius: 100,
                backgroundColor: SUBME_COLOR.DARK_BLUE,
          }
          
        
        }} 
        >
            <Tab.Screen name="SearchGame" component={Game}  options={{title:"SEARCH", tabBarLabelStyle: { textTransform:'none' }}}/>
            <Tab.Screen name="ActiveGame" component={ActiveGame} options={{title:"ACTIVE", tabBarLabelStyle: { textTransform:'none' }}}/>
            <Tab.Screen name="PastGame" component={PastGame} options={{title:"PAST", tabBarLabelStyle: { textTransform:'none' }}}/>
          </Tab.Navigator>
          </View>


  )
}

export default TabGameNavigator;