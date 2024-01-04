import { View, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Link, Stack } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Text , TextInput} from 'react-native-paper';
import { SUBME_COLOR } from '../../constants/constants';
import { Image } from 'react-native-elements';


const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      console.log(result);
      alert('Password reset successfully');

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (

    <SafeAreaView className='w-full h-full bg-white text-center items-center '>

      <View className=' w-2/5 h-fit  items-center mb-8'>
        <Image source={require('../../images/submeLogo.jpeg')}  className='h-32 w-32 ' />
      </View>

      <View className='w-4/5 h-1/6 justify-center text-center'>
        <Text className=' font-bold text-2xl' style={{color:SUBME_COLOR.DARK_BLUE}}>Reset Password</Text>

        {
          !successfulCreation && (
             <Text className='text-md'  style={{color:SUBME_COLOR.DARK_BLUE}}>Enter email to reset your password. </Text>
          )
        }
         {
          successfulCreation && (
             <Text className='text-xs'  style={{color:SUBME_COLOR.DARK_BLUE}}>Enter verification code and set new password</Text>
          )
        }
      </View >

      <View className=' w-4/5 h-4/6 text-center items-center '>
        {!successfulCreation && (
          <>
            <TextInput 
            autoCapitalize="none" placeholder='Email' value={emailAddress} onChangeText={setEmailAddress}  
            textColor='black' className='mb-5 bg-gray-200 rounded-2xl w-full'
            mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE}
            />
            <Button onPress={onRequestReset}  textColor ='white' className=' w-full' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}>Submit</Button>
            <View className='flex-row mt-10'>
            <Text  style={{color:SUBME_COLOR.DARK_BLUE}}>Have another account? </Text>
            <Link href="/login" asChild>
              <Pressable >
                <Text  style={{color:SUBME_COLOR.DARK_BLUE}} className='underline'>Login</Text>
              </Pressable>
            </Link>            
          </View>
          </>
        )}

      {successfulCreation && (
              <>
                  <TextInput 
                  autoCapitalize="none" placeholder='Code' value={code} onChangeText={setCode} 
                  mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE} dense  textColor='black' 
                  className='mb-5 bg-gray-200 underline rounded-2xl w-full' />
                  <TextInput 
                  autoCapitalize="none" placeholder='New Password' value={password} onChangeText={setPassword} 
                  secureTextEntry dense mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE} textColor='black' className='mb-8 bg-gray-200 underline rounded-2xl w-full' />
                  <Button onPress={onReset}  textColor ='white' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}} className=' w-full'>Reset Password</Button>
              </>
            )}
      </View>
    </SafeAreaView>
  );
};



export default PwReset;