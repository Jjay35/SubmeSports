import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SUBME_COLOR } from '../../../constants/constants'
import { useUser } from '@clerk/clerk-expo';
import friendsService from './friendsService';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';
import { IconButton } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';

const FriendRequests = () => {

  const { isLoaded, user } = useUser();
  const [friendRequests, setFriendRequests] = useState<Array<FriendDetails>>(null);

  // State used for tracking refresh 
  const [refreshing, setRefreshing] = React.useState(false);

 //function to get friend requests of current user from db according to user id
  const getFriendRequests= (user)=>{
    friendsService
    .getAllFriendRequests(user.id)
    .then((response) => {
      setFriendRequests(response.data)
      console.log("got friend requests from DB");
    }).catch((error) => {
      console.log("Error fetching friend requests from DB");
    });
  };

  //function to decline friend request
  const declineFriendRequest = (friendUserID)=>{
    friendsService.rejectFriendRequest(user.id, friendUserID)
    .then((response)=>{
      console.log("rejected friend request")
    }).catch((error) => {
      console.log("Error rejecting friend request");
    });

    setFriendRequests(
      friendRequests.filter((friendRequest) => {
      return friendRequest.userID !== friendUserID;
      })
  );
  }


//function to accept friend request
  const acceptFriendRequest = (friendUserID)=>{
    friendsService
    .confirmFriendRequest(user.id, friendUserID)
    .then((response)=>{
      console.log("Added as a friend")
    }).catch((error) => {
      console.log("Error accepting friend request");
    });

    setFriendRequests(
      friendRequests.filter((friendRequest) => {
      return friendRequest.userID !== friendUserID
      })
  );
  }

  // On refresh, update friends list from db
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFriendRequests(user);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  // On focused, call getFriends to update friends list
  useFocusEffect(
    React.useCallback(() => {
      console.log("focused")
      getFriendRequests(user);
    }, [])
  );
  
  return (
    <View className='w-full h-full text-center justify-center items-center' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}>
      <ScrollView 
      className='w-5/6' 
      // contentContainerStyle={{alignContent:'center', justifyContent:'center'}}
      refreshControl={ <RefreshControl refreshing={refreshing} 
      onRefresh={onRefresh}/>}
      >

      {friendRequests && friendRequests.map((friendRequest, index)=>{
        return(
          <View  key={index} className='w-full bg-slate-100 items-center mb-3 p-1.5 rounded-xl flex-row justify-between'>
            <View className='flex-row'>
              <Image source={require('../../../images/userImage.jpeg')}  className=" h-10 w-10 rounded-full" />
              <View className='ml-2 justify-center'>
                <Text className='font-bold text-lg' style={{color:SUBME_COLOR.DARK_BLUE}}>{friendRequest.name}</Text>

               </View>
            </View>
          
            <View className='flex-row item-end'>
            <IconButton 
                  icon="check"  
                  onPress={()=>{acceptFriendRequest(friendRequest.userID)}} 
                  size={22} iconColor='white' 
                  style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}
                />        
             <IconButton 
                  icon="close"  
                  onPress={()=>{declineFriendRequest(friendRequest.userID)}} 
                  size={22} iconColor='white' 
                  style={{backgroundColor:SUBME_COLOR.RED}}
                />        
            </View> 
               
           </View>
        ) 
      
      })}
      </ScrollView>
    </View>
  )
}

export default FriendRequests