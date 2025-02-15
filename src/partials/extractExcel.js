import { PermissionsAndroid, Platform } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
const RNFS = require('react-native-fs')
import XLSX from 'xlsx'
import PushNotification from 'react-native-push-notification'

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

PushNotification.configure({
    onRegister: function (token) {
        console.log('onRegister token:', token);
    },
    popInitialNotification: true,// This line solves the problem that I was facing.
    requestPermissions: Platform.OS === 'ios'
});

const userNowInactive = () => {
    showNotification();
}

const showNotification = (title, message,) => {
    console.log("Notification")
    PushNotification.localNotification({
        title: title,
        message: message,
        playSound: true,
        channelId: 123,
        autoCancel: true,
        vibrate: true,
        vibration: 300,
        priority: 'high'
    });
};
PushNotification.createChannel(
    {
        channelId: 123, // (required)
        channelName: "TodoYumak", // (required)
        playSound: true,
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    //(created) => console.log(`createChannel returned '${created}'`) / / (optional) callback returns whether the channel was created, false means it already existed.
);

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
        showNotification("YDS Kelime,Quiz ve Sözlük", "Excel dosyası indirildi")
    }).catch((e) => {
        console.log('hata');
        console.log('Error', e)
    });
}

module.exports.importDataFromExcel = async (fileData) => {
    const excelFile = await RNFS.readFile(fileData.uri, 'ascii')
    const wb = XLSX.read(excelFile, { type: 'binary' })
    const wsname = wb.SheetNames[0]
    const ws = wb.Sheets[wsname]
    const data = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        raw: false, blankrows: false
    })
    const arrayOfExcel = await excelToArray(data)//Set excel data to array
    const importExcelDatasToDB = await importToDB(arrayOfExcel)
    return importExcelDatasToDB
}

const excelToArray = (excelData) => {
    let arrayOfExcel = []
    for (let i = 1; i < excelData.length; i++)
        arrayOfExcel.push({
            vocabulary: excelData[i][1],
            translate: excelData[i][0]
        })
    return arrayOfExcel
}

const importToDB = async (arrayExcelData) => {
    const db = openDatabase({
        name: 'yds',
        createFromLocation: '~www/sqlite_yds.db'
    })
    if (arrayExcelData.length != 0)
        await db.transaction(tx => {
            arrayExcelData.map((l, i) => {
                tx.executeSql('INSERT OR IGNORE INTO yds(vocabulary, translate) VALUES(?,?)',
                    [l.vocabulary.toLowerCase().trim(), l.translate.toLowerCase().trim()], (tx, results) => {
                    }, (err) => console.log(err))
            })

        })
    return true
}