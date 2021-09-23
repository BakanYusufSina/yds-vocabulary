import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated from 'react-native-reanimated'
import { openDatabase } from 'react-native-sqlite-storage'
import DictionaryList from '../partials/DictionaryList'

export default class LetterDictionary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dictionary: [],
            letterOfDictionary: [],
            db: openDatabase({
                name: 'yds',
                createFromLocation: '~www/sqlite_yds.db'
            })
        }
    }
    componentDidMount() {
        this.getList()
    }
    getList = (l) => {
        const letter = this.props.route.params.letter || l
        this.state.db.transaction(tx => {
            if (letter == 'Favoriler') {
                tx.executeSql('SELECT * FROM dictionary WHERE favorite=1', [],
                    (tx, results) => {
                        let arrayOfVocabulary = []
                        for (let i = 0; i < results.rows.length; ++i) {
                            arrayOfVocabulary.push(results.rows.item(i))
                        }
                        //Get all vocabularies from db
                        this.setState({ dictionary: [...arrayOfVocabulary] })
                    })
            }
            else if (letter.length <= 1)
                tx.executeSql(`SELECT * FROM dictionary WHERE vocabulary LIKE '${letter}%'`, [],
                    (tx, results) => {
                        let arrayOfVocabulary = []
                        for (let i = 0; i < results.rows.length; ++i) {
                            if (results.rows.item(i).vocabulary[0] == letter)
                                arrayOfVocabulary.push(results.rows.item(i))
                        }
                        //Get all vocabularies from db
                        this.setState({ dictionary: [...arrayOfVocabulary] })
                    })
            else
                tx.executeSql("SELECT * FROM dictionary", [],
                    (tx, results) => {
                        console.log(results.rows);
                        let arrayOfVocabulary = []
                        for (let i = 0; i < results.rows.length; ++i) {
                            arrayOfVocabulary.push(results.rows.item(i))
                        }
                        //Get all vocabularies from db
                        this.setState({ dictionary: [...arrayOfVocabulary] })
                    })
        }, (err) => console.log(err))
    }
    render() {
        if (this.state.dictionary.length === 0) {
            if (this.props.route.params.letter == 'Favoriler')
                return (
                    <LinearGradient colors={['#25283D', '#2C5364']} style={{
                        flex: 1,
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Favori kelimeniz yok</Text>
                    </LinearGradient>
                )
            else
                return (
                    <View style={{ flex: 1 }}>
                        <ActivityIndicator color={'wheat'} size={50} />
                    </View>)
        }
        return (
            <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
                <DictionaryList dictionary={this.state.dictionary} db={this.state.db}
                    refresh={(letter) => this.getList(letter)} letter={this.props.route.params.letter} />
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    }
})