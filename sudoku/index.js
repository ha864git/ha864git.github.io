"use strict";

import { Board } from "./src/Board.js";
import { Smode } from "./src/Smode.js";
import { Smemo } from "./src/Smemo.js";
import { Sdb } from "./src/Sdb.js";

const board = new Board();
const smode = new Smode();
const smemo = new Smemo();

// ---------------------------- //
const sdb = new Sdb("sudoku", "myData", makeSelectTable);
function dbClear() { sdb.dbClear(); }
function dbAdd(label, data, note, done) { sdb.dbAdd(label, data, note, done); }
function dbDelete(key) { htDbDelete(key); sdb.dbDelete(key); }
function dbUpdate(key, index, data) { htDbupdate(key, index, data); sdb.dbUpdate(key, index, data); }

let htDb;
let error = false;
let fedit = false;
let fdelete = false;
let dbSelectedRow = null;
let latest_sum = 0;

const image_up = '&nbsp;&nbsp;▲▽';
const image_down = '&nbsp;&nbsp;△▼';
const image_none = '&nbsp;&nbsp;▲▼';

window.download = function download() {
    if (fedit || fdelete) return;
    sdb.download(exeDownload);
}

window.onload = function () {
    for (let i = 0; i < 9; i++) {
        document.getElementById("td" + i).innerHTML = makeCells(i);
    }
    for (let i = 0; i < 3; i++) {
        document.getElementById("inp" + i).innerHTML = makeKeys(i);
    }
    document.getElementById('fileinput').addEventListener('change', fileInput);
    document.getElementById('fileinput').addEventListener('click', clearFilePath);
    updateAll();
}

function fileInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
        dbUpload(reader.result);
    };
    reader.onerror = (event) => {
        console.log(reader.error);
    };
}

function clearFilePath(e) {
    this.value = null;
}

function htDbupdate(key, index, data) {
    htDb.forEach((line, i) => {
        if (Number(key) == line[1]) {
            htDb[i][index + 1] = data;
        }
    });
}

function htDbDelete(key) {
    for (let i = 0; i < htDb.length; i++) {
        if (Number(key) == htDb[i][1]) {
            htDb.splice(i, 1);
            return;
        }
    }
}

window.upload = upload;
function upload() {
    if (fedit || fdelete) return;
    document.getElementById("fileinput").click();
}

function exeDownload(result) {
    let data = "";
    result.forEach(line => {
        let l = "\"" + line.data1 + "\"";
        l += ", \"" + line.data2 + "\"";
        l += ", \"" + line.data3 + "\"";
        l += ", \"" + line.data4 + "\"";
        data += l + "\r\n";
    });
    const filename = "sudoku.csv";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], { type: "text/csv" });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}

function dbUpload(data) {
    const arr = data.split('\r\n');
    let dt = [];
    arr.forEach(line => {
        let dt0 = line.split("\", \"");
        dt0.forEach((d, index) => {
            dt0[index] = d.replace("\"", "");
        });
        if (dt0.length > 1) {
            dt.push(dt0);
        }
    });
    dbClear();
    dt.forEach(line => {
        dbAdd(line[0], line[1], line[2], line[3]);
    });
}

function makeSelectTable(data, keys) {
    htDb = [];
    data.forEach((line, index) => {
        htDb.push([index, keys[index], line.data1, line.data2, line.data3, line.data4]);
    });

    makeSelectTableHtml(htDb, image_none, image_none, image_none);

    const obj = document.getElementById("seltbl");
    const bottom = obj.scrollHeight - obj.clientHeight;
    obj.scrollTop = bottom;
    const row = htDb.length;
    if (row > 0) {
        selectRow(row);
    }
}

function makeSelectTableHtml(data, sort1, sort2, sort3) {
    let ht = "<table id=\"table1\">";
    ht += "<thead><tr>";
    ht += "<th style=\"display:none;\">key</th>";
    ht += "<th onclick=\"onclickTh(this)\">label" + sort1 + "</th>";
    ht += "<th style=\"display:none;\">data</th>";
    ht += "<th onclick=\"onclickTh(this)\">note" + sort2 + "</th>";
    ht += "<th onclick=\"onclickTh(this)\">done" + sort3 + "</th>";
    ht += "</tr></thead>";
    ht += "<tbody>";
    data.forEach(line => {
        ht += "<tr>";
        ht += "<td style=\"display:none;\">" + line[1] + "</td>";
        ht += "<td onclick=\"onclickTd(this)\">" + line[2] + "</td>";
        ht += "<td style=\"display:none;\">" + line[3] + "</td>";
        ht += "<td onclick=\"onclickTd(this)\">" + line[4] + "</td>";
        ht += "<td onclick=\"onclickTd(this)\">" + line[5] + "</td>";
        ht += "</tr>";
    });
    ht += "</tbody>";
    ht += "</table>";
    document.getElementById("seltbl").innerHTML = ht;
}

window.onclickTh = onclickTh;
function onclickTh(obj) {
    dtclear();
    const index = obj.cellIndex + 1;
    if (obj.innerText.indexOf("▲▽") != -1) {
        htDb.sort(function (a, b) { return (b[index].localeCompare(a[index])); });
        if (index == 2) {
            makeSelectTableHtml(htDb, image_down, image_none, image_none);
        } else if (index == 4) {
            makeSelectTableHtml(htDb, image_none, image_down, image_none);
        } else {
            makeSelectTableHtml(htDb, image_none, image_none, image_down);
        }
    } else {
        htDb.sort(function (a, b) { return (a[index].localeCompare(b[index])); });
        if (index == 2) {
            makeSelectTableHtml(htDb, image_up, image_none, image_none);
        } else if (index == 4) {
            makeSelectTableHtml(htDb, image_none, image_up, image_none);
        } else {
            makeSelectTableHtml(htDb, image_none, image_none, image_up);
        }
    }
}

window.onclickTd = onclickTd;
function onclickTd(obj) {
    if (error) return;
    const key = obj.parentElement.childNodes[0].firstChild.data;
    const cellIndex = obj.cellIndex;
    const str = obj.parentElement.childNodes[2].firstChild.data;
    if (fedit) {
        const text = prompt('label', obj.parentElement.childNodes[cellIndex].firstChild.data);
        if (text !== null) {
            obj.parentElement.childNodes[cellIndex].firstChild.data = text;
            dbUpdate(key, cellIndex, text);
        }
    } else if (fdelete) {
        const result = confirm('Do you want to delete it?');
        if (result) {
            const table = document.querySelector("table#table1");
            const row = obj.parentElement.rowIndex;
            table.deleteRow(row);
            dbDelete(key);
        }
    } else {
        const row = obj.parentElement.rowIndex;
        selectRow(row);
    }
}

function selectRow(row) {
    clearSelectRow();
    const table = document.querySelector("table#table1");
    if (table.rows.length > 1 && row > 0) {
        const str = table.rows[row].childNodes[2].firstChild.data;
        board.setOriginal(str);
        memory_out();
        table.rows[row].classList.add('selectedMark');
        dbSelectedRow = row;
    }
}

function clearSelectRow() {
    const elements = document.getElementsByClassName("selectedMark");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('selectedMark');
    }
    dbSelectedRow = null;
}

window.memo = memo;
function memo() {
    if (error) return;
    if (smemo.isMode()) {
        document.getElementById('memo').classList.remove('button_pink');
        smemo.modeOff();
    } else {
        document.getElementById('memo').classList.add('button_pink');
        smemo.modeOn();
    }
    updateAll();
}

window.edit = edit;
function edit() {
    if (error) return;
    if (fedit) {
        document.getElementById('edit').classList.remove('button_pink');
        fedit = false;
    } else {
        document.getElementById('delete').classList.remove('button_pink');
        document.getElementById('edit').classList.add('button_pink');
        fdelete = false;
        fedit = true;
    }
}

window.deletex = deletex;
function deletex() {
    if (error) return;
    if (fdelete) {
        document.getElementById('delete').classList.remove('button_pink');
        fdelete = false;
    } else {
        document.getElementById('edit').classList.remove('button_pink');
        document.getElementById('delete').classList.add('button_pink');
        fedit = false;
        fdelete = true;
    }
}

window.selectbutton = selectbutton;
function selectbutton(obj) {
    if (error) return;
    let str_id = obj.id;
    let temp = str_id.split("_");
    let row = Number(temp[1]);
    let col = Number(temp[2]);
    const n = board.getCell(row, col);
    if (n == 0) {
        smode.setSelected(row, col);
    } else {
        smode.setMarkedNumber(n);
    }
    updateAll();
}

window.setbutton = setbutton;
function setbutton(obj) {
    if (error) return;
    const n = Number(obj.id.split("_")[1]) + 1;
    if (smemo.isMode()) {
        if (smode.isSelected()) {
            const [selected_row, selected_col] = smode.getSelected();
            smemo.add(selected_row, selected_col, n);
            updateAll();
        }
    } else if (smode.isSelected()) {
        const [selected_row, selected_col] = smode.getSelected();
        if (board.getCell(selected_row, selected_col) == 0) {
            error = board.setCell(selected_row, selected_col, n);
        } else {
            smode.setMarkedNumber(n);
        }
    } else {
        smode.setMarkedNumber(n);
    }
    updateAll();
}

window.undo = undo;
function undo() {
    if (smemo.isMode()) return;
    smode.clear();
    const lst = board.getUndo();
    if (lst.length > 1) {
        const row = lst[1][0];
        const col = lst[1][1];
        smode.setSelected(row, col);
    }
    board.clearError(error);
    error = false;
    updateAll();
}

window.redo = redo;
function redo() {
    if (error) return;
    if (smemo.isMode()) return;
    smode.clear();
    const lst = board.getRedo();
    if (lst.length > 0) {
        const row = lst[0][0];
        const col = lst[0][1];
        smode.setSelected(row, col);
    }
    updateAll();
}

window.memory_in = memory_in;
function memory_in() {
    if (error) return;
    if (smemo.isMode()) return;
    let str = board.memIn();
    smode.clear();
    updateAll();
    const date = new Date();
    const formatDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    dbAdd(formatDate, str, "★★★☆☆", "-----");
}

window.memory_out = memory_out;
function memory_out() {
    if (error) return;
    if (smemo.isMode()) return;
    board.memOut();
    smode.clear();
    smemo.clearAll();
    updateAll();
}

window.dtclear = dtclear;
function dtclear() {
    error = false;
    if (smemo.isMode()) {
        if (smode.isSelected()) {
            const [selected_row, selected_col] = smode.getSelected();
            smemo.clear(selected_row, selected_col);
            updateAll();
        }
    } else {
        board.clear();
        smode.clear();
        smemo.clearAll();
        updateAll();
        clearSelectRow();
        latest_sum = 0;
    }
}

function makeCells(n) {
    const col_base = (n % 3) * 3;
    const row_base = Math.floor(n / 3) * 3;
    let ht = "<table><tbody>";
    for (let row = row_base; row < row_base + 3; row++) {
        ht += "<tr>";
        for (let col = col_base; col < col_base + 3; col++) {
            ht += "<td><button id=\"button_" + row + "_" + col + "\" class=\"tbutton\" type=\"button\"  onclick=\"selectbutton(this)\">　</button></td>";
        }
        ht += "</tr>";
    }
    ht += "</tbody></table>"
    return ht;
}

function makeKeys(n) {
    const x = n * 3;
    let ht = "<table><tbody>";
    ht += "<tr>";
    for (let j = x; j < x + 3; j++) {
        ht += "<td><button id=\"num_" + j + "\" class=\"kbutton\" type=\"button\"  onclick=\"setbutton(this)\">" + (j + 1) + "</button></td>";
    }
    ht += "</tr><tr>";
    for (let j = x; j < x + 3; j++) {
        ht += "<td><p id=\"na_" + j + "\" class=\"cellnum\">9</p></td>";
    }
    ht += "</tr>";
    ht += "</tbody></table>"
    return ht;
}

function updateAll() {
    clearCellColor();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const n = board.getCell(row, col);
            if (n == 0) {
                if (smemo.isExists(row, col)) {
                    const ht = document.getElementById('button_' + row + '_' + col).outerHTML;
                    document.getElementById('button_' + row + '_' + col).outerHTML = smemo.getHtml(row, col, ht);
                    document.getElementById('button_' + row + '_' + col).classList.add('button_memo');
                } else {
                    document.getElementById('button_' + row + '_' + col).textContent = "　";
                }
                if (smode.isSelected()) {
                    const [selected_row, selected_col] = smode.getSelected();
                    if (selected_row == row && selected_col == col) {
                        if (smemo.isMode()) {
                            document.getElementById('button_' + row + '_' + col).classList.add('button_chartreuse');
                        } else {
                            document.getElementById('button_' + row + '_' + col).classList.add('button_pink');
                        }
                    }
                }
            } else {
                document.getElementById('button_' + row + '_' + col).textContent = n;
                if (smode.isMarked()) {
                    if (smode.getMarkedNumber() == n) {
                        document.getElementById('button_' + row + '_' + col).classList.add('button_cyan');
                    }
                } else if (smode.isSelected()) {
                    const [selected_row, selected_col] = smode.getSelected();
                    if (selected_row == row && selected_col == col) {
                        if (error) {
                            document.getElementById('button_' + row + '_' + col).classList.add('button_red');
                        } else {
                            document.getElementById('button_' + row + '_' + col).classList.add('button_blue');
                        }
                    } else if (error && n == board.getCell(selected_row, selected_col)) {
                        document.getElementById('button_' + row + '_' + col).classList.add('button_orange');
                    }
                }
                if (board.isOriginal(row, col)) {
                    document.getElementById('button_' + row + '_' + col).classList.add('button_bold');
                }
            }
        }
        const lst = board.listNumberOfTimes();
        let sum = 0;
        lst.forEach((value, index) => {
            document.getElementById('na_' + index).innerHTML = 9 - value;
            sum += value;
        });
        if (latest_sum === 80 && sum === 81 && error === false) {
            const date = new Date();
            const formatDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const table = document.querySelector("table#table1");
            const key = table.rows[dbSelectedRow].childNodes[0].innerText;
            dbUpdate(key, 4, formatDate);
            table.rows[dbSelectedRow].childNodes[4].innerText = formatDate;
        }
        latest_sum = sum;
    }
}

function clearCellColor() {
    const color = ["button_blue", "button_pink", "button_cyan", "button_orange", "button_red", "button_bold", "button_chartreuse", "button_memo"];
    color.forEach(cl => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                document.getElementById('button_' + row + '_' + col).classList.remove(cl);
            }
        }
    });
}
