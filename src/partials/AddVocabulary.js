import React, { useRef, useState } from 'react'
import { View, Text, TouchableHighlight, Alert } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { Overlay } from 'react-native-elements/dist/overlay/Overlay'
import { openDatabase } from 'react-native-sqlite-storage'

export default function AddVocabulary(props) {
    const [vocabulary, setVocabulary] = useState('')
    const [translate, setTranslate] = useState('')
    const [doneOverlay, setDoneOverlay] = useState(false)
    let secondTextInput = useRef()
    const addNewVocabulary = () => {
        const db = openDatabase({
            name: 'yds',
            createFromLocation: '~www/sqlite_yds.db'
        })
        if (vocabulary != '' && translate != '') {
            db.transaction(tx => {
                tx.executeSql('INSERT INTO yds(vocabulary, translate) VALUES("' + vocabulary.toLowerCase().trim() + '","'
                    + translate.toLowerCase().trim() + '")', [], (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setDoneOverlay(true)
                            setTimeout(() => {
                                setDoneOverlay(false)
                                props.showOverlay()
                                props.isAdded()
                            }, 1000)
                        }
                    }, (err) => console.log(err))
            })
        }
        else {
            setDoneOverlay(true)
            setTimeout(() => setDoneOverlay(false), 1000)
        }

    }
    return (
        <View>
            <Input
                containerStyle={{ width: '100%' }}
                label='Kelime'
                onChangeText={val => setVocabulary(val)}
                labelStyle={{ color: 'wheat' }}
                inputStyle={{ color: 'white', fontSize: 14 }}
                autoFocus value={vocabulary.trimLeft()}
                onSubmitEditing={() => { secondTextInput.focus(); }}>
            </Input>
            <Input
                containerStyle={{ width: '100%' }}
                label='Anlamı'
                onChangeText={val => setTranslate(val)}
                labelStyle={{ color: 'wheat' }}
                inputStyle={{ color: 'white', fontSize: 14 }}
                value={translate.trimLeft()}
                ref={(input) => { secondTextInput = input; }}>
            </Input>
            <TouchableHighlight style={{
                marginHorizontal: '15%',
                backgroundColor: 'wheat',
                alignItems: 'center',
                paddingVertical: 10,
                borderRadius: 3
            }} onPress={() => addNewVocabulary()} underlayColor={'white'}>
                <Text style={{
                    color: 'darkslategray',
                    fontWeight: 'bold'
                }}>KAYDET</Text>
            </TouchableHighlight>
            <Overlay overlayStyle={{ alignItems: 'center', padding: 25 }}
                visible={doneOverlay}>
                <Icon name={(vocabulary != '' && translate != '') ? 'done' : 'close'}
                    style={{
                        backgroundColor: (vocabulary != '' && translate != '') ? 'darkcyan' : 'darkred',
                        borderRadius: 50, width: 50, height: 50, marginBottom: 15
                    }}
                    color='wheat' size={50} />
                <Text style={{ fontWeight: 'bold', letterSpacing: 1 }}>
                    {(vocabulary != '' && translate != '') ? 'Kelimeniz kaydedildi' :
                        'Lütfen boş alan bırakmayınız'}</Text>
            </Overlay>
        </View>
    )
}
