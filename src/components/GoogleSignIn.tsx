// https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections
import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { View, Platform, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'android') return
        void WebBrowser.warmUpAsync()
        return () => void WebBrowser.coolDownAsync();

    }, [])
};

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
    const router = useRouter();
    useWarmUpBrowser()

    const { startSSOFlow } = useSSO();

    const onPress = useCallback(async () => {

        try {

            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({

                strategy: 'oauth_google',
                redirectUrl: AuthSession.makeRedirectUri(),

            })


            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                router.replace("/(app)/(tabs)");
            } else {
                console.error('No createdSessionId');
            }
        } catch (err) {

            console.error(JSON.stringify(err, null, 2));
        }
    }, [])

    return (
        <TouchableOpacity
            onPress={onPress}
            className='bg-white border-2 border-gray-200 rounded-xl py-4 shadow-sm'
            activeOpacity={0.8}
        >
            <View className='flex-row items-center justify-center'>
                <Ionicons name='logo-google' size={20} color='#EA4335' />
                <Text className='text-gray-900 font-semibold text-lg ml-3'>Continue with Google</Text>
            </View>
        </TouchableOpacity>
    )
}