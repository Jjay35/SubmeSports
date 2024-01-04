import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Faq from './faq';



const Stack = createStackNavigator();

const FaqNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Faq'>
        <Stack.Screen name="Faq" component={Faq}  options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}

export default FaqNavigator