import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet,Pressable, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { OAuthButtons } from './OAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Text , TextInput} from 'react-native-paper';
import { Image } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SUBME_COLOR } from '../../constants/constants';


const Login = () => {

    const { signIn, setActive, isLoaded } = useSignIn();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

      const onSignInPress = async () => {
        console.log(isLoaded);
          if (!isLoaded) {
            return;
          }
          setLoading(true);
          try {
            const completeSignIn = await signIn.create({
              identifier: emailAddress,
              password,
            });
      
          // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
          } catch (err: any) {
            alert(err.errors[0].message);
          } finally {
            setLoading(false);
          }
        };

     return (
      <SafeAreaView className='w-full h-full text-center items-center bg-white' >
        <View className=' w-2/5 h-fit  items-center mb-8'>
          <Image source={require('../../images/submeLogo.jpeg')}  className='h-32 w-32 ' />
        </View>

        <View className='w-4/5 h-1/6 justify-center items-start '>
          <Text className='font-bold text-2xl' style={{color:SUBME_COLOR.DARK_BLUE}}>Login</Text>
          <Text className='font-italic text-md' style={{color:SUBME_COLOR.DARK_BLUE}}>Please sign in to your account.</Text>
        </View > 

        <View className='w-4/5 mb-5'>
          <TextInput 
            autoCapitalize="none" placeholder='Email' value={emailAddress} onChangeText={setEmailAddress}  
            underlineColor='transparent' dense  textColor='black'
            mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE}
            className='mb-5 bg-gray-200' 
            caretHidden={false}

            />
          <TextInput 
            autoCapitalize="none" placeholder='Password' value={password} onChangeText={setPassword}
            secureTextEntry underlineColor='transparent'  dense textColor='black' 
            mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE}
            className='mb-8 bg-gray-200 underline'
            caretHidden={false}
            />

          <Button onPress={onSignInPress}  textColor ='white' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}>Login</Button>
       </View>
      
      <Link href="/reset" asChild className='mb-2'>
        <Pressable >
          <Text style={{color:SUBME_COLOR.DARK_BLUE}}>Forgot password?</Text>
        </Pressable>
      </Link>

      <Link href="/register" asChild className='mb-8'>
        <Pressable >
          <Text style={{color:SUBME_COLOR.DARK_BLUE}}>Create Account</Text>
        </Pressable>
      </Link>  

        <View className='w-4/5 flex-row justify-center text-center items-center mb-6 '>
          <View className='bg-[#262726] w-2/5 h-0.5' />
          <Text className=' text-black mx-2'>OR</Text>
          <View className='bg-[#262726] w-2/5 h-0.5' />
        </View>

        <View className='w-3/5 mb-8 flex-row items-center justify-between'>
          <OAuthButtons strategy={'oauth_google'} />
          <OAuthButtons strategy={'oauth_facebook'} />
          <OAuthButtons strategy={'oauth_apple'} />
        </View>
      
  </SafeAreaView>
  )
}

export default Login;

