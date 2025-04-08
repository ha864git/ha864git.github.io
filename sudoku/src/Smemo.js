export class Smemo {

    smemo = [];
    mode = false;

    constructor() {
        this.smemo = [];
        for (let i = 0; i < 9; i++) {
            this.smemo.push([[], [], [], [], [], [], [], [], []])
        }
        this.mode = false;
        console.log("Smemo initialized");
    }

    modeOn() {
        this.mode = true;
    }

    modeOff() {
        this.mode = false;
    }

    isMode() {
        return this.mode;
    }

    clearAll() {
        this.smemo = [];
        for (let i = 0; i < 9; i++) {
            this.smemo.push([[], [], [], [], [], [], [], [], []])
        }
        this.mode = false;
    }

    add(row, column, number) {
        if (this.smemo[row][column].includes(number)) return;
        if (this.smemo[row][column].length >= 4) return;
        this.smemo[row][column].push(number);
        this.smemo[row][column].sort();
    }

    clear(row, column) {
        this.smemo[row][column] = [];
    }

    get(row, column) {
        return this.smemo[row][column];
    }

    isExists(row, column) {
        return (this.smemo[row][column].length > 0);
    }

    getHtml(row, column, outerHTML) {
        const outerHTMLs = outerHTML.split(">")[0] + ">";
        const outerHTMLe = "<" + outerHTML.split("<").slice(-1)[0];
        let innerHTML = "";
        for (let i = 0; i < this.smemo[row][column].length; i++) {
            if (i == 2) {
                innerHTML += "<br>";
            } else if (i > 0) {
                innerHTML += "&nbsp;";
            }
            innerHTML += this.smemo[row][column][i];
        }
        for (let i = this.smemo[row][column].length; i < 4; i++) {
            if (i == 2) {
                innerHTML += "<br>";
            } else if (i > 0) {
                innerHTML += "&nbsp;";
            }
            innerHTML += "&nbsp;";
        }
        return (outerHTMLs + innerHTML + outerHTMLe);
    }

}
