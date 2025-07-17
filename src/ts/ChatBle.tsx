import { stringToBytes, bytesToString } from '../functions/ConvertData';
import { useEffect, useRef, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, View, TouchableOpacity, Text, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatMessage } from '../types/ChatMessage';
import styles from '../js/ChatStyles';


const SERVICE_UUID = '9fa6b9ed-4037-41fa-abcd-74fe29305d59';
const CHARACTERISTIC_UUID = '3ab25f54-95b5-4036-b082-73e814fac6a8';

export default function ChatBle() {
    const route = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Chat'>>();
    const { deviceId } = route.params;

    const [inputMessage, setInputMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<string | null>(null);
    const listMessages = useRef<FlatList>(null);

    const send = async (msg: string) => {
        if (!deviceId) return;
        const data = stringToBytes(msg);
        await BleManager.write(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID, data);

        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'me', text: inputMessage },
        ]);
        setInputMessage('');
    };

    useEffect(() => {
        if (!deviceId) return;

        BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID)
            .then(() => {
                setStatus('Notification activated');
            })
            .catch(() => {
                setStatus('Failed to enable notifications');
            });

        const handleUpdate = (event: any) => {
            try {
                if (event?.value && Array.isArray(event.value)) {
                    const text = bytesToString(event.value);
                    setMessages(prev => [
                        ...prev,
                        { id: Date.now().toString(), type: 'other', text },
                    ]);
                }
            } catch (err) {
                setStatus('Error decoding message');
            }
        };

        const bleEmitter = new NativeEventEmitter(NativeModules.BleManager);

        const subscription = bleEmitter.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            handleUpdate
        );

        return () => {
            BleManager.stopNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID);
            subscription.remove();
        };
    }, [deviceId]);


    const changePage = () => {
        navigation.navigate('Connection');
    }

    const renderItem = ({ item }: { item: ChatMessage }) => (
        <View
            style={[
                styles.messageBubble,
                item.type === 'me' ? styles.myMessage : styles.theirMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={{ flex: 1, padding: 10, marginTop: 30 }}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.6}
                    onPress={changePage}
                >
                    <Text style={{ color: '#1976d2' }}>Cancel</Text>
                </TouchableOpacity>

                {deviceId && (
                    <>
                        <FlatList
                            ref={listMessages}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            onContentSizeChange={() => listMessages.current?.scrollToEnd({ animated: true })}
                            onLayout={() => listMessages.current?.scrollToEnd({ animated: true })}
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Type your message"
                                placeholderTextColor="#888"
                                value={inputMessage}
                                onChangeText={setInputMessage}
                                style={styles.input}
                            />
                            <TouchableOpacity
                                style={styles.sendButton}
                                activeOpacity={0.6}
                                onPress={send.bind(null, inputMessage)}
                            >
                                <Text style={styles.sendText}>Send</Text>
                            </TouchableOpacity>
                        </View>

                        {status && <Text style={{ color: 'blue', margin: 10 }}>{status}</Text>}
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );

}