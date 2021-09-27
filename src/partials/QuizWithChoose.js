import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'

export default function QuizWithChoose(props) {
    const [quizAnswers, setQuizAnswers] = useState(null)
    const [questionCount, setCount] = useState(props.questionCount)
    const [questions, setQuestions] = useState([...props.questions])
    const [questionAnswers, setQuestionAnswers] = useState([])
    const db = openDatabase({
        name: 'yds',
        createFromLocation: '~www/sqlite_yds.db'
    })
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT translate FROM dictionary ORDER BY random() LIMIT ?',
                [props.questionCount * 5],
                async (tx, results) => {
                    const answers = []
                    if (results.rowsAffected > 0) {
                        for (let i = 0; i < results.rows.item.length; i++)
                            await answers.push(results.rows.item(i))
                        console.log('answers', answers);
                    }
                    setQuizAnswers(answers)
                })
        })
    }, [])
    const getAnswerList = async (qIndex) => {
        const answers = []
        for (let i = 0; i <= 3; i++) {
            if (i == 3)
                await answers.push(questions[qIndex].translate)
            else
                await answers.push(quizAnswers[Math.floor(Math.random() * i + (questionCount - 1))])
        }
        setQuestionAnswers(answers)
    }
    if (questions.length === 0) return null
    return (
        <View style={styles.container}>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {questions[0].vocabulary}
                </Text>
            </View>

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