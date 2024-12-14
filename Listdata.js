import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt, faClock, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';

const Listdata = () => {
  const jsonUrl = 'http://10.0.2.2:3000/geoease'; // URL untuk data yang dibuat di CreateData
  const [isLoading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => {
        setDataUser(json); // Sesuaikan struktur data
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [refresh]);

  function refreshPage() {
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => setDataUser(json))
      .catch((error) => console.error(error));
  }

  function deleteData(id) {
    fetch(jsonUrl + '/' + id, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        alert('Data terhapus');
        refreshPage();
      });
  }

  return (
    <SafeAreaView>
      {isLoading ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.cardtitle}>Loading...</Text>
        </View>
      ) : (
        <View>
          <FlatList
            style={{ marginBottom: 0 }}
            data={dataUser}
            onRefresh={refreshPage}
            refreshing={refresh}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity>
                  <View style={styles.card}>
                    <View>
                      <Text style={styles.cardtitle}>Nama: {item.nama}</Text>
                      <Text style={styles.cardContent}>Deskripsi: {item.deskripsi}</Text>
                      <Text style={styles.cardContent}>
                        <FontAwesomeIcon icon={faCalendar} size={15} /> Tanggal: {item.tanggal}
                      </Text>
                      <Text style={styles.cardContent}>
                        <FontAwesomeIcon icon={faClock} size={15} /> Waktu: {item.waktu}
                      </Text>
                      <Text style={styles.cardContent}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} size={15} /> Lokasi: {item.lokasi}
                      </Text>
                    </View>

                    {/* Delete Icon */}
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => deleteData(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardtitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardContent: {
    fontSize: 12,
    marginVertical: 3,
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 7,
    position: 'relative', // Ensure the icon is positioned within the card
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Listdata;
