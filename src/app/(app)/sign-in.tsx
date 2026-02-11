import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import GoogleSignIn from '@/components/GoogleSignIn';

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
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

      if (signInAttempt.status === 'complete') {
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
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className='flex-1 px-6'>
          <View className='flex-1 justify-center'>
            <View className='items-center mb-8'>
              <View className='w-20 h-20 bg-gradient-to-br from blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name='fitness' size={40} color='white' />
              </View>
              <Text className='text-3xl font-bold text-gray-900 mb-2'>Ultimate Fitness App</Text>
              <Text className='text-lg text-gray-600 text-center'>Track your fitness journey{'\n'}and reach your goals</Text>
            </View>


            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>Welcome Back</Text>

              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Email</Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name="mail-outline" size={20} color='#6b7280' />
                  <TextInput
                    placeholder='Enter your Email'
                    value={emailAddress}
                    autoCapitalize='none'
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setEmailAddress}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
              </View>
              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Password</Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name="lock-closed-outline" size={20} color='#6b7280' />
                  <TextInput
                    placeholder='Enter your password'
                    value={password}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>


            <TouchableOpacity
              onPress={onSignInPress}
              disabled={isLoading}
              className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
              activeOpacity={0.8}
            >
              <View className='flex-row items-center justify-center'>
                {isLoading ? (
                  <Ionicons name='refresh' size={20} color='white' />
                ) : (
                  <Ionicons name='log-in-outline' size={20} color='white' />
                )}
                <Text className='text-white font-semibold text-lg ml-2'>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </View>
            </TouchableOpacity>

            <View className='flex-row items-center my-4'>
              <View className='flex-1 h-px bg-gray-200' />
              <Text className='px-4 text-gray-500 text-sm' >or</Text>
              <View className='flex-1 h-px bg-gray-200' />
            </View>

            <GoogleSignIn />

            <View className='flex-row items-center justify-center mt-4'>
              <Text className='text-gray-600'>Don't have an account?</Text>
              <Link href='/sign-up' asChild>
                <TouchableOpacity>
                  <Text className='text-blue-600 font-semibold pl-[6px]'>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>



          <View className='pb-6'>
            <Text className='text-center text-gray-500 text-sm'>Start your fitness journey today</Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}