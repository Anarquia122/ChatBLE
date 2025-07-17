import { StyleSheet } from "react-native";

const connectionStyle = StyleSheet.create({
    errorMessage: {
        color: 'red',
         margin: 10,
    },
    notFoundText: {
        textAlign: 'center', 
        marginTop: 20, 
        color: '#888',
    },
    deviceBtn: {
        padding: 10, 
        borderBottomWidth: 1, 
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
});

export default connectionStyle;