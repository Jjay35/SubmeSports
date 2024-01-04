import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { SUBME_COLOR } from '../constants/constants';
export default function BarButton({setModalVisible, modalVisible}) {
    return (
        <View style={styles.overall}>
            <View>
            </View>
            <View style={styles.item}>
            </View>
            <View style={styles.item}>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}> 
                    <FontAwesome name="filter" size={24} color="black"/>
                </TouchableOpacity>
               
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    overall:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
        
    },
    container1:{
        backgroundColor: 'cyan',
        padding: 5,
        paddingHorizontal: 20,
    },
    container2:{
        backgroundColor: 'yellow',
        padding: 5,
        paddingHorizontal: 20,
    },
    container3:{
        backgroundColor: 'orange',
        padding: 5,
        paddingHorizontal: 20,
    }
  });