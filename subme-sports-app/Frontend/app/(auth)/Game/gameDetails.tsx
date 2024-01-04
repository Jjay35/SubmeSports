import React, { useState}from 'react'
import { StyleSheet, View, Text, ScrollView, Image, FlatList,Pressable, Button, RefreshControl, Alert} from 'react-native'
import { useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import hideDoubleHeader from '../hideDoubleHeader';
import { Modal } from "../../../components/alertModal"
import { useUser } from '@clerk/clerk-expo';
import gameService from '../Game/gameService'
import { SUBME_COLOR } from '../../../constants/constants';
import profileService from '../Profile/profileService';
import { IconButton } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';

const GameDetails = ({navigation, route}) => {
    hideDoubleHeader(navigation, "Game Details");

    const { isLoaded, user } = useUser();
    
    const nav = useNavigation()
    const { gameData } = route.params
    const navigateToGameDetails = () => {
        nav.navigate('Game' as never);
      };
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModal2Visible, setIsModal2Visible] = useState(false)
    const [isUserInModalVisible, setIsUserInModalVisible] = useState(false)
    const [isUserJoined, setIsUserJoined] = useState({})
    const [playerNames, setPlayerNames] = useState([])
    const [waitListNames, setWaitListNames] = useState([])
    const [selected, setSelected] = useState(false)
    const [userName, setCurrentUserName] = useState<string>("");
    
    useFocusEffect(
      React.useCallback(() => {
        if (gameData.playersJoined.includes(user.id) || gameData.waitList.includes(user.id)){
          setIsUserJoined(true)
        }
        else{
          setIsUserJoined(false)
        }
        getUserName(user);
      }, [])
    );
    
      /**
       * Gets current user's name, used for in game group chat
       * @param user 
       */
    const getUserName = (user)=>{
        profileService
        .getProfileById(user.id)
        .then((response) => {
        setCurrentUserName(response.data.name);   
            console.log("got username info from DB");
        }).catch((error) => {
            console.log(error);
        });
    };



    //First, before a user joins a game
    //The button would be a join button, there are 2 conditions
    // If there is space to join the game then just join normally through the first modal
    // If there is no space to join, then join through waitlist through the second modal
    // If any of this they accept then the button would automatically switch to a leave button
    
    // In the leave button, then it will pop up the modal where you have are already committed to the game, are you sure you want to leave modal

    //This handles all the modals when someone clicks a join button
    const handleJoinButton = () =>{
      if(gameData.playersNeeded > 0){
        handleFirstModal()
      }
      else{
        handleSecondModal()
      }

    }


    const handleLeaveButton = () =>{
      setIsUserInModalVisible(() => !isUserInModalVisible)
    }



    //This handles the modal when the user wants to join a game they are not in
    const handleFirstModal = () => {
      setIsModalVisible(() => !isModalVisible)
      console.log("Game Data of players Needed: ", gameData.playersNeeded)
    }

    //This handles the modal when the user wants to join a game they are not in but it is already full
    const handleSecondModal = () => {
      setIsModal2Visible(() => !isModal2Visible)
      console.log("Game Data of players Needed: ", gameData.playersNeeded)
    }

    //This handles if the user has already joined the game or not
    //If the user has already joined the game this will show a modal to notify that the user is already in the game
    
    //
    const confirmGame = () => {
      // setSelected(() => !selected)
      // setIsModalVisible(() => !isModalVisible)
      if (gameData.playersNeeded > 0){
        updateMainPlayersList(gameData)
        
      }
      else{
        updateWaitList(gameData)
        //Fill in function to add the user to waitlist

      }
      setIsModalVisible(() => !isModalVisible)
      setIsModal2Visible(() => !isModal2Visible)
    }
   
    const leaveGame = () =>{
      updateUserLeaveGame(gameData)
      setIsUserInModalVisible(() => !isUserInModalVisible)
    }

    
    const getPlayerNames = (gameData) => {
      gameService.getPlayersName(gameData.id)
      .then((response) => {
        // console.log("Getting playerNames response: ", response.data)
        setPlayerNames(response.data);
        // console.log("Check playerNames function data: ", playerNames)
        // console.log("Got names of the player data")
      }).catch((error) => {
        console.log(error)
      })
    }

    const getWaitListNames = (gameData) => {
      gameService.getWaitListName(gameData.id)
      .then((response) => {
        // console.log("Getting waitList response: ", response.data)
        setWaitListNames(response.data);
        // console.log("Check waitList function data: ", waitListNames)
        // console.log("Got names of the waitList")
      }).catch((error) => {
        console.log(error)
      })
    }

    const updateWaitList = (gameData) => {
      gameData.waitList.push(user.id)
      setIsUserJoined(true)
      gameService.updateGame(gameData.id, gameData)
      .then((response) =>{
        console.log("Updated game info, a new player join on waitlist: ", user.id)
      }).catch((error) => {
        console.log("Error updating game info when player joins")
      })
    }

    const updateMainPlayersList = (gameData) =>{
      gameData.playersJoined.push(user.id)
      setIsUserJoined(true)
      gameData.playersNeeded -= 1
      gameService.updateGame(gameData.id, gameData)
      .then((response) =>{
        console.log("Updated game info, a new player joined: ", user.id)
        console.log("Number of playersNeeded left: ", response.data.playersNeeded)
        console.log("This is the playersJoined array: ", response.data.playersJoined)
      }).catch((error) => {
        console.log("Error updating game info when player joins")
      })
    }


    const updateUserLeaveGame = (gameData) => {
      if(gameData.playersJoined.includes(user.id)){
        gameData.playersNeeded += 1
        let newPlayersJoined = gameData.playersJoined.filter((item) => item !== user.id)
        gameData.playersJoined = newPlayersJoined
        if(gameData.waitList.length !== 0 && gameData.playersNeeded > 0){
            let waitListPlayerJoinMain = gameData.playersJoined.push(gameData.waitList[0])
            console.log(gameData.playersJoined)
            setPlayerNames(gameData.playersJoined)
            let newWaitList = gameData.waitList.filter((item) => item !== gameData.waitList[0])
            gameData.waitList = newWaitList
            
            setWaitListNames(gameData.waitList)
            gameData.playersNeeded -= 1
        }
        
      }
      else{
        let newWaitList = gameData.waitList.filter((item) => item !== user.id)
        gameData.waitList = newWaitList
      }
      
      setIsUserJoined(false)
      
      
      gameService.updateGame(gameData.id, gameData)
      .then((response) =>{
        console.log("Updated game info, this user left: ", user.id)
        console.log("Number of playersNeeded left: ", response.data.playersNeeded)
        console.log("This is the playersJoined array: ", response.data.playersJoined)
      }).catch((error) => {
        console.log("Error updating game info when player leaves")
      })
    }
    
    useFocusEffect(
      React.useCallback(() => {
        getPlayerNames(gameData)
        getWaitListNames(gameData)
      }, [])
    );

    // State used for tracking refresh 
    const [refreshing, setRefreshing] = React.useState(false);

    // On refresh, reload faqs from db
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      getPlayerNames(gameData)
      getWaitListNames(gameData)
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }, []);
    
    

    const sportsList = {"Flag Football" : require("../../../images/football.jpeg"), "Soccer" : require("../../../images/soccer.jpeg"), "Basketball" : require("../../../images/basketball.jpeg"), "Bowling" : require("../../../images/bowling.jpeg"), "Dodgeball" : require("../../../images/dodgeball.jpeg"), "Golf" : require("../../../images/golf.jpeg"), "Kickball" : require("../../../images/kickball.jpeg"), "Volleyball" : require("../../../images/volleyball.jpeg")}
    const teamGender = {"C" : "Coed", "M" : "Male", "F" : "Female"}
    const competitiveLevel = {"R" : "Recreational", "I" : "Intermediate", "C" : "Competitive"}

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={sportsList[gameData.sport]} style={styles.image}></Image>
            </View>
            <ScrollView className='h-full'style={styles.content} showsVerticalScrollIndicator={true} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {route.params && route.params.currentScreen == "ActiveGame" && 
                <View className='w-full flex items-end'>
                  <IconButton 
                    icon="chat"  
                    onPress={()=>navigation.navigate('Chat', { userName : userName, gameData: {chatID: gameData.chatID}})}
                    //On press , navigat to new screen to chat with user
                    size={20} iconColor='white' 
                    style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}
                  />       
                </View>
                    
                }

                <Text style={styles.title}>Organizer</Text>
                <Text className='text-xl mb-5'>{gameData.gameCreatorName}</Text>
                <Text style={styles.title}>Game Details</Text>
                <View className='mb-5'>
                  <Text>{gameData.gameDetails}</Text>
                </View>
                <Text style={styles.title}>Sport level</Text>
                <Text className='mb-5'>{competitiveLevel[gameData.competitiveness]}</Text>
                <Text style={styles.title}>Players</Text>
                {gameData.playersJoined.length === 0 ? (
                    <Text className='mb-5'>No players have joined the game yet</Text>
                  ) : ( playerNames &&
                    playerNames.map((player, index) => (<View className="flex-row">
                      <Text className='mb-5' key={index}>{index + 1}. {player.playerName} {"\n"} {gameData.playersJoined[index]}</Text>
                      <IconButton 
                          icon="content-copy"  
                          size={18} iconColor='white' 
                          style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}
                          onPress={()=>{Clipboard.setString(gameData.playersJoined[index]); Alert.alert('', 'Copied friend ID to clipboard')}}
                      />
                      </View>
                    ))
                    
                  )}

                <Text style={styles.title}>Spots open</Text>
                <Text className='mb-5'>{gameData.playersNeeded}</Text>
                <Text style={styles.title}>Waitlist</Text>
                {gameData.waitList.length === 0 ? (
                    <Text className='mb-5'>Waitlist is clear</Text>
                  ) : (
                    waitListNames.map((player, index) => (
                      <Text className='mb-5' key={index}>{index + 1}. {player.playerName}</Text>
                    ))
                    
                  )}
                
                <Modal isVisible={isModalVisible}>
                  <Modal.Container>
                    <Modal.Header title="YOU ARE JOINING THE GAME!" />
                    <Modal.Body>
                      <Text style={styles.text}>Are you sure you want to play?</Text>
                      </Modal.Body>
                    <Modal.Footer>
                      <View>
                        <Pressable style={({pressed}) => [ styles.button, {backgroundColor: pressed ? 'lightgrey' : 'white'},]} onPress={confirmGame}>
                          <Text style={{color: 'blue'}}>Confirm</Text>
                        </Pressable>
                        <Pressable style={({pressed}) => [ styles.button, {backgroundColor: pressed ? 'lightgrey' : 'white'},]} onPress={()=>setIsModalVisible(false)}>
                          <Text style={{color: 'red'}}>Cancel</Text>
                        </Pressable>
                      </View>
                      
                    </Modal.Footer>
                  </Modal.Container>
                </Modal>
                <Modal isVisible={isModal2Visible}>
                  <Modal.Container>
                    <Modal.Header title="Oops, ths game is already full. However, you are being added to the waitlist"/>
                    <Modal.Body>
                      <Text style={styles.text}>If someone decides to leave this game, the next player in line will be notifed that they are invited to join the game.</Text>
                      </Modal.Body>
                    <Modal.Footer>
                      <View>
                        {/* Add functionality when user joins a game and it is full then add to the waitlist once waitlist in schema is updated*/}
                        <Pressable style={({pressed}) => [ styles.button, {backgroundColor: pressed ? 'lightgrey' : 'white'},]} onPress={confirmGame}>
                          <Text style={{color: 'blue'}}>Confirm</Text>
                        </Pressable>
                        <Pressable style={({pressed}) => [ styles.button, {backgroundColor: pressed ? 'lightgrey' : 'white'},]} onPress={()=>setIsModal2Visible(false)}>
                          <Text style={{color: 'red'}}>Cancel</Text>
                        </Pressable>
                      </View>
                      
                    </Modal.Footer>
                  </Modal.Container>
                </Modal>
                <Modal isVisible={isUserInModalVisible}>
                  <Modal.Container>
                    <Modal.Header title="Are you sure you want to leave the game"/>
                    <Modal.Body>
                      <Text style={styles.text}>If you leave the game, you will need to queue up in the waitlist again if the number of people allowed in this game is full.</Text>
                      </Modal.Body>
                    <Modal.Footer>
                      <View>
                        <Pressable style={({pressed}) => [ styles.button, {backgroundColor: pressed ? 'lightgrey' : 'white'},]} onPress={leaveGame}>
                          <Text style={{color: 'blue'}}>Confirm</Text>
                        </Pressable>
                        <Pressable style={({pressed}) => [ styles.button, {backgroundColor: pressed ? 'lightgrey' : 'white'},]} onPress={()=>setIsUserInModalVisible(false)}>
                          <Text style={{color: 'red'}}>Cancel</Text>
                        </Pressable>
                      </View>
                      
                    </Modal.Footer>
                  </Modal.Container>
                </Modal>
            </ScrollView>
            <View className='absolute bottom-7 left-0 right-0 items-center'>
              {!isUserJoined ? (
                    <Button title='Join Game' onPress={handleJoinButton}></Button>    
                  ) : (
                      <Button title='Leave Game' onPress={handleLeaveButton}></Button>
                  )}
            </View>
            
        </View>
    )
  }
  
  export default GameDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      textContainer:{
        flex: 1,
        marginBottom: 10
      },
      title:{
        fontWeight: 'bold',
        fontSize: 20,
        color: '#00b4d8',
        marginBottom: 10
      },
      text: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
      },
      button:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
      },
      imageContainer:{
        height: 200,
        borderWidth: 2,
        borderColor: '#000',
      },
      content: {
        flex: 1,
        padding: 20,
        gap: 15,
      },
      list: {
        marginTop: 20,
      },
      image:{
        flex: 1,
        resizeMode: "cover",
        width: '100%',
       
    },
  })