import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { Text, View, StyleSheet, TextInput, TouchableHighlight } from 'react-native'
import { ListItem } from 'react-native-elements'
import { openDatabase } from 'react-native-sqlite-storage'
import LinearGradient from 'react-native-linear-gradient'

let db = openDatabase({
    name: 'yds',
    createFromLocation: '~www/sqlite_yds.db'
})

export default class Quiz extends Component {
    constructor() {
        super()
        this.state = {
            countOfQuestions: 0, //Soru sayısı
            questions: [], //Sorular quiz için
            vocabularies: [], //Veritabanından gelen kelimeleri tutan dizi
            currentQuestionIndex: 0, //Şu anki soru
            answerOfUser: '', //Kullanıcının girdiği ceva 
            isCorrect: false, //Cevabın doğruluğunu tutan boolean
            correctAnswersCount: 0, //Doğru cevap sayısı
            answerList: [] //Kullanıcının cevaplarını tutan dizi
        }
    }
    //Dizideki elemanları karıştır
    shuffle = (array) => {
        var currentIndex = array.length, randomIndex
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
        return array
    }
    //Veritabanından kelimeleri getir ve diziye atayarak karıştır
    getVocabularies = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM yds', [], (tx, results) => {
                let arrayOfVocabulary = []
                for (let i = 0; i < results.rows.length; ++i) {
                    arrayOfVocabulary.push(results.rows.item(i))
                }
                arrayOfVocabulary = this.shuffle(arrayOfVocabulary)
                this.setState({ vocabularies: [...arrayOfVocabulary] })
            }, (err) => console.log(err))
        })
    }
    //Sayfa yüklenince kelimeleri getir
    componentDidMount() {
        this.getVocabularies()
    }
    //Kullanıcının istediği soru sayısına göre quizi hazırlayan fonksiyon
    getQuiz = async (countQuestions) => {
        await this.setState({ questions: this.state.vocabularies.slice(0, countQuestions) })
    }
    //Sorunun doğruluğunu kontrol eden fonksiyon
    checkQuestion = async (index) => {
        if (this.state.answerOfUser === this.state.questions[index].translate) {
            this.setState({
                isCorrect: true, correctAnswersCount: (this.state.correctAnswersCount + 1)
            })
        }
        if (this.state.countOfQuestions > this.state.currentQuestionIndex)
            await this.setState({
                currentQuestionIndex: (this.state.currentQuestionIndex + 1), isCorrect: false,
                answerList: [...this.state.answerList, {
                    vocabulary: this.state.questions[index].vocabulary,
                    answer: this.state.questions[index].translate,
                    userAnswer: this.state.answerOfUser,
                    isCorrect: this.state.answerOfUser === this.state.questions[index].translate ? true : false
                }]
            })
    }
    //Soru Limiti Belirleme
    checkQuizLimit = (value) => {
        this.setState({
            countOfQuestions:
                value > this.state.vocabularies.length ?
                    this.state.vocabularies.length : value
        })
    }
    render() {
        let countQuestion = this.state.countOfQuestions
        return (
            <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
                {/*SKOR TABELASI */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{
                        alignItems: 'center', backgroundColor: '#285943',
                        paddingHorizontal: 25, paddingVertical: 10,
                        borderRadius: 6
                    }}>
                        <Text style={{ color: 'wheat', fontWeight: 'bold' }}>Doğru</Text>
                        <Text style={{
                            color: 'wheat', marginTop: 6,
                            fontSize: 18, fontWeight: 'bold'
                        }}>{this.state.correctAnswersCount}</Text>
                    </View>
                    <View style={{
                        alignItems: 'center', backgroundColor: '#DE3C4B',
                        paddingHorizontal: 25, paddingVertical: 10,
                        borderRadius: 6
                    }}>
                        <Text style={{ color: 'wheat', fontWeight: 'bold' }}>Yanlış</Text>
                        <Text style={{
                            color: 'wheat', marginTop: 6,
                            fontSize: 18, fontWeight: 'bold'
                        }}>{this.state.currentQuestionIndex - this.state.correctAnswersCount}</Text>
                    </View>
                </View>
                {/*Soru ve Cevap Ekranı */}
                {this.state.questions.length === 0 ||
                    (this.state.currentQuestionIndex == this.state.countOfQuestions) ?
                    (
                        <View>
                            {this.state.currentQuestionIndex != 0 ? (
                                <View style={{ marginTop: 15 }}>
                                    <TouchableHighlight onPress={() => this.setState({
                                        correctAnswersCount: 0, countOfQuestions: 0, currentQuestionIndex: 0,
                                        questions: [], answerList: []
                                    })} style={[styles.btn, { marginBottom: 10 }]}>
                                        <Text style={{ color: 'white' }}>Sıfırla</Text>
                                    </TouchableHighlight>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {this.state.answerList.map((l, i) => (
                                            <ListItem containerStyle={{
                                                backgroundColor: l.isCorrect == true ?
                                                    '#285943' : '#DE3C4B'
                                            }} bottomDivider key={i}>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: 'white' }}>
                                                        {l.vocabulary + ' - ' + l.answer}</ListItem.Title>
                                                    <ListItem.Subtitle style={{ color: 'white' }}>
                                                        Cevabınız : {l.userAnswer}</ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        ))}
                                    </ScrollView>
                                </View>
                            ) : (
                                <>
                                    <TextInput style={{
                                        borderBottomWidth: 0.75,
                                        borderBottomColor: 'wheat',
                                        marginHorizontal: '35%',
                                        textAlign: 'center',
                                        color: 'white'
                                    }} keyboardType='numeric' onChangeText={(val) =>
                                        this.checkQuizLimit(val)
                                    } value={this.state.countOfQuestions === 0 ? '' :
                                        Number(this.state.countOfQuestions).toString()}
                                    />
                                    <TouchableHighlight style={styles.btn}
                                        onPress={() => this.getQuiz(this.state.countOfQuestions)}
                                        underlayColor={'none'}>
                                        <Text style={{ fontWeight: 'bold', color: 'white' }}>Başlat</Text>
                                    </TouchableHighlight>
                                </>
                            )}
                        </View>
                    ) : (
                        <View style={{ marginTop: 30 }}>
                            <Text style={{
                                alignSelf: 'center', fontWeight: 'bold',
                                fontSize: 18, color: 'wheat'
                            }}>
                                {this.state.questions[this.state.currentQuestionIndex].vocabulary}
                            </Text>
                            <TextInput
                                style={{
                                    borderBottomWidth: 1,
                                    width: '75%', alignSelf: 'center',
                                    borderBottomColor: 'wheat', color: 'white'
                                }} onChangeText={(val) => this.setState({ answerOfUser: val })}
                                ref={input => { this.textInput = input }} />
                            <TouchableHighlight style={{
                                backgroundColor: '#07BEB8',
                                width: '75%', alignSelf: 'center',
                                paddingHorizontal: 15,
                                paddingVertical: 6, alignItems: 'center',
                                marginTop: 15, borderRadius: 6
                            }} onPress={() => {
                                this.textInput.clear()
                                this.checkQuestion(this.state.currentQuestionIndex)
                            }} underlayColor={'none'}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>CEVAPLA</Text>
                            </TouchableHighlight>
                        </View>
                    )
                }
                {console.log(this.state.answerList)}
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 25
    },
    btn: {
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 6,
        paddingHorizontal: 15,
        width: '35%',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 10,
        borderColor: 'wheat'
    }
})