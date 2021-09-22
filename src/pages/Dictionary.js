import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableHighlight } from 'react-native'
import LetterDictionary from './LetterDictionary'

export default function Dictionary(props) {
    const [vocabularies, setVocabularies] = useState([])//All vocabularies
    //Alphabet array
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
        "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Tüm Liste", "Favoriler"];
    const db = openDatabase({
        name: 'yds',
        createFromLocation: '~www/sqlite_yds.db'
    })
    //Get vocabularies from db with letter
    const getLetterDic = async (letter) => {
        let arrayOfLetterVocabulary = []
        console.log(letter);
        if (letter == 'Favoriler') {
            await vocabularies.map((l, i) => {
                if (l.favorite == 1)
                    arrayOfLetterVocabulary.push(l)
            })
        }
        if (letter.length <= 1)
            await vocabularies.map((l, i) => {
                if (l.vocabulary[0] == letter)
                    arrayOfLetterVocabulary.push(l)
            })
        props.navigation.navigate('LetterDictionary', {
            dictionary: letter.length && letter !== 'Favoriler' <= 1 ? arrayOfLetterVocabulary
                : vocabularies
        })
    }
    useEffect(() => {
        getList()
    }, [])
    const getList = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM dictionary', [], (tx, results) => {
                let arrayOfVocabulary = []
                for (let i = 0; i < results.rows.length; ++i) {
                    arrayOfVocabulary.push(results.rows.item(i))
                }
                //Get all vocabularies from db
                setVocabularies([...arrayOfVocabulary])
            })
        }, (err) => console.log(err))
    }
    const updateList = () => {
        getList()
    }
    if (vocabularies.length === 0) return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
        </LinearGradient>)
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <View style={styles.sectionContainer}>
                {alphabet.map((l, i) => (
                    <TouchableHighlight style={styles.btn} key={i} onPress={() => {
                        getLetterDic(l).then(() => { })
                    }} underlayColor={'gray'}>
                        <Text style={{
                            color: 'darkslategray',
                            fontWeight: 'bold'
                        }}>{l.toUpperCase()}</Text>
                    </TouchableHighlight>
                ))}
            </View>
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