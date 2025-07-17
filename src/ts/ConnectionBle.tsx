import { useEffect, useRef, useState } from 'react';
import { View, PermissionsAndroid, Platform, TouchableOpacity, Text, FlatList, Button, NativeEventEmitter, NativeModules, ActivityIndicator } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import connectionStyle from '../js/ConnectionStyle';

export default function ConnectionBle() {
    const [devices, setDevices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    let isScanning = useRef(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Connection'>>();

    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            ]);

            const allGranted = Object.values(granted).every(p => p === PermissionsAndroid.RESULTS.GRANTED);
            if (!allGranted) {
                setError('BLE permissions not granted. Please enable them in settings.');
            }
        } catch (err) {
            setError('Error requesting permissions.');
            console.warn(err);
        }
    };


    useEffect(() => {
        if (Platform.OS === 'android') {
            BleManager.enableBluetooth().then(() => {
                // Success
                requestPermissions();
            }).catch(() => {
                // Failure
                setError("The user refuse to enable bluetooth.");
            })
        }
        BleManager.start({ showAlert: false });
    }, []);


    useEffect(() => {
        const bleEmitter = new NativeEventEmitter(NativeModules.BleManager);

        const handleDiscoverPeripheral = (peripheral: any) => {
            console.log('Dispositivo encontrado:', peripheral);
            setDevices((prevDevices) => {
                const exists = prevDevices.some(dev => dev.id === peripheral.id);
                if (!exists) return [...prevDevices, peripheral];
                return prevDevices;
            });
        };

        const discoverSub = bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

        return () => {
            discoverSub.remove();
        };
    }, []);

    const scan = () => {
        if (isScanning.current) return;
        setDevices([]);
        isScanning.current = true;
        setIsLoading(true);
        setError(null);
        BleManager.scan([], 10, true).then(() => {
            setTimeout(() => {
                isScanning.current = false;
                setIsLoading(false);
            }, 5000);
        }).catch(error => {
            setError('Scan failed. Please try again.');
            console.log(error);
            setIsLoading(false);
            isScanning.current = false;
        });
    }

    const connect = async (id: string) => {
        try {
            setError(null);
            await BleManager.connect(id)
            await BleManager.retrieveServices(id);
            navigation.navigate('Chat', { deviceId: id });
        } catch (error) {
            setError('Connection failed. Please try again.');
        }
    };

    return (
        <View style={{ padding: 20, marginTop: 30 }}>
            <Button
                title='Scan'
                onPress={() => scan()}
            />
            {isLoading && <ActivityIndicator size={'large'} />}
            {error && <Text style={connectionStyle.errorMessage}>{error}</Text>}
            {!isLoading && devices.length === 0 && (
                <Text style={connectionStyle.notFoundText}>
                    No devices found
                </Text>
            )}

            <FlatList
                data={devices}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => connect(item.id)}
                        style={connectionStyle.deviceBtn}>
                        <Text style={{ color: '#222' }} >{item.name || item.advertising?.localName || 'anonymous'} ({item.id})</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}