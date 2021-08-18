import React, { useState } from 'react'
import { View, Text, TouchableHighlight, Alert } from 'react-native'
import { Input } from 'react-native-elements'
import { openDatabase } from 'react-native-sqlite-storage'

export default function AddVocabulary(props) {
    const [vocabulary, setVocabulary] = useState('')
    const [translate, setTranslate] = useState('')
    const addNewVocabulary = () => {
        const db = openDatabase({
            name: 'yds',
            createFromLocation: '~www/sqlite_yds.db'
        })
        db.transaction(tx => {
            tx.executeSql('INSERT INTO yds(vocabulary, translate) VALUES("' + vocabulary + '","'
                + translate + '")', [], (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Başarılı',
                            'Kelime Kaydedildi',
                            [
                                {
                                    text: 'Tamam',
                                },
                            ],
                            { cancelable: false }
                        );
                        props.showOverlay()
                        props.isAdded()
                    }
                }, (err) => console.log(err))
        })
    }
    return (
        <View>
            <Input
                containerStyle={{ width: '100%' }}
                label='Kelime'
                onChangeText={val => setVocabulary(val)}
                labelStyle={{ color: 'wheat' }}
                inputStyle={{ color: 'white', fontSize: 14 }}>
            </Input>
            <Input
                containerStyle={{ width: '100%' }}
                label='Anlamı'
                onChangeText={val => setTranslate(val)}
                labelStyle={{ color: 'wheat' }}
                inputStyle={{ color: 'white', fontSize: 14 }}>
            </Input>
            <TouchableHighlight style={{
                marginHorizontal: '15%',
                backgroundColor: 'wheat',
                alignItems: 'center',
                paddingVertical: 10,
                borderRadius: 3
            }} onPress={() => addNewVocabulary()}>
                <Text style={{
                    color: 'darkslategray',
                    fontWeight: 'bold'
                }}>KAYDET</Text>
            </TouchableHighlight>
        </View>
    )
}
