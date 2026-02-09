import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function SignIn() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const onSignInPress = async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if(signInAttempt.status === 'complete'){
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }


    }



    return (
    <SafeAreaView className='flex-1'>
      <Text className='text-2xl font-bold'>SignIn</Text>
      <TextInput 
        placeholder='Enter Email'
        value={emailAddress}
        autoCapitalize='none'
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput 
        placeholder='Enter Password'
        value={password}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>

      <View>
        <Text>Don't have an account?</Text>
        <Link href='/sign-up'>
        <Text>Sign up</Text>
      </Link>
      </View>

    </SafeAreaView>
  )
}