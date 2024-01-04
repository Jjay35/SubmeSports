import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SUBME_COLOR } from "../../../constants/constants";
import React from "react";
import { View, Text } from 'react-native'
import Friends from "./friends";
import FriendRequests from "./friendRequests";
import AddFriend from "./addFriend";

const Tab = createMaterialTopTabNavigator();

const TabFriendsNavigator = () => {
    return (
        <View className='w-full h-full' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}> 
  
        <Tab.Navigator initialRouteName='Friends' 
          screenOptions={{tabBarStyle:{
              marginTop:20,
              marginBottom:20,
              width:'83%',
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
              <Tab.Screen name="Friends" component={Friends} options={{title:"FRIENDS" ,tabBarLabelStyle: { textTransform:'none' }}}/>
              <Tab.Screen name="FriendRequests" component={FriendRequests} options={{title:"REQUESTS", tabBarLabelStyle: { textTransform:'none' }}}/>
              <Tab.Screen name="AddFriend" component={AddFriend} options={{title:"NEW", tabBarLabelStyle: { textTransform:'none' }}}/>
            </Tab.Navigator>
          </View>
    )
  }
  
  export default TabFriendsNavigator;