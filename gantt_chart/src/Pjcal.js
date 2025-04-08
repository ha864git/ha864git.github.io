'use strict';

export class Pjcal {

    constructor(name) {
        this.name = name;
        this.weekWorkingDays = [0, 1, 1, 1, 1, 1, 0];
        this.nonWorkingDays = [];
        this.WorkingDays = [];
        const newDate = new Date();
        const strDate = newDate.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
        this.projectDates = {
            start: '', end: '', report: strDate
        };
        this.calenderData = {
            id: name,
            year: '',
            month: ''
        }
        this.editingTd = null;
        this.updateDb = null;
        this.#makeCalenderBase(name);
    }

    #makeCalenderBase(name) {
        let ht = `<div id="${name}ProjectDays"></div>`
        ht += `<div id="${name}WeekDays"></div>`
        ht += `<div id="${name}Calender"></div>`
        ht += `<div id="${name}workDays"></div>`
        document.querySelector(`#${name}`).innerHTML = ht;
    }

    isWorkingDay(dt) {
        //const dt = new Date(strDate);
        if (isNaN(dt.getTime())) return false;
        for (let i = 0; i < this.WorkingDays.length; i++) {
            const wd = new Date(this.WorkingDays[i].date);
            if (dt.getTime() == wd.getTime()) return true;
        }
        for (let i = 0; i < this.nonWorkingDays.length; i++) {
            let wd = new Date(this.nonWorkingDays[i].date);
            if (dt.getTime() == wd.getTime()) return false;
        }
        if (this.weekWorkingDays[dt.getDay()] == 0) return false;
        return true;
    }

    storeProjectDates(kind, data) {
        switch (kind) {
            case 'weekWorkingDays':
                this.weekWorkingDays = [...data];
                break;
            case 'nonWorkingDays':
                this.nonWorkingDays = [];
                data.forEach(dt => {
                    this.nonWorkingDays.push({ date: dt[0], note: dt[1] });
                });
                break;
            case 'WorkingDays':
                this.WorkingDays = [];
                data.forEach(dt => {
                    this.WorkingDays.push({ date: dt[0], note: dt[1] });
                });
                break;
            case 'projectDates':
                this.projectDates.start = data[0];
                this.projectDates.end = data[1];
                this.projectDates.report = data[2];
                break;
        }
    }

    createCalender(year, month) {
        this.makeCalendar(year, month);
        this.makeProjectDays();
        this.makeWeekCheckBoxs();
        this.makeWorkTable();
        this.makeWorkDays();
    }

    makeCalendar(year, month) {
        this.calenderData.id = this.name;
        this.calenderData.year = year;
        this.calenderData.month = month;

        let sd = new Date(year, month - 1, 1);
        const startDay = sd.getDay();
        let ed = new Date(year, month, 0);
        const endDayCount = ed.getDate();
        sd.setDate(sd.getDate() - 1);   // 先月の月末日
        const lastMonthEndDayCount = sd.getDate();
        const lastMonth = ('0' + (sd.getMonth() + 1)).slice(-2);
        ed.setDate(ed.getDate() + 1);   // 翌月の月初日
        const lastMonthYear = sd.getFullYear();
        const nextMonth = ('0' + (ed.getMonth() + 1)).slice(-2);
        const nextMonthYear = ed.getFullYear();
        const strMonth = ('0' + month).slice(-2);

        let ht = '<table id="tableCalender"><tbody><tr>';;
        ht += `<td class="clbutton" colspan="2"><button type="button" name="${this.name}previous">前の月</button></td>`;
        ht += `<td class="clym" colspan="3">${year}年${month}月</td>`;
        ht += `<td class="clbutton" colspan="2"><button type="button" name="${this.name}next">次の月</button></td>`;
        ht += '</tr>';

        ht += '<tr>';
        const weeks = ['日', '月', '火', '水', '木', '金', '土']
        weeks.forEach(w => { ht += `<td class="headder">${w}</td>`; });
        ht += '</tr>';

        let dayCount = 1;
        for (let w = 0; w < 6; w++) {
            ht += '<tr>';
            for (let d = 0; d < 7; d++) {
                const strDayCount = ('0' + dayCount).slice(-2);
                if (w == 0 && d < startDay) {
                    let ld = lastMonthEndDayCount - startDay + d + 1;
                    let strld = ('0' + ld).slice(-2);
                    ht += `<td class="week${d} day${lastMonthYear}-${lastMonth}-${strld} invalid" name="${this.name}cday" date="${lastMonthYear}-${lastMonth}-${strld}">${ld}</td>`;
                } else if (dayCount > endDayCount) {
                    let nd = dayCount - endDayCount;
                    let strnd = ('0' + nd).slice(-2);
                    ht += `<td class="week${d} day${nextMonthYear}-${nextMonth}-${strnd} invalid" name="${this.name}cday" date="${nextMonthYear}-${nextMonth}-${strnd}">${nd}</td>`;
                    dayCount++;
                } else {
                    ht += `<td class="week${d} day${year}-${strMonth}-${strDayCount}" name="${this.name}cday" date="${year}-${strMonth}-${strDayCount}">${dayCount}</td>`;
                    dayCount++;
                }
            }
            ht += '</tr>';
            if (dayCount > endDayCount) { w = 6; }
        }
        ht += '</tbody></table>'
        document.querySelector(`#${this.name}Calender`).innerHTML = ht;
        document.querySelector(`[name="${this.name}previous"]`).addEventListener('click', this.previous.bind(this));
        document.querySelector(`[name="${this.name}next"]`).addEventListener('click', this.next.bind(this));
        const cdays = document.querySelectorAll(`[name="${this.name}cday"]`);
        cdays.forEach(cday => {
            cday.addEventListener('click', this.onclickTdDate.bind(this));
        });
        this.updateCalenderWorkingDays();
    }

    onclickTdDate(obj) {
        const strDate = obj.target.attributes.date.value.replaceAll('-', '/');
        console.log(strDate);
        if (this.isCheckedNonWorkingDays()) {
            if (this.nonWorkingDays.findIndex(({ date }) => date === strDate) == -1) {
                this.nonWorkingDays.push({ date: strDate, note: '' });
                this.nonWorkingDays.sort((a, b) => {
                    if (a.date < b.date) {
                        return -1;
                    } else if (a.date > b.date) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                this.updateDb('nonWorkingDays', this.nonWorkingDays);
            }
        } else {
            if (this.WorkingDays.findIndex(({ date }) => date === strDate) == -1) {
                this.WorkingDays.push({ date: strDate, note: '' });
                this.WorkingDays.sort((a, b) => {
                    if (a.date < b.date) {
                        return -1;
                    } else if (a.date > b.date) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                this.updateDb('WorkingDays', this.WorkingDays);
            }
        }
        this.makeWorkDays();
        this.updateCalenderWorkingDays();
    }

    next() {
        if (this.calenderData.id != '') {
            let year = this.calenderData.year;
            let month = this.calenderData.month;
            month += 1;
            if (month > 12) { year += 1; month = 1; }
            this.makeCalendar(year, month);
        }
    }

    previous() {
        if (this.calenderData.id != '') {
            let year = this.calenderData.year;
            let month = this.calenderData.month;
            month -= 1;
            if (month < 1) { year -= 1; month = 12; }
            this.makeCalendar(year, month);
        }
    }

    makeProjectDays() {
        const start = this.projectDates.start.replaceAll('/', '-');
        const end = this.projectDates.end.replaceAll('/', '-');
        const report = this.projectDates.report.replaceAll('/', '-');
        let ht = `<div class="${this.name}inputDates">`
        ht += `<label>開始日</label><input name="start" type="date" value="${start}"/>`
        ht += `<label>終了日</label><input name="end" type="date" value="${end}" />`
        ht += `<label>報告日</label><input name="report" type="date" value="${report}" />`
        ht += '</div>'
        document.querySelector(`#${this.name}ProjectDays`).innerHTML = ht;
        const inputs = document.querySelectorAll(`.${this.name}inputDates > input`);
        inputs.forEach(input => {
            input.addEventListener('change', this.onchangeInputDate.bind(this));
        });
    }

    onchangeInputDate(obj) {
        const data = obj.target.value.replaceAll('-', '/');
        if (obj.target.name == 'start') this.projectDates.start = data;
        if (obj.target.name == 'end') this.projectDates.end = data;
        if (obj.target.name == 'report') this.projectDates.report = data;
        this.updateDb('projectDates', this.projectDates);
    }

    makeWeekCheckBoxs() {
        let ht = '<table id="calendarWeekDays"><tbody>';
        let ht0 = '<tr>';
        let ht1 = '<tr>';
        const weeks = ['日', '月', '火', '水', '木', '金', '土']
        weeks.forEach((w, i) => {
            ht0 += `<td class="headder">${w}</td>`;
            let checked = '';
            if (this.weekWorkingDays[i] == 1) {
                checked = ' checked';
            }
            ht1 += '<td class="weekBx">'
            ht1 += `<input type="checkbox" class="${this.name}weekCheckBox" name="week${i}"${checked}></td>`
        });
        ht0 += '</tr>';
        ht1 += '</tr>';
        ht += ht0 + ht1;
        ht += '</tbody></table>'
        document.querySelector(`#${this.name}WeekDays`).innerHTML = ht;
        const boxs = document.querySelectorAll(`.${this.name}weekCheckBox`);
        boxs.forEach(box => {
            box.addEventListener('change', this.onchangeWeekChekBox.bind(this));
        });
        this.updateCalenderWorkingDays();
    }

    onchangeWeekChekBox(obj) {
        const i = parseInt(obj.target.name.slice(-1));
        const v = obj.target.checked ? 1 : 0;
        this.weekWorkingDays[i] = v;
        this.updateCalenderWorkingDays();
        this.updateDb('weekWorkingDays', this.weekWorkingDays);
    }

    makeWorkTable() {
        let ht = '';
        ht += '<form>';
        ht += '<div class="setdays">';
        ht += '<div class="settingDays">';
        ht += `<input type="radio" name="${this.name}days" value="0" checked="" />休日　　❎:削除`;
        ht += `<div id="${this.name}nonWorkingDays" class="tsel"></div>`;
        ht += '</div>';
        ht += '<div class="settingDays">';
        ht += `<input type="radio" name="${this.name}days" value="1" />休日稼働日　　❎:削除`;
        ht += `<div id="${this.name}WorkingDays" class="tsel"></div>`;
        ht += '</div>';
        ht += '</div>';
        ht += '</form>';
        document.querySelector(`#${this.name}workDays`).innerHTML = ht;
    }

    isCheckedNonWorkingDays() {
        const radios = document.getElementsByName(`${this.name}days`);
        let ans = false;
        radios.forEach((r, i) => { if (r.checked) if (r.value == "0") ans = true; });
        return ans;
    }

    makeWorkDays() {
        let idKey = this.name;

        let ht = '';
        ht += '<table><colgroup><col class="coldel"><col class="coldate"><col class="colmemo"></colgroup>';
        ht += '<tbody>';
        this.nonWorkingDays.forEach(d => {
            ht += '<tr>';
            ht += `<td name="${idKey}DeleteNonWDate">❎</td>`;
            ht += `<td>${d.date}</td>`;
            ht += `<td class="${idKey}tdNote" name="nonWorkingDays">${d.note}</td>`;
            ht += '</tr>';
        });
        document.querySelector(`#${idKey}nonWorkingDays`).innerHTML = ht;

        ht = '';
        ht += '<table><colgroup><col class="coldel"><col class="coldate"><col class="colmemo"></colgroup>';
        ht += '<tbody>';
        this.WorkingDays.forEach(d => {
            ht += '<tr>';
            ht += `<td name="${idKey}DeleteWDate">❎</td>`;
            ht += `<td>${d.date}</td>`;
            ht += `<td class="${idKey}tdNote" name="WorkingDays">${d.note}</td>`;
            ht += '</tr>';
        });
        document.querySelector(`#${idKey}WorkingDays`).innerHTML = ht;
        let nonwtds = document.querySelectorAll(`[name="${idKey}DeleteNonWDate"]`);
        nonwtds.forEach(nonwtd => {
            nonwtd.addEventListener('click', this.deleteNonW.bind(this));
        });
        let wtds = document.querySelectorAll(`[name="${idKey}DeleteWDate"]`);
        wtds.forEach(wtd => {
            wtd.addEventListener('click', this.deleteW.bind(this));
        });
        nonwtds = document.querySelectorAll(`.${idKey}tdNote`);
        nonwtds.forEach(nonwtd => {
            nonwtd.addEventListener('click', this.onclickTd.bind(this));
        });
    }

    deleteNonW(obj) {
        let strDate = obj.target.parentNode.cells[1].innerHTML;
        this.nonWorkingDays = this.nonWorkingDays.filter(function (x) { return x.date != strDate });
        this.makeWorkDays();
        this.updateCalenderWorkingDays();
        this.updateDb('nonWorkingDays', this.nonWorkingDays);
    }

    deleteW(obj) {
        let strDate = obj.target.parentNode.cells[1].innerHTML;
        this.WorkingDays = this.WorkingDays.filter(function (x) { return x.date != strDate });
        this.makeWorkDays();
        this.updateCalenderWorkingDays();
        this.updateDb('WorkingDays', this.WorkingDays);
    }

    onclickTd(obj) {
        if (!this.editingTd) {
            this.editingTd = {
                td: obj.target,
                preData: obj.target.innerText,
                index: obj.target.parentElement.rowIndex,
                id: obj.target.parentElement.parentElement.parentElement.parentElement.id,
                name: obj.target.attributes.name.value,
                onblur: this.onblurTd.bind(this)
            };
            obj.target.setAttribute('contenteditable', 'true');
            obj.target.addEventListener('blur', this.editingTd.onblur);
            obj.target.focus();
        }
    }

    onblurTd() {
        const data = this.editingTd.td.innerHTML.replace('<br>', '');
        if (this.editingTd.preData != data) {
            const i = this.editingTd.index;
            if (this.editingTd.name == 'nonWorkingDays') {
                this.nonWorkingDays[i].note = data;
                this.updateDb('nonWorkingDays', this.nonWorkingDays);
            } else if (this.editingTd.id == `${this.name}WorkingDays`) {
                this.WorkingDays[i].note = data;
                this.updateDb('WorkingDays', this.WorkingDays);
            }
        }
        this.editingTd.td.removeAttribute('contenteditable');
        this.editingTd.td.removeEventListener('blur', this.editingTd.onblur);
        this.editingTd = null;
    }

    updateCalenderWorkingDays() {
        this.weekWorkingDays.forEach((w, i) => {
            const q = document.querySelectorAll(`.week${i}`);
            const color = w == 0 ? 'red' : 'black';
            q.forEach(a => { a.style.color = color; });
        });
        this.nonWorkingDays.forEach(d => {
            const strd = d.date.replaceAll('/', '-');
            const q = document.querySelectorAll(`.day${strd}`);
            q.forEach(a => { a.style.color = 'red'; });
        });
        this.WorkingDays.forEach(d => {
            const strd = d.date.replaceAll('/', '-');
            const q = document.querySelectorAll(`.day${strd}`);
            q.forEach(a => { a.style.color = 'black'; });
        });
    }

}
