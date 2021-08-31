import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Text, Modal } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableHighlight } from 'react-native'
import LetterDictionary from './LetterDictionary'

export default function Dictionary(props) {
    const [vocabularies, setVocabularies] = useState([])
    const [letterVisible, setLetterVisible] = useState(false)
    const [chosenLetter, setChosenLetter] = useState('')
    const [letterDictionary, setLetterDictionary] = useState([])
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
        "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Tüm Liste"];
    const db = openDatabase({
        name: 'yds',
        createFromLocation: '~www/sqlite_yds.db'
    })
    const getLetterDic = async (letter) => {
        let arrayOfVocabulary = []
        await vocabularies.map((l, i) => {
            if (l.vocabulary[0] == letter)
                arrayOfVocabulary.push(l)
        })
        setLetterDictionary([...arrayOfVocabulary])
    }
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM dictionary', [], (tx, results) => {
                let arrayOfVocabulary = []
                for (let i = 0; i < results.rows.length; ++i) {
                    arrayOfVocabulary.push(results.rows.item(i))
                }
                setVocabularies([...arrayOfVocabulary])
            })
        }, (err) => console.log(err))
    }, [])
    if (vocabularies.length === 0) return null
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <View style={styles.sectionContainer}>
                {alphabet.map((l, i) => (
                    <TouchableHighlight style={styles.btn} key={i} onPress={async () => {
                        setLetterDictionary([])
                        await setChosenLetter(l)
                        getLetterDic(l)
                        console.log('dictionary', letterDictionary)
                        setLetterVisible(true)
                    }} underlayColor={'gray'}>
                        <Text style={{
                            color: 'darkslategray',
                            fontWeight: 'bold'
                        }}>{l.toUpperCase()}</Text>
                    </TouchableHighlight>
                ))}
            </View>
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={letterVisible}
                    onRequestClose={() => {
                        setLetterVisible(!letterVisible);
                    }}
                >
                    <LetterDictionary setVisible={() => setLetterVisible(false)}
                        vocabularyList={chosenLetter != '' ? letterDictionary : []} />
                </Modal>
            </View>
            {/*vocabularies.slice(0,100).map((l, i) => (
                    <ListItem key={i}>
                        <ListItem.Content>
                            <ListItem.Title>{l.vocabulary}</ListItem.Title>
                            <ListItem.Subtitle>{l.translate}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                ))*/}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        paddingHorizontal: 6,
    },
    sectionContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: 'wheat',
        width: '22.5%',
        alignItems: 'center',
        paddingVertical: 15,
        alignSelf: 'stretch',
        marginBottom: 10,
        borderRadius: 6
    }
})