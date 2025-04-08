'use strict';

export class Pjcvs {

    constructor(name) {
        this.name = name;
        this.calenderYorigin = null;
        this.isWorkingDay = null;
        this.onClickMemoryX = null;
        this.tbody = null;
        this.day_width = 15;
        this.shift_base = 0;
        this.start = 0;
        this.end = 0;
        this.days = 0;
        this.getTaskTableData = null;
        this.#makeProjectCanvas();
    }

    #makeProjectCanvas() {
        let ht = `<canvas id="${this.name}Calendar" width="4000px" height="4000px" class="${this.name}canvas1">Your Browser doesn’t support Canvas.</canvas>`;
        ht += `<canvas id="${this.name}TaskBar" width="4000px" height="4000px" class="${this.name}canvas2">Your Browser doesn’t support Canvas.</canvas>`;
        ht += `<canvas id="${this.name}Headder" width="4000px" height="4000px" class="${this.name}canvash">Your Browser doesn’t support Canvas.</canvas>`;
        ht += `<button id="${this.name}editButton" class="editButton" type="button" onclick="edit()">&#x1f4dd;</button>`;
        const elem = document.querySelector(`#${this.name}`);
        elem.innerHTML = ht;
        elem.classList.add(`${this.name}FrameCanvas`);
        this.#addEventsCanvas(`${this.name}Calendar`);
        window.addEventListener('resize', this.resizeWindow.bind(this));
    }

    draw(start, end, report, day_width, rh, x_origin, y_origin, progressLineMode, tbody) {

        this.tbody = tbody;
        this.day_width = day_width;
        this.calenderYorigin = y_origin + rh * 3;
        this.#updateShift(this.calenderYorigin, tbody);

        const canvasC = document.querySelector(`#${this.name}Calendar`);
        const canvasT = document.querySelector(`#${this.name}TaskBar`);
        const tbody_hight = tbody.getBoundingClientRect().height;
        if (canvasC.getContext && canvasT.getContext) {
            const ctx = canvasC.getContext("2d");
            ctx.clearRect(0, 0, canvasC.width, canvasC.height); // clear
            const ctx2 = canvasT.getContext("2d");
            ctx2.clearRect(0, 0, canvasT.width, canvasT.height);    // clear
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx2.lineWidth = 1;
            ctx2.strokeStyle = "black";

            this.start = start;
            this.end = end;
            const sd = new Date(start);
            const ed = new Date(end);
            this.days = (ed.getTime() - sd.getTime()) / (24 * 60 * 60 * 1000) + 1;

            const weeks = ["日", "月", "火", "水", "木", "金", "土"];

            // fill in white to hide the task bar when scrolling up
            ctx.fillStyle = "white";
            ctx.fillRect(x_origin, 0, this.days * day_width, y_origin + rh * 3);

            //　month loop
            let latest_month = 0;
            let position_month = 0;
            let dt = new Date(start);
            for (let i = 0; i < this.days; i++) {
                let month = dt.getMonth() + 1;
                if (latest_month != month) {
                    const mstr = String(month);
                    const metrics = ctx.measureText(mstr);
                    const offset_position_month = (day_width - metrics.width) / 2;
                    ctx.fillStyle = "black";
                    ctx.fillText(mstr, i * day_width + offset_position_month + x_origin, 15 + y_origin);
                    if (latest_month != 0) {
                        ctx.fillStyle = "white";
                        ctx.strokeRect(position_month * day_width + x_origin, y_origin, (i - position_month) * day_width, rh);
                    }
                    latest_month = month;
                    position_month = i;
                }
                dt.setDate(dt.getDate() + 1);
            }
            ctx.strokeRect(position_month * day_width + x_origin, y_origin, (this.days - position_month) * day_width, rh);

            // date loop
            dt = new Date(start);
            for (let i = 0; i < this.days; i++) {
                const dstr = String(dt.getDate());
                let metrics = ctx.measureText(dstr);
                const offset_position_day = (day_width - metrics.width) / 2;
                const wstr = weeks[dt.getDay()];
                metrics = ctx.measureText(wstr);
                const offset_position_week = (day_width - metrics.width) / 2;
                if (!this.isWorkingDay(dt)) {
                    ctx.fillStyle = "mistyrose";
                    ctx2.fillStyle = "mistyrose";
                } else {
                    ctx.fillStyle = "white";
                    ctx2.fillStyle = "white";
                }
                ctx.fillRect(i * day_width + x_origin, 20 + y_origin, day_width, rh);
                ctx.fillRect(i * day_width + x_origin, 40 + y_origin, day_width, rh);
                ctx2.fillRect(i * day_width + x_origin, 0, day_width, tbody_hight);
                ctx.fillStyle = "black";
                ctx2.fillStyle = "black";
                ctx.strokeRect(i * day_width + x_origin, 20 + y_origin, day_width, rh);
                ctx.strokeRect(i * day_width + x_origin, 40 + y_origin, day_width, rh);
                ctx.fillText(dstr, i * day_width + offset_position_day + x_origin, 35 + y_origin);
                ctx.fillText(wstr, i * day_width + offset_position_week + x_origin, 55 + y_origin);

                if (i > 0) {
                    ctx2.strokeStyle = "rgb(255 165 0 / 50%)";
                    ctx2.lineWidth = 1;
                    ctx2.setLineDash([1, 5]);
                    ctx2.beginPath();
                    ctx2.moveTo(i * day_width + x_origin, 0);
                    ctx2.lineTo(i * day_width + x_origin, tbody_hight);
                    ctx2.stroke();
                    ctx2.setLineDash([]);
                }

                dt.setDate(dt.getDate() + 1);
            }

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(this.days * day_width + x_origin, 60 + y_origin);
            ctx.lineTo(this.days * day_width + x_origin, 60 + y_origin + tbody_hight + 2);
            ctx.stroke();

            for (let i = 0; i < tbody.children.length; i++) {
                ctx2.beginPath();
                ctx2.lineWidth = 1;
                ctx2.strokeStyle = "rgb(0 0 0 / 30%)";
                ctx2.moveTo(x_origin, tbody.children[i].offsetTop - tbody.children[0].offsetTop + tbody.children[i].offsetHeight);
                ctx2.lineTo(x_origin + this.days * day_width, tbody.children[i].offsetTop - tbody.children[0].offsetTop + tbody.children[i].offsetHeight);
                ctx2.stroke();
            }

            for (let i = 0; i < tbody.children.length; i++) {
                const pd = this.getTaskTableData(tbody, i);

                if (pd.pstart != "" && pd.pend != "") {
                    if (pd.duration == "0") {
                        this.#draw_milestone(ctx2, pd.pstart, pd.pend, pd.top, pd.height, pd.task);
                    } else if (pd.duration != "") {
                        this.#draw_bar(ctx2, pd.pstart, pd.pend, pd.duration, pd.top, pd.height, pd.task, pd.percent);
                    } else {
                        this.#draw_sumbar(ctx2, pd.pstart, pd.pend, pd.top, pd.height, pd.task);
                    }
                }
            }
            this.drawTableHeadder();
            if (progressLineMode) this.#drawProgressLine(ctx2, tbody, report);
        }

    }

    drawTableHeadder() {
        const canvasH = document.querySelector(`#${this.name}Headder`);
        if (canvasH.getContext) {
            const ctx = canvasH.getContext("2d");

            // fill in white to hide the calender when scrolling left
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.offsetHeight);

            const table = this.tbody.parentNode;
            const thead = this.tbody.parentNode.children[1];
            const baseX = ctx.canvas.width - table.offsetLeft - thead.offsetWidth - 2;
            const canvasHeight = ctx.canvas.offsetHeight - 1;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";
            for (let i = 0; i < thead.children[0].cells.length; i++) {
                let w = thead.children[0].cells[i].getBoundingClientRect().width;
                let x = thead.children[0].cells[i].offsetLeft;
                let y = thead.children[0].cells[i].offsetTop;
                let str = thead.children[0].cells[i].innerHTML;
                let h = thead.children[0].cells[i].offsetHeight;
                let strMetrics = ctx.measureText(str);
                if (w > 0) {
                    ctx.fillStyle = "#6b6b6b";
                    ctx.fillRect(x + baseX, canvasHeight - h, w, h);
                    ctx.strokeStyle = "#E0E1E3";
                    ctx.strokeRect(x + baseX, canvasHeight - h, w, h);
                    ctx.fillStyle = "white";
                    ctx.font = "14px serif";
                    ctx.strokeStyle = "white";
                    ctx.fillText(str, x + baseX + (w - strMetrics.width) / 2, canvasHeight - h / 3);
                }
            }
            // for Edit mode
            const x0 = thead.children[0].cells[0].offsetLeft;
            const x5 = thead.children[0].cells[5].offsetLeft;
            const h0 = thead.children[0].cells[0].offsetHeight;
            if (x5 > x0) {
                ctx.fillStyle = "#6b6b6b";
                ctx.fillRect(x0 + baseX, canvasHeight - h0, x5 - x0, h0);
                ctx.strokeStyle = "#E0E1E3";
                ctx.strokeRect(x0 + baseX, canvasHeight - h0, x5 - x0, h0);
            }
            const editButton = document.querySelector(`#${this.name}editButton`);
            editButton.style.left = table.offsetLeft + 16 + editButton.width / 2 + 'px';
            editButton.style.top = table.offsetTop + (h0 - editButton.offsetHeight) / 2 - 2 + 'px';
        }
    }

    // イナズマ線描画
    #drawProgressLine(ctx, tbody, report) {
        const progressLineWidth = 4;        // 線幅
        const progressLineColor = 'red';    // 線色
        const strReportDate = report;
        const reportDate = new Date(strReportDate);
        const progressLineBaseX = this.#getPosition(strReportDate) + this.day_width - progressLineWidth / 2;

        let latestPoint = [progressLineBaseX, 0];    // 前回プロット位置設定
        let latestHeight = 0;
        for (let i = 0; i < tbody.children.length; i++) {
            const pd = this.getTaskTableData(tbody, i);

            const cellOffsetTop = tbody.children[i].offsetTop - tbody.children[0].offsetTop;
            const cellOffsetHeight = tbody.children[i].offsetHeight;
            const newY = cellOffsetTop + cellOffsetHeight / 2;
            latestHeight = cellOffsetHeight;

            let newPoint = [progressLineBaseX, newY];       // 新プロット位置デフォルト設定
            if (pd.pstart != "" && pd.pend != "") {
                const planStartDate = new Date(pd.pstart);
                const planEndDate = new Date(pd.pend);
                if (pd.duration == "0") {
                    if (pd.rend != "") {
                        // 完了マイルストーン
                        if (reportDate < planStartDate) {
                            newPoint[0] = this.#getPosition(pd.pstart) + this.day_width / 2;
                        }
                    } else {
                        // 未完了マイルストーン
                        if (planStartDate <= reportDate) {
                            newPoint[0] = this.#getPosition(pd.pstart) + this.day_width / 2;
                        }
                    }
                } else if (pd.duration != "") {
                    if (pd.rend != "") {
                        // 完了タスク
                        if (reportDate < planEndDate) {
                            newPoint[0] = this.#getPosition(pd.pend) + this.day_width;
                        }
                    } else {
                        // 進行タスク
                        if (pd.percent == 0) {
                            if (planStartDate <= reportDate) {
                                newPoint[0] = this.#getPosition(pd.pstart);
                            }
                        } else {
                            const p = parseInt(pd.duration) * parseInt(pd.percent) * this.day_width / 100;
                            newPoint[0] = this.#getPosition(pd.pstart) + p;
                        }
                    }
                }
            }

            ctx.beginPath();
            ctx.lineWidth = progressLineWidth;
            ctx.strokeStyle = progressLineColor;
            ctx.moveTo(...latestPoint);
            ctx.lineTo(...newPoint);
            ctx.stroke();

            latestPoint = [...newPoint];

        }
        let newPoint = [progressLineBaseX, latestPoint[1] + latestHeight / 2];
        ctx.beginPath();
        ctx.lineWidth = progressLineWidth;
        ctx.strokeStyle = progressLineColor;
        ctx.moveTo(...latestPoint);
        ctx.lineTo(...newPoint);
        ctx.stroke();

    }

    #draw_sumbar(ctx, sd, ed, y, h, task) {
        ctx.fillStyle = "rgb(23 116 185)";
        ctx.fillRect(this.#getPosition(sd), y + (3 * h) / 4 - 2, this.#getPosition(ed) + this.day_width - this.#getPosition(sd), 4);
        ctx.font = "14px serif";
        ctx.strokeStyle = "black";
        ctx.strokeText(task, this.#getPosition(sd) + 2, y + h / 2 + 2);
    }

    #draw_milestone(ctx, sd, ed, y, h, task) {
        ctx.fillStyle = "rgb(23 116 185)";
        ctx.beginPath();
        ctx.moveTo(this.#getPosition(sd) + 2, y + h / 2);
        ctx.lineTo(this.#getPosition(sd) + this.day_width / 2, y + 8);
        ctx.lineTo(this.#getPosition(sd) + this.day_width - 2, y + h / 2);
        ctx.lineTo(this.#getPosition(sd) + this.day_width / 2, y + h - 8);
        ctx.fill();

        ctx.font = "14px serif";
        ctx.strokeStyle = "black";
        ctx.strokeText(task, this.#getPosition(sd) + this.day_width + 2, y + h / 2 + 4);
    }

    #draw_bar(ctx, sd, ed, days, y, h, task, percent) {
        ctx.fillStyle = "rgb(211 232 251)";
        if (percent == "100%") ctx.fillStyle = "black";
        ctx.fillRect(this.#getPosition(sd), y + h / 2 - 7, this.#getPosition(ed) + this.day_width - this.#getPosition(sd), 16);

        if (percent != "" && percent != "100%") {
            const p = parseInt(percent);
            ctx.fillStyle = "rgb(0 121 218)";
            const l = parseInt(days) * p / 100;
            const ln = parseInt(l);
            const lm = (l - ln) * this.day_width;
            const le = this.getEndDate(sd, ln + 1);
            ctx.fillRect(this.#getPosition(sd), y + h / 2 - 7, this.#getPosition(le) + lm - this.#getPosition(sd), 16);
        }

        ctx.strokeStyle = "rgb(168 201 218)";
        ctx.strokeRect(this.#getPosition(sd), y + h / 2 - 7, this.#getPosition(ed) + this.day_width - this.#getPosition(sd), 16);

        ctx.font = "14px serif";
        ctx.strokeStyle = "darkblue";
        ctx.strokeText(task, this.#getPosition(ed) + this.day_width + 2, y + (3 * h) / 4);
    }

    #addEventsCanvas(name) {
        const el = document.querySelector(`#${name}`);
        el.addEventListener("touchstart", this.#onClickCanvas.bind(this));
        el.addEventListener("mousedown", this.#onClickCanvas.bind(this));
        el.addEventListener("touchend", this.#offClickCanvas.bind(this));
        el.addEventListener("mouseup", this.#offClickCanvas.bind(this));
        el.addEventListener("touchcancel", this.#offClickCanvas.bind(this));
        el.addEventListener("touchmove", this.#offClickCanvas.bind(this));
        el.addEventListener("mouseout", this.#offClickCanvas.bind(this));
    }

    #onClickCanvas(event) {
        this.onClickMemoryX = event.clientX;
    }

    #offClickCanvas(event) {
        if (this.onClickMemoryX != null && this.tbody != null) {
            let w = this.onClickMemoryX - event.clientX;
            w = Math.floor(w / this.day_width) * this.day_width;
            this.shiftCalendar(w);
        }
        this.onClickMemoryX = null;
    }

    shiftCalendar(n) {
        if (this.tbody == null) return;
        const x = this.tbody.parentNode.offsetLeft + this.tbody.getBoundingClientRect().width;
        const can = document.querySelector(`.${this.name}canvas1`);
        const can2 = document.querySelector(`.${this.name}canvas2`);
        const w = document.body.clientWidth;
        const plotw = this.day_width * this.days;
        this.shift_base += n;
        if (this.shift_base < 0) {
            this.shift_base = 0;
        }
        if (w - x > plotw - this.shift_base) {
            this.shift_base = plotw + x - w;
            this.shift_base = Math.ceil(this.shift_base / this.day_width) * this.day_width;
        }
        can.style.left = (x - this.shift_base) + 1 + "px";
        can2.style.left = (0 - this.shift_base) + "px";
    }

    resizeWindow() {
        if (this.tbody != null) {
            this.#updateShift(this.calenderYorigin, this.tbody);
        }
    }

    #updateShift(y_origin, tbody) {
        let x = tbody.parentNode.offsetLeft + tbody.getBoundingClientRect().width + 1;
        let y = tbody.parentNode.offsetTop + tbody.offsetTop;
        const can1 = document.querySelector(`.${this.name}canvas1`);
        const canF = document.querySelector(`.${this.name}FrameCanvas`);
        const canH = document.querySelector(`.${this.name}canvash`);
        canF.style.left = `${x}px`;
        canF.style.top = `${y}px`;
        can1.style.left = `${x}px`;
        can1.style.top = (y - y_origin - 1) + "px";
        canH.style.left = (x - 4000) + "px";
        canH.style.top = (y - 4000) + "px";
    }

    #getPosition(str_date) {
        const sd = new Date(this.start);
        const cd = new Date(str_date);
        let leftp = 0;
        if (sd.getTime() < cd.getTime()) {
            leftp = (cd.getTime() - sd.getTime()) / (24 * 60 * 60 * 1000) * this.day_width;
            return leftp;
        }
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

}