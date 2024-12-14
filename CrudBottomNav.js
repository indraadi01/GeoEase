import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDatabase, faPenToSquare, faStreetView, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Createdata from './Createdata';
import Listdata from './Listdata';
import Editdata from './Editdata';
import Mapdata from './Mapdata'


function HomeScreen() {
  return <Listdata />;
}

function CreateScreen() {
  return <Createdata />;
}

function WebScreen() {
  return <Listdata />;
}

function EditScreen() {
  return <Editdata />;
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [showAddButton, setShowAddButton] = React.useState(true);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 5,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
      >
        <Tab.Screen
          name="List"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faDatabase} color={color} size={25} />
            ),
          }}
        />

        <Tab.Screen
          name="Tambah Data"
          component={CreateScreen}
          listeners={{
            focus: () => setShowAddButton(false), // Sembunyikan tombol saat masuk ke halaman
            blur: () => setShowAddButton(true),  // Tampilkan tombol saat keluar dari halaman
          }}
          options={{
            headerShown: true,
            tabBarButton: (props) =>
              showAddButton && (
                <TouchableOpacity
                  style={styles.addButtonIcon}
                  onPress={props.onPress}
                >
                  <FontAwesomeIcon icon={faCirclePlus} color="#000" size={60} />
                </TouchableOpacity>
              ),
          }}
        />

        <Tab.Screen
          name="Peta"
          component={WebScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faStreetView} color={color} size={25} />
            ),
          }}
        />

        <Tab.Screen
          name="Edit Data"
          component={EditScreen}
          options={{
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faPenToSquare} color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  addButtonIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 55,
    right: '43%',
  },
});
