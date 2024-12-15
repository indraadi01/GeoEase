import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'; // Add Image import here
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDatabase, faPenToSquare, faStreetView, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Createdata from './Createdata';
import Listdata from './Listdata';
import Editdata from './Editdata';
const webmap = require('./Mapdata.html');

function HomeScreen() {
  return <Listdata />;
}

function CreateScreen() {
  return <Createdata />;
}

function MapsScreen() {
  return (
    <WebView
      source={webmap}
    />
  );
}

function EditScreen() {
  return <Editdata />;
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [showAddButton, setShowAddButton] = React.useState(true);

  // Debugging: log when focus or blur happens
  React.useEffect(() => {
    console.log("showAddButton: ", showAddButton);
  }, [showAddButton]);

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
            headerShown: true,
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Image
                  source={require('./assets/iconGeoEase.png')} // Path ke gambar
                  style={styles.iconStyle}
                />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>GeoEase</Text>
                  <Text style={styles.subHeader}>make surveys easier</Text>
                </View>
              </View>
            ),
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faDatabase} color={color} size={25} />
            ),
          }}
        />

        <Tab.Screen
          name="Tambah Data"
          component={CreateScreen}
          listeners={{
            focus: () => {
              console.log("Focus on 'Tambah Data' tab");
              setShowAddButton(true); // Tampilkan tombol saat masuk ke halaman 'Tambah Data'
            },
            blur: () => {
              console.log("Blur from 'Tambah Data' tab");
              setShowAddButton(true); // Tampilkan tombol saat keluar dari halaman 'Tambah Data'
            },
          }}
          options={{
            headerShown: false,
            tabBarButton: (props) =>
              showAddButton && (
                <TouchableOpacity
                  style={styles.addButtonIcon}
                  onPress={() => {
                    console.log("Tambah Data button pressed");
                    props.onPress();
                  }}
                >
                  <FontAwesomeIcon icon={faCirclePlus} color="#000" size={60} />
                </TouchableOpacity>
              ),
          }}
        />

        <Tab.Screen
          name="Peta"
          component={MapsScreen}
          listeners={{
            focus: () => {
              console.log("Focus on 'Peta' tab");
              setShowAddButton(false); // Sembunyikan tombol saat masuk ke halaman 'Peta'
            },
            blur: () => {
              console.log("Blur from 'Peta' tab");
              setShowAddButton(true); // Tampilkan tombol saat keluar dari halaman 'Peta'
            },
          }}
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
          listeners={{
            focus: () => {
              console.log("Focus on 'Edit Data' tab");
              setShowAddButton(false); // Sembunyikan tombol saat masuk ke halaman 'Peta'
            },
            blur: () => {
              console.log("Blur from 'Edit Data' tab");
              setShowAddButton(true); // Tampilkan tombol saat keluar dari halaman 'Peta'
            },
          }}
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
    right: '9%',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerTextContainer: {
    marginLeft: 10, // Just for spacing
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 12,
    marginTop: 2,
    color: '#888',
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
});
