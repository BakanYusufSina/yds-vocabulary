import React, { Component, useState } from 'react'
import { Dimensions } from 'react-native'
import { TouchableHighlight } from 'react-native'
import { Text, View, StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import LinearGradient from 'react-native-linear-gradient'
import AddVocabulary from '../partials/AddVocabulary'
import VocabularyList from '../partials/VocabularyList'
import ActionButton from '@logvinme/react-native-action-button'

export default function Vocabularies() {
    const [showOverlay, setShowOverlay] = useState(false)
    const [refreshList, setRefresh] = useState(false)
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <VocabularyList updateList={refreshList} />
            {/*KELİME EKLEME BUTONU*/}
            <>
                <ActionButton buttonColor="rgba(231,76,60,1)" useNativeFeedback={false}
                    offsetX={10} offsetY={10}>
                    <ActionButton.Item buttonColor='#9b59b6' title="Excel'e Aktar" onPress={() => console.log("notes tapped!")}
                        useNativeFeedback={false} style={styles.acBtn}>
                        <Icon name="file-excel-o" type='font-awesome' size={22} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Kelime Ekle" onPress={() => setShowOverlay(true)}
                        useNativeFeedback={false} style={styles.acBtn}>
                        <Icon name="plus" type='font-awesome' size={22} />
                    </ActionButton.Item>
                </ActionButton>
                <Overlay visible={showOverlay}
                    onBackdropPress={() => setShowOverlay(false)}
                    overlayStyle={{ width: '85%', backgroundColor: '#25283D' }}>
                    <AddVocabulary isAdded={() => {
                        setRefresh(true)
                        setTimeout(() => setRefresh(false), 500)
                    }}
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
})