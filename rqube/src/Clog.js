'use strict';

export class Clog {

    log = [];
    undoCounter = 0;

    constructor() {
        this.log = [];
        this.undoCounter = 0;
        console.log("Clog initialized");
    }

    clear() {
        this.log = [];
        this.undoCounter = 0;
    }

    add(color, angle) {
        while (this.undoCounter > 0) {
            this.log.pop();
            this.undoCounter -= 1;
        }
        this.log.push([color, angle]);
    }

    undo() {
        let answer = [];
        if (this.log.length > 0) {
            if (this.undoCounter < this.log.length) {
                this.undoCounter += 1;
                let wk = [...this.log[this.log.length - this.undoCounter]]
                answer.push(wk);
                answer[0][1] = 0 - answer[0][1];
            }
        }
        return answer;
    }

    redo() {
        let answer = [];
        if (this.log.length > 0) {
            if (this.undoCounter > 0) {
                answer.push(this.log[this.log.length - this.undoCounter]);
                this.undoCounter -= 1;
            }
        }
        return answer;
    }

}
