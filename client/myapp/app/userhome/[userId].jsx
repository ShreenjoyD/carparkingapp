import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { Avatar } from "react-native-paper";
//import { useEffect } from "react";
//import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen () {

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

    const { userId } = useLocalSearchParams();
    const navigation = useNavigation();

    return (<View>
            <View style={{ marginTop:50, marginHorizontal: "auto" }}><Avatar.Text size={100} label={userId} /></View>
            <Text style={{ marginTop:30, textAlign:'center', fontSize: 20}}>Welcome!</Text>
            <View style={styles.parklink}><Button title="Book a slot for your Car" onPress={()=>{navigation.navigate('slot', {par1: `${userId}`})}} /></View>
            </View>);
}

const styles = StyleSheet.create({
    parklink: {
        backgroundColor: 'blue',
        marginTop: 100,
        width: 250,
        marginHorizontal: 'auto',
        /*textAlign: 'center',*/
        fontSize: 18,
    }
})
