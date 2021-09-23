import { PermissionsAndroid } from 'react-native'
const RNFS = require('react-native-fs')
import XLSX from 'xlsx'

module.exports.handle = async (vocabularies) => {
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
                exportDataToExcel(vocabularies);
                console.log("Permission granted");
            } else {
                // Permission denied
                console.log("Permission denied");
            }
        } else {
            // Already have Permission (calling our exportDataToExcel function)
            await exportDataToExcel(vocabularies)
            return true

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
    RNFS.writeFile(RNFS.DownloadDirectoryPath + '/yds.xlsx', wbout, 'ascii').then((r) => {
        console.log('Success')
    }).catch((e) => {
        console.log('hata');
        console.log('Error', e)
    });

}

module.exports.importDataFromExcel = async (fileData) => {
    let vocabularyList = []/*
    const wb = XLSX.read(RNFS.ExternalStorageDirectoryPath + '/yds.xlsx', { type: 'binary' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    console.log(ws);
    const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    console.log("Data>>>" + data);
    */
    const excelFile = await RNFS.readFile(fileData.uri, 'ascii');
    const wb = XLSX.read(excelFile, { type: 'binary' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    console.log(ws);
    const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    console.log("Data>>>" + data);
    /*
        const dt = await XLSX.read(fileData.uri, {});
        const first_worksheet = dt.Sheets[dt.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        console.log(data);
        */
}