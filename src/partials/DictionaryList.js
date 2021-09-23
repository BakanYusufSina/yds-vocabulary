import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native'
import Animated from 'react-native-reanimated'
import { Icon, Input } from 'react-native-elements'

export default function DictionaryList(props) {
    const db = props.db
    let scrollY = new Animated.Value(0)
    const scrollRef = useRef()
    const [countOfVocabulary, setCount] = useState(15)
    const [loadMoreBool, setLoadMore] = useState(false)
    const [dictionary, setDictionary] = useState(props.dictionary)
    const [filteredDictionary, setFiltered] = useState([])
    const [filterText, setFilterText] = useState('')
    //Favorite
    const addToFavorite = (id, index, isFavorite) => {
        db.transaction(tx => {
            tx.executeSql('UPDATE dictionary SET favorite=? WHERE id=?', [!isFavorite, id], async (tx, results) => {
                if (results.rowsAffected > 0) {
                    await props.refresh(props.letter)
                }
            }, (err) => console.log(err))
        })
    }
    useEffect(() => {
        setDictionary(props.dictionary)
    }, [props.dictionary])
    //Filter list
    const filterDictionary = (filter) => {
        setFiltered(dictionary.filter(i => i.vocabulary.toLowerCase().
            includes(filter.toLowerCase())))
        setFilterText(filter)
    }
    //SCROLL_EVENT
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }
    const loadMoreData = () => {
        if (countOfVocabulary <= dictionary.length) {
            setCount(countOfVocabulary + 15)
            setLoadMore(false)
        }
    }
    const scrollUpToTop = () => {
        scrollRef.current.scrollTo({
            y: 0,
            animated: true
        })
    }
    const listOfDictionary = filterText == '' ? dictionary : filteredDictionary
    return (
        <>
            <Input
                placeholder='Kelime arayın...'
                leftIcon={
                    <Icon
                        name='search'
                        size={18}
                        color='wheat'
                    />
                }
                inputStyle={{ color: 'white', fontSize: 15 }}
                onChangeText={(filter) => filterDictionary(filter)}
            />
            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        listener: event => {
                            if (isCloseToBottom(event.nativeEvent)) {
                                setLoadMore(true)
                                loadMoreData()
                            }
                        }
                    }
                )}
                onMomentumScrollEnd={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        setLoadMore(true)
                        loadMoreData()
                    }
                }}
                ref={scrollRef}
            >
                {listOfDictionary.slice(0, countOfVocabulary).map((l, i) => (
                    <View key={i} style={styles.listItem}>
                        <Text style={styles.listItemText}>
                            {l.vocabulary.charAt(0).toUpperCase() + l.vocabulary.slice(1)}
                        </Text>
                        <Text style={{ color: 'white' }}>{l.translate}</Text>
                        <Icon name={l.favorite === 0 ? 'star-outline' : 'star'}
                            containerStyle={styles.favIcon} color='white'
                            onPress={() => addToFavorite(l.id, i, l.favorite)} />
                    </View>
                ))}
                {loadMoreBool === true ?
                    (<ActivityIndicator color={'wheat'} size={15} />) : <></>}
            </Animated.ScrollView>
            <TouchableHighlight style={styles.btnArrowUp}
                onPress={scrollUpToTop} underlayColor={'darkslategray'}>
                <Icon name='arrow-up' type='font-awesome' color='white'
                    size={20} />
            </TouchableHighlight>
        </>
    )
}

const styles = StyleSheet.create({
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
    },
    favIcon: {
        position: 'absolute',
        right: 15,
        top: 15
    }
})