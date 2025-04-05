import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function LoginScreen() {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setmessage] = useState("");

    const router = useRouter();

    const handleRegister = async () => {
        try {
          const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
          });
          const data = await response.json();
          setmessage(data.message);
          router.push(`/userhome/${userId}`);
        } catch (error) {
          Alert.alert('Error', 'Something went wrong');
        }
      };

    return (
        <View style={{ marginTop: 150, padding: 20 }}>
          <TextInput style={{ borderWidth: 1, marginBottom: 10 }} placeholder="Enter your ID" onChangeText={setUserId} />
          <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry placeholder="Enter your password" onChangeText={setPassword} />
          <Button title="Register" onPress={handleRegister} />
          <Text style={styles.textmsg}>{message}</Text>
        </View>
      );
}

const styles = StyleSheet.create({
  textmsg: {
    color: 'rgb(0,255, 50)',
    fontSize: 20,
    textAlign:"center",
    marginTop: 20
  }
})
