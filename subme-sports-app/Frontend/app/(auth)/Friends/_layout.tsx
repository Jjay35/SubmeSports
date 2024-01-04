import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Friends from './friends';
import AddFriend from './addFriend';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderTitle } from '@react-navigation/elements';
import FriendRequests from './friendRequests';
import { SUBME_COLOR } from '../../../constants/constants';
import TabFriendsNavigator from './friendsTabLayout';
import Chat from '../Chat/chat';


const Stack = createStackNavigator();

const FriendsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Friendstab' screenOptions={{headerShown:false}}>
      <Stack.Screen name= "Friendstab" component={TabFriendsNavigator} />
      <Stack.Screen name= "Chat"  component={Chat} />
  </Stack.Navigator>


     
  )
}

export default FriendsNavigator;