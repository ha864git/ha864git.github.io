'use strict';

import { Rcube } from "./src/Rcube.js";
import { Clog } from "./src/Clog.js";

const rcube = new Rcube();
const clog = new Clog();

let isNumberDisplay = false;
let isAlphabetDisplay = false;

function updateMirrors() {
    document.querySelector('#westMirror').outerHTML = make_west_html(rcube);
    document.querySelector('.rotate-westMirror').style.transform = `rotateX(-${rcube.state.stateRotate[rcube.state.defSurface.west][rcube.state.state]}deg)`;
    document.querySelector('#northMirror').outerHTML = make_north_html(rcube);
    document.querySelector('.rotate-northMirror').style.transform = `rotateZ(-${rcube.state.stateRotate[rcube.state.defSurface.north][rcube.state.state]}deg)`;
    document.querySelector('#bottomMirror').outerHTML = make_bottom_html(rcube);
    document.querySelector('.rotate-bottomMirror').style.transform = `rotateY(${rcube.state.stateRotate[rcube.state.defSurface.bottom][rcube.state.state]}deg)`;
}

window.cwy = function cwy() {
    rcube.rotateWcubeY(90);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

window.ccwy = function ccwy() {
    rcube.rotateWcubeY(-90);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

window.cwx = function cwx() {
    rcube.rotateWcubeX(90);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

window.ccwx = function ccwx() {
    rcube.rotateWcubeX(-90);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

window.cwz = function cwz() {
    rcube.rotateWcubeZ(90);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

window.ccwz = function ccwz() {
    rcube.rotateWcubeZ(-90);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

// 乱数で面（色）を選択する為のデータ
const colors = ['green', 'blue', 'white', 'yellow', 'red', 'orange'];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const rotates = ['rotateX90', 'rotateXr90', 'rotateY90', 'rotateYr90', 'rotateZ90', 'rotateZr90'];

function set3d() {
    document.querySelector('#rcubeMain').outerHTML = make_rcubeMain_html(rcube);
    document.querySelector('.bigcube2').style.transform = rcube.getTransformRotates();
    updateMirrors();
}

window.nextStep = function () {
    const result = solutionStep1();
    if (result != '') {
        print_log(` - ${result}`);
        execute(result);
    }
    const list = document.getElementById('text_area');
    if (!list.value.endsWith('\n')) list.value = list.value + '\n';
    list.scrollTo(0, list.scrollHeight); // Show the latest line
    list.focus();
}

window.updateN = function () {
    isNumberDisplay = !isNumberDisplay;
    isAlphabetDisplay = !isAlphabetDisplay;
    set3d();
}

window.cubeRotate = (color, angle) => {
    cubeRotate(color, angle);
    const n = cdata.indexOf(color);
    const col = rcube.colors[rcube.state.stateColors[n][rcube.state.state]];
    print_log(` [${clog.log.length}] --- ${col}(${angle})\n`);
}

const cdata = ['top', 'bottom', 'east', 'west', 'north', 'south'];

window.cubeClear = () => cubeClear();
function cubeClear() {
    rcube.clear();
    set3d();
    clog.clear();
    updateLogCounter();
    print_clear();
}

function cubeRotate(color, angle) {
    cbRotate(color, angle);
    clog.add(color, angle);
    updateLogCounter();
}

function cbRotate(color, angle) {
    switch (color) {
        case 'bottom':
            color = rcube.colors[rcube.state.getSurface(rcube.state.defSurface.bottom)];
            break;
        case 'west':
            color = rcube.colors[rcube.state.getSurface(rcube.state.defSurface.west)];
            break;
        case 'east':
            color = rcube.colors[rcube.state.getSurface(rcube.state.defSurface.east)];
            break;
        case 'north':
            color = rcube.colors[rcube.state.getSurface(rcube.state.defSurface.north)];
            break;
        case 'south':
            color = rcube.colors[rcube.state.getSurface(rcube.state.defSurface.south)];
            break;
        case 'top':
            color = rcube.colors[rcube.state.getSurface(rcube.state.defSurface.top)];
            break;
        default:
            break;
    }
    if (angle === 90) {
        rcube.fcw(color);
    } else if (angle === -90) {
        rcube.fcw(color);
        rcube.fcw(color);
        rcube.fcw(color);
    }
    set3d();
}

// 初期htmlを作成
window.onload = function () {
    document.querySelector('#rcubeMain').outerHTML = make_rcubeMain_html(rcube);
    document.querySelector('#westMirror').outerHTML = make_west_html(rcube);
    document.querySelector('#northMirror').outerHTML = make_north_html(rcube);
    document.querySelector('#bottomMirror').outerHTML = make_bottom_html(rcube);
    document.getElementById('text_area').focus();
    executeView(['', 'blue', 'white']);
}

function make_rcubeMain_html(icube) {
    const colorCode = ['Y', 'W', 'G', 'B', 'R', 'O']
    let col = 0;
    let ht = '';    // 回転面をまとめたhtml
    let ht2 = '';   // 非回転部分をまとめたhtml
    ht += '<div id="rcubeMain" class="bigcube2">'
    ht += `<div id="rotate_block" style="width: 300px; height: 300px; position: absolute; transform-style: preserve-3d; `
    ht += `transform-origin: 0px 0px -50px; animation: unset; animation-fill-mode: forwards;">`;
    ht2 += '<div style="width: 300px; height: 300px; position: absolute; transform-style: preserve-3d;">';
    icube.bigcube.forEach((layer, l) => {
        layer.forEach((line, m) => {
            line.forEach((p, n) => {
                let htw = '<div ';
                htw += `style="transform: translateX(${icube.transrates[l][m][n][0]}px) translateY(${icube.transrates[l][m][n][1]}px) translateZ(${icube.transrates[l][m][n][2]}px) `;
                htw += `${p.getTransformRotates()}; `;
                htw += `width: 100px; height: 100px; position: absolute; transform-style: preserve-3d;">`;
                for (let j = 0; j < p.surfaces.length; j++) {
                    let dspn = isNumberDisplay ? p.surfaces[j] + 1 : ''
                    if (p.surfaces[j] >= 0) {
                        if (isAlphabetDisplay && isNumberDisplay) dspn = colorCode[j] + dspn;
                        htw += `<div class="${icube.faces[j]} face">${dspn}</div>`;
                    } else {
                        htw += `<div class="b${icube.faces[j]} face">${dspn}</div>`;
                    }
                }
                htw += '</div>';
                if (icube.surfaceNumber[l][m][n][col] >= 0) {
                    ht += htw;
                } else {
                    ht2 += htw;
                }
                //                i += 1;
            });
        });
    });
    ht += '</div>';
    ht += ht2;
    ht += '</div>';
    ht += '</div>';
    return ht;
}

function make_west_html(icube) {
    let ht = '<div id="westMirror">';
    ht += '<div class="rotate-westMirror">';
    let face = icube.getFaces(icube.colors[rcube.state.getSurface(icube.state.defSurface.west)]);
    face.forEach((line, m) => {
        line.forEach((p, n) => {
            ht += '<div style="transform: ';
            ht += ` translateX(${icube.transrates_west[m][2 - n][0]}px)`;
            ht += ` translateY(${icube.transrates_west[m][2 - n][1]}px)`;
            ht += ` translateZ(${icube.transrates_west[m][2 - n][2]}px)`;
            ht += ` rotateX(-${p[2]}deg); width: 100px; height: 100px; position: absolute; transform-style: preserve-3d;">`;
            let dspn = isNumberDisplay ? p[1] : ''
            if (isAlphabetDisplay && isNumberDisplay) dspn = p[0] + dspn;
            ht += `<div class="rwest c${p[0]} face">${dspn}</div>`;
            ht += '</div>';
        });
    });
    ht += `</div>`;
    ht += `<div style="transform: `;
    ht += ` translateX(${icube.transrates_west[0][0][0] + 40}px)`;
    ht += ` translateY(${icube.transrates_west[0][0][1] - 125}px)`;
    ht += ` translateZ(${icube.transrates_west[0][0][2] + 10}px)`;
    ht += `; width: 300px; height: 300px; position: absolute; transform-style: preserve-3d;">`;
    ht += `<div class="ring3 r3west">`;
    ht += `<img class="img3rotr w3button" src="./img/rotate90.png" onclick="cubeRotate('west',90)">`;
    ht += `<img class="img3rot w3button" src="./img/rotate90.png" onclick="cubeRotate('west',-90)">`;
    ht += `</div>`;
    ht += '</div>';
    ht += '</div>';
    return ht;
}

function make_north_html(icube) {
    let ht = '<div id="northMirror">';
    ht += '<div class="rotate-northMirror">';
    let face = icube.getFaces(icube.colors[rcube.state.getSurface(icube.state.defSurface.north)]);
    face.forEach((line, m) => {
        line.forEach((p, n) => {
            ht += '<div style="transform: ';
            ht += ` translateX(${icube.transrates_north[m][2 - n][0]}px)`;
            ht += ` translateY(${icube.transrates_north[m][2 - n][1]}px)`;
            ht += ` translateZ(${icube.transrates_north[m][2 - n][2]}px)`;
            ht += ` rotateZ(-${p[2]}deg); width: 100px; height: 100px; position: absolute; transform-style: preserve-3d;">`;
            let dspn = isNumberDisplay ? p[1] : ''
            if (isAlphabetDisplay && isNumberDisplay) dspn = p[0] + dspn;
            ht += `<div class="rnorth c${p[0]} face">${dspn}</div>`;
            ht += '</div>';
        });
    });
    ht += `</div>`;
    ht += `<div style="transform: `;
    ht += ` translateX(${icube.transrates_north[0][0][0] + 50}px)`;
    ht += ` translateY(${icube.transrates_north[0][0][1] - 60}px)`;
    ht += ` translateZ(${icube.transrates_north[0][0][2] + 50}px)`;
    ht += `; width: 300px; height: 300px; position: absolute; transform-style: preserve-3d;">`;
    ht += `<div class="ring3 r3north">`;
    ht += `<img class="img3rotr w3button" src="./img/rotate90.png" onclick="cubeRotate('north',90)">`;
    ht += `<img class="img3rot w3button" src="./img/rotate90.png" onclick="cubeRotate('north',-90)">`;
    ht += `</div>`;
    ht += '</div>';
    ht += '</div>';
    return ht;
}


function make_bottom_html(icube) {
    let ht = '<div id="bottomMirror">';
    ht += '<div class="rotate-bottomMirror">';
    let face = icube.getFaces(icube.colors[rcube.state.getSurface(icube.state.defSurface.bottom)]);
    face.forEach((line, m) => {
        line.forEach((p, n) => {
            ht += '<div style="transform: ';
            ht += ` translateX(${icube.transrates_bottom[m][n][0]}px)`;
            ht += ` translateY(${icube.transrates_bottom[m][n][1]}px)`;
            ht += ` translateZ(${icube.transrates_bottom[m][n][2]}px)`;
            ht += ` rotateY(-${p[2]}deg); width: 100px; height: 100px; position: absolute; transform-style: preserve-3d;">`;
            let dspn = isNumberDisplay ? p[1] : ''
            if (isAlphabetDisplay && isNumberDisplay) dspn = p[0] + dspn;
            ht += `<div class="rbottom c${p[0]} face">${dspn}</div>`;
            ht += '</div>';
        });
    });
    ht += `</div>`;
    ht += `<div style="transform: `;
    ht += ` translateX(${icube.transrates_bottom[1][0][0] + 60}px)`;
    ht += ` translateY(${icube.transrates_bottom[1][0][1] - 200}px)`;
    ht += ` translateZ(${icube.transrates_bottom[1][0][2] + 70}px)`;
    ht += `; width: 300px; height: 300px; position: absolute; transform-style: preserve-3d;">`;
    ht += `<div class="ring3 r3bottom">`;
    ht += `<img class="img3rotr w3button" src="./img/rotate90.png" onclick="cubeRotate('bottom',-90)">`;
    ht += `<img class="img3rot w3button" src="./img/rotate90.png" onclick="cubeRotate('bottom',90)">`;
    ht += `</div>`;
    ht += '</div>';
    ht += '</div>';
    return ht;
}

//-----------------------------------

document.getElementById('text_area').addEventListener('keydown', enterKeyPress);

function enterKeyPress(e) {
    if (e.key === 'Enter') {
        const text_area = document.getElementById('text_area');
        const lines = text_area.value.split('\n');
        const line = lines[lines.length - 1];
        execute(line);
    }
}

function execute(line) {
    line = line.replace(/^\s+/, ""); // 左トリム
    line = line.replace(/\s+$/, ""); // 右トリム
    const chars = [...line];
    const args = line.split(' ');
    if (args.length == 0) return;
    if (args[0] == 'view' || args[0] == 'v') {
        executeView(args);
        return;
    }
    if (line === 'clear' || args[0] == 'c') {
        console.log('clear');
        cubeClear();
        return;
    }
    if (line === 'shuffle' || args[0] == 's') {
        console.log('shuffle');
        shuffle();
        return;
    }
    if (line === 'x') {
        const result = solutionStep1();
        if (result != '') {
            print_log(` - ${result}`);
            execute(result);
        }
        return;
    }
    if (args[0] === 'n') {
        updateN();
        return;
    }
    chars.forEach(c => {
        executeOne(c);
    });
}

function convertColor(color) {
    if (color === 'r') return 'red';
    if (color === 'b') return 'blue';
    if (color === 'w') return 'white';
    if (color === 'g') return 'green';
    if (color === 'o') return 'orange';
    if (color === 'y') return 'yellow';
    return color;
}

function executeView(args) {
    let top = rcube.colors.indexOf('blue');;
    let front = rcube.colors.indexOf('white');
    if (args.length > 1) {
        const work = rcube.colors.indexOf(convertColor(args[1]));
        if (work >= 0) top = work;
    }
    if (args.length > 2) {
        const work = rcube.colors.indexOf(convertColor(args[2]));
        if (work >= 0) front = work;
    }
    let state = 17;
    for (let i = 0; i < rcube.state.stateColors[rcube.state.defSurface.top].length; i++) {
        if (rcube.state.stateColors[rcube.state.defSurface.top][i] == top) {
            state = i;
        }
        if (rcube.state.stateColors[rcube.state.defSurface.top][i] == top && rcube.state.stateColors[rcube.state.defSurface.south][i] == front) {
            state = i;
            break;
        }
    }
    rcube.state.state = state;
    set3d();
    return;
}

function executeOne(c) {
    const cmdindex = [
        ['R', ['red', 90]],
        ['O', ['orange', 90]],
        ['G', ['green', 90]],
        ['B', ['blue', 90]],
        ['Y', ['yellow', 90]],
        ['W', ['white', 90]],
        ['r', ['red', -90]],
        ['o', ['orange', -90]],
        ['g', ['green', -90]],
        ['b', ['blue', -90]],
        ['y', ['yellow', -90]],
        ['w', ['white', -90]]
    ];
    for (let i = 0; i < cmdindex.length; i++) {
        if (cmdindex[i][0] === c) {
            cubeRotate(cmdindex[i][1][0], cmdindex[i][1][1]);
            print_log(` [${clog.log.length}] --- ${cmdindex[i][1][0]}(${cmdindex[i][1][1]})`);
            return;
        }
    }
    console.log(`?:${c}`);

}

window.undo = function () {
    const data = clog.undo();
    updateLogCounter();
    if (data.length > 0) cbRotate(data[0][0], data[0][1]);
}

window.redo = function () {
    const data = clog.redo();
    updateLogCounter();
    if (data.length > 0) cbRotate(data[0][0], data[0][1]);
}

function updateLogCounter() {
    let count = clog.log.length - clog.undoCounter;
    const lc = document.getElementById('logcount');
    lc.innerText = count;
}

window.shuffle = function () {
    cubeClear();
    clog.clear();
    updateLogCounter();
    for (let i = 0; i < 300; i++) {
        const n = getRandomInt(6);
        cbRotate(colors[n], 90);
    }
}

function print_log(str) {
    const list = document.getElementById('text_area');
    list.value = list.value + '\n' + str;
    list.scrollTo(0, list.scrollHeight); // Show the latest line
    list.focus();
}

function print_clear() {
    const list = document.getElementById('text_area');
    list.value = '';
    list.scrollTo(0, list.scrollHeight); // Show the latest line
    list.focus();
}

function getOtherSideColor(color, surfaces) {
    let wface = [...surfaces];
    wface[color] = -1;
    for (let i = 0; i < wface.length; i++) {
        if (wface[i] >= 0) {
            return i;
        }
    }
    return -1;
}

function getOtherSidesColor(color, surfaces) {
    let wface = [...surfaces];
    wface[color] = -1;
    let ans = [];
    for (let i = 0; i < wface.length; i++) {
        if (wface[i] >= 0) {
            ans.push(i);
        }
    }
    return ans;
}

// Step1
function solutionStep1() {
    const colorIndexTop = rcube.state.stateColors[rcube.state.defSurface.top][rcube.state.state];
    const edges = getEdgesInclude(colorIndexTop);
    const result = edges.filter(d => d[1] == rcube.state.defSurface.top);

    if (result.length == 0) {   // 天面に全く無いとき
        print_log('Step1: The 1st layer cross incomplete');
        print_log(' - No matching edges');
        for (let i = 0; i < edges.length; i++) {
            if (edges[i][1] != rcube.state.defSurface.top && edges[i][1] != rcube.state.defSurface.bottom &&
                edges[i][3] != rcube.state.defSurface.top && edges[i][3] != rcube.state.defSurface.bottom) {
                // 側面にある場合は90度回転
                if (edges[i][1] == getLeftSide(edges[i][3])) return getRotateCW90(edges[i][3]);
                return getRotateCCW90(edges[i][3]);
            }
        }
        for (let i = 0; i < edges.length; i++) {    // 底面にある場合は180度回転
            if (edges[i][1] == rcube.state.defSurface.bottom) return getRotateCW90(edges[i][3]) + getRotateCW90(edges[i][3]);
        }
        for (let i = 0; i < edges.length; i++) {    // 上面の側面にある場合
            if (edges[i][3] == rcube.state.defSurface.top) return getRotateCW90(edges[i][1]) + getRotateCW90(getRightSide(edges[i][1]));
        }
        // 全てが底面の側面にある場合どれでもいいから側面へ移動しTop面へセット
        return getRotateCCW90(rcube.state.defSurface.south) + getRotateCW90(rcube.state.defSurface.east);
    }
    const dirs = [rcube.state.defSurface.north, rcube.state.defSurface.east, rcube.state.defSurface.south, rcube.state.defSurface.west];
    let max_save = [...dirs];
    for (let j = 0; j < 4; j++) {
        let colors = [];
        for (let i = 0; i < 4; i++) {
            const k = dirs[(i + j) % 4];
            colors.push([rcube.colors[colorIndexTop].slice(0, 1).toUpperCase(), rcube.state.defSurface.top,
            rcube.colors[rcube.state.stateColors[k][rcube.state.state]].slice(0, 1).toUpperCase(), dirs[i]]);
        }
        for (let i = 0; i < result.length; i++) {
            colors = colors.filter(d => (d[2] != result[i][2] || d[3] != result[i][3]));
        }
        if (colors.length < max_save.length) {
            max_save = [...colors];
        }
    }
    if (max_save.length == 0) {
        print_log('Step1: The 1st layer cross completed');
        const ans = solutionStep2();
        return ans;
    } else {
        print_log('Step1: The 1st layer cross incomplete')
        for (let i = 0; i < max_save.length; i++) {
            for (let j = 0; j < edges.length; j++) {
                if (max_save[i][2] == edges[j][2] && max_save[i][3] == edges[j][3]) {   // 辺の側面の方向と色が上段の辺と同じ        
                    if (edges[j][3] != rcube.state.defSurface.bottom && edges[j][3] != rcube.state.defSurface.top && edges[j][1] != rcube.state.defSurface.bottom) {
                        // 辺の一方は側面にTop色がある -> 90度回転
                        if (getRightSide(edges[j][3]) == edges[j][1])
                            return getRotateCCW90(edges[j][3]);
                        return getRotateCW90(edges[j][3]);
                    }
                }
            }
        }
        for (let i = 0; i < edges.length; i++) {
            let targetSide = getEdgeSideDir(max_save, edges[i][2]);
            if (targetSide >= 0) {
                if (edges[i][1] == rcube.state.defSurface.bottom) { // 下段の低面にTop色の辺があるとき
                    let commonAnswer = getRotate180(edges[i][3]);
                    if (targetSide == edges[i][3]) return commonAnswer; // 同じ側
                    if (targetSide == getOppositeSide(edges[i][3])) return getRotate180(rcube.state.defSurface.top) + commonAnswer;  // 反対側
                    if (targetSide == getLeftSide(edges[i][3])) return getRotateCCW90(rcube.state.defSurface.top) + commonAnswer; // 左側
                    return getRotateCW90(rcube.state.defSurface.top) + commonAnswer;
                }
                if (edges[i][3] == rcube.state.defSurface.bottom) { // 下段の側面にTop色の辺があるとき
                    let commonAnswer = getRotateCW90(edges[i][1]) + getRotateCW90(rcube.state.defSurface.top) + getRotateCCW90(getLeftSide(edges[i][1]));
                    if (targetSide == edges[i][1]) return commonAnswer; // 同じ側
                    if (targetSide == getOppositeSide(edges[i][1])) return getRotate180(rcube.state.defSurface.top) + commonAnswer; // 反対側
                    if (targetSide == getLeftSide(edges[i][1])) return getRotateCCW90(rcube.state.defSurface.top) + commonAnswer;   // 左側か?
                    return getRotateCW90(rcube.state.defSurface.top) + commonAnswer;
                }
            }
        }
        for (let i = 0; i < edges.length; i++) {
            let targetSide = getEdgeSideDir(max_save, edges[i][2]);
            if (targetSide >= 0) {
                if (edges[i][1] == rcube.state.defSurface.top) {    // 上段のTop面にTop色の辺があるとき
                    if (targetSide == edges[i][3]) return '';       // 側面はセット先と同じ側：既に完成しているので回転不要
                    if (targetSide == getOppositeSide(edges[i][3])) // 反対側
                        return getRotateCW90(edges[i][3]) + getRotateCW90(rcube.state.defSurface.top) + getRotateCW90(rcube.state.defSurface.top) + getRotateCW90(getRightSide(edges[i][3]));
                    if (targetSide == getRightSide(edges[i][3]))    // 左右どちらか
                        return getRotateCW90(edges[i][3]) + getRotateCW90(rcube.state.defSurface.top) + getRotateCCW90(edges[i][3]);
                    return getRotateCCW90(edges[i][3]) + getRotateCCW90(rcube.state.defSurface.top) + getRotateCCW90(edges[i][3]);
                }
                if (edges[i][3] == rcube.state.defSurface.top) {    // 上段の側面にTop色の辺があるとき
                    if (targetSide == edges[i][1])                  // 同じ側
                        return getRotateCW90(edges[i][1]) + getRotateCCW90(rcube.state.defSurface.top) + getRotateCW90(getRightSide(edges[i][1]));
                    if (targetSide == getOppositeSide(edges[i][1])) // 反対側
                        return getRotateCW90(edges[i][1]) + getRotateCW90(rcube.state.defSurface.top) + getRotateCW90(getRightSide(edges[i][1]));
                    if (targetSide == getRightSide(edges[i][1]))    // 左右どちらか
                        return getRotateCW90(edges[i][1]) + getRotateCW90(getRightSide(edges[i][1]));
                    return getRotateCCW90(edges[i][1]) + getRotateCCW90(getLeftSide(edges[i][1]));
                }
            }
        }
        for (let i = 0; i < edges.length; i++) {
            let targetSide = getEdgeSideDir(max_save, edges[i][2]);
            if (targetSide >= 0) {
                if (edges[i][3] != rcube.state.defSurface.bottom && edges[i][3] != rcube.state.defSurface.top) {
                    // 側面にTop色があってその側面の方向と色が合ってない
                    let ans = getRotateCW90(rcube.state.defSurface.top);
                    if (targetSide == getOppositeSide(edges[i][3])) {
                        ans += getRotateCW90(rcube.state.defSurface.top)
                    } else if (targetSide == getLeftSide(edges[i][3])) {
                        ans = getRotateCCW90(rcube.state.defSurface.top);
                    }
                    if (getRightSide(edges[i][3]) == edges[i][1]) {
                        ans += getRotateCCW90(edges[i][3]);
                    } else {
                        ans += getRotateCW90(edges[i][3]);
                    }
                    return ans;
                }
            }
        }
        return '';
    }
}

// Step2: 
function solutionStep2() {
    const colorIndexTop = rcube.state.stateColors[rcube.state.defSurface.top][rcube.state.state];
    const corners = getCornersInclude(colorIndexTop);
    const edges = getEdgesInclude(colorIndexTop);

    let ct = 0;
    edges.forEach(d => {
        if (d[1] == rcube.state.defSurface.top) {
            corners.forEach(c => {
                if (c[1] == rcube.state.defSurface.top && c[3] == d[3] && c[2] == d[2]) ct += 1;
            });
        }
    });
    if (ct == 4) {

        const findColorSouth = rcube.colors[rcube.state.stateColors[rcube.state.defSurface.south][rcube.state.state]].slice(0, 1).toUpperCase();
        const foundedge = edges.filter(d => d[2] === findColorSouth);

        if (foundedge[0][3] != rcube.state.defSurface.south) { // キューブのsouth方向の色と辺のその色の方向が一致しないとき
            if (foundedge[0][3] == getOppositeSide(rcube.state.defSurface.south)) {
                return getRotate180(rcube.state.defSurface.top);
            }
            if (foundedge[3] == getRightSide(rcube.state.defSurface.south))
                return getRotateCW90(rcube.state.defSurface.top);
            return getRotateCCW90(rcube.state.defSurface.top);
        }

        print_log('Step2: The 1st layer corners completed');
        const ans = solutionStep3();
        return ans;
    }
    print_log('Step2: The 1st layer corners incomplete')

    for (let i = 0; i < corners.length; i++) {
        // Step2-1:下段の側面がTop面色でもう一方の側面の色と方向が上段辺側面と一致する場合
        let rotateSide = -1;
        if (corners[i][3] == rcube.state.defSurface.bottom && getEdgeSideColor(edges, corners[i][5]) == corners[i][4]) rotateSide = corners[i][5];
        if (corners[i][5] == rcube.state.defSurface.bottom && getEdgeSideColor(edges, corners[i][3]) == corners[i][2]) rotateSide = corners[i][3];
        if (rotateSide >= 0) {
            // 回転面の方向とTop面色のある面の方向で回転方向を決定
            if ((rotateSide == rcube.state.defSurface.south && corners[i][1] == rcube.state.defSurface.east) ||
                (rotateSide == rcube.state.defSurface.west && corners[i][1] == rcube.state.defSurface.south) ||
                (rotateSide == rcube.state.defSurface.north && corners[i][1] == rcube.state.defSurface.west) ||
                (rotateSide == rcube.state.defSurface.east && corners[i][1] == rcube.state.defSurface.north)
            ) return getRotateCCW90(rotateSide) + getRotateCW90(corners[i][1]) + getRotateCW90(rotateSide) + getRotateCCW90(corners[i][1]);
            return getRotateCW90(rotateSide) + getRotateCCW90(corners[i][1]) + getRotateCCW90(rotateSide) + getRotateCW90(corners[i][1]);
        }
    }

    for (let i = 0; i < corners.length; i++) {
        // Step2-2:上段の側面がTop面色でもう一方の側面の色と方向が上段辺側面と一致する場合
        let otherSide = -1;
        if (corners[i][3] == rcube.state.defSurface.top && getEdgeSideColor(edges, corners[i][5]) == corners[i][4]) otherSide = corners[i][5];
        if (corners[i][5] == rcube.state.defSurface.top && getEdgeSideColor(edges, corners[i][3]) == corners[i][2]) otherSide = corners[i][3];
        if (otherSide >= 0) {
            // 回転面の方向とTop面色のある面の方向で回転方向を決定 ※中央を回転させると2回手順を削減できる
            if ((corners[i][1] == rcube.state.defSurface.south && otherSide == rcube.state.defSurface.east) ||
                (corners[i][1] == rcube.state.defSurface.west && otherSide == rcube.state.defSurface.south) ||
                (corners[i][1] == rcube.state.defSurface.north && otherSide == rcube.state.defSurface.west) ||
                (corners[i][1] == rcube.state.defSurface.east && otherSide == rcube.state.defSurface.north)
            ) return getRotateCW90(corners[i][1]) + getRotateCCW90(getOppositeSide(corners[i][1])) + getRotateCW90(rcube.state.defSurface.bottom)
                + getRotateCW90(getOppositeSide(corners[i][1])) + getRotateCCW90(corners[i][1]);
            return getRotateCCW90(corners[i][1]) + getRotateCW90(getOppositeSide(corners[i][1])) + getRotateCCW90(rcube.state.defSurface.bottom)
                + getRotateCCW90(getOppositeSide(corners[i][1])) + getRotateCW90(corners[i][1]);
        }
    }

    for (let i = 0; i < corners.length; i++) {
        // 底面にTop色があってその一方の側面がTop面の側面色と一致している場合は180度回転させる
        let rotateSide = -1;
        if (corners[i][1] == rcube.state.defSurface.bottom && getEdgeSideColor(edges, corners[i][3]) == corners[i][2]) rotateSide = corners[i][3];
        if (corners[i][1] == rcube.state.defSurface.bottom && getEdgeSideColor(edges, corners[i][5]) == corners[i][4]) rotateSide = corners[i][5];
        if (rotateSide >= 0) {
            // 回転面の方向とTop面色のある面の方向で回転方向を決定
            let otherSide = rotateSide == corners[i][3] ? corners[i][5] : corners[i][3];
            if ((rotateSide == rcube.state.defSurface.south && otherSide == rcube.state.defSurface.east) ||
                (rotateSide == rcube.state.defSurface.west && otherSide == rcube.state.defSurface.south) ||
                (rotateSide == rcube.state.defSurface.north && otherSide == rcube.state.defSurface.west) ||
                (rotateSide == rcube.state.defSurface.east && otherSide == rcube.state.defSurface.north)
            ) return getRotateCCW90(rotateSide) + getRotateCCW90(rotateSide) + getRotateCCW90(getOppositeSide(otherSide))
                + getRotateCW90(rotateSide) + getRotateCW90(rotateSide) + getRotateCW90(getOppositeSide(otherSide))
                + getRotateCW90(otherSide) + getRotateCCW90(rotateSide) + getRotateCCW90(otherSide) + getRotateCW90(rotateSide);
            return getRotateCW90(rotateSide) + getRotateCW90(rotateSide) + getRotateCW90(getOppositeSide(otherSide))
                + getRotateCCW90(rotateSide) + getRotateCCW90(rotateSide) + getRotateCCW90(getOppositeSide(otherSide))
                + getRotateCCW90(otherSide) + getRotateCW90(rotateSide) + getRotateCW90(otherSide) + getRotateCCW90(rotateSide);
        }
    }

    for (let i = 0; i < corners.length; i++) {
        // 上段の側面がTop面色でもう一方の側面とTop面の側面の色が一致しいない場合は下段に降ろす
        let otherSide = -1;
        if (corners[i][3] == rcube.state.defSurface.top) otherSide = corners[i][5];
        if (corners[i][5] == rcube.state.defSurface.top) otherSide = corners[i][3];
        if (otherSide >= 0) {
            const rotateSide = corners[i][1];
            if ((rotateSide == rcube.state.defSurface.south && otherSide == rcube.state.defSurface.east) ||
                (rotateSide == rcube.state.defSurface.west && otherSide == rcube.state.defSurface.south) ||
                (rotateSide == rcube.state.defSurface.north && otherSide == rcube.state.defSurface.west) ||
                (rotateSide == rcube.state.defSurface.east && otherSide == rcube.state.defSurface.north)
            ) return getRotateCW90(rotateSide) + getRotateCW90(rcube.state.defSurface.bottom) + getRotateCCW90(rotateSide);
            return getRotateCCW90(rotateSide) + getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCW90(rotateSide);
        }
    }

    for (let i = 0; i < corners.length; i++) {
        // 上段のTop面がTop面色で側面色が一致していない場合は下段に降ろす
        if (corners[i][1] == rcube.state.defSurface.top &&
            getEdgeSideColor(edges, corners[i][3]) != corners[i][2] &&
            getEdgeSideColor(edges, corners[i][5]) != corners[i][4]) {
            if ((corners[i][3] == rcube.state.defSurface.north && corners[i][5] == rcube.state.defSurface.west) ||
                (corners[i][3] == rcube.state.defSurface.west && corners[i][5] == rcube.state.defSurface.south) ||
                (corners[i][3] == rcube.state.defSurface.south && corners[i][5] == rcube.state.defSurface.east) ||
                (corners[i][3] == rcube.state.defSurface.east && corners[i][5] == rcube.state.defSurface.north))
                return getRotateCW90(corners[i][3]) + getRotateCW90(rcube.state.defSurface.bottom) + getRotateCCW90(corners[i][3]);;
            return getRotateCCW90(corners[i][3]) + getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCW90(corners[i][3]);;
        }
    }

    for (let i = 0; i < corners.length; i++) {
        let targetSide = -1;
        let targetColor = '';
        let edgeSide = -1;
        if (corners[i][3] == rcube.state.defSurface.bottom) {
            targetSide = corners[i][5];
            targetColor = corners[i][4];
        }
        if (corners[i][5] == rcube.state.defSurface.bottom) {
            targetSide = corners[i][3];
            targetColor = corners[i][2];
        }
        if (targetSide >= 0) {
            // 下段の側面がTop面色でもう一方の側面とTop面の側面の色が一致しいない場合は一致する角度に下段を回す
            for (let j = 0; j < edges.length; j++) {
                if (targetColor == edges[j][2]) {
                    edgeSide = edges[j][3];
                }
            }
            if (edgeSide >= 0) {
                // 反対側ならば下段を180度回転
                if (edgeSide == getOppositeSide(targetSide))
                    return (getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(rcube.state.defSurface.bottom));
                // 隣なら下段を90度回転
                if ((edgeSide == rcube.state.defSurface.south && targetSide == rcube.state.defSurface.east) ||
                    (edgeSide == rcube.state.defSurface.west && targetSide == rcube.state.defSurface.south) ||
                    (edgeSide == rcube.state.defSurface.north && targetSide == rcube.state.defSurface.west) ||
                    (edgeSide == rcube.state.defSurface.east && targetSide == rcube.state.defSurface.north)
                ) return getRotateCCW90(rcube.state.defSurface.bottom);
                return getRotateCW90(rcube.state.defSurface.bottom);
            }
        }
    }

    for (let i = 0; i < corners.length; i++) {
        if (corners[i][1] == rcube.state.defSurface.bottom) {
            // 底面がTop面色で側面がTop面の側面の色に一致しいない場合は一致する角度に下段を回す
            let targetSide = corners[i][3];
            let targetColor = corners[i][2];
            let edgeSide = -1;
            for (let j = 0; j < edges.length; j++) {
                if (edges[j][2] == targetColor) {
                    edgeSide = edges[j][3];
                }
            }
            if (edgeSide >= 0) {
                // 反対側ならば下段を180度回転
                if (edgeSide == getOppositeSide(targetSide)) return (getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(rcube.state.defSurface.bottom));
                // 隣なら下段を90度回転
                if ((edgeSide == rcube.state.defSurface.south && targetSide == rcube.state.defSurface.east) ||
                    (edgeSide == rcube.state.defSurface.west && targetSide == rcube.state.defSurface.south) ||
                    (edgeSide == rcube.state.defSurface.north && targetSide == rcube.state.defSurface.west) ||
                    (edgeSide == rcube.state.defSurface.east && targetSide == rcube.state.defSurface.north)
                ) return getRotateCCW90(rcube.state.defSurface.bottom);
                return getRotateCW90(rcube.state.defSurface.bottom);
            }
        }
    }
    return '';
}

// Step3: 
function solutionStep3() {

    const r = [
        [rcube.state.defSurface.south, rcube.state.defSurface.east],
        [rcube.state.defSurface.east, rcube.state.defSurface.north],
        [rcube.state.defSurface.north, rcube.state.defSurface.west],
        [rcube.state.defSurface.west, rcube.state.defSurface.south]
    ];

    for (let i = 0; i < r.length; i++) {
        const fedge = getEdgeIncludes(r[i][0], r[i][1]);
        if (fedge[1] != r[i][0] || fedge[3] != r[i][1]) {
            if (fedge[3] == rcube.state.defSurface.bottom) {
                const ansCommon = getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(r[i][1]) +
                    getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(r[i][1]) +
                    getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(r[i][0]) +
                    getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(r[i][0]);
                if (fedge[1] == r[i][0])
                    return ansCommon;
                if (fedge[1] == getOppositeSide(r[i][0]))
                    return getRotate180(rcube.state.defSurface.bottom) + ansCommon;
                if (fedge[1] == getRightSide(r[i][0]))
                    return getRotateCCW90(rcube.state.defSurface.bottom) + ansCommon;
                return getRotateCW90(rcube.state.defSurface.bottom) + ansCommon;
            }
            if (fedge[1] == rcube.state.defSurface.bottom) {
                const ansCommon = getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(r[i][0]) +
                    getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(r[i][0]) +
                    getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(r[i][1]) +
                    getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(r[i][1]);
                if (fedge[3] == r[i][1])
                    return ansCommon;
                if (fedge[3] == getOppositeSide(r[i][1]))
                    return getRotate180(rcube.state.defSurface.bottom) + ansCommon;
                if (fedge[3] == getLeftSide(r[i][1]))
                    return getRotateCW90(rcube.state.defSurface.bottom) + ansCommon;
                return getRotateCCW90(rcube.state.defSurface.bottom) + ansCommon;
            }
        }
    }

    for (let i = 0; i < r.length; i++) {
        const fedge = getEdgeIncludes(r[i][0], r[i][1]);
        if (fedge[1] != r[i][0] || fedge[3] != r[i][1]) {
            print_log(' - No matching edges. Try to rotate.');
            return getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(r[i][1]) +
                getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(r[i][1]) +
                getRotateCW90(rcube.state.defSurface.bottom) + getRotateCW90(r[i][0]) +
                getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(r[i][0]);
        }
    }
    print_log('Step3: The 2nd layer completed');
    let ans = solutionStep4();
    return ans;

}

// Step4
function solutionStep4() {

    const colorIndexBottom = rcube.state.stateColors[rcube.state.defSurface.bottom][rcube.state.state];
    const edges = getEdgesInclude(colorIndexBottom);
    const leaves = edges.filter(d => (d[1] == rcube.state.defSurface.bottom)).map(c => c[3]);

    if (leaves.length == 4) {   // 4辺全てが底面色ならSTEP4完成
        print_log('Step4: The 3rd layer cross completed');
        let ans = solutionStep5();
        return ans;
    }

    if (leaves.length == 2) {   // 2辺が底面色
        print_log('Step4: The 3rd layer cross incomplete');

        if (leaves[0] == getOppositeSide(leaves[1])) {
            // 一直線に並ぶ場合
            return getRotateCW90(getLeftSide(leaves[0])) + getRotateCW90(leaves[1]) + getRotateCW90(rcube.state.defSurface.bottom) +
                getRotateCCW90(leaves[1]) + getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(getLeftSide(leaves[0]));
        }

        const pair = [  // 近接して並ぶパターンを定義
            [rcube.state.defSurface.south, rcube.state.defSurface.east],
            [rcube.state.defSurface.east, rcube.state.defSurface.north],
            [rcube.state.defSurface.north, rcube.state.defSurface.west],
            [rcube.state.defSurface.west, rcube.state.defSurface.south],
        ];

        for (let i = 0; i < pair.length; i++) {
            if ((leaves[0] == pair[i][0] && leaves[1] == pair[i][1]) ||
                (leaves[1] == pair[i][0] && leaves[0] == pair[i][1])) {
                // 近接して並ぶパターンに一致する場合
                return getRotateCW90(getLeftSide(pair[i][0])) + getRotateCW90(getOppositeSide(pair[i][0])) + getRotateCW90(rcube.state.defSurface.bottom) +
                    getRotateCCW90(getOppositeSide(pair[i][0])) + getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(getLeftSide(pair[i][0]));
            }
        }
    }
    // 収束パターンに一致しなかった場合 -> とにかく回してみる
    print_log('Step4: The 3rd layer cross incomplete -> Try');
    return getRotateCW90(rcube.state.defSurface.south) + getRotateCW90(rcube.state.defSurface.west) + getRotateCW90(rcube.state.defSurface.bottom) +
        getRotateCCW90(rcube.state.defSurface.west) + getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(rcube.state.defSurface.south);

}

// Step5: 
function solutionStep5() {

    const colorIndexBottom = rcube.state.stateColors[rcube.state.defSurface.bottom][rcube.state.state];
    const corners = getCornersInclude(colorIndexBottom);  // 底面色を含むコーナーを取得
    const found = corners.filter(d => (d[1] != rcube.state.defSurface.bottom)); // 底面色が合っていない物を抽出

    if (found.length == 0) {   // 4角全てが底面色ならSTEP5完成
        print_log('Step5: The 3rd layer corner color completed');
        let ans = solutionStep6();
        return ans;
    }
    print_log('Step5: The 3rd layer corner color incomplete');

    let rotateSide = -1;
    if (found.length == 2) {
        if (found[0][1] == found[1][1]) {
            rotateSide = getRightSide(found[0][1]);
        } else if (found[0][1] == getOppositeSide(found[1][1])) {
            rotateSide = getRightSide(found[0][3]);
            if (found[0][3] == rcube.state.defSurface.bottom) rotateSide = getRightSide(found[0][5]);
        } else {
            rotateSide = getRightSide(found[1][1]);
            if (found[1][1] == getLeftSide(found[0][1])) rotateSide = getRightSide(found[0][1]);
        }
    } else if (found.length == 3) {
        for (let i = 0; i < corners.length; i++) {
            if (corners[i][1] == rcube.state.defSurface.bottom) {
                rotateSide = corners[i][3];
                if (rotateSide == getLeftSide(corners[i][5])) rotateSide = corners[i][5];
                break;
            }
        }
    } else if (found.length == 4) {
        const patern = [
            [rcube.state.defSurface.north, rcube.state.defSurface.north, rcube.state.defSurface.south, rcube.state.defSurface.south],
            [rcube.state.defSurface.east, rcube.state.defSurface.east, rcube.state.defSurface.west, rcube.state.defSurface.west],
            [rcube.state.defSurface.north, rcube.state.defSurface.west, rcube.state.defSurface.west, rcube.state.defSurface.south],
            [rcube.state.defSurface.west, rcube.state.defSurface.south, rcube.state.defSurface.south, rcube.state.defSurface.east],
            [rcube.state.defSurface.south, rcube.state.defSurface.east, rcube.state.defSurface.east, rcube.state.defSurface.north],
            [rcube.state.defSurface.east, rcube.state.defSurface.north, rcube.state.defSurface.north, rcube.state.defSurface.west]
        ];
        const found4 = corners.filter(d => (d[1] != rcube.state.defSurface.bottom)).map(c => c[1]).sort();
        for (let i = 0; i < patern.length; i++) {
            const ptn = [...patern[i]].sort();
            if (found4.toLocaleString() == ptn.toLocaleString()) {
                rotateSide = getOppositeSide(patern[i][1]);
                if (i == 0 || i == 1) rotateSide = getLeftSide(patern[i][0]);
                break;
            }
        }
    }
    if (rotateSide >= 0)
        return getRotateCW90(rotateSide) + getRotate180(rcube.state.defSurface.bottom) + getRotateCCW90(rotateSide) +
            getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCW90(rotateSide) + getRotateCCW90(rcube.state.defSurface.bottom) +
            getRotateCCW90(rotateSide);
    return '';
}

// Step6 
function solutionStep6() {

    const colorIndexBottom = rcube.state.stateColors[rcube.state.defSurface.bottom][rcube.state.state];
    const corners = getCornersInclude(colorIndexBottom);  // 底面色を含むコーナーを取得
    // ３面色が一致しているコーナーを抽出
    const found = corners.filter(d => (d[1] === rcube.state.defSurface.bottom) &&
        (d[2] == rcube.colors[rcube.state.stateColors[d[3]][rcube.state.state]].slice(0, 1).toUpperCase()) &&
        (d[4] == rcube.colors[rcube.state.stateColors[d[5]][rcube.state.state]].slice(0, 1).toUpperCase()));

    if (found.length == 4) {   // コーナー全てが色一致なら完了
        print_log('Step6: The 3rd layer corner position completed');
        let ans = solutionStep7();
        return ans;
    }

    if (found.length == 0) {   // コーナー全て一致してないならばとにかく底面を90度回す
        print_log('Step6: The 3rd layer corner position incomplete Turn to search');
        return getRotateCW90(rcube.state.defSurface.bottom);
    }

    let sd = [0, 0, 0];
    if (found.length == 1) {   // コーナー１カ所だけ一致している場合
        print_log('Step6: The 3rd layer corner position incomplete eq1');
        sd[1] = found[0][3];
        if (found[0][3] == getLeftSide(found[0][5])) sd[1] = found[0][5];
    } else {
        print_log('Step6: The 3rd layer corner position incomplete neq1 -> Try');
        const dt = [rcube.state.defSurface.north, rcube.state.defSurface.west, rcube.state.defSurface.east, rcube.state.defSurface.south];
        sd[1] = dt[getRandomInt(4)];    // コーナー２カ所以上はランダムに選択して回す（固定パターンはループする）
    }
    sd[0] = getRightSide(sd[1]);
    sd[2] = getOppositeSide(sd[1]);
    return getRotateCW90(sd[0]) + getRotateCCW90(sd[1]) + getRotateCW90(sd[0]) +
        getRotate180(sd[2]) + getRotateCCW90(sd[0]) + getRotateCW90(sd[1]) +
        getRotateCW90(sd[0]) + getRotate180(sd[2]) + getRotate180(sd[0]);

}

// Step7 
function solutionStep7() {

    const colorIndexBottom = rcube.state.stateColors[rcube.state.defSurface.bottom][rcube.state.state];
    const edges = getEdgesInclude(colorIndexBottom);  // 底面色を含む辺を取得
    // 色が合っている辺を抽出
    const result = edges.filter(d => d[2] === rcube.colors[rcube.state.stateColors[d[3]][rcube.state.state]].slice(0, 1).toUpperCase());

    if (result.length == 4) {   // ４辺全て色が合っていれば完了
        print_log('Step7: The 3rd layer completed');
        return '';
    }
    print_log('Step7: The 3rd layer incomplete');

    let rotateSide = rcube.state.defSurface.east;   // 条件が合わないときの暫定的な回転面を設定
    if (result.length == 1) rotateSide = getRightSide(result[0][3]);   // 1つの辺のみが一致しているときの回転面設定
    return getRotate180(rotateSide) + getRotateCW90(rcube.state.defSurface.bottom) +
        getRotateCW90(rotateSide) + getRotateCW90(rcube.state.defSurface.bottom) + getRotateCCW90(rotateSide) +
        getRotateCCW90(rcube.state.defSurface.bottom) + getRotateCCW90(rotateSide) + getRotateCCW90(rcube.state.defSurface.bottom) +
        getRotateCCW90(rotateSide) + getRotateCW90(rcube.state.defSurface.bottom) + getRotateCCW90(rotateSide);

}

function getRotate180(colorIndexRotateSide) {
    const colorNameHead = rcube.colors[rcube.state.stateColors[colorIndexRotateSide][rcube.state.state]].slice(0, 1).toUpperCase();
    return (colorNameHead + colorNameHead);
}

function getRotateCW90(colorIndexRotateSide) {
    const colorNameHead = rcube.colors[rcube.state.stateColors[colorIndexRotateSide][rcube.state.state]].slice(0, 1).toUpperCase();
    return (colorNameHead);
}

function getRotateCCW90(colorIndexRotateSide) {
    const colorNameHead = rcube.colors[rcube.state.stateColors[colorIndexRotateSide][rcube.state.state]].slice(0, 1);
    return (colorNameHead);
}

function getEdgesInclude(colorIndex) {
    const colorName = rcube.colors[colorIndex];
    let color1 = colorName.slice(0, 1).toUpperCase();;
    let edges = [];
    rcube.bigcube.forEach((a) => {
        a.forEach((b) => {
            b.forEach((c) => {
                let count = 0
                c.surfaces.forEach(d => { if (d >= 0) count += 1; });
                if (count == 2) {  // 辺を検出
                    if (c.surfaces[colorIndex] >= 0) {
                        const colorIndex2 = getOtherSideColor(colorIndex, c.surfaces);
                        const color2 = rcube.colors[colorIndex2].slice(0, 1).toUpperCase();
                        let wk1 = []; // 全体の色面構成を作成
                        rcube.state.stateColors.forEach(c => wk1.push(c[rcube.state.state]))
                        let wk2 = []; // 小体の色面構成を作成
                        c.stateColors.forEach(d => wk2.push(d[c.state]));
                        let result = [0, 0, 0, 0, 0, 0]; // 合成して全体軸で小体の面構成を作成
                        wk1.forEach((a, i) => {
                            result[i] = wk2[a];
                        });
                        edges.push([color1, result.indexOf(colorIndex), color2, result.indexOf(colorIndex2)]);
                    }
                }
            });
        });
    });
    return edges;
}

function getEdgeIncludes(dir1, dir2) {
    const colorIndex1 = rcube.state.stateColors[dir1][rcube.state.state];
    const colorIndex2 = rcube.state.stateColors[dir2][rcube.state.state];
    const colorName1 = rcube.colors[colorIndex1];
    const colorName2 = rcube.colors[colorIndex2];
    let color1 = colorName1.slice(0, 1).toUpperCase();;
    let color2 = colorName2.slice(0, 1).toUpperCase();;
    let edge = [];
    rcube.bigcube.forEach((a) => {
        a.forEach((b) => {
            b.forEach((c) => {
                let count = 0
                c.surfaces.forEach(d => { if (d >= 0) count += 1; });
                if (count == 2) {  // 辺を検出
                    if (c.surfaces[colorIndex1] >= 0 && c.surfaces[colorIndex2] >= 0) {
                        let wk1 = []; // 全体の色面構成を作成
                        rcube.state.stateColors.forEach(c => wk1.push(c[rcube.state.state]))
                        let wk2 = []; // 小体の色面構成を作成
                        c.stateColors.forEach(d => wk2.push(d[c.state]));
                        let result = [0, 0, 0, 0, 0, 0]; // 合成して全体軸で小体の面構成を作成
                        wk1.forEach((a, i) => {
                            result[i] = wk2[a];
                        });
                        edge = [color1, result.indexOf(colorIndex1), color2, result.indexOf(colorIndex2)];
                    }
                }
            });
        });
    });
    return edge;
}

function getCornersInclude(colorIndex) {
    const colorName = rcube.colors[colorIndex];
    let color1 = colorName.slice(0, 1).toUpperCase();;
    let edges = [];
    rcube.bigcube.forEach((a) => {
        a.forEach((b) => {
            b.forEach((c) => {
                let count = 0
                c.surfaces.forEach(d => { if (d >= 0) count += 1; });
                if (count == 3) {  // 角を検出
                    if (c.surfaces[colorIndex] >= 0) {
                        const [colorIndex2, colorIndex3] = getOtherSidesColor(colorIndex, c.surfaces);
                        const color2 = rcube.colors[colorIndex2].slice(0, 1).toUpperCase();
                        const color3 = rcube.colors[colorIndex3].slice(0, 1).toUpperCase();
                        let wk1 = []; // 全体の色面構成を作成
                        rcube.state.stateColors.forEach(c => wk1.push(c[rcube.state.state]))
                        let wk2 = []; // 小体の色面構成を作成
                        c.stateColors.forEach(d => wk2.push(d[c.state]));
                        let result = [0, 0, 0, 0, 0, 0]; // 合成して全体軸で小体の面構成を作成
                        wk1.forEach((a, i) => {
                            result[i] = wk2[a];
                        });
                        edges.push([color1, result.indexOf(colorIndex), color2, result.indexOf(colorIndex2), color3, result.indexOf(colorIndex3)]);
                    }
                }
            });
        });
    });
    return edges;
}

// 反対の面番号を獲得する
function getOppositeSide(side) {
    if (side == rcube.state.defSurface.north) return rcube.state.defSurface.south;
    if (side == rcube.state.defSurface.south) return rcube.state.defSurface.north;
    if (side == rcube.state.defSurface.east) return rcube.state.defSurface.west;
    if (side == rcube.state.defSurface.west) return rcube.state.defSurface.east;
    if (side == rcube.state.defSurface.top) return rcube.state.defSurface.bottom;
    if (side == rcube.state.defSurface.bottom) return rcube.state.defSurface.top;
    return side;
}

// 右側の面番号を獲得する
function getRightSide(side) {
    if (side == rcube.state.defSurface.south) return rcube.state.defSurface.east;
    if (side == rcube.state.defSurface.east) return rcube.state.defSurface.north;
    if (side == rcube.state.defSurface.north) return rcube.state.defSurface.west;
    if (side == rcube.state.defSurface.west) return rcube.state.defSurface.south;
    return side;
}

// 左側の面番号を獲得する
function getLeftSide(side) {
    if (side == rcube.state.defSurface.south) return rcube.state.defSurface.west;
    if (side == rcube.state.defSurface.west) return rcube.state.defSurface.north;
    if (side == rcube.state.defSurface.north) return rcube.state.defSurface.east;
    if (side == rcube.state.defSurface.east) return rcube.state.defSurface.south;
    return side;
}

// edge配列の指定面の色を獲得する
function getEdgeSideColor(edges, dir) {
    for (let i = 0; i < edges.length; i++) {
        if (edges[i][3] == dir) return edges[i][2];
    }
    return '';
}

function getEdgeSideDir(edges, color) {
    for (let i = 0; i < edges.length; i++) {
        if (edges[i][2] == color) return edges[i][3];
    }
    return -1;
}