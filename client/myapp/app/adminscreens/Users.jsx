import { StyleSheet, TouchableOpacity, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { DataTable } from 'react-native-paper';
import { Eye, EyeOff } from "lucide-react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function UserScreen() {

  const [todos, setTodos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(()=>{
    handleusers();
  }, [todos]);

  const handleusers = async () => {
    const resp = await fetch('http://localhost:3000/getusers');
    const data = await resp.json();
    setTodos(data.userdata);
  }

  const removeuser = async (id) => {
  const resp = await fetch('http://localhost:3000/deleteuser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
    });
    const data = await resp.json();
    if(data.message==="success")
      Alert.alert("User Account deleted successfully")
  }

  return (
    <SafeAreaView style={styles.allcontainer}>
      <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={{ marginLeft: '90%', marginTop: '3%' }}>{isVisible ? <EyeOff size={24} /> : <Eye size={24} />}</TouchableOpacity>
      <DataTable style={styles.container}>
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title>UserID</DataTable.Title>
        <DataTable.Title>User's Password</DataTable.Title>
      </DataTable.Header>
      {todos.map((item, index) => (
      <DataTable.Row>
        <DataTable.Cell>{item.userid}</DataTable.Cell>
        <DataTable.Cell>{isVisible?item.password:"*****"}</DataTable.Cell>
        <Pressable onPress={() => removeuser(item.userid)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="blue" selectable={undefined} />
      </Pressable>
      </DataTable.Row>))}
    </DataTable>
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
