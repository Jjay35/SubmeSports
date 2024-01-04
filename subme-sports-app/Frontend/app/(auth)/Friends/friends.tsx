import { View, Text, RefreshControl  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SUBME_COLOR } from '../../../constants/constants'
import { useUser } from '@clerk/clerk-expo';
import friendsService from './friendsService';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';
import { IconButton } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { Modal } from '../../../components/alertModal';
import { Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import profileService from '../Profile/profileService';

const Friends = ({navigation}) => {
  const { isLoaded, user } = useUser();
  const [userName, setCurrentUserName] = useState<string>("");
  const [friends, setFriends] = useState<Array<FriendDetails>>(null);
  const [friendToRemove, setFriendToRemove] = useState<FriendDetails>(null);
  const [removeFriendModalVisible, setRemoveFriendModalVisible] = useState(false);

  // State used for tracking refresh 
  const [refreshing, setRefreshing] = React.useState(false);

  //function to get friends of current user from db according to user id
  const getFriends = (user)=>{
    friendsService
    .getAllFriends(user.id)
    .then((response) => {
      setFriends(response.data)
      console.log("got friends from DB");
    }).catch((error) => {
      console.log("Error fetching friends from DB");
    });
  };

   //function to remove friend 
   const removeFriendRequest = (friendUserID)=>{

    setRemoveFriendModalVisible(false);
    setFriendToRemove(null);

    friendsService.rejectFriendRequest(user.id, friendUserID)
    .then((response)=>{
      console.log("removed friend")
    }).catch((error) => {
      console.log("Error rejecting friend request");
    });

    setFriends(
      friends.filter((friend) => {
      return friend.userID !== friendUserID;
      })
  );
  }

   // On refresh, update friends list from db
   const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFriends(user);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  /**
   * Fetches current user's name from DB, used for chatting
   * @param user 
   */
  const getUserProfile = (user)=>{
    profileService
    .getProfileById(user.id)
    .then((response) => {
    setCurrentUserName(response.data.name);   
        console.log("got username info from DB");
    }).catch((error) => {
        console.log(error);
    });
};

  // On focused, call getFriends to update friends list
  useFocusEffect(
    React.useCallback(() => {
      getUserProfile(user)
      getFriends(user);
    }, [])
  );

  return (
    <View className='w-full h-full text-center justify-center items-center' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}>
      <ScrollView 
        className='w-4/5' 
        contentContainerStyle={{alignContent:'center', justifyContent:'center'}}
        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        >

      {friends && friends.map((friend, index)=>{
        return(
          <View  key={index} className='w-full bg-slate-100 items-center mb-3 p-1.5 rounded-xl flex-row justify-between'>
            <View className='flex-row'>
              <Image source={require('../../../images/userImage.jpeg')}  className=" h-10 w-10 rounded-full" />
              <View className='ml-2 justify-center'>
                <Text className='font-bold text-lg' style={{color:SUBME_COLOR.DARK_BLUE}}>{friend.name}</Text>
               </View>
            </View>
          
            <View className='item-end flex-row'>
            <IconButton 
                  icon="account-remove"  
                  onPress={()=>{setFriendToRemove(friend); setRemoveFriendModalVisible(true)}}
                  //On press , navigat to new screen to chat with user
                  size={20} iconColor='white' 
                  style={{backgroundColor:SUBME_COLOR.RED}}
                />        
            <IconButton 
                  icon="chat"  
                  onPress={()=>navigation.navigate('Chat' as never, {friend:friend, userName : userName})}
                  //On press , navigat to new screen to chat with user
                  size={20} iconColor='white' 
                  style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}
                />        
            </View>
               
          </View>
        ) 
      
      })}
      </ScrollView>

    {friendToRemove && 
          <Modal isVisible={removeFriendModalVisible}>
            <View className='bg-white rounded-xl h-1/6 items-center'>
              <View className='h-3/5 justify-center'>
                <Text className='text-lg'>Remove <Text className='font-bold' style={{color:SUBME_COLOR.RED}}>{friendToRemove.name}</Text> from friends List?</Text>
              </View>
              <View className='w-3/5 flex-row justify-around '>
                <Button style={{backgroundColor:SUBME_COLOR.DARK_BLUE}} onPress={()=>removeFriendRequest(friendToRemove.userID)}>
                  <Text className='text-white'>Confirm</Text>
                </Button>
                
                <Button style={{backgroundColor:SUBME_COLOR.RED}} onPress={()=>{setRemoveFriendModalVisible(false)}}>
                  <Text className='text-white'>Cancel</Text>
                </Button>
              </View>
            </View>
                    
            </Modal>
        }

       
        

       
    </View>
  )
}

export default Friends
