import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import Profile from './profile';


const Stack = createStackNavigator();

const ProfileNavigator = ({route}) => {

  return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name="Profile" component={Profile}  options={{headerShown:false}}/>
        </Stack.Navigator>
  )
}

export default ProfileNavigator; 