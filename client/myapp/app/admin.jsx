import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";

export default function Adminlogin() {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        try {
          const response = await fetch('http://localhost:3000/adlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
          });
          const data = await response.json();
          if (data.success) {
            setIsLoggedIn(true);
            router.push('/admindb');
          } else {
            Alert.alert('Login Failed', 'Invalid credentials');
          }
        } catch (error) {
          Alert.alert('Error', 'Something went wrong');
        }
      };

    return (
        <View style={{ marginTop: 150, padding: 20 }}>
          <Text>User ID:</Text>
          <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setUserId} />
          <Text>Password:</Text>
          <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry onChangeText={setPassword} />
          <Button title="Login" style={{ marginBottom: 10 }} onPress={handleLogin} />
        </View>
      );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    marginTop: 20,
    textAlign: 'center',
  }
})
