import React, { useState } from "react";
import { View, Button, Text, TextInput, Platform, Alert, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
//import { useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingScreen() {

  const [date, setDate] = useState(new Date());
  const [timein, settimein] = useState(new Date());
  const [timeout, settimeout] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);
  const [carmodel, setcarmodel] = useState("");

  const isWeb = Platform.OS === "web";
  const now = new Date();

  const route = useRoute();
  const { par1 } = route.params;

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

  const navigation = useNavigation();

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === "ios");
  };

  const onChangeTimein = (event, selectedTime) => {
    if (selectedTime) {
      settimein(selectedTime);
    }
    setShowTimePicker1(Platform.OS === "ios");
  };

  const onChangeTimeout = (event, selectedTime) => {
    if (selectedTime) {
      settimeout(selectedTime);
    }
    setShowTimePicker2(Platform.OS === "ios");
  };

  const checkslots = async() => {
    try {
      const response = await fetch('http://localhost:3000/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carmodel, date, timein, timeout })
      });

      const data = await response.json();

      if (!data.available) {
          Alert.alert("No slots available", "Please choose a different time.");
          return;
      }
      else
        navigation.navigate('checkout', {param1: `${carmodel}`, param2: `${date}`, param3: `${timein}`, param4: `${timeout}`, param5: `${par1}` });
    }
    catch (error) {
      console.error("Error checking availability:", error);
      Alert.alert("An error occurred. Please try again.");
      }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput value={carmodel} onChangeText={setcarmodel} style={styles.input} placeholder="Enter Vehicle Details" />
      {isWeb ? (<>
        <Text>Date: {date.toLocaleDateString()}</Text>
        <DatePicker selected={date} onChange={(d) => setDate(d)} dateFormat="yyyy/MM/dd" minDate={new Date()} />
        <Text style={{ marginTop: 10 }}>Time-In: {timein.toLocaleTimeString()}</Text>
        <DatePicker
          selected={timein}
          onChange={(t) => {
            settimein(t);
            if (t >= timeout) {
              const newTimeOut = new Date(t);
              newTimeOut.setMinutes(newTimeOut.getMinutes() + 30);
              settimeout(newTimeOut);
            }
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="h:mm aa"
          minTime={date.toLocaleDateString() === now.toLocaleDateString() ? now: new Date(0, 0, 0, 0, 0, 0)}
          maxTime={new Date(0, 0, 0, 23, 59, 0)}
        />
        <Text style={{ marginTop: 10 }}>Time-Out: {timeout.toLocaleTimeString()}</Text>
        <DatePicker
          selected={timeout}
          onChange={(t) => {
            if (t <= timein) {
              Alert.alert("Invalid Time", "Time-Out must be later than Time-In!");
              return;
            }
            settimeout(t);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="h:mm aa"
          minTime={timein}
          maxTime={new Date(0, 0, 0, 23, 59, 0)}
        />
      </>) : (<>
      <View style={styles.pbtn }>
      <Button title="Pick Parking Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}<Text style={{ paddingLeft:30,  }}>{date.toLocaleDateString()}</Text>
      </View>
      <View style={styles.pbtn }>
      <Button title="Select Time In" onPress={() => setShowTimePicker1(true)} />
      {showTimePicker1 && (
        <DateTimePicker
          value={timein}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTimein}
          minimumDate={date.toLocaleDateString() === now.toLocaleDateString() ? now : undefined}
        />
      )}<Text style={{ paddingLeft:30,  }}>{timein.toLocaleTimeString()}</Text>
      </View>
      <View style={styles.pbtn}>
      <Button title="Select Time Out" onPress={() => setShowTimePicker2(true)} />
      {showTimePicker2 && (
        <DateTimePicker
          value={timeout}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTimeout}
          minimumDate={timein}
        />
      )}<Text style={{ paddingLeft:30,  }}>{timeout.toLocaleTimeString()}</Text>
      </View></>)}
      <View style={styles.pbtn}>
      <Button title="Get a slot" onPress={checkslots} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '70%',
    height: '10%',
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 5
  },
  pbtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 350,
    marginTop: 30,
  }
})
