import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet } from 'react-native'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated from 'react-native-reanimated'

export default class LetterDictionary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dictionary: [],
            countOfVocabulary: 15,
            scrollY: new Animated.Value(0),
            loadMoreData: false
        }
    }
    componentDidMount() {
        this.setState({
            dictionary: this.props.route.params.dictionary
        })
    }
    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }
    loadMoreData = () => {
        if (this.state.countOfVocabulary <= this.state.dictionary.length)
            this.setState({
                countOfVocabulary: this.state.countOfVocabulary + 15,
                loadMoreData: false
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
                <Animated.ScrollView
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        {
                            listener: event => {
                                if (this.isCloseToBottom(event.nativeEvent)) {
                                    this.setState({ loadMoreData: true })
                                    this.loadMoreData()
                                }
                            }
                        }
                    )}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            this.setState({ loadMoreData: true })
                            this.loadMoreData()
                        }
                    }}
                >
                    {this.state.dictionary.slice(0, this.state.countOfVocabulary).map((l, i) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={styles.listItemText}>
                                {l.vocabulary.charAt(0).toUpperCase() + l.vocabulary.slice(1)}
                            </Text>
                            <Text style={{ color: 'white' }}>{l.translate}</Text>
                        </View>
                    ))}
                    {this.state.loadMoreData === true ?
                        (<ActivityIndicator color={'wheat'} size={25} />) : <></>}
                </Animated.ScrollView>
            </LinearGradient >
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