import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import HomeScreen from './adminscreens/Home';
import UserScreen from './adminscreens/Users';
import BookingScreen from './adminscreens/Bookings';

const Drawer = createDrawerNavigator();

export default function Admindbscreen() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Users" component={UserScreen} />
          <Drawer.Screen name="Bookings" component={BookingScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
