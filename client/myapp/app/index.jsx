import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, Link } from "expo-router";

export default function LoginScreen() {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    //const [token, setToken] = useState(localStorage.getItem("token") || "");

    const router = useRouter();

    const handleLogin = async () => {
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
          });
          const data = await response.json();
          if (data.success) {
            //localStorage.setItem("token", data.token);
            //setToken(data.token);
            router.push(`/userhome/${userId}`);
          } else {
            Alert.alert('Login Failed', 'Invalid credentials');
          }
        } catch (error) {
          Alert.alert('Error', 'Something went wrong');
        }
      };

    return (
      <SafeAreaView>
        <View style={{ marginTop: 150, padding: 20 }}>
          <Text>User ID:</Text>
          <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setUserId} />
          <Text>Password:</Text>
          <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry onChangeText={setPassword} />
          <Button title="Login" style={{ marginBottom: 10 }} onPress={handleLogin} />
          <Link href="/register" style={styles.link} >Do not have an account. Create one?</Link>
        </View>
      </SafeAreaView>
      );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    marginTop: 20,
    textAlign: 'center',
  }
})
