import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native'
import { View, Text, Pressable } from 'react-native'
import { ListItem } from 'react-native-elements/dist/list/ListItem'

export default function LetterDictionary(props) {
    const [dictionary, setDictionary] = useState([])
    useEffect(() => {
        setDictionary(props.vocabularyList)
        console.log('letterDictionary', dictionary)
    }, [])
    if (dictionary.length == 0) return null
    return (
        <View style={styles.container}>
            <ScrollView>
                {dictionary.map((l, i) => (
                    <View key={i}>
                        <Text>{l.vocabulary}</Text>
                    </View>
                ))}
            </ScrollView>
            <Pressable
                onPress={() => props.setVisible()}
            >
                <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginHorizontal: '10%',
    }
})