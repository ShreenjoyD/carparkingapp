import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { DataTable } from 'react-native-paper';

export default function BookingScreen() {

  const [todos, setTodos] = useState([]);

  useEffect(()=>{
    handlebooking();
  }, []);

  const handlebooking = async () => {
    const resp = await fetch('http://localhost:3000/getbookingdata');
    const data = await resp.json();
    setTodos(data.bookingdata);
  }

  return (
    <SafeAreaView style={styles.allcontainer}>
      <ScrollView>
      <DataTable style={styles.container}>
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title>Date</DataTable.Title>
        <DataTable.Title>Time-In</DataTable.Title>
        <DataTable.Title>Time-Out</DataTable.Title>
        <DataTable.Title>Car Details</DataTable.Title>
        <DataTable.Title>Payment Status</DataTable.Title>
        <DataTable.Title>Slot Alloted</DataTable.Title>
      </DataTable.Header>
      {todos.map((item, index) => (
      <DataTable.Row>
        <DataTable.Cell>{item.date}</DataTable.Cell>
        <DataTable.Cell>{item.time_in}</DataTable.Cell>
        <DataTable.Cell>{item.time_out}</DataTable.Cell>
        <DataTable.Cell>{item.model}</DataTable.Cell>
        <DataTable.Cell>{item.paystatus}</DataTable.Cell>
        <DataTable.Cell>{item.slot_number}</DataTable.Cell>
      </DataTable.Row>))}
    </DataTable>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allcontainer: {
    flex: 1,
  },
  container: {
    padding: 15,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
});
