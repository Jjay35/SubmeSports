import { View, Text , KeyboardAvoidingView, Platform} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import hideDoubleHeader from '../hideDoubleHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SUBME_COLOR } from '../../../constants/constants';
import { IconButton, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import profileService from '../Profile/profileService';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { useFocusEffect } from 'expo-router';
import chatService from './chatService';

var stompClient =null;

const Chat = ({navigation, route}) => {

     // Displays friend's name as header
     let HeaderTitle = route.params.friend ? route.params.friend.name :  route.params.gameData ? "Game Chat": "Chat";
     hideDoubleHeader(navigation, HeaderTitle); 
   
     // Used for auto-scrolling to bottom of chat
     const listRef = useRef<FlatList>(null);

     const [privateChats, setPrivateChats] = useState<Array<Message>>([]);
     const [chatMessage , setChatMessage] = useState<string>("");

     const [userData, setUserData] = useState({
         username: '',
         receivername: '',
         connected: false,
         message: ''
       });


    /**
     * On initial load, scroll to bottom of chat
     * Everytime a message is added, automatically scroll to bottom of chat
     */
    useEffect(()=>{   
       setTimeout(() => {
        listRef.current.scrollToEnd({animated: true});
       }, 300);
    },[privateChats]);
    
    
     /**
     * On focus, set up user data and connects user to private websocket session with the other user
     */
    useFocusEffect(
        React.useCallback(() => {
            if(route.params.userName){

                if(route.params.friend){
                    getChatHistory(route.params.friend.chatID);
                }

                else if(route.params.gameData){
                    getChatHistory(route.params.gameData.chatID);
                }

                setUserData({...userData,username: route.params.userName});
                connect();
            }
        }, [])
      );

    
    /**
     * Gets chatHistory for user
     * @param id 
     */
       const getChatHistory = (id)=>{
        chatService
        .getChatHistory(id)
        .then((response)=>{
            setPrivateChats(response.data.messages);
        }).catch((error) => {
            console.log("Error fetching chat history info from DB");
          });
      
    }
       
    /**
     * Helper method to connect user to websocket session
     */
    const connect =()=>{
        let Sock = new SockJS('http://coms-402-006.class.las.iastate.edu:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    /**
     * Subscribes user to private channel when connected to websocket session
     */
    const onConnected = () => {
        setUserData({...userData,"connected": true});

        // Subscribe to private channel for 1 - 1 chatting for friends
        if(route.params.friend){
            stompClient.subscribe('/user/'+route.params.userName+'/private', onPrivateMessage);
        }

        // Subscribe to private game chat channel for game chat with other joined players
        else if(route.params.gameData){
            stompClient.subscribe("/groupChat/" + route.params.gameData.chatID, onPrivateMessage);
        }
    }

    /**
     * Prints out erorr message when websocket session fails
     * @param err 
     */
        const onError = (err) => {
            console.log(err);
        }

    /**
     * Receives private message from private websocket session
     * @param payload 
     */
    const onPrivateMessage = (payload)=>{
        var payloadData = JSON.parse(payload.body);

        //Update chat for private friend chat
        if(route.params.friend){
            if( payloadData.senderName == route.params.friend.name){
                setPrivateChats(prevChats =>[...prevChats, payloadData])
            }
        }
        

        //Update chat for game chat
        else if(route.params.gameData && payloadData.senderName != route.params.userName){
            setPrivateChats(prevChats =>[...prevChats, payloadData])
        }
    }

    /**
     * Sends private message to private websocket session
     */
    const sendPrivateValue=()=>{
    
        if (stompClient && route.params && userData.message !== "") {
            
            var chatMessage : Message = {
                id : 0,
                senderName: route.params.userName,
                receiverName:route.params.friend ? route.params.friend.name :  "",
                message: userData.message,
                date : "",
                status:"MESSAGE"
            };
        
            setPrivateChats(prevChats =>[...prevChats, chatMessage])

            if(route.params.friend){
                stompClient.send("/app/private-message", {token:route.params.friend.chatID}, JSON.stringify(chatMessage));
            }

            else if(route.params.gameData){
                stompClient.send("/app/group-message", {token:route.params.gameData.chatID}, JSON.stringify(chatMessage));
            }

            setUserData({...userData,"message": ""});
            setChatMessage("");
        }
    }

    /**
     * Sets the temporary message state with text from chat input box
     * @param message 
     */
    const handleMessage =(message)=>{
        setUserData({...userData,"message": message});
        setChatMessage(message);
    }

  return (
    <View className='bg-white w-full h-full mb-0'> 
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='bg-white w-full h-full items-center mb-0'  keyboardVerticalOffset={100} >

        { privateChats && 
        <FlatList 
            data= { privateChats}
            ref={listRef}
            ListFooterComponent={<View style={{padding:5}}/>}
            className='h-[80vh] w-full mb-2'
            style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index } ) => (
            
               item.senderName == route.params.userName ?
                <View key={index} className='flex items-end w-full mt-5' >
                    <View className='mr-3 p-2 rounded-2xl flex items-end' style={{maxWidth:"75%", backgroundColor:SUBME_COLOR.DARK_BLUE}}>
                        <Text className='text-base text-white'>{item.message}</Text>
                    </View>
                </View>
                : <View key={index} className='flex items-start mt-5 w-full'>
                    <Text className='mb-1 ml-3 px-2 font-semibold'>{item.senderName}</Text>
                     <View className='bg-white ml-3 p-2 rounded-2xl flex items-start' style={{maxWidth:"75%"}}>
                        <Text className='text-base' >{item.message}</Text>
                    </View>
                </View>

            )}
        />}
       
        
        <View className='w-full justify-center flex-row items-center bg-white h-[10vh] mb-0' >
            <TextInput
                className='w-4/5  justify-center mr-1 ml-1 bg-gray-300' dense mode='outlined'
                placeholder='Type your message'
                multiline
                textColor='black'
                autoCapitalize='none'
                onChangeText={(e)=>{handleMessage(e)}}
                value={chatMessage}
                activeOutlineColor={SUBME_COLOR.DARK_BLUE}
             />
          
            <IconButton 
                icon="send"  
                className='ml-1'
                size={24} iconColor='white' 
                style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}
                onPress={sendPrivateValue}
                />
        </View>
           
        </KeyboardAvoidingView>

    </View>
       
    
  )
}

export default Chat