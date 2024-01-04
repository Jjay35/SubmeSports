import { View, Text } from 'react-native'
import React, { useState } from 'react'
import hideDoubleHeader from '../hideDoubleHeader'
import { SUBME_COLOR } from '../../../constants/constants'
import { useUser } from '@clerk/clerk-expo'
import { Button, IconButton, TextInput } from 'react-native-paper'
import friendsService from './friendsService'
import { ScrollView } from 'react-native-gesture-handler'
import { Image } from 'react-native-elements'
import { useFocusEffect } from 'expo-router'

const AddFriend = ({navigation}) => {

  const { isLoaded, user } = useUser();
  const [ friendsToAdd, setFriendsToAdd ] = useState<Array<FriendDetails>>([]);
  const [friendToSearch, setFriendToSearch] = useState<string>("");

  const searchFriend = ()=>{

    if(friendToSearch == user.id){
      alert("You cannot add yourself as a friend");
      return;
    }

    friendsService
    .checkFriendsStatus(user.id, friendToSearch)
    .then((response)=>{
      console.log( response.data == "");
      if(response.data != ""){

        setFriendsToAdd([response.data])
        console.log("got temporary friend info from DB");
      }
    
    }).catch((error) => {
      console.log(error);
    });
  }

  const addFriend = (tempFriendObject : FriendDetails)=>{

       friendsService
    .createFriendRequest(user.id, tempFriendObject.userID)
    .then((response)=>{
      console.log("Friend request sent!")
      searchFriend();
    }).catch((error) => {
      console.log("Error sending friend request");
    });
  }

    // On focused, call getFriends to update friends list
    useFocusEffect(
      React.useCallback(() => {
        console.log("focused")
        setFriendsToAdd([]);
        setFriendToSearch("");
      }, [])
    );



  return (
    <View className='w-full h-full text-center items-center ' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}>
      <View className='w-5/6  items-center'>
        <Text className='mb-5 font-bold text-xl' style={{color:SUBME_COLOR.DARK_BLUE}}>Find New Friends</Text>
        <View className='w-full mb-5'>
        <TextInput 
          placeholder='Enter friend ID' 
          className='w-full bg-white self-start text-xs mb-2 mr-0 '
          underlineColor='transparent'
          outlineColor='transparent'
          textColor='black'
          value={friendToSearch ? friendToSearch : ""}
          mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE}
          dense
          onChangeText={(e)=>{setFriendToSearch(e)}}
          outlineStyle={{borderRadius:10}}
          multiline
        />
        <Button onPress={()=>searchFriend()} textColor='white' style={{backgroundColor:SUBME_COLOR.DARK_BLUE , borderRadius:10}}>Search</Button>
       
        </View>
        
        <ScrollView className='w-full h-full'>
          {friendsToAdd && friendsToAdd.map((friendToAdd :FriendDetails, index)=>{
              return (
                <View key={index} className='w-full bg-slate-100 items-center mb-3 p-1.5 rounded-xl flex-row justify-between'>
                  <View className='flex-row'>
                    <Image source={require('../../../images/userImage.jpeg')}  className=" h-10 w-10 rounded-full" />
                    <View className='ml-2 justify-center'>
                      <Text className='font-bold text-lg' style={{color:SUBME_COLOR.DARK_BLUE}}>{friendToAdd.name}</Text>
                    </View>
                  </View>

                  <View className='item-end'>
                      { friendToAdd.status == "N" &&   
                      <Button textColor='white' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}} onPress={()=>addFriend(friendToAdd)} >Add</Button>

                        }

                      { friendToAdd.status == "R" &&   
                      <Button disabled>Pending</Button>
                          }

                      { friendToAdd.status == "F" &&   
                      <Button disabled>Friend</Button>
                          } 
                </View>
                </View>

              )
          })}
        </ScrollView>
        
               
          
       

        
      </View>
    </View>
  )
}

export default AddFriend