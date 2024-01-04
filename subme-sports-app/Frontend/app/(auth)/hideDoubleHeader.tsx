import { useCallback, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Pressable } from 'react-native';
import {useRoute} from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text } from 'react-native-paper';

/**
 * Use this helper function to hide the parent header when navigating to a child screen,
 * added functionality to rename title of child's screen with spaces
 * @param navigation navigation object from current screen
 */
const hideDoubleHeader = (navigation, screenName) => {
  const currRouteName = useRoute().name;
  const parentRouteName = navigation.getState().routes[0].name;

    useFocusEffect(
      () => {
      navigation.getParent().setOptions({
        headerTitle: screenName, 
        headerRight: () => (null),
        headerBackTitle:'Back',
  
        headerLeft: () => { 
          return   <HeaderBackButton onPress={()=>navigation.goBack()}/>
        },
      }
      )
  
  
      return () => {
          //If parent router name is "Game" , reload + symbol on right of header
          //Replace left header with hamburger icon when transitioning to parent screen
  
          navigation.getParent().setOptions({ 
            headerShown: true, 
            headerTitle:parentRouteName == "Friendstab" ? "Friends" : parentRouteName, 
            headerLeft: () => {
              return  <Pressable onPress={()=>navigation.toggleDrawer()} style={{marginLeft:15}}>
                          <Ionicons name="menu-outline" size={40} color="black" />
                      </Pressable>
              },
              
            headerRight: 
            parentRouteName == "Game"   ? () => {return   <Pressable onPress={()=>navigation.navigate('CreateGame' as never)}>
              <Ionicons className='ml-20' name="add" size={40} color="black" />
            </Pressable>} 
            : null ,
          })
      };

      })



}

export default hideDoubleHeader;