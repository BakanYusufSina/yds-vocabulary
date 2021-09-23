import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableHighlight } from 'react-native'

export default function Dictionary(props) {
    //Alphabet array
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
        "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Tüm Liste", "Favoriler"];
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <View style={styles.sectionContainer}>
                {alphabet.map((l, i) => (
                    <TouchableHighlight style={styles.btn} key={i} onPress={() => {
                        props.navigation.navigate('LetterDictionary', { letter: l })
                    }} underlayColor={'gray'}>
                        <Text style={{
                            color: 'darkslategray',
                            fontWeight: 'bold'
                        }}>{l.toUpperCase()}</Text>
                    </TouchableHighlight>
                ))}
            </View>
        </LinearGradient >
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