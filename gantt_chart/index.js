"use strict";
import { Pjcal } from "./src/Pjcal.js";
import { Pjdb } from "./src/Pjdb.js";
import { Pjcvs } from "./src/Pjcvs.js";
import { Pjtbl } from "./src/Pjtbl.js";

const pjcal = new Pjcal("mycalendar");
pjcal.updateDb = (kind, data) => pjdb.updateDb(kind, data);

const pjtbl = new Pjtbl("mytable");
pjtbl.isWorkingDay = (dt) => { return pjcal.isWorkingDay(dt); }
pjtbl.updateDb = (kind, data) => pjdb.updateDb(kind, data);
window.onclickTdCommand = (td) => pjtbl.onclickTdCommand(td);
window.onclickTdText = (td) => pjtbl.onclickTdText(td);
window.onclickTdDate = (td) => pjtbl.onclickTdDate(td);

const pjcvs = new Pjcvs("mycanvas");
pjcvs.isWorkingDay = (dt) => { return pjcal.isWorkingDay(dt); }
pjcvs.getTaskTableData = (tbody, i) => { return pjtbl.getTaskTableData(tbody, i); }

const pjdb = new Pjdb("projects", "myProject", didDbOpen);

let editMode = false;
let progressLineMode = false;

function didDbOpen(data) {
    data.forEach(dt => {
        if (dt.kind == 'task') {
            pjtbl.projectDb = [...dt.data];
        } else if (dt.kind == 'nonWorkingDays') {
            pjcal.nonWorkingDays = [...dt.data];
        } else if (dt.kind == 'WorkingDays') {
            pjcal.WorkingDays = [...dt.data];
        } else if (dt.kind == 'weekWorkingDays') {
            pjcal.weekWorkingDays = [...dt.data];
        } else if (dt.kind == 'projectDates') {
            pjcal.projectDates = dt.data;
        }
    });
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    pjcal.createCalender(year, month);
    if (pjtbl.projectDb.length == 0) { return; }
    pjtbl.makeTableHtml();
    pjcvs.draw(pjcal.projectDates.start, pjcal.projectDates.end, pjcal.projectDates.report, 15, 20, 0, 200, progressLineMode, pjtbl.tbody);
}

function clearTabBodyShow() {
    const tabBody = document.querySelectorAll('.tab_body');
    tabBody.forEach(tabItem => tabItem.classList.remove('is-show'));
}

window.redraw = () => {
    clearTabBodyShow();
    const tabBody1 = document.querySelector('.tab_body_1');
    tabBody1.classList.add("is-show");
    pjtbl.makeTableHtml();
    pjcvs.draw(pjcal.projectDates.start, pjcal.projectDates.end, pjcal.projectDates.report, 15, 20, 0, 200, progressLineMode, pjtbl.tbody);
    showEdit();
    pjtbl.setTableEditMode(editMode);
    pjcvs.drawTableHeadder();
    pjcvs.resizeWindow();
}

window.setCalendar = () => {
    clearTabBodyShow();
    const tabBody1 = document.querySelector('.tab_body_2');
    tabBody1.classList.add("is-show");
}

window.edit = () => {
    editMode = !editMode;
    showEdit();
    pjtbl.setTableEditMode(editMode);
    pjcvs.drawTableHeadder();
    pjcvs.resizeWindow();
}

window.progressLine = () => {
    progressLineMode = !progressLineMode;
    const elem = document.querySelector('#progressLine');
    elem.classList.remove('progressMode');
    if (progressLineMode) elem.classList.add('progressMode');
    redraw();
}

window.onload = function () {
    document.getElementById('fileinput').addEventListener('change', fileInput);
    document.getElementById('fileinput').addEventListener('click', clearFilePath);
    addEventsShift("shiftL");
    addEventsShift("shiftR");
}

function showEdit() {
    let visibility_value = "collapse";
    if (editMode) {
        visibility_value = "visible";
    }
    const elements = document.getElementsByClassName("collapse");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = visibility_value;
    }
}

//-------- file IO -----------------

window.upload = () => document.getElementById("fileinput").click();
function clearFilePath(e) { this.value = null; }
function updateDb(kind, data) { pjdb.updateDb(kind, data); }

function fileInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
        console.log(reader.result);
        dbUpload(reader.result);
    };
    reader.onerror = (event) => {
        console.log(reader.error);
    };
}

function dbUpload(data) {
    const defaultData = {
        task: [],
        nonWorkingDays: [],
        WorkingDays: [],
        weekWorkingDays: [0, 1, 1, 1, 1, 1, 1, 0],
        projectDates: { start: '', end: '', report: '' }
    }
    const cdt = JSON.parse(data);
    if (cdt.task === undefined) {
        updateDb('task', defaultData.task);
    } else {
        updateDb('task', cdt.task);
    }
    if (cdt.nonWorkingDays === undefined) {
        updateDb('nonWorkingDays', cdt.nonWorkingDays);
    } else {
        updateDb('nonWorkingDays', cdt.nonWorkingDays);
    }
    if (cdt.WorkingDays === undefined) {
        updateDb('WorkingDays', defaultData.WorkingDays);
    } else {
        updateDb('WorkingDays', cdt.WorkingDays);
    }
    if (cdt.weekWorkingDays === undefined) {
        updateDb('weekWorkingDays', defaultData.weekWorkingDays);
    } else {
        updateDb('weekWorkingDays', cdt.weekWorkingDays);
    }
    if (cdt.projectDates === undefined) {
        updateDb('weekWorkingDays', defaultData.weekWorkingDays);
    } else {
        updateDb('projectDates', cdt.projectDates);
    }
    pjdb.openDb();
}

window.download = () => {
    const data = {
        task: pjtbl.projectDb,
        nonWorkingDays: pjcal.nonWorkingDays,
        WorkingDays: pjcal.WorkingDays,
        weekWorkingDays: pjcal.weekWorkingDays,
        projectDates: pjcal.projectDates
    }
    const strDate = new Date().toLocaleString('sv-SE').replace(/[-: ]/g, '');
    const filename = `project_${strDate}.json`;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
};

//------ Canvas shift repat operation ------------------------------//

const day_width = 15;
let shift_pitch = 1;
let timeoutID;

function shiftTimeOver(name) {
    timeoutID = setTimeout(function () {
        if (shift_pitch < 28) {
            shift_pitch += 2;
        }
        let n = shift_pitch * day_width;
        if (name == "shiftL") n = 0 - n;
        pjcvs.shiftCalendar(n);
        shiftTimeOver(name);
    }, 100);
}

function shiftTimerStart(event) {
    const name = event.srcElement.id;
    shift_pitch = 1;
    let n = shift_pitch * day_width;
    if (name == "shiftL") n = 0 - n;
    pjcvs.shiftCalendar(n);
    timeoutID = setTimeout(function () { shiftTimeOver(name); }, 600);
}

function shiftClearTimeout() {
    shift_pitch = 0;
    clearTimeout(timeoutID);
}

function addEventsShift(name) {
    const el = document.getElementById(name);
    el.addEventListener("touchstart", function (e) { shiftTimerStart(e) });
    el.addEventListener("mousedown", function (e) { shiftTimerStart(e) });
    el.addEventListener("touchend", shiftClearTimeout);
    el.addEventListener("mouseup", shiftClearTimeout);
    el.addEventListener("touchcancel", shiftClearTimeout);
    el.addEventListener("touchmove", shiftClearTimeout);
    el.addEventListener("mouseout", shiftClearTimeout);
}