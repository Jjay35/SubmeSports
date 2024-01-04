import { View , Image, Alert} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useUser } from '@clerk/clerk-expo';
import { Button, Text, Chip, IconButton} from 'react-native-paper';
import _ from "lodash";
import EditProfile from './editProfile';
import { ScrollView } from 'react-native-gesture-handler';
import { SUBME_COLOR } from '../../../constants/constants';
import userService from '../User/userService';
import profileService from './profileService';
import { User , sportsOptions} from './profileInfo';
import * as Clipboard from 'expo-clipboard';

const Profile = () => {

  const { isLoaded, user } = useUser();
  const [currUser, setUser] = useState <User | null>(null);
  const [currUserCache, setUserCache] = useState <User | null>(null);
  const [visible, setVisible] = useState(false);
  const [needToCall, setNeedToCall] = React.useState(false); //Used to prevent duplicate api calls for useEffect

  // Shows or hide modal during profile editing sessions 
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  //function to fetch images from db according to user id


  //function to create user in DB
  const createUser = (user)=>{

    const userObject = {id: user.id, role : 1}
    
    userService
    .createUser(userObject)
    .then((response) => {
     createUserProfile(user);
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  //function to create user Profile in DB
  const createUserProfile = (user)=>{

      //Converts null values to empty string
      let firstName = (user.firstName) === null ? "" : user.firstName;
      let lastName = (user.lastName) === null ? "" : user.lastName;

      const userProfileObject = 
      { id:user.id,  
        name : firstName + " " +  lastName, 
        hideAge :true, 
        age : 0, 
        sportPref : [1,0,0,0,0,0,0,0,0], 
        education: "-", 
        work: "-", 
        interests : "-", 
        pillars: [], 
        quote : "", 
        gameDist: 45,
      }

      setUser(userProfileObject);
      setUserCache(userProfileObject);

      profileService
      .createProfile(userProfileObject)
      .then((response)=>{
        console.log("Created user profile in DB");
      }).catch((error)=>{
        console.log(error);
      })
  }

  //function to get user profile info from db according to user id
  const getUserProfile = (user)=>{
    profileService
    .getProfileById(user.id)
    .then((response) => {
      setUser(response.data);
      setUserCache(response.data);
      console.log("got user info from DB");
    }).catch((error) => {
      console.log("Error fetching profile info from DB");
    });
  };

  //Function to update user profile in DB
  const updateUserProfile = ()=>{
    profileService
    .updateProfile(currUserCache.id,currUserCache)
    .then((response) => {
      console.log("Updated user profile in DB");
      setUser(response.data);
      setUserCache(response.data);
    }).catch((error) => {
      console.log("Error updating user profile in DB");
    });
  }

  // Function to check if user exists in DB
  const checkUserExists = (user)=>{
    userService
    .checkUserExists(user.id)
    .then((response)=>{
        //If user already exists in DB, load user info from DB, else create User in DB
        if(response.data){
          getUserProfile(user);
        }else{
          if(user != null){
            createUser(user);       

          }
         }
    }).catch((error) => {
      console.log("Error checking if user exists in DB");
    });;
  }

  /**
   * On first load, check if user exists in DB, if 
   * yes , load user profile info from DB,
   * else, create user and user profile in DB
   */
  useEffect(()=> {
    if (isLoaded && currUser == null && user != null){
      if(needToCall){
        checkUserExists(user);
      }else{
        setNeedToCall(true);
      }
              

    }
    
  },[needToCall])

  return (
    <ScrollView className='w-full h-full text-center' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}} contentContainerStyle={{alignItems:'center'}}>
      {isLoaded && currUser && user && <>
        <View className='w-full mb-10 items-end mt-2 mr-2'>
          <Button onPress={showModal} textColor ='#000000' className='w-1/6' style={{backgroundColor:SUBME_COLOR.RED}}>Edit</Button>
        </View>

        <View className='h-1/6'>
          <Image source={require('../../../images/userImage.jpeg')}  className=" h-40 w-40 rounded-full" />
        </View>
        
        <View className='w-full mt-10 justify-center items-center text-center   '>
            <Text className='text-black font-bold text-3xl mb-5'>{currUser.name}</Text>
        </View >
        {currUser.quote && 
        <View className='w-5/6 text-center justify-center items-center mb-14'>
          <Text className='text-black font-italic text-lg '>{currUser.quote}</Text>
        </View>}

        <View className='w-5/6'>
          {!currUser.hideAge &&
            <View className=' justify-center mb-5'>
              <View className='w-5/6  items-start'>
                  <Text className='text-black font-bold text-lg'>Age</Text>
              </View >
              <View className='w-2/6 items-start '>
                  <Text className='text-black font-italic text-lg '>{(currUser.age).toString()}</Text>
              </View >
            </View>
        }

            <View className='justify-center mb-8'>
              <View className='w-5/6 items-start'>
                  <Text className='text-black font-bold text-lg mb-2'>Friend ID</Text>
              </View >
              
              <View className='w-full items-center flex-row  justify-between '>
                  <Text className='text-black font-italic text-sm '>{user.id}</Text>
                  <IconButton 
                    icon="content-copy"  
                    size={18} iconColor='white' 
                    style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}
                    onPress={()=>{Clipboard.setString(user.id); Alert.alert('', 'Copied friend ID to clipboard')}}
                />
              </View >


            </View>

            <View className='justify-between mb-5'>
              <View className='w-5/6 items-start '>
                  <Text className='text-black font-bold text-lg mb-2'>Sport Preferences</Text>
              </View >
              <View className='w-full flex-row flex-wrap '>
                  {currUser.sportPref.map((sport :number, index)=>(
                    sport == 1 && 
                    <Chip  className='inline-block mr-2'  style={{marginBottom:10, backgroundColor:SUBME_COLOR.DARK_BLUE}} key={index}>
                      <Text className='text-white'>
                        {sportsOptions[index]}
                      </Text>
                    </Chip>))}
                    
              </View >
            </View>

            <View className='justify-center mb-5'>
              <View className='w-5/6 items-start'>
                  <Text className='text-black font-bold text-lg mb-2'>Education</Text>
              </View >
              <View className='w-2/6 items-start '>
                  <Text className='text-black font-italic text-lg '>{currUser.education}</Text>
              </View >
            </View>

            <View className='justify-center mb-5'>
              <View className='w-5/6 items-start'>
                  <Text className='text-black font-bold text-lg '>Work</Text>
              </View >
              <View className='w-2/6 items-start '>
                  <Text className='text-black font-italic text-lg '>{currUser.work}</Text>
              </View >
            </View>

            <View className='justify-center mb-5'>
              <View className='w-5/6 items-start'>
                  <Text className='text-black font-bold text-lg '>Interests</Text>
              </View >
              <View className='w-2/6 items-start '>
                  <Text className='text-black font-italic text-lg '>{currUser.interests}</Text>
              </View >
            </View>

            <View className='justify-center mb-5'>
              <View className='w-5/6 items-start'>
                  <Text className='text-black font-bold text-lg '>Preferred Game Distance</Text>
              </View >
              <View className='w-2/6 items-start '>
                  <Text className='text-black font-italic text-lg '>{(currUser.gameDist).toString()} miles</Text>
              </View >
            </View>

          </View>

       {visible && 
          <EditProfile  
            visible ={visible}
            hideModal ={hideModal}
            currUser ={currUser}
            setUser ={setUser}
            currUserCache ={currUserCache}
            setUserCache ={setUserCache}
            sportsOptions ={sportsOptions}
            updateUserProfile={updateUserProfile}
          />
          }
      </>}
    
    </ScrollView>
  )
}

export default Profile