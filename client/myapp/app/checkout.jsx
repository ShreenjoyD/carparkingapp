import { View, Text, Image, Button, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
//import { useRouter } from "expo-router";

export default function CheckoutScreen() {

const [qrCode, setQrCode] = useState(null);
const route = useRoute();
const { param1, param2, param3, param4, param5 } = route.params;

/*useEffect(() => {
          handleuser();
}, []);
  
      const handleuser = async () => {
          try {
                    const response = await fetch('http://localhost:3000/checkuser', {
                      method: 'GET',
                      headers: { Authorization: `Bearer ${token}` },
                    });
  
                    const data = await response.json();
                    const router = useRouter();
  
                    if (data.message !== "success") {
                      router.push('/login');
                    }
                  } catch (error) {
                    Alert.alert('Error', 'Something went wrong');
                  }
}*/

const handlePayment = async () => {
    try {
        const response = await fetch('http://localhost:3000/generate-qrcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ param1, param2, param3, param4, param5 })
        });
        const data = await response.json();
        if (data.qrCode) {
            setQrCode(data.qrCode);
            Alert.alert('Booking Confirmed', `Your slot number is: ${data.slot}`);
        } else {
            Alert.alert('Error', 'No available slots');
        }
    } catch (error) {
        Alert.alert('Error', 'Failed to process payment');
    }
};

return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Checkout Page</Text>
      <Image source={{ uri: 'https://images.ctfassets.net/kftzwdyauwt9/6c20363e-30c0-486d-2e9bfa611583/b15f2e43a5a525763c966ab4562a31b2/stripe.jpg?w=3840&q=90&fm=webp' }} style={{ width: 150, height: 50, marginBottom: 20 }} />
      <Button title="Pay" onPress={handlePayment} style={{ marginTop: 100 }} />
      {qrCode && <><Image source={{ uri: qrCode }} style={{ width: 200, height: 200, marginTop: 20 }} /><Text style={{ marginTop: 40 }}>Scan me to park your car</Text></>}
    </View>
  );
}
