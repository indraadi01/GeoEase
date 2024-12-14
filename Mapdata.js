// Mapdata.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const Mapdata = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState([]);

  const jsonUrl = 'http://10.0.2.2:3000/geoease'; // URL API untuk data lokasi

  useEffect(() => {
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => {
        setDataUser(json); // Mengambil data lokasi dari API
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // Fungsi untuk membuka Google Maps dengan koordinat tujuan
  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: dataUser.length > 0 ? parseFloat(dataUser[0].latitude) : 37.78825, // Default latitude
            longitude: dataUser.length > 0 ? parseFloat(dataUser[0].longitude) : -122.4324, // Default longitude
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {dataUser.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
              }}
              title={item.nama}
              description={item.deskripsi}
              onPress={() =>
                Alert.alert(
                  item.nama,
                  `${item.deskripsi}\nTanggal: ${item.tanggal}\nWaktu: ${item.waktu}`,
                  [
                    {
                      text: 'Menuju Lokasi',
                      onPress: () => openGoogleMaps(item.latitude, item.longitude),
                    },
                    { text: 'Tutup', style: 'cancel' },
                  ]
                )
              }
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Mapdata;
