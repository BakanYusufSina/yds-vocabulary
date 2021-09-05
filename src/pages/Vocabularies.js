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
import extractExcel from '../partials/extractExcel'

export default function Vocabularies() {
    const [showOverlay, setShowOverlay] = useState(false)
    const [refreshList, setRefresh] = useState(false)
    const [extractExcelData, setExcelData] = useState([])
    const [excelVisible, setExcelVisible] = useState(false)
    return (
        <LinearGradient colors={['#25283D', '#2C5364']} style={styles.container}>
            <VocabularyList updateList={refreshList}
                vocabularyList={(vocabularies) => setExcelData(vocabularies)} />
            {/*KELİME EKLEME BUTONU*/}
            <>
                <ActionButton buttonColor="rgba(231,76,60,1)" useNativeFeedback={false}
                    offsetX={10} offsetY={10}>
                    <ActionButton.Item buttonColor='#9b59b6' title="Excel'e Aktar"
                        onPress={() => {
                            extractExcel.handle(extractExcelData)
                            setExcelVisible(true)
                            setTimeout(() => setExcelVisible(false), 2000)
                        }}
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
                <Overlay visible={excelVisible} onBackdropPress={() => setExcelVisible(false)}>
                    <View style={styles.excelContainer}>
                        <Icon name='list' size={45} color={'darkcyan'} />
                        <Icon name='arrow-right' type='font-awesome'
                            style={{ marginHorizontal: 15 }} />
                        <Icon name='file-excel-o' type='font-awesome' size={35} color={'darkslategray'} />
                    </View>
                    <Text style={styles.excelText}>Kelime listeniz EXCEL'e aktarıldı</Text>
                </Overlay>
            </>
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    excelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10
    },
    excelText: {
        fontWeight: 'bold',
        letterSpacing: 1,
        marginTop: 10
    }
})