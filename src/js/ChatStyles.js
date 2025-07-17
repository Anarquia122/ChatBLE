import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    cancelButton: {
        alignItems: 'flex-start', 
        marginBottom: 20
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        marginVertical: 4,
        borderRadius: 10,
    },
    myMessage: {
        backgroundColor: '#1976d2',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#723172',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        color: '#222',
    },
    sendButton: {
        backgroundColor: '#1976d2',
        padding: 12,
        marginLeft: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default styles;