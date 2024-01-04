import { View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { LogoutButton } from '../../components/logoutButton';
import { useNavigation } from 'expo-router';
import ProfileNavigator from './Profile/_layout';
import GameNavigator from './Game/_layout';
import { Pressable } from 'react-native';
import FaqNavigator from './Faq/_layout';
import FriendsNavigator from './Friends/_layout';
import { SUBME_COLOR } from '../../constants/constants';


function DrawerContent(props) {

  return (
    <View className='flex-1'>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
      <View className='p-5 '>
        <LogoutButton/>
      </View>
     </View>

  );
}

//For drawer.Screen names, add a space after the name to make it unique to prevent warnings for screens with same names
const layout = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props}/>} screenOptions={
      ({navigation}) =>({headerLeft:  () => {
      return  <Pressable onPress={()=>navigation.toggleDrawer()} style={{marginLeft:15}}>
                  <Ionicons name="menu-outline" size={40} color="black" />
              </Pressable>
      }, 
      drawerActiveBackgroundColor:SUBME_COLOR.DARK_BLUE, 
      drawerActiveTintColor:'white',
    })
      
      
      
      }>
  
       <Drawer.Screen name="Profile " component={ProfileNavigator} options={{drawerIcon: ({color}) => (
         <Ionicons name="person" size={24} color={color} />)
            }} />

      <Drawer.Screen name="Game " component={GameNavigator}  options={{drawerIcon: ({color}) => (
         <Ionicons name="game-controller-outline" size={24} color={color} />), headerRight: () => (
          <Pressable onPress={()=>navigation.navigate('CreateGame' as never)}>
              <Ionicons name="add" size={40} color="black" />
          </Pressable> )
            }} />

      <Drawer.Screen name="Friends " component={FriendsNavigator} options={{drawerIcon: ({color}) => (
         <Ionicons name="people-outline" size={24} color={color}  />), 
            }} />

      <Drawer.Screen name="FAQ " component={FaqNavigator} options={{drawerIcon: ({color}) => (
         <Ionicons name="help-outline" size={24} color={color}/>)
            }} />

    </Drawer.Navigator>
   
  )
}
4
export default layout
