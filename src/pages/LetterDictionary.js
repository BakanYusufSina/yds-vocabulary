import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet } from 'react-native'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export default class LetterDictionary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dictionary: []
        }
    }
    componentDidMount() {
        this.setState({
            dictionary: this.props.route.params.dictionary
        })
    }
    render() {
        if (this.state.dictionary.length === 0)
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator color={'wheat'} size={50} />
                </View>)
        return (
            <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
                <ScrollView>
                    {this.state.dictionary.map((l, i) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={styles.listItemText}>
                                {l.vocabulary.charAt(0).toUpperCase() + l.vocabulary.slice(1)}
                            </Text>
                            <Text style={{ color: 'white' }}>{l.translate}</Text>
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    },
    listItem: {
        borderBottomWidth: 0.25,
        borderColor: 'white',
        marginBottom: 5,
        paddingLeft: 10,
        paddingVertical: 5,
    },
    listItemText: {
        color: 'wheat',
        fontWeight: 'bold'
    }
})