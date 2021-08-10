import React, { useEffect } from 'react'
import {
    View, Text, StyleSheet,
    TouchableHighlight
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { openDatabase } from 'react-native-sqlite-storage'

export default function Home(props) {
    const db = openDatabase({
        name: 'yds',
        createFromLocation: '~www/sqlite_yds.db'
    })

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS yds(id INTEGER PRIMARY KEY AUTOINCREMENT,' +
                'vocabulary text,translate text)', [])
        })
    }, [])
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableHighlight style={styles.btn}
                    onPress={() => props.navigation.navigate('Vocabularies')}
                    underlayColor={'#EFD9CE'}>
                    <Text style={styles.txt}>Kelime Ekle</Text>
                </TouchableHighlight>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <TouchableHighlight style={[styles.btn, { backgroundColor: '#EFD9CE' }]}
                    onPress={() => props.navigation.navigate('Quiz')}
                    underlayColor={'#07BEB8'}>
                    <Text style={styles.txt}>QUIZ</Text>
                </TouchableHighlight>
            </View>
        </LinearGradient>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: 'white',
    },
    btn: {
        borderRadius: 6,
        borderColor: 'darkslategray',
        borderWidth: 0.2,
        marginHorizontal: '25%',
        backgroundColor: '#07BEB8',
        marginVertical: 10,
        alignItems: 'center',
        paddingVertical: 18
    },
    txt: {
        color: 'darkslategray',
        fontWeight: 'bold',
        fontSize: 15
    }
})