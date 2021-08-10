import React, { Component, useState } from 'react'
import { Dimensions } from 'react-native'
import { TouchableHighlight } from 'react-native'
import { Text, View, StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import AddVocabulary from '../partials/AddVocabulary'
import VocabularyList from '../partials/VocabularyList'

export default function Vocabularies() {
    const [showOverlay, setShowOverlay] = useState(false)
    const [refreshList, setRefresh] = useState(false)
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <VocabularyList refreshVocabularyList={refreshList}
                setRefreshList={() => setRefresh(false)} />
            {/*KELİME EKLEME BUTONU*/}
            <>
                <TouchableHighlight style={styles.addBtn} onPress={() => setShowOverlay(true)}>
                    <Text style={styles.addBtnText}>+</Text>
                </TouchableHighlight>
                <Overlay visible={showOverlay}
                    onBackdropPress={() => setShowOverlay(false)}
                    overlayStyle={{ width: '85%', backgroundColor: '#25283D' }}>
                    <AddVocabulary isAdded={() => setRefresh(true)}
                        showOverlay={() => setShowOverlay(false)} />
                </Overlay>
            </>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    addBtn: {
        position: 'absolute',
        bottom: 10,
        borderWidth: 0.25,
        borderRadius: 50,
        alignItems: 'center',
        width: 60,
        height: 60,
        justifyContent: 'center',
        backgroundColor: '#EFD9CE',
        right: (Dimensions.get('screen').width - 60) / 2
    },
    addBtnText: {
        fontSize: 26,
        color: 'darkslategray'
    }
})