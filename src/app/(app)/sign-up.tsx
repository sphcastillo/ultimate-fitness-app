import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

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
        <SafeAreaView className='flex-1'>
            <Text>SignUp</Text>
            <TextInput 
                autoCapitalize='none'
                placeholder='Enter email'
                value={emailAddress}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput 
                secureTextEntry={true}
                placeholder='Enter password'
                value={password}
                onChangeText={(password) => setPassword(password)}
            />

            <TouchableOpacity onPress={onSignUpPress}>
                <Text>Continue</Text>
            </TouchableOpacity>

            <View>
                <Text>Already have an account?</Text>
                <Link href='/sign-in'>
                    <Text>Sign in</Text>
                </Link>
            </View>
        </SafeAreaView>
    )
}