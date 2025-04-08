'use strict';

export class Pjtbl {

    #tbl;

    constructor(name) {
        this.name = name;
        this.tblid = null;
        this.makeTable(name);
        this.#tbl = { level: 4, task: 5, staff: 6, pstart: 7, duration: 8, pend: 9, rstart: 10, rend: 11, percent: 12 };
        this.isWorkingDay = null;
        this.editingTd = null;
        this.updateDb = null;
        this.tbody = null;
        this.projectDb = [];
    }

    getTaskTableData(tbody, i) {
        const tbl = this.#tbl;
        const answer = {};
        answer.task = tbody.children[i].cells[tbl.task].innerHTML;
        answer.level = tbody.children[i].cells[tbl.level].innerHTML;
        answer.pstart = tbody.children[i].cells[tbl.pstart].innerHTML;
        answer.pend = tbody.children[i].cells[tbl.pend].innerHTML;
        answer.duration = tbody.children[i].cells[tbl.duration].innerHTML;
        answer.rstart = tbody.children[i].cells[tbl.rstart].innerHTML;
        answer.rend = tbody.children[i].cells[tbl.rend].innerHTML;
        answer.percent = tbody.children[i].cells[tbl.percent].innerHTML;
        answer.top = tbody.children[i].offsetTop - tbody.children[0].offsetTop;
        answer.height = tbody.children[i].offsetHeight;
        return answer;
    }

    makeTable(name) {
        this.tblid = `${this.name}taskTable`
        let ht = '';
        ht += `<table id="${this.tblid}" class="table01">`;
        ht += '<colgroup></colgroup><thead></thead><tbody></tbody>'
        ht += '</table>';
        ht += `<form id="${this.name}date-picker">`;
        ht += '<div class="nativeDatePicker">';
        ht += '<input type="date" id="pday" name="pday" />';
        ht += '<span class="validity"></span>';
        ht += '</div>';
        ht += '</form>';
        document.querySelector(`#${name}`).innerHTML = ht;
    }

    makeTableHtml() {
        const tbl = this.#tbl;

        const tcol = document.querySelector(`#${this.name}taskTable > colgroup`);
        let ht = "";
        ht += "<tr>";
        ht += "<col class=\"collapse\">";
        ht += "<col class=\"collapse\">";
        ht += "<col class=\"collapse\">";
        ht += "<col class=\"collapse\">";
        ht += "<col style=\"visibility: collapse;\">";
        ht += "<col>";
        ht += "<col>";
        ht += "<col>";
        ht += "<col>";
        ht += "<col>";
        ht += "<col>";
        ht += "<col>";
        ht += "<col>";
        ht += "</tr>";
        tcol.innerHTML = ht;

        const thead = document.querySelector(`#${this.name}taskTable > thead`);
        this.thead = thead;
        ht = "";
        ht += "<tr>";
        ht += "<th class=\"cmdline\"></th>";
        ht += "<th class=\"cmdline\"></th>";
        ht += "<th class=\"cmdline\"></th>";
        ht += "<th class=\"cmdline\"></th>";
        ht += "<th class=\"level\"></th>";
        ht += "<th class=\"task\">タスク</th>";
        ht += "<th class=\"staff\">担当</th>";
        ht += "<th class=\"date\">計画開始日</th>";
        ht += "<th class=\"duration\">日数</th>";
        ht += "<th class=\"date\">計画終了日</th>";
        ht += "<th class=\"date\">実績開始日</th>";
        ht += "<th class=\"date\">実績終了日</th>";
        ht += "<th class=\"percent\">進捗</th>";
        ht += "</tr>";
        thead.innerHTML = ht;

        // ガントチャートデータテーブルを作成しtbodyに設定する

        const tbody = document.querySelector(`#${this.name}taskTable > tbody`);
        this.tbody = tbody;

        // 元データ分のテーブル行を作成する
        ht = "";
        for (let i = 0; i < this.projectDb.length; i++) {
            ht += "<tr>";
            ht += this.makeLineHtml();
            ht += "</tr>";
        }
        tbody.innerHTML = ht;


        let start_dates = ["", "", "", "", "", "", ""];
        let end_dates = ["", "", "", "", "", "", ""];
        let end_index = [0, 0, 0, 0, 0, 0, 0];
        let error = false;

        this.projectDb.forEach((dbt, i) => {

            if (!error) {
                const level = this.checkLevel(dbt.level);
                if (level >= 0) {
                    tbody.children[i].cells[tbl.level].innerHTML = level;
                    tbody.children[i].cells[tbl.task].innerHTML = dbt.task;
                    this.setTaskLevel(tbody.children[i].cells[tbl.task], level);

                    if (dbt.staff != undefined) {
                        tbody.children[i].cells[tbl.staff].innerHTML = dbt.staff;
                    }

                    tbody.children[i].cells[tbl.pstart].classList.remove("autoValue");
                    let str_st_date = dbt.pstart;
                    const dt = new Date(str_st_date);
                    if (!isNaN(dt.getTime())) {
                        tbody.children[i].cells[tbl.pstart].innerHTML = str_st_date;
                        const duration = parseInt(dbt.duration);
                        if (!isNaN(duration)) {
                            tbody.children[i].cells[tbl.duration].innerHTML = duration;
                        } else if (dbt.duration == "") {
                            start_dates[level] = str_st_date;
                            end_index[level] = i;
                            for (let i = level + 1; i < start_dates.length; i++) {
                                start_dates[i] = "";
                                end_dates[i] = "";
                            }
                        } else {
                            tbody.children[i].cells[tbl.task].innerHTML = "Error: duration?";
                            error = true;
                        }
                    } else if (str_st_date == "") {
                        if (end_dates[level] != "") {
                            str_st_date = this.getEndDate(end_dates[level], "2");
                            tbody.children[i].cells[tbl.pstart].innerHTML = str_st_date;
                            tbody.children[i].cells[tbl.pstart].classList.add("autoValue");
                        } else if (start_dates[level - 1] != "") {
                            str_st_date = start_dates[level - 1];
                            tbody.children[i].cells[tbl.pstart].innerHTML = str_st_date;
                            tbody.children[i].cells[tbl.pstart].classList.add("autoValue");
                        } else {
                            tbody.children[i].cells[tbl.task].innerHTML = "Error: planStartDate?";
                            error = true;
                        }
                        const duration = parseInt(dbt.duration);
                        if (!isNaN(duration)) {
                            tbody.children[i].cells[tbl.duration].innerHTML = duration;
                        } else if (dbt.duration == "" && str_st_date != "") {
                            start_dates[level] = str_st_date;
                            end_index[level] = i;
                            for (let i = level + 1; i < start_dates.length; i++) {
                                start_dates[i] = "";
                                end_dates[i] = "";
                            }
                        } else {
                            // duration Error
                        }
                    } else {
                        // strat date Error
                    }

                    tbody.children[i].cells[tbl.pend].classList.remove("autoValue");
                    const str_start_e = tbody.children[i].cells[tbl.pstart].innerHTML;
                    const str_days_e = tbody.children[i].cells[tbl.duration].innerHTML;
                    if (str_days_e != "" && str_start_e != "") {
                        const str_end_date = this.getEndDate(str_start_e, str_days_e);
                        tbody.children[i].cells[tbl.pend].innerHTML = str_end_date;
                        tbody.children[i].cells[tbl.pend].classList.add("autoValue");
                        end_dates[level] = str_end_date;
                        for (let i = level - 1; i > 0; i--) {
                            end_dates[i] = str_end_date;
                            tbody.children[end_index[i]].cells[tbl.pend].innerHTML = str_end_date;
                            tbody.children[end_index[i]].cells[tbl.pend].classList.add("autoValue");
                        }
                    }

                    tbody.children[i].cells[tbl.percent].classList.remove("autoValue");
                    if (dbt.rstart != "") {
                        tbody.children[i].cells[tbl.rstart].innerHTML = dbt.rstart;
                        if (dbt.rend != "") {
                            tbody.children[i].cells[tbl.rend].innerHTML = dbt.rend;
                            tbody.children[i].cells[tbl.percent].innerHTML = 100 + "%";
                            tbody.children[i].cells[tbl.percent].classList.add("autoValue");
                        } else if (dbt.percent != "") {
                            const percent = parseInt(dbt.percent);
                            if (!isNaN(percent)) {
                                tbody.children[i].cells[tbl.percent].innerHTML = percent + "%";
                            }
                        }
                    }
                } else {
                    tbody.children[i].cells[tbl.task].innerHTML = "Error: level?";
                    error = true;
                }

            }

        });

    }

    setTableEditMode(editMode) {
        const tbody = this.tbody;
        const table = tbody.parentElement;
        const trlen = tbody.children.length;
        if (editMode) {
            if (trlen <= this.projectDb.length) {
                table.insertRow(trlen + 1);
                const newtr = tbody.children[trlen];
                newtr.innerHTML = '<td class="cmdline lastline" onclick="onclickTdCommand(this)">➕</td>';
            }
        } else {
            if (trlen > this.projectDb.length) {
                table.deleteRow(trlen);
            }
        }
    }

    makeLineHtml() {
        let ht = '';
        ht += '<td class="cmdline" onclick="onclickTdCommand(this)">➕</td>';
        ht += '<td class="cmdline" onclick="onclickTdCommand(this)">❎</td>';
        ht += '<td class="cmdline" onclick="onclickTdCommand(this)">⬅️</td>';
        ht += '<td class="cmdline" onclick="onclickTdCommand(this)">➡️</td>';
        ht += '<td class="level">1</td>';
        ht += '<td class="task" onclick="onclickTdText(this)">new task</td>';
        ht += '<td class="staff" onclick="onclickTdText(this)"></td>';
        ht += '<td class="date" name="planStart" onclick="onclickTdDate(this)"></td>';
        ht += '<td class="duration" onclick="onclickTdText(this)"></td>';
        ht += '<td class="date" name="planEnd" onclick="onclickTdDate(this)"></td>';
        ht += '<td class="date" name="resultStart" onclick="onclickTdDate(this)"></td>';
        ht += '<td class="date" name="resultEnd" onclick="onclickTdDate(this)"></td>';
        ht += '<td class="percent" onclick="onclickTdText(this)"></td>';
        return ht;
    }

    checkLevel(level) {
        const n = parseInt(level);
        if (isNaN(n)) return -1;
        if (n > 9 || n < 0) return -1;
        return n;
    }

    setTaskLevel(td, level) {
        for (let l = 1; l <= 5; l++) {
            td.classList.remove("lev" + l);
        }
        td.classList.add("lev" + level);
    }

    getEndDate(str_start, str_days) {
        const dt = new Date(str_start);
        if (isNaN(dt.getTime())) return "";
        let n = parseInt(str_days);
        if (isNaN(n)) return "";
        while (n > 0) {
            if (this.isWorkingDay(dt)) {
                n -= 1;
            }
            if (n > 0) {
                dt.setDate(dt.getDate() + 1);
            }
        }
        return dt.toLocaleDateString("ja-JP", {
            year: "numeric", month: "2-digit",
            day: "2-digit"
        })
    }

    //テキスト設定  HTML5標準Datepickerをセルの前面に表示、フォーカスが離れたときに値を保存
    onclickTdText(td) {
        const tbl = this.#tbl;
        if (td.cellIndex == tbl.percent && td.parentElement.cells[tbl.rstart].innerText == "") return;
        // 進捗の入力を禁止：実績開始日の記入が無いとき
        if (td.cellIndex == tbl.percent && td.parentElement.cells[tbl.rend].innerText != "") return;
        // 進捗の入力を禁止：実績終了日の記入が有るときは進捗は100%とみなす
        if (td.cellIndex == tbl.rstart && td.parentElement.cells[tbl.pstart].innerText == "") return;
        // 実績開始日の記入を禁止：計画開始日の記入が無いとき
        if (td.cellIndex == tbl.rend && td.parentElement.cells[tbl.rstart].innerText == "") return;
        // 実績終了日の記入を禁止：実績開始日の記入が無いとき
        if (td.cellIndex == tbl.pend) return;
        // 計画終了日の記入を禁止：全て（日数で定義する）

        if (!this.editingTd) {
            this.editingTd = {         // Td内容を保存
                elem: td,
                preData: td.innerText,
                index: td.parentElement.rowIndex,
                id: td.parentElement.parentElement.parentElement.parentElement.id
            };
            if (td.className.includes('percent')) {     // 進捗率のセルは%文字を削除
                td.innerText = td.innerText.slice(0, -1);
            }
            td.setAttribute('contenteditable', 'true');     // セルを編集可能にする
            td.focus();                                     // フォーカス設定
            td.onblur = this.tdTextOnblur.bind(this);       // フォーカスが離れたときの処理を登録 
        }
    }

    tdTextOnblur(obj) {      // セルからフォーカスが離れたときの処理
        const data = this.editingTd.elem.innerHTML.replace('<br>', '');
        if (this.editingTd.preData != data) {
            const i = this.editingTd.index - 1;
            const cname = this.editingTd.elem.className;
            if (cname.includes('task')) {               // 担当者
                this.projectDb[i].task = data;
                this.updateDb('task', this.projectDb);
            } else if (cname.includes('staff')) {       // 担当者
                this.projectDb[i].staff = data;
                this.updateDb('task', this.projectDb);
            } else if (cname.includes('duration')) {     // 期間
                const n = parseInt(data);
                if (isNaN(n)) {
                    this.editingTd.elem.innerHTML = this.editingTd.preData;
                } else if (n >= 0) {
                    this.editingTd.elem.innerHTML = String(n);
                    this.projectDb[i].duration = String(n);
                    this.updateDb('task', this.projectDb);
                } else {
                    this.editingTd.elem.innerHTML = this.editingTd.preData;
                }
            } else if (cname.includes('percent')) {     // 進捗率
                const n = parseInt(data);
                if (isNaN(n)) {
                    this.editingTd.elem.innerHTML = this.editingTd.preData;
                } else if (n > 0 && n < 100) {
                    this.editingTd.elem.innerHTML = String(n) + '%';
                    this.projectDb[i].percent = String(n);
                    this.updateDb('task', this.projectDb);
                } else {
                    this.editingTd.elem.innerHTML = this.editingTd.preData;  // 1～99以外は前の値に戻す、100は完了日を入れることを前提
                }
            }
        }
        this.editingTd.elem.removeAttribute('contenteditable');     // セル編集可能を解除
        this.editingTd = null;                                      // Td保存を削除
    }

    //日付設定  HTML5標準Datepickerをセルの前面に表示、フォーカスが離れたときに値を保存
    onclickTdDate(td) {
        const tbl = this.#tbl;
        if (td.cellIndex == tbl.rstart && td.parentElement.cells[tbl.pstart].innerText == "") return;
        // 実績開始日の記入を禁止：計画開始日の記入が無いとき
        if (td.cellIndex == tbl.rend && td.parentElement.cells[tbl.rstart].innerText == "") return;
        // 実績終了日の記入を禁止：実績開始日の記入が無いとき
        if (td.cellIndex == tbl.pend) return;
        // 計画終了日の記入を禁止：全て（日数で定義する）
        if (!this.editingTd) {
            this.editingTd = {         // Td内容を保存
                elem: td,
                preData: td.innerText,
                index: td.parentElement.rowIndex,
                id: td.parentElement.parentElement.parentElement.parentElement.id
            };
            this.setDatePicker(td);         // Datepickerの設定
        }
    }

    setDatePicker(td) {     // Datepickerの設定
        const dp = document.querySelector(`#${this.name}date-picker`);
        dp.style.left = (td.offsetLeft - 8) + "px";             // 横位置設定
        dp.style.top = (td.offsetTop - 0) + "px";               // 上位置設定
        dp.style.visibility = 'visible';                        // 表示状態に変更
        let str = this.getInputDateFormat(td.innerHTML);                    // セルの内容をyyyy-mm-ddに変換
        if (this.editingTd.elem.className.includes("autoValue")) str = '';  // 自動計算値は空白にする
        const input = document.querySelector("#pday");
        input.value = str;                                      // Datepickerへ値を設定
        input.focus();                                          // フォーカスを設定
        input.onblur = this.inputDateOnblur.bind(this);         // フォーカスが離れたときの処理を登録
    }

    inputDateOnblur(obj) {      // Datepickerからフォーカスが離れたときの処理
        const nd = obj.target.value.replaceAll('-', '/');       // yyyy-mm-dd を yyyy/mm/dd に変換
        obj.target.value = '';                                  // 次に使う為に日付をクリア
        if (nd == '' && this.editingTd.elem.className.includes('autoValue')) {  // 自動計算の場合は前の値に戻す
            this.editingTd.elem.innerHTML = editingTd.preData;
        } else {
            this.editingTd.elem.innerHTML = nd;                 // 新し値をセルに設定
            this.editingTd.elem.classList.remove('autoValue');  // 自動計算を解除
        }
        const tdName = this.editingTd.elem.attributes.name.value;   // セルの名前取得
        const i = this.editingTd.elem.parentElement.rowIndex - 1;   // セルの行番号取得
        switch (tdName) {
            case 'planStart':
                this.projectDb[i].pstart = nd;
                break;
            case 'planEnd':
                this.projectDb[i].pend = nd;
                break;
            case 'resultStart':
                this.projectDb[i].rstart = nd;
                break;
            case 'resultEnd':
                this.projectDb[i].rend = nd;
                break;
        }
        this.updateDb('task', this.projectDb);      // IndexDBへ保存
        this.editingTd = null;                      // Td保存をクリア
        document.querySelector(`#${this.name}date-picker`).style.visibility = 'hidden';  // Datepickerを隠す
    }

    getInputDateFormat(str) {       // yyyy/mm/dd を yyyy-mm-dd に変換
        const dt = new Date(str);
        if (!isNaN(dt.getTime())) {
            str = dt.toLocaleDateString("ja-JP", {
                year: "numeric", month: "2-digit",
                day: "2-digit"
            }).replaceAll('/', '-');
        } else {
            str = '';
        }
        return str
    }

    onclickTdCommand(td) {
        const tbl = this.#tbl;
        const tr = td.parentElement;
        const tbody = tr.parentElement;
        const table = tbody.parentElement;
        let row = tr.rowIndex;
        switch (td.innerText) {
            case "➕":  // 行挿入
                let pstart = '';
                let level = 1;
                if (tbody.children.length !== 1) {
                    if (td.className.includes('lastline')) {
                        if (tbody.children.length > 1) {
                            pstart = tbody.children[row - 2].cells[tbl.pstart].innerHTML;   // 開始日を最後の行に合わせる
                            if (tbody.children[row - 2].cells[tbl.pstart].className.includes("autoValue")) pstart = '';
                            level = tbody.children[row - 2].cells[tbl.level].innerHTML;   // タスクレベルを最後の行に合わせる      
                        }
                    } else {
                        pstart = tbody.children[row - 1].cells[tbl.pstart].innerHTML;   // 開始日は上の行に合わせる
                        if (tbody.children[row - 1].cells[tbl.pstart].className.includes("autoValue")) pstart = '';
                        level = tbody.children[row - 1].cells[tbl.level].innerHTML;   // タスクレベルを上の行に合わせる   
                    }
                }
                table.insertRow(row);
                const newtr = tbody.children[row - 1];
                newtr.innerHTML = this.makeLineHtml();
                newtr.cells[tbl.level].innerHTML = level;
                this.setTaskLevel(newtr.cells[tbl.task], level);                     // タスクインデント設定
                const insertdata = {
                    task: 'new task',
                    level: level,
                    duration: '',
                    pstart: pstart,
                    pend: '',
                    rstart: '',
                    rend: '',
                    percent: '',
                    staff: ''
                };
                this.projectDb.splice(row - 1, 0, insertdata);
                this.updateDb('task', this.projectDb);
                break;
            case "❎":  //  行削除
                table.deleteRow(row);
                this.projectDb.splice(row - 1, 1);
                this.updateDb('task', this.projectDb);
                break;
            case "⬅️":
                let n = parseInt(tr.cells[tbl.level].innerHTML);
                if (isNaN(n)) {
                    tr.cells[tbl.level].innerHTML = "1"
                } else {
                    if (n > 1) {
                        tr.cells[tbl.level].innerHTML = String(n - 1);
                        this.setTaskLevel(tr.cells[tbl.task], n - 1);
                    }
                }
                this.projectDb[row - 1].level = tr.cells[tbl.level].innerHTML;
                this.updateDb('task', this.projectDb);
                break;
            case "➡️":
                let m = parseInt(tr.cells[tbl.level].innerHTML);
                if (isNaN(m)) {
                    tr.cells[tbl.level].innerHTML = "1"
                } else {
                    if (m < 5) {
                        tr.cells[tbl.level].innerHTML = String(m + 1);
                        this.setTaskLevel(tr.cells[tbl.task], m + 1);
                    }
                }
                this.projectDb[row - 1].level = tr.cells[tbl.level].innerHTML;
                this.updateDb('task', this.projectDb);
                break;
        }
    }


}