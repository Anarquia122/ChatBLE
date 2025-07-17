import ChatBle from "../ts/ChatBle";
import ConnectionBle from "../ts/ConnectionBle";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "../types/Navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function ChatScreen() {
    return (
        <Stack.Navigator
            initialRouteName="Connection"
            screenOptions={{
                contentStyle: { backgroundColor: '#121212' },
                headerStyle: { backgroundColor: '#1f1f1f' },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen name="Connection" component={ConnectionBle} />
            <Stack.Screen name="Chat" component={ChatBle} />
        </Stack.Navigator>
    );
}