import React, { useEffect } from 'react'
import {
    View, Text, StyleSheet,
    TouchableHighlight
} from 'react-native'
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
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableHighlight style={styles.btn}
                    onPress={() => props.navigation.navigate('Vocabularies')}>
                    <Text style={styles.txt}>Kelime Ekle</Text>
                </TouchableHighlight>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <TouchableHighlight style={[styles.btn, { backgroundColor: 'darkslategray' }]}
                    onPress={() => props.navigation.navigate('Quiz')}>
                    <Text style={styles.txt}>QUIZ</Text>
                </TouchableHighlight>
            </View>
        </View>
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
        backgroundColor: 'darkcyan',
        marginVertical: 10,
        alignItems: 'center',
        paddingVertical: 26
    },
    txt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    }
})