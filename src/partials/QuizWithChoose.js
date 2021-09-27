import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
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
    useEffect(() => {
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
    }, [])
    const getAnswerList = (qIndex) => {
        const answers = []
        const indexList = []
        for (let i = 0; indexList.length < 3; i++)
            if (indexList.indexOf(quizAnswers[Math.floor(Math.random() * quizAnswers.length)]) == -1)
                indexList.push(quizAnswers[Math.floor(Math.random() * quizAnswers.length)])
        for (let i = 0; i <= 3; i++) {
            if (i == 3)
                answers.push(questions[qIndex].translate)
            else
                answers.push(indexList[i])
        }
        console.log(answers);
        //setQuestionAnswers(answers)
    }
    if (questions.length === 0 && quizAnswers.length === 0) return null
    return (
        <View style={styles.container}>
            {getAnswerList(0)}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {questions[0].vocabulary}
                </Text>
            </View>
            {questionAnswers.map((l, i) =>
                <View style={styles.answersContainer} key={i}>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

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