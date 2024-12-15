import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, TextInput, Button, StyleSheet, Text, Platform, PermissionsAndroid, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faClock, faLocationCrosshairs, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const Createdata = () => {
    const navigation = useNavigation();
    const jsonUrl = 'http://192.168.112.52:3000/geoease';
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tanggal, setTanggal] = useState(new Date());
    const [waktu, setWaktu] = useState(new Date());
    const [lokasi, setLokasi] = useState('');
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const submit = () => {
        const formattedTanggal = `${tanggal.getDate()}/${tanggal.getMonth() + 1}/${tanggal.getFullYear()}`;
        const formattedWaktu = `${waktu.getHours()}:${waktu.getMinutes()}`;

        const data = {
            id: new Date().getTime().toString(),
            nama: nama,
            deskripsi: deskripsi,
            tanggal: formattedTanggal,
            waktu: formattedWaktu,
            lokasi: lokasi,
            longitude: longitude || 0, // Default value jika tidak tersedia
            latitude: latitude || 0, // Default value jika tidak tersedia
        };

        fetch(jsonUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                Alert.alert('Data Tersimpan', 'Data berhasil disimpan', [
                    {
                        text: 'OK',
                        onPress: () => {}, // Kosongkan atau tambahkan aksi lain jika diperlukan
                    },
                ]);
                setNama('');
                setDeskripsi('');
                setTanggal(new Date());
                setWaktu(new Date());
                setLokasi('');
                setLongitude(null);
                setLatitude(null);
            });
    };

    const handleGetLocation = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Permission to Access Location",
                        message: "We need access to your location",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
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
                    setLokasi(`${latitude}, ${longitude}`);
                    setLatitude(latitude);
                    setLongitude(longitude);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Tambah Data Survey</Text>
            </View>
            <ScrollView style={styles.form}>
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
                <View style={styles.dateTimeContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Tanggal"
                        value={`${tanggal.getDate()}/${tanggal.getMonth() + 1}/${tanggal.getFullYear()}`}
                        onFocus={() => setShowDatePicker(true)}
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faCalendar} color="#000" size={20} />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={tanggal}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setTanggal(selectedDate);
                            }}
                        />
                    )}
                </View>
                <View style={styles.dateTimeContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Waktu"
                        value={`${waktu.getHours()}:${waktu.getMinutes()}`}
                        onFocus={() => setShowTimePicker(true)}
                    />
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faClock} color="#000" size={20} />
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={waktu}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                setShowTimePicker(false);
                                if (selectedTime) setWaktu(selectedTime);
                            }}
                        />
                    )}
                </View>
                <View style={styles.locationContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Lokasi Anda"
                        value={lokasi}
                        onChangeText={(text) => setLokasi(text)}
                    />
                    <TouchableOpacity onPress={handleGetLocation} style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faLocationCrosshairs} color="#000" size={20} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={submit}>
                    <Text style={styles.saveButtonText}>Simpan Data</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 12,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    form: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    inputWithIcon: {
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 8,
        paddingLeft: 40,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    dateTimeContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    locationContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    iconContainer: {
        position: 'absolute',
        left: 10,
        top: 12,
    },
    saveButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Createdata;
