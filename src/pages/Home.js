import React, { useEffect } from 'react'
import {
    View, Text, StyleSheet,
    TouchableHighlight
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { openDatabase } from 'react-native-sqlite-storage'
import { Icon } from 'react-native-elements'

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
            <View>
                <TouchableHighlight style={styles.btn}
                    onPress={() => props.navigation.navigate('Vocabularies')}
                    underlayColor={'gray'}>
                    <>
                        <Icon name='file-text' size={25} type='font-awesome'
                            color='white' />
                        <Text style={styles.txt}>KELİME</Text>
                    </>
                </TouchableHighlight>
            </View>
            <View>
                <TouchableHighlight style={[styles.btn, { backgroundColor: 'wheat' }]}
                    onPress={() => props.navigation.navigate('Quiz')}
                    underlayColor={'gray'}>
                    <>
                        <Icon name='pencil' type='font-awesome' size={25} />
                        <Text style={[styles.txt, { color: 'darkslategray' }]}>QUIZ</Text>
                    </>
                </TouchableHighlight>
            </View>
            <View>
                <TouchableHighlight style={[styles.btn, { backgroundColor: '#25283D' }]}
                    onPress={() => props.navigation.navigate('Dictionary')}
                    underlayColor={'gray'}>
                    <>
                        <Icon name='book' type='font-awesome' size={25} color='white' />
                        <Text style={styles.txt}>SÖZLÜK</Text>
                    </>
                </TouchableHighlight>
            </View>
            <View style={{
                position: 'absolute', alignSelf: 'center',
                top: 60, alignItems: 'center', flexDirection: 'row'
            }}>
                <Icon name='book' type='font-awesome' color={'#BFD8B8'}
                    size={60} />
                <Text style={styles.iconText}>YDS</Text>
            </View>
        </LinearGradient >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    btn: {
        borderRadius: 5,
        marginHorizontal: '25%',
        backgroundColor: '#2C5364',
        marginVertical: 10,
        alignItems: 'center',
        paddingVertical: 15
    },
    txt: {
        color: 'wheat',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10
    },
    iconText: {
        color: 'darkcyan',
        marginLeft: 18,
        fontFamily: 'monospace',
        fontSize: 25,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontStyle: 'italic'
    }
})