import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'

export default function QuizWithChoose(props) {
    const [quizAnswers, setQuizAnswers] = useState([]) //Random answer list
    const [questionCount, setCount] = useState(props.questionCount)
    const [questions, setQuestions] = useState([...props.questions])//All questions
    const [questionAnswers, setQuestionAnswers] = useState([])//Answers for one question
    const db = openDatabase({
        name: 'yds',
        createFromLocation: '~www/sqlite_yds.db'
    })
    useEffect(async () => {
        db.transaction(tx => {
            tx.executeSql('SELECT translate FROM dictionary ORDER BY random() LIMIT 10',
                [],
                async (tx, results) => {
                    const answers = []
                    for (let i = 0; i < results.rows.length; i++)
                        await answers.push(results.rows.item(i).translate)
                    setQuizAnswers(answers)
                })
        })
        await getAnswerList(0)
    }, [])
    const getAnswerList = async (qIndex) => {
        console.log('deneme')
        let answers = []
        for (let i = 0; i <= 3; i++) {
            if (i == 3)
                answers.push(questions[qIndex].translate)
            else
                answers.push(quizAnswers[Math.floor(Math.random() * quizAnswers.length)])
        }
        answers = await [...shuffle(answers)]
        setQuestionAnswers([...answers])
    }
    const shuffle = (array) => {
        var currentIndex = array.length, randomIndex
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
        return array
    }
    if (questionAnswers.length < 4)
        return (<View>
            <ActivityIndicator color='white' size={35} style={styles.activity} />
        </View>)
    if (questionAnswers.indexOf(undefined) != -1)
        getAnswerList(0)
    else
        return (
            <View style={styles.container}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>
                        {questions[0].vocabulary}
                    </Text>
                </View>
                {questionAnswers.map((l, i) =>
                    <TouchableHighlight style={styles.answersContainer} key={i}
                        onPress={() => console.log(l)} underlayColor='white'>
                        <Text>{l}</Text>
                    </TouchableHighlight>
                )}
            </View>
        )
}

const styles = StyleSheet.create({
    container: {

    },
    activity: {
        marginTop: '15%',
        alignSelf: 'center'
    },
    questionContainer: {
        backgroundColor: 'white',
        width: '75%',
        alignSelf: 'center',
        marginVertical: '5%',
        paddingVertical: 15,
        borderRadius: 6,
        borderWidth: 1,
        alignItems: 'center'
    },
    questionText: {
        fontSize: 18,
        fontFamily: 'monospace',
        color: 'black',
    },
    answersContainer: {
        width: '75%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 14,
        marginBottom: '2%',
        borderRadius: 10,
    }
})