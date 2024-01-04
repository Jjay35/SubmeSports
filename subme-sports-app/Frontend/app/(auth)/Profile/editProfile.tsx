import { View, Pressable, TextInput} from 'react-native'
import { Avatar, Button, Card, Text , Chip, Switch} from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import React from 'react'
import { CustomAgeSlider, CustomRangeSlider } from './slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUBME_COLOR } from '../../../constants/constants';

const EditProfile = (props) => {

    /**
     * Function fo save sport preferences and change current chip color
     * @param sport 
     */
        const saveSportPrefernces =(chipNo:Number)=>{

        // Creates a deep copy of sportPreference array to prevent mutation
        let temp =   JSON.parse(JSON.stringify(props.currUserCache.sportPref));    
        temp[Number(chipNo)] = temp[Number(chipNo)] == 1 ? 0 : 1;

        //Any cannot be deselected , any option will be deselected if any other option is selected
        if(chipNo == 0){
            temp = [1,0,0,0,0,0,0,0,0]
        }else{
            temp[0] = 0;
        }

        //Any option will be selected if all other options are deselected
        if(temp.every(item => item == 0)){
            temp = [1,0,0,0,0,0,0,0,0]
        }

        props.setUserCache(currUserCache=>({...currUserCache, sportPref:temp}));
    } 

    // Functions for Editing profile, update user details after editing is done
    const SaveChanges = ()=>{
        props.setUser(props.currUserCache);
        props.hideModal();
        props.updateUserProfile();
    }

    
  return (
    <>
    <View className='h-screen w-full absolute top-0 ' style={{ position:'absolute', top:0}}>

    <ScrollView style={{ backgroundColor:SUBME_COLOR.DARK_BLUE, minHeight:"100%", margin:0, padding:0}}  automaticallyAdjustKeyboardInsets={true}>
                <View className='w-full items-end mr-2'>
                    <Pressable onPress={ ()=>{props.setUserCache(props.currUser) ;  props.hideModal()}}>
                        <Icon color={"white"} name="close" size={40} />
                    </Pressable>
                </View>
              
                <View className="flex-col justify-around h-full w-full items-center">
                <View className='w-full items-center'>
                    <Text className='text-3xl text-slate-300 font-bold'>Edit Profile</Text>
                </View>

                    <View className='w-4/5 mt-10 mb-10'>
                        <Text className='text-2xl font-semibold text-white'>Name</Text>
                        <TextInput autoCapitalize="none" returnKeyType='done'  value={props.currUserCache.name} onChangeText={(e)=>props.setUserCache(currUserCache=>({...currUserCache, name:e}))} 
                            className=' bg-transparent w-full text-white border-white border p-3 rounded-xl ' />
                    </View>

                    <View className='w-4/5 mb-10'>
                        <Text className='text-2xl font-semibold text-white'>Quote</Text>
                        <TextInput autoCapitalize="none" maxLength={100} returnKeyType='done' multiline value={props.currUserCache.quote} onChangeText={(e)=>props.setUserCache(currUserCache=>({...currUserCache, quote:e}))} 
                            className=' bg-transparent w-full text-white border-white border p-3 rounded-xl  '  />
                            <Text className='text-white text-right w-full'>{props.currUserCache.quote.length}/100</Text>
                    </View>

                    <View className='w-4/5 mb-10 flex-row justify-between'>
                        <Text className='text-2xl font-semibold text-white'>Hide Age</Text>
                        <Switch color='#f36871' value={props.currUserCache.hideAge} onValueChange={()=>props.setUserCache(currUserCache=>({...currUserCache, hideAge:!(currUserCache.hideAge)}))}/>
                    </View>

                    <View className='w-4/5 mb-10'>
                        <CustomAgeSlider setUserCache={props.setUserCache} cacheAge = {props.currUserCache.age} />
                    </View>

                    <View className='w-4/5 mb-10'>
                        <Text className='text-2xl font-semibold text-white'>Sport preferences</Text>
                        <View className='gap-2'>
                            {
                                props.sportsOptions.map((sport, index)=>(
                                <Chip key={index} style={{backgroundColor : props.currUserCache.sportPref[index] == 1 ? '#f36871' : 'white'}} onPress={()=>saveSportPrefernces(index)}>
                                    <Text className='text-black'>
                                        {sport}
                                    </Text>
                                </Chip>
                                ))
                            }
                        </View>
                    </View>

                    <View className='w-4/5'>
                        <Text className='text-2xl font-semibold text-white'>Education</Text>
                        <TextInput autoCapitalize="none" returnKeyType='done' value={props.currUserCache.education}  onChangeText={(e)=>props.setUserCache(currUserCache=>({...currUserCache, education:e}))}  
                        className='mb-5 bg-transparent w-full text-white border-white border p-3 rounded-xl' />
                    </View>

                    <View className='w-4/5'>
                        <Text className='text-2xl font-semibold text-white'>Work</Text>
                        <TextInput autoCapitalize="none" returnKeyType='done' value={props.currUserCache.work}  onChangeText={(e)=>props.setUserCache(currUserCache=>({...currUserCache, work:e}))}  
                        className='mb-5 bg-transparent w-full text-white border-white border p-3 rounded-xl' />
                    </View>

                    <View className='w-4/5'>
                        <Text className='text-2xl font-semibold text-white'>Interests</Text>
                        <TextInput autoCapitalize="none" returnKeyType='done' value={props.currUserCache.interests}  onChangeText={(e)=>props.setUserCache(currUserCache=>({...currUserCache, interests:Number(e)}))}  
                        className='mb-5 bg-transparent w-full text-white border-white border p-3 rounded-xl' />
                    </View>

                    <View className='w-4/5 mb-10'>
                        <CustomRangeSlider setUserCache={props.setUserCache} cacheRange = {props.currUserCache.gameDist} />
                    </View>

                    <Button onPress={SaveChanges} textColor ='black' className='bg-white mb-64'>Save Changes</Button>
                </View>
            </ScrollView>
        </View>
    </>
  )
}

export default EditProfile