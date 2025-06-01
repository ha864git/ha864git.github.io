'use strict';

import { Lcube } from "./Lcube.js";

// Rubik's Cube 

export class Rcube {

    colors = ['yellow', 'white', 'green', 'blue', 'red', 'orange'];

    // 小キューブ構成するデータ
    faces = ["top", "bottom", "right", "left", "front", "back"];

    // 小キューブを配置する位置データ [translateX,translateY,translateZ]
    transrates = [
        [
            [[-150, -150, 50], [-50, -150, 50], [50, -150, 50]],
            [[-150, -50, 50], [-50, -50, 50], [50, -50, 50]],
            [[-150, 50, 50], [-50, 50, 50], [50, 50, 50]]
        ],
        [
            [[-150, -150, -50], [-50, -150, -50], [50, -150, -50]],
            [[-150, -50, -50], [-50, -50, -50], [50, -50, -50]],
            [[-150, 50, -50], [-50, 50, -50], [50, 50, -50]]
        ],
        [
            [[-150, -150, -150], [-50, -150, -150], [50, -150, -150]],
            [[-150, -50, -150], [-50, -50, -150], [50, -50, -150]],
            [[-150, 50, -150], [-50, 50, -150], [50, 50, -150]]
        ]
    ];

    transrates_north = [
        [[-150, -150, -600], [-50, -150, -600], [50, -150, -600]],
        [[-150, -50, -600], [-50, -50, -600], [50, -50, -600]],
        [[-150, 50, -600], [-50, 50, -600], [50, 50, -600]]
    ];

    transrates_bottom = [
        [[-150, 600, 50], [-50, 600, 50], [50, 600, 50]],
        [[-150, 600, -50], [-50, 600, -50], [50, 600, -50]],
        [[-150, 600, -150], [-50, 600, -150], [50, 600, -150]]
    ];

    transrates_west = [
        [[-540, -150, 50], [-540, -150, -50], [-540, -150, -150]],
        [[-540, -50, 50], [-540, -50, -50], [-540, -50, -150]],
        [[-540, 50, 50], [-540, 50, -50], [-540, 50, -150]]
    ];

    surfaceNumber = [
        // [Top, Bottom, East, West, South, North]
        // 0,1,2,3,4,5,6,7,8: (Display Number - 1)   -1: No Display 
        [
            [[6, -1, -1, 2, 0, -1], [7, -1, -1, -1, 1, -1], [8, -1, 0, -1, 2, -1]],
            [[-1, -1, -1, 5, 3, -1], [-1, -1, -1, -1, 4, -1], [-1, -1, 3, -1, 5, -1]],
            [[-1, 0, -1, 8, 6, -1], [-1, 1, -1, -1, 7, -1], [-1, 2, 6, -1, 8, -1]]
        ],
        [
            [[3, -1, -1, 1, -1, -1], [4, -1, -1, -1, -1, -1], [5, -1, 1, -1, -1, -1]],
            [[-1, -1, -1, 4, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, -1, 4, -1, -1, -1]],
            [[-1, 3, -1, 7, -1, -1], [-1, 4, -1, -1, -1, -1], [-1, 5, 7, -1, -1, -1]]
        ],
        [
            [[0, -1, -1, 0, -1, 2], [1, -1, -1, -1, -1, 1], [2, -1, 2, -1, -1, 0]],
            [[-1, -1, -1, 3, -1, 5], [-1, -1, -1, -1, -1, 4], [-1, -1, 5, -1, -1, 3]],
            [[-1, 6, -1, 6, -1, 8], [-1, 7, -1, -1, -1, 7], [-1, 8, 8, -1, -1, 6]]
        ]
    ];

    constructor() {
        this.bigcube = [];
        this.state = new Lcube();
        this.clear();
    }

    getTransformRotates() {
        return this.state.getTransformRotates();
    }

    rotateWcubeX(deg) {
        this.state.rotateLcubeX(deg);
    }

    rotateWcubeY(deg) {
        this.state.rotateLcubeY(deg);
    }

    rotateWcubeZ(deg) {
        this.state.rotateLcubeZ(deg);
    }

    clear() {
        this.bigcube = [];
        let n = 1;
        for (let i = 0; i < 3; i++) {
            let w1 = [];
            for (let j = 0; j < 3; j++) {
                let w2 = [];
                for (let k = 0; k < 3; k++) {
                    const lcube = new Lcube();
                    lcube.numbr = n;
                    lcube.surfaces = this.surfaceNumber[i][j][k];
                    w2.push(lcube);
                    n++;
                }
                w1.push(w2);
            }
            this.bigcube.push(w1);
        }
    }

    getFaces(surface) {
        const index = this.colors.indexOf(surface);
        let a = [];
        if (index >= 0) {
            a = [[, ,], [, ,], [, ,]];
            this.surfaceNumber.forEach((l, i) => {
                l.forEach((m, j) => {
                    m.forEach((n, k) => {
                        if (n[index] >= 0) {
                            switch (surface) {
                                case 'yellow':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'white':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'green':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'blue':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'red':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'orange':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                            }
                        }
                    });
                });
            });
        }
        let b = [];
        const colorCode = ['Y', 'W', 'G', 'B', 'R', 'O']
        a.forEach((row, r) => {
            let work = [...row];
            row.forEach((col, c) => {
                const color = colorCode[col.stateColors[index][col.state]];
                const number = col.surfaces[col.stateColors[index][col.state]] + 1;
                const angle = col.stateRotate[index][col.state];
                work[c] = [color, number, angle];
            });
            b.push(work);
        });
        return b;
    }

    // 面構成（ルービックキューブ表面の番号）取得 
    getCubes(surface) {
        const index = this.colors.indexOf(surface);
        let a = [];
        if (index >= 0) {
            a = [[, ,], [, ,], [, ,]];
            this.surfaceNumber.forEach((l, i) => {
                l.forEach((m, j) => {
                    m.forEach((n, k) => {
                        if (n[index] >= 0) {
                            switch (surface) {
                                case 'yellow':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'white':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'green':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'blue':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'red':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'orange':
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                            }
                        }
                    });
                });
            });
        }
        return a;
    }

    // 色指定面回転：時計回転 CW（ClockWise）
    fcw(surface) {
        const index = this.colors.indexOf(surface);
        if (index >= 0) {
            let a = [[, ,], [, ,], [, ,]];
            this.surfaceNumber.forEach((l, i) => {
                l.forEach((m, j) => {
                    m.forEach((n, k) => {
                        if (n[index] >= 0) {
                            switch (surface) {
                                case 'yellow':
                                    this.bigcube[i][j][k].rotateLcubeY(-90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'white':
                                    this.bigcube[i][j][k].rotateLcubeY(90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'green':
                                    this.bigcube[i][j][k].rotateLcubeX(90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'blue':
                                    this.bigcube[i][j][k].rotateLcubeX(-90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'red':
                                    this.bigcube[i][j][k].rotateLcubeZ(90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'orange':
                                    this.bigcube[i][j][k].rotateLcubeZ(-90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                            }
                        }
                    });
                });
            });
            const na = this.cw(a);
            this.surfaceNumber.forEach((l, i) => {
                l.forEach((m, j) => {
                    m.forEach((n, k) => {
                        if (n[index] >= 0) {
                            this.bigcube[i][j][k] = na[Math.floor(n[index] / 3)][n[index] % 3];
                        }
                    });
                });
            });
        }
    }

    // 色指定面回転：反時計回転 CCW（CounterClockWise)
    fccw(surface) {
        const index = this.colors.indexOf(surface);
        if (index >= 0) {
            let a = [[, ,], [, ,], [, ,]];
            this.surfaceNumber.forEach((l, i) => {
                l.forEach((m, j) => {
                    m.forEach((n, k) => {
                        if (n[index] >= 0) {
                            switch (surface) {
                                case 'yellow':
                                    this.bigcube[i][j][k].rotateY(90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'white':
                                    this.bigcube[i][j][k].rotateY(-90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'green':
                                    this.bigcube[i][j][k].rotateX(-90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'blue':
                                    this.bigcube[i][j][k].rotateX(90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'red':
                                    this.bigcube[i][j][k].rotateZ(-90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                                case 'orange':
                                    this.bigcube[i][j][k].rotateZ(90);
                                    a[Math.floor(n[index] / 3)][n[index] % 3] = this.bigcube[i][j][k];
                                    break;
                            }
                        }
                    });
                });
            });
            const na = this.ccw(a);
            this.surfaceNumber.forEach((l, i) => {
                l.forEach((m, j) => {
                    m.forEach((n, k) => {
                        if (n[index] >= 0) {
                            this.bigcube[i][j][k] = na[Math.floor(n[index] / 3)][n[index] % 3];
                        }
                    });
                });
            });
        }
    }

    // 配列回転
    cw = a => a[0].map((_, c) => a.map(r => r[c]).reverse());
    ccw = a => a[0].map((_, c) => a.map(r => r[c])).reverse();

}