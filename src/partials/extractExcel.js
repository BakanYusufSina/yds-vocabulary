import { PermissionsAndroid } from 'react-native'
var RNFS = require('react-native-fs')
import XLSX from 'xlsx'

module.exports.handle = async (vocabularies) => {
    console.log('excel');
    // function to handle exporting
    try {
        // Check for Permission (check if permission is already given or not)
        let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

        if (!isPermitedExternalStorage) {

            // Ask for permission
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage permission needed",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            )


            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Permission Granted (calling our exportDataToExcel function)
                exportDataToExcel();
                console.log("Permission granted");
            } else {
                // Permission denied
                console.log("Permission denied");
            }
        } else {
            // Already have Permission (calling our exportDataToExcel function)
            exportDataToExcel(vocabularies);
        }
    } catch (e) {
        console.log('Error while checking permission');
        console.log(e);
        return
    }
}

const exportDataToExcel = (vocabularies) => {

    // Created Sample data
    let sample_data_to_export = [...vocabularies]

    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export)
    XLSX.utils.book_append_sheet(wb, ws, "Yds")
    const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" })

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/yds.xlsx', wbout, 'ascii').then((r) => {
        console.log('Success')
    }).catch((e) => {
        console.log('Error', e)
    });

}