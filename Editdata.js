import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';


const Editdata = () => {
    const jsonUrl = 'http://192.168.48.52:3000/geoease'; // URL data
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [waktu, setWaktu] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [selectedItem, setSelectedItem] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [latitude, setLatitude] = useState(null); // State untuk latitude
const [longitude, setLongitude] = useState(null); // State untuk longitude

    useEffect(() => {
        fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => setDataList(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    const refreshPage = () => {
        setRefresh(true);
        fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => setDataList(json))
            .catch((error) => console.error(error))
            .finally(() => setRefresh(false));
    };

    const selectItem = (item) => {
        setSelectedItem(item);
        setNama(item.nama);
        setDeskripsi(item.deskripsi);
        setTanggal(item.tanggal);
        setWaktu(item.waktu);
        setLokasi(item.lokasi);
    };

    const submit = () => {
        const updatedData = {
            nama,
            deskripsi,
            tanggal,
            waktu,
            lokasi,
            latitude, // Tambahkan latitude ke data
            longitude, // Tambahkan longitude ke data
        };
    
        fetch(`${jsonUrl}/${selectedItem.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then(() => {
                alert('Data berhasil diperbarui');
                resetForm();
                refreshPage();
            })
            .catch((error) => console.error(error));
    };

    const resetForm = () => {
        setNama('');
        setDeskripsi('');
        setTanggal('');
        setWaktu('');
        setLokasi('');
        setSelectedItem({});
    };

    const handleGetLocation = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permission to Access Location',
                        message: 'We need access to your location',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    alert('Permission to access location was denied');
                    return;
                }
            }
    
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude); // Simpan latitude
                    setLongitude(longitude); // Simpan longitude
                    setLokasi(`${latitude}, ${longitude}`); // Gabungkan lokasi untuk tampilan
                },
                (error) => {
                    console.error(error);
                    alert('Unable to fetch location');
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 10000
                }
            );
        } catch (error) {
            console.error(error);
            alert('Failed to request location permission');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={styles.cardTitle}>Loading...</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nama"
                                value={nama}
                                onChangeText={(value) => setNama(value)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Deskripsi"
                                value={deskripsi}
                                onChangeText={(value) => setDeskripsi(value)}
                            />
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Tanggal"
                                    value={tanggal}
                                    editable={false}
                                />
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.iconContainer}>
                                    <FontAwesomeIcon icon={faCalendar} size={15} />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={new Date(tanggal || Date.now())}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) setTanggal(selectedDate.toLocaleDateString());
                                        }}
                                    />
                                )}
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Waktu"
                                    value={waktu}
                                    editable={false}
                                />
                                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.iconContainer}>
                                    <FontAwesomeIcon icon={faClock} size={15} />
                                </TouchableOpacity>
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={new Date(waktu || Date.now())}
                                        mode="time"
                                        display="default"
                                        onChange={(event, selectedTime) => {
                                            setShowTimePicker(false);
                                            if (selectedTime) setWaktu(selectedTime.toLocaleTimeString());
                                        }}
                                    />
                                )}
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Lokasi (Koordinat)"
                                    value={lokasi}
                                    onChangeText={setLokasi} // Allow manual input
                                />
                                <TouchableOpacity onPress={handleGetLocation} style={styles.iconContainer}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} size={15} />
                                </TouchableOpacity>
                            </View>
                            <Button title="Edit" style={styles.button} onPress={submit} />
                        </View>
                        <View style={styles.divider}></View>
                        <ScrollView style={{ flex: 1 }}>
                            <FlatList
                                style={{ marginBottom: 10 }}
                                data={dataList}
                                onRefresh={refreshPage}
                                refreshing={refresh}
                                keyExtractor={({ id }) => id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => selectItem(item)}>
                                        <View style={styles.card}>
                                            <Text style={styles.cardTitle}>Nama: {item.nama}</Text>
                                            <Text>Deskripsi: {item.deskripsi}</Text>
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
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    form: {
        padding: 10,
        marginBottom: 15,
    },
    inputContainer: {
        position: 'relative',
        marginVertical: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 8,
        padding: 8,
        marginVertical: 5,
        width: '100%',
    },
    inputWithIcon: {
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 8,
        paddingLeft: 30,
        padding: 8,
        marginVertical: 5,
        width: '100%',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        top: '30%',
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        borderRadius: 8,
    },
    divider: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardContent: {
        marginTop: 5,
    },
});

export default Editdata;
