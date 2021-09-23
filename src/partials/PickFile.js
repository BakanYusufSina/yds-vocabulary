import DocumentPicker from 'react-native-document-picker'

module.exports = async () => {
    // Pick a single file
    try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.xlsx],
        })
        return res[0]
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err
        }
    }
}