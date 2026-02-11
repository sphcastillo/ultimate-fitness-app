import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');

    const onSignUpPress = async () => {
        if (!isLoaded) return;

        console.log(emailAddress, password);

        try {
            await signUp.create({ emailAddress, password });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            setPendingVerification(true);

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    }

    if (pendingVerification) {
        return (
            <>
                <Text>Verify your Email</Text>
                <TextInput
                    placeholder='Enter your verification code'
                    value={code}
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress}>
                    <Text>Verify</Text>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-200'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
                <View className='flex-1 px-6'>
                    <View className='flex-1 justify-center'>
                        <View className='items-center mb-8'>
                            <View className='w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                                <Ionicons name='fitness' size={40} color='white' />
                            </View>
                            <Text className='text-3xl font-bold text-gray-900 mb-2'>Join Ultimate Fit App</Text>
                            <Text className='text-lg text-gray-600 text-center'>Start your fitness journey{'\n'}and achieve your goals</Text>
                        </View>

                        <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
                            <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>Create Your Account</Text>


                            <View className='mb-4'>
                                <Text className='text-sm font-medium text-gray-700 mb-2'>Email</Text>
                                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                                    <Ionicons name="mail-outline" size={20} color='#6b7280' />
                                    <TextInput
                                        placeholder='Enter your email'
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
                                        secureTextEntry={true}
                                        placeholder='Create a password'
                                        placeholderTextColor='#9CA3AF'
                                        value={password}
                                        onChangeText={setPassword}
                                        className='flex-1 ml-3 text-gray-900'
                                        editable={!isLoading}
                                    />
                                </View>
                                <Text className='text-xs text-gray-500 mt-1'>Must be at least 8 characters</Text>
                            </View>


                            <TouchableOpacity
                                onPress={onSignUpPress}
                                disabled={isLoading}
                                activeOpacity={0.8}
                                className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
                            >
                                <View className='flex-row items-center justify-center'>
                                    {isLoading ? (
                                        <Ionicons name='refresh' size={20} color='white' />
                                    ) : (
                                        <Ionicons name='person-add-outline' size={20} color='white' />
                                    )}
                                    <Text className='text-white font-semibold text-lg ml-2'>
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <Text className='text-center text-gray-500 text-xs mb-4'>
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </Text>

                        </View>


                        <View className='flex-row justify-center items-center'>
                            <Text className='text-gray-600'>Already have an account?</Text>
                            <Link href='/sign-in' asChild>
                                <TouchableOpacity>
                                    <Text className='text-blue-600 font-semibold pl-[6px]'>Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    <View className='pb-6'>
                        <Text className='text-center text-gray-500 text-sm'>Ready to transform your fitness?</Text>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}