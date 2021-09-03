import React, { Component, createRef } from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet } from 'react-native'
import { TouchableHighlight } from 'react-native'
import { Text, View, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
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
        this.scrollRef = createRef()
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
    scrollUpToTop = () => {
        this.scrollRef.current.scrollTo({
            y: 0,
            animated: true
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
                    ref={this.scrollRef}
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
                        (<ActivityIndicator color={'wheat'} size={15} />) : <></>}
                </Animated.ScrollView>
                <TouchableHighlight style={styles.btnArrowUp}
                    onPress={this.scrollUpToTop} underlayColor={'darkslategray'}>
                    <Icon name='arrow-up' type='font-awesome' color='white'
                        size={20} />
                </TouchableHighlight>
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
    },
    btnArrowUp: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: 'darkcyan',
        padding: 10,
        borderRadius: 50
    }
})