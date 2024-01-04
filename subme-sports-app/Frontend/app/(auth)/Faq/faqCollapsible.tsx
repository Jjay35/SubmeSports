import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Collapsible from 'react-native-collapsible';
import { SUBME_COLOR } from '../../../constants/constants';
import { Ionicons } from '@expo/vector-icons';
import {  IconButton, TextInput } from 'react-native-paper';

/**
 * Custom FAQ collapsible component
 * Supports content updates to DB
 * @returns 
 */
const FaqCollapsible = (props) => {

    const [isCollapse, setCollapse] = React.useState(true);

    let collapsableColor:string = SUBME_COLOR.LIGHT_BLUE;
    let cachedQuestion = props.question;
    let cachedAnswer = props.answer;

    if(props.isEditing){
        collapsableColor = SUBME_COLOR.DARK_BLUE;
    }else if( !isCollapse){
        collapsableColor = SUBME_COLOR.RED;
    } 
    
  return (
    <View className='w-full' style={{backgroundColor:collapsableColor}}>
      <Pressable  className='p-5' onPress={()=>{if(!props.isEditing){
        setCollapse(!isCollapse)
      }}}>
            <View className='flex-row justify-between items-center mb-5'>
                {!props.isEditing &&  <Text className='font-bold ' >{props.question}</Text>}
                {props.isEditing &&
                <>
                    <TextInput 
                      defaultValue={cachedQuestion}  
                      editable={props.isEditing} 
                      className='w-4/5' 
                      dense 
                      multiline 
                      onChangeText={(e)=>{cachedQuestion = e}}
                    />
                    <IconButton 
                      icon="trash-can-outline"  
                      onPress={()=>props.deleteFaq(props.faqID)} 
                      size={24} iconColor='black' 
                      style={{backgroundColor:SUBME_COLOR.RED}}
                    />
                </>
                  
                 }
                {!props.isEditing && isCollapse && <Ionicons name="chevron-down-outline" size={24} color="black" />}
                {!props.isEditing && !isCollapse && <Ionicons name="chevron-up-outline" size={24} color="black" />}

            </View>

            {props.isEditing &&
                <View className='flex-row justify-between items-center mb-5'>
                    <TextInput 
                      defaultValue={cachedAnswer} 
                      editable={props.isEditing} 
                      className='w-4/5' 
                      dense 
                      multiline
                      onChangeText={(e)=>{cachedAnswer = e}}
                    />
                      <IconButton 
                      icon="content-save"  
                      onPress={()=>props.updateFaq(props.faqID, cachedQuestion, cachedAnswer)} 
                      size={24} iconColor='black' 
                      style={{backgroundColor:SUBME_COLOR.RED}}
                    />
                </View>
            }
            {!props.isEditing &&
             <Collapsible collapsed={isCollapse}  >
                <Text className=''>{props.answer}</Text>
            </Collapsible>
            }
           
      </Pressable>
    </View>
  )
}

export default FaqCollapsible