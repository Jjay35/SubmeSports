import { View} from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider';
import { Text } from 'react-native-paper';
import { setTextRange } from 'typescript';


/**
 * Custom slider component abstracted to improve rerender performance
 * @param props 
 * @returns 
 */
 export const CustomAgeSlider = (props) => {

    const [age, setAge] = useState<number>(props.cacheAge);

  return (
    <>
        <Text className='text-2xl font-semibold text-white'>Age : {age.toString()}</Text>
        <Slider
            value={props.cacheAge}
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor='#f36871'
            onValueChange={value => setAge(value)}
            onSlidingComplete={value =>props.setUserCache(currUserCache=>({...currUserCache, age:Number(value)}))}
    />
    </>
   
  )
}

export const CustomRangeSlider = (props) => {

  const [range, setRange] = useState<number>(props.cacheRange);

return (
  <>
      <Text className='text-2xl font-semibold text-white'>Preferred Game Distance </Text>
      <Text  className='text-xl font-semibold text-white'>{range.toString()} miles</Text>
      <Slider
          value={props.cacheRange}
          minimumValue={5}
          maximumValue={200}
          step={5}
          minimumTrackTintColor='#f36871'
          onValueChange={value => setRange(value)}
          onSlidingComplete={value =>props.setUserCache(currUserCache=>({...currUserCache, gameDist:Number(value)}))}
  />
  </>
 
)
}



