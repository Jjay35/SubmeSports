import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import Game from './game';
import CreateGame from './createGame';
import { useNavigation } from 'expo-router';
import GameDetails from './gameDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SUBME_COLOR } from '../../../constants/constants';
import TabGameNavigator from './tablayout';
import Chat from '../Chat/chat';
const Stack = createStackNavigator();


const Tab = createMaterialTopTabNavigator();

const GameNavigator = () => {

  return (
        <Stack.Navigator initialRouteName='Game' screenOptions={{headerShown:false}}>
            <Stack.Screen name= "Game" component={TabGameNavigator} />
            <Stack.Screen name= "CreateGame" component={CreateGame} />
            <Stack.Screen name= "GameDetails" component={GameDetails} />
            <Stack.Screen name= "Chat"  component={Chat} />
        </Stack.Navigator>
  )
}

export default GameNavigator;