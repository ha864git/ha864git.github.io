'use strict';

export class Sdb {

    constructor(dbName, objStoreName, callback) {
        this.dbName = dbName;
        this.objStoreName = objStoreName;
        this.callback = callback;
        this.callback2 = null;
        this.db = null;
        this.openDb();
    }

    openDb() {
        let openRequest = indexedDB.open(this.dbName);
        openRequest.onupgradeneeded = (event) => {
            this.db = event.target.result;
            this.db.onerror = (event) => {
                console.log("Error loading database.");
            };
            if (!this.db.objectStoreNames.contains(this.objStoreName)) {
                const objStoreKey = { autoIncrement: true };
                const objectStore = this.db.createObjectStore(this.objStoreName, objStoreKey);
                console.log("Object store created.");
            }
        };
        openRequest.onsuccess = (event) => {
            this.db = event.target.result;
            console.log("DB Open OK");
            this.dbGetAllData();
        };
        openRequest.onerror = (event) => {
            console.error("DB Open Error", openResult.error);
        };
    }

    dbGetAllData() {
        const transaction = this.db.transaction(this.objStoreName, 'readonly');
        const objectStore = transaction.objectStore(this.objStoreName);
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            const result = event.target.result;
            this.dbGetAllKeys(result);
        };
        request.onerror = (event) => {
            console.log("DB Read Error", event.target.error);
        };
    }

    dbGetAllKeys(data) {
        const transaction = this.db.transaction(this.objStoreName, 'readonly');
        const objectStore = transaction.objectStore(this.objStoreName);
        const request = objectStore.getAllKeys();
        request.onsuccess = (event) => {
            const result = event.target.result;
            this.callback(data, result);
        };
        request.onerror = (event) => {
            console.log("DB Read Error", event.target.error);
        };
    }

    dbAdd(label, data, note, done) {
        const transaction = this.db.transaction(this.objStoreName, 'readwrite');
        const objectStore = transaction.objectStore(this.objStoreName);
        const sdata = {
            data1: label,
            data2: data,
            data3: note,
            data4: done
        };
        const request = objectStore.add(sdata);
        request.onsuccess = (event) => {
            console.log("Request successful.");
            this.dbGetAllData();
        };
        request.onerror = (event) => {
            console.log('保存失敗。event:', event);
        };
    }

    dbDelete(key) {
        let transaction = this.db.transaction(this.objStoreName, 'readwrite');
        let objectStore = transaction.objectStore(this.objStoreName);
        let request = objectStore.openCursor(IDBKeyRange.only(Number(key)));
        request.onsuccess = (event) => {
            let cursor = request.result;
            if (cursor) {
                let updateRequest = cursor.delete();
                updateRequest.onsuccess = (event) => {
                    console.log("削除成功");
                };
                cursor.continue();
            }
        }
        request.onerror = (event) => {
            console.log('削除失敗。event:', event);
        };
    }

    dbUpdate(key, index, data) {
        let transaction = this.db.transaction(this.objStoreName, 'readwrite');
        let objectStore = transaction.objectStore(this.objStoreName);
        let request = objectStore.openCursor(IDBKeyRange.only(Number(key)));
        request.onsuccess = (event) => {
            let cursor = request.result;
            if (cursor) {
                if (index == 1) {
                    cursor.value.data1 = data;
                } else if (index == 3) {
                    cursor.value.data3 = data;
                } else {
                    cursor.value.data4 = data;
                }
                let updateRequest = cursor.update(cursor.value);
                updateRequest.onsuccess = (event) => {
                    console.log("更新成功", event.target.result);
                };
                cursor.continue();
            }
        }
        request.onerror = (event) => {
            console.log('更新失敗。event:', event);
        };
    }

    dbClear() {
        let transaction = this.db.transaction(this.objStoreName, 'readwrite');
        let objectStore = transaction.objectStore(this.objStoreName);
        let request = objectStore.clear();
        request.onsuccess = (event) => {
            console.log('クリア成功', event);
        };
        request.onerror = (event) => {
            console.log('クリア失敗', event);
        };
    }

    download(callback) {
        this.callback2 = callback;
        let transaction = this.db.transaction(this.objStoreName, 'readonly');
        let objectStore = transaction.objectStore(this.objStoreName);
        let request = objectStore.getAll();
        request.onsuccess = (event) => {
            const result = event.target.result;
            this.callback2(result);
        };
        request.onerror = (event) => {
            console.log('取得失敗。event:', event);
        };

    }

}
