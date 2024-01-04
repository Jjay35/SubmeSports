import { View } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import { Redirect } from 'expo-router'

//Used for redirectiing to home page after authentication is processed
// Need to find fix for redirecting url once authenticated
const Page = () => {
  return (
    <>
    <Redirect href="/(auth)/Profile" />
    </>
   
  )
}

export default Page;