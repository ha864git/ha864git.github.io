'use strict';

// Little cube

export class Lcube {

    constructor() {
        this.state = 1;     // 小方体（小立方体）状態 初期値：1
        this.numbr = 0;     // シリアル番号保存領域：1-27（使用側に依存）
        this.surfaces = []; // 表示面管理領域 [top, bottom, east, west, south, north] 
    }

    defSurface = { top: 0, bottom: 1, east: 2, west: 3, south: 4, north: 5 };

    // 小方体の状態を実現するtransform rotate script
    #rotates = [
        'rotateY(90deg)',                   // WN:0
        '',                                 // SN:1
        'rotateY(-90deg)',                  // EN:2	
        'rotateY(180deg)',                  // NN:3	
        'rotateX(-90deg)',                  // TN:4	
        'rotateX(90deg)',                   // BN:5	
        'rotateY(90deg) rotateX(180deg)',   // WS:6	
        'rotateZ(180deg)',                  // SS:7	
        'rotateY(-90deg) rotateX(180deg)',  // ES:8	
        'rotateY(180deg) rotateZ(180deg)',  // NS:9	
        'rotateX(-90deg) rotateY(180deg)',  // TS:10	
        'rotateX(90deg) rotateY(180deg)',   // BS:11	
        'rotateY(90deg) rotateX(-90deg)',   // WE:12	
        'rotateZ(90deg)',                   // SE:13	
        'rotateY(-90deg) rotateX(90deg)',   // EE:14	
        'rotateY(180deg) rotateZ(-90deg)',  // NE:15	
        'rotateX(-90deg) rotateY(-90deg)',  // TE:16	
        'rotateX(90deg) rotateY(90deg)',    // BE:17	
        'rotateY(90deg) rotateX(90deg)',    // WW:18	
        'rotateZ(-90deg)',                  // SW:19	
        'rotateY(-90deg) rotateX(-90deg)',  // EW:20	
        'rotateY(180deg) rotateZ(90deg)',   // NW:21	
        'rotateX(-90deg) rotateY(90deg)',   // TW:22	
        'rotateX(90deg) rotateY(-90deg)'    // BW:23
    ];

    // x,y,zの+-90degで状態遷移先番号
    #px_change = [17, 5, 23, 11, 1, 9, 16, 10, 22, 4, 3, 7, 13, 14, 15, 12, 2, 8, 21, 18, 19, 20, 0, 6];  // rotateX(90deg)
    #mx_change = [22, 4, 16, 10, 9, 1, 23, 11, 17, 5, 7, 3, 15, 12, 13, 14, 6, 0, 19, 20, 21, 18, 8, 2];  // rotateX(-90deg)
    #py_change = [3, 0, 1, 2, 12, 18, 7, 8, 9, 6, 14, 20, 11, 17, 5, 23, 13, 21, 10, 22, 4, 16, 15, 19];  // rotateY(90deg)
    #my_change = [1, 2, 3, 0, 20, 14, 9, 6, 7, 8, 18, 12, 4, 16, 10, 22, 21, 13, 5, 23, 11, 17, 19, 15];  // rotateY(-90deg)
    #pz_change = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];  // rotateZ(90deg)
    #mz_change = [18, 19, 20, 21, 22, 23, 12, 13, 14, 15, 16, 17, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];  // rotateZ(-90deg)

    // 小方体状態を実現するtransform rotate scriptを返します
    getTransformRotates() {
        return this.#rotates[this.state];
    }

    // 面番号を指定すると小方体の回転前の面番号（面色）を返します
    getSurface(surface) {
        return this.stateColors[surface][this.state];
    }

    rotateLcubeX(deg) {
        switch (deg) {
            case 90:
                this.state = this.#px_change[this.state];
                break;
            case 180:
                this.state = this.#px_change[this.state];
                this.state = this.#px_change[this.state];
                break;
            case 270:
                this.state = this.#px_change[this.state];
                this.state = this.#px_change[this.state];
                this.state = this.#px_change[this.state];
                break;
            case -90:
                this.state = this.#mx_change[this.state];
                break;
            case -180:
                this.state = this.#mx_change[this.state];
                this.state = this.#mx_change[this.state];
                break;
            case -270:
                this.state = this.#mx_change[this.state];
                this.state = this.#mx_change[this.state];
                this.state = this.#mx_change[this.state];
                break;
            default:
                break;
        }
    }

    rotateLcubeY(deg) {
        switch (deg) {
            case 90:
                this.state = this.#py_change[this.state];
                break;
            case 180:
                this.state = this.#py_change[this.state];
                this.state = this.#py_change[this.state];
                break;
            case 270:
                this.state = this.#py_change[this.state];
                this.state = this.#py_change[this.state];
                this.state = this.#py_change[this.state];
                break;
            case -90:
                this.state = this.#my_change[this.state];
                break;
            case -180:
                this.state = this.#my_change[this.state];
                this.state = this.#my_change[this.state];
                break;
            case -270:
                this.state = this.#my_change[this.state];
                this.state = this.#my_change[this.state];
                this.state = this.#my_change[this.state];
                break;
            default:
                break;
        }
    }

    rotateLcubeZ(deg) {
        switch (deg) {
            case 90:
                this.state = this.#pz_change[this.state];
                break;
            case 180:
                this.state = this.#pz_change[this.state];
                this.state = this.#pz_change[this.state];
                break;
            case 270:
                this.state = this.#pz_change[this.state];
                this.state = this.#pz_change[this.state];
                this.state = this.#pz_change[this.state];
                break;
            case -90:
                this.state = this.#mz_change[this.state];
                break;
            case -180:
                this.state = this.#mz_change[this.state];
                this.state = this.#mz_change[this.state];
                break;
            case -270:
                this.state = this.#mz_change[this.state];
                this.state = this.#mz_change[this.state];
                this.state = this.#mz_change[this.state];
                break;
            default:
                break;
        }
    }

    // 小方体の各状態における各面の回転前の面番号（色指定番号）
    stateColors = [
        [0, 0, 0, 0, 5, 4, 1, 1, 1, 1, 4, 5, 5, 3, 4, 2, 3, 3, 4, 2, 5, 3, 2, 2],   // 0:Top
        [1, 1, 1, 1, 4, 5, 0, 0, 0, 0, 5, 4, 4, 2, 5, 3, 2, 2, 5, 3, 4, 2, 3, 3],   // 1:Bottom
        [4, 2, 5, 3, 2, 2, 5, 3, 4, 2, 3, 3, 0, 0, 0, 0, 5, 4, 1, 1, 1, 1, 4, 5],   // 2:East
        [5, 3, 4, 2, 3, 3, 4, 2, 5, 3, 2, 2, 1, 1, 1, 1, 4, 5, 0, 0, 0, 0, 5, 4],   // 3:West
        [3, 4, 2, 5, 0, 1, 3, 4, 2, 5, 0, 1, 3, 4, 2, 5, 0, 1, 3, 4, 2, 5, 0, 1],   // 4:South
        [2, 5, 3, 4, 1, 0, 2, 5, 3, 4, 1, 0, 2, 5, 3, 4, 1, 0, 2, 5, 3, 4, 1, 0]    // 5:North
    ];

    // 小方体の各状態における各面の文字方向
    stateRotate = [
        [270, 0, 90, 180, 180, 0, 270, 180, 90, 0, 180, 0, 90, 90, 90, 90, 180, 0, 270, 270, 270, 270, 180, 0],   // 0:Top
        [90, 0, 270, 180, 0, 180, 90, 180, 270, 0, 0, 180, 90, 90, 90, 90, 0, 180, 270, 270, 270, 270, 0, 180],   // 1:Bottom
        [0, 0, 0, 0, 270, 90, 180, 180, 180, 180, 270, 90, 0, 90, 180, 270, 270, 90, 0, 270, 180, 90, 270, 90],   // 2:East
        [0, 0, 0, 0, 90, 270, 180, 180, 180, 180, 90, 270, 180, 90, 0, 270, 90, 270, 180, 270, 0, 90, 90, 270],   // 3:West
        [0, 0, 0, 0, 0, 0, 180, 180, 180, 180, 180, 180, 90, 90, 90, 90, 90, 90, 270, 270, 270, 270, 270, 270],   // 4:South
        [0, 0, 0, 0, 180, 180, 180, 180, 180, 180, 0, 0, 270, 270, 270, 270, 90, 90, 90, 90, 90, 90, 270, 270]    // 5:North
    ]

}