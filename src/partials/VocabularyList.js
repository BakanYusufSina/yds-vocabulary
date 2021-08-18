import React, { Component, useEffect, useState } from 'react'
import {
    View, Text, ScrollView, Alert, TextInput, TouchableHighlight,
    RefreshControl
} from 'react-native'
import { ListItem, Overlay, Icon, Input } from 'react-native-elements'
import { openDatabase } from 'react-native-sqlite-storage'
import LinearGradient from 'react-native-linear-gradient'

let db = openDatabase({
    name: 'yds',
    createFromLocation: '~www/sqlite_yds.db'
})

export default class VocabularyList extends Component {
    constructor() {
        super()
        this.state = {
            vocabularies: [],
            showOverlay: false,
            selectedVocabulary: {},
            isEditing: false,
            editedVocabulary: '',
            editedTranslate: '',
            refreshing: false,
            filterText: '',
            filteredVocabularies: []
        }
    }
    componentDidMount() {
        this.getVocabularies()
    }
    getVocabularies = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM yds', [], (tx, results) => {
                let arrayOfVocabulary = []
                for (let i = 0; i < results.rows.length; ++i) {
                    arrayOfVocabulary.push(results.rows.item(i))
                }
                arrayOfVocabulary.sort(function (a, b) {
                    if (a.vocabulary > b.vocabulary) return 1
                })
                this.setState({ vocabularies: [...arrayOfVocabulary] })
            }, (err) => console.log(err))
        })
    }
    deleteVocabulary = () => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM yds WHERE id=?',
                [this.state.selectedVocabulary.id], (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert(this.state.selectedVocabulary.vocabulary
                            + ' silindi!')
                        this.setState({
                            selectedVocabulary: {}, showOverlay: false,
                            isEditing: false
                        })
                    }
                })
        }, (err) => console.log(err))
    }
    editVocabulary = () => {
        this.setState({
            editedVocabulary: this.state.editedVocabulary ? this.state.editedVocabulary :
                this.state.selectedVocabulary.vocabulary,
            editedTranslate: this.state.editedTranslate ? this.state.editedTranslate :
                this.state.selectedVocabulary.translate
        })
        db.transaction(tx => {
            tx.executeSql('UPDATE yds SET vocabulary=?, translate=? ' +
                'WHERE id=?', [this.state.editedVocabulary,
                this.state.editedTranslate,
                this.state.selectedVocabulary.id], (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert(this.state.selectedVocabulary.vocabulary + ' düzenlendi!')
                        this.setState({ showOverlay: false })
                    }
                }, (err) => { console.log(err) })
        })
    }
    filterVocabularies = () => {
        let filterText = this.state.filterText
        this.setState({
            filteredVocabularies: this.state.vocabularies.filter(i => i.vocabulary.toLowerCase().
                includes(filterText))
        })
    }
    render() {
        let vocabulariesList = this.state.filterText === '' ?
            this.state.vocabularies : this.state.filteredVocabularies
        if (this.state.vocabularies.length === 0)
            return <View><Text>There is no vocabulary yet</Text></View>
        return (
            <ScrollView style={{ flex: 1 }}
                refreshControl={<RefreshControl refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.getVocabularies()
                        this.setState({ refreshing: false })
                    }} />}>
                <>
                    <View>
                        <Input
                            leftIcon={<Icon name='search' color='wheat' size={22} />}
                            maxLength={15}
                            containerStyle={{
                                marginTop: '2%',
                                marginBottom: '6%',
                                height: 36
                            }}
                            inputStyle={{ color: 'white' }}
                            onChangeText={async (val) => {
                                await this.setState({ filterText: val })
                                this.filterVocabularies()
                            }} />
                    </View>
                    <View>
                        {vocabulariesList.map((l, i) => (
                            <ListItem key={i}
                                linearGradientProps={{
                                    colors: ['#07BEB8', '#EFD9CE'],
                                    start: { x: 1, y: 0 },
                                    end: { x: 0.25, y: 0 },
                                }}
                                ViewComponent={LinearGradient} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{l.vocabulary}</ListItem.Title>
                                    <ListItem.Subtitle>{l.translate}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron onPress={() => {
                                    this.setState({
                                        selectedVocabulary: { ...l },
                                        showOverlay: true
                                    })
                                }} />
                            </ListItem>
                        ))}
                    </View>
                    <>
                        <Overlay isVisible={this.state.showOverlay}
                            onBackdropPress={() => this.setState({ showOverlay: false, isEditing: false })}
                            overlayStyle={{ width: '75%', backgroundColor: '#25283D' }}>
                            <View>
                                {this.state.isEditing ?
                                    <View>
                                        <TextInput defaultValue={this.state.selectedVocabulary.vocabulary}
                                            style={{
                                                borderBottomWidth: 0.5, borderBottomColor: 'wheat',
                                                color: 'white', fontSize: 15
                                            }}
                                            onChangeText={(val) => this.setState({ editedVocabulary: val })} />
                                        <TextInput defaultValue={this.state.selectedVocabulary.translate}
                                            style={{
                                                borderBottomWidth: 0.5, borderBottomColor: 'wheat',
                                                color: 'white', fontSize: 15
                                            }}
                                            onChangeText={(val) => this.setState({ editedTranslate: val })} />
                                        <TouchableHighlight style={{
                                            width: '75%',
                                            alignSelf: 'center', alignItems: 'center',
                                            backgroundColor: 'wheat', paddingVertical: 10,
                                            borderRadius: 3, marginTop: 10
                                        }} onPress={() => this.editVocabulary()}>
                                            <Text style={{ color: 'darkslategray', fontWeight: 'bold' }}>
                                                {this.state.isEditing ? 'GÜNCELLE' : 'KAYDET'}</Text>
                                        </TouchableHighlight>
                                    </View> :
                                    <View>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'wheat' }}>
                                            {this.state.selectedVocabulary.vocabulary}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'white' }}>
                                            {this.state.selectedVocabulary.translate}
                                        </Text>
                                    </View>
                                }

                                <View style={{
                                    flexDirection: 'row', position: 'absolute',
                                    right: 0
                                }}>
                                    <Icon name='delete' type='Ionicon' size={22} color='red'
                                        onPress={() => this.deleteVocabulary()} />
                                    <Icon name='edit' type='Ionicon' size={22} color='darkcyan'
                                        onPress={() => this.setState({ isEditing: !this.state.isEditing })} />
                                </View>
                            </View>
                        </Overlay>
                    </>
                </>
            </ScrollView >
        )
    }
}
