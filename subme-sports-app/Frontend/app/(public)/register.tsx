import { View, StyleSheet,Pressable} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import { Image } from 'react-native-elements';

import { Stack, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Text , TextInput} from 'react-native-paper';
import { SUBME_COLOR } from '../../constants/constants';


const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='w-full h-full text-center items-center bg-white'>
      <View className=' w-2/5 h-fit  items-center mb-8'>
        <Image source={require('../../images/submeLogo.jpeg')}  className='h-32 w-32 ' />
      </View>

      <View className='w-4/5 h-1/6 justify-center items-start '>
          <Text className='font-bold text-2xl' style={{color:SUBME_COLOR.DARK_BLUE}}>Sign up</Text>
      </View > 

      <View className=' w-4/5 h-4/6 text-center items-center'>
        <Spinner visible={loading} />
        {!pendingVerification && (
        <>
          <TextInput 
          autoCapitalize="none" placeholder='Email' value={emailAddress} onChangeText={setEmailAddress} 
          mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE} dense
          textColor='black' className='mb-5 bg-gray-200 underline rounded-2xl w-full'  />
          <TextInput 
          autoCapitalize="none" placeholder='Password' value={password} onChangeText={setPassword} 
          secureTextEntry mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE} dense
          textColor='black' className='mb-8 bg-gray-200 underline rounded-2xl w-full'/> 
          <Button onPress={onSignUpPress}  textColor ='white' className='w-full' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}>Sign Up</Button>

          <View className='flex-row mt-10'>
            <Text style={{color:SUBME_COLOR.DARK_BLUE}}>Already have an account? </Text>
            <Link href="/login" asChild>
              <Pressable >
                <Text className='underline' style={{color:SUBME_COLOR.DARK_BLUE}}>Login</Text>
              </Pressable>
            </Link>            
          </View>
          
        </>
      )}

      {pendingVerification && (
        <>
          <View className='w-full items-center'> 
            <TextInput 
              autoCapitalize="none" placeholder='Code' value={code} onChangeText={setCode} 
              mode='outlined' activeOutlineColor={SUBME_COLOR.DARK_BLUE}
             textColor='black' className='mb-8 bg-gray-200 underline rounded-2xl w-full' />
            <Button onPress={onPressVerify}  textColor ='white' className='w-full' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}>Verify</Button>
          </View>
        </>
      )}
      </View>
      
 </SafeAreaView>

   
  );
};

export default Register;