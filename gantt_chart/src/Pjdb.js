'use strict';

export class Pjdb {

    constructor(dbName, objStoreName, didDbOpen) {
        this.dbName = dbName;
        this.objStoreName = objStoreName;
        this.didDbOpen = didDbOpen;
        this.db = null;
        this.keyTasks = null;
        this.keyProjectDates = null;
        this.keyWeekDays = null;
        this.keyNonWorkingDays = null;
        this.keyWorkingDays = null;
        this.onsuccessDbAdd = null;
        this.openDb();
    }

    openDb() {
        const openRequest = indexedDB.open(this.dbName);
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
            console.log("get all ok");
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
            data.forEach((dt, i) => {
                if (dt.kind == 'task') {
                    this.keyTasks = result[i];
                } else if (dt.kind == 'nonWorkingDays') {
                    this.keyNonWorkingDays = result[i];
                } else if (dt.kind == 'WorkingDays') {
                    this.keyWorkingDays = result[i];
                } else if (dt.kind == 'weekWorkingDays') {
                    this.keyWeekDays = result[i];
                } else if (dt.kind == 'projectDates') {
                    this.keyProjectDates = result[i];
                }
            });
            this.didDbOpen(data);
        };
        request.onerror = (event) => {
            console.log("DB Read Error", event.target.error);
        };
    }

    updateDb(kind, data) {
        switch (kind) {
            case 'task':
                if (this.keyTasks == null) {
                    this.onsuccessDbAdd = function (result) { this.keyTasks = result; }.bind(this);
                    this.#addDb(kind, data);
                } else {
                    this.#exeUpdateDb(this.keyTasks, kind, data);
                }
                break;
            case 'projectDates':
                if (this.keyProjectDates == null) {
                    this.onsuccessDbAdd = function (result) { this.keyProjectDates = result; }.bind(this);
                    this.#addDb(kind, data);
                } else {
                    this.#exeUpdateDb(this.keyProjectDates, kind, data);
                }
                break;
            case 'weekWorkingDays':
                if (this.keyWeekDays == null) {
                    this.onsuccessDbAdd = function (result) { this.keyWeekDays = result; }.bind(this);
                    this.#addDb(kind, data);
                } else {
                    this.#exeUpdateDb(this.keyWeekDays, kind, data);
                }
                break;
            case 'nonWorkingDays':
                if (this.keyNonWorkingDays == null) {
                    this.onsuccessDbAdd = function (result) { this.keyNonWorkingDays = result; }.bind(this);
                    this.#addDb(kind, data);
                } else {
                    this.#exeUpdateDb(this.keyNonWorkingDays, kind, data);
                }
                break;
            case 'WorkingDays':
                if (this.keyWorkingDays == null) {
                    this.onsuccessDbAdd = function (result) { this.keyWorkingDays = result; }.bind(this);
                    this.#addDb(kind, data);
                } else {
                    this.#exeUpdateDb(this.keyWorkingDays, kind, data);
                }
                break;
        }
    }

    #addDb(kind, data) {
        const transaction = this.db.transaction(this.objStoreName, 'readwrite');
        const objectStore = transaction.objectStore(this.objStoreName);
        const sdata = {
            kind: kind,
            data: data
        };
        const request = objectStore.add(sdata);
        request.onsuccess = (event) => {
            console.log(event.target.result);
            console.log("Request successful.");
            this.onsuccessDbAdd(event.target.result);
        };
        request.onerror = (event) => {
            console.log('保存失敗。event:', event);
        };
    }

    #exeUpdateDb(key, kind, data) {
        let transaction = this.db.transaction(this.objStoreName, 'readwrite');
        let objectStore = transaction.objectStore(this.objStoreName);
        let request = objectStore.openCursor(IDBKeyRange.only(Number(key)));
        request.onsuccess = (event) => {
            let cursor = request.result;
            if (cursor) {
                if (cursor.value.kind == kind) {
                    cursor.value.data = data;
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

    #dbDelete(key) {
        let transaction = this.db.transaction(this.objStoreName, 'readwrite');
        let objectStore = transaction.objectStore(objStoreName);
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

    #dbClear() {
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

}