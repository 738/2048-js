var width = 4;
var height = 4;
var score = 0;
var isPlaying = 0;
var zeroColor = "rgb(255,230,220)";
var colorArr = ["rgb(255,210,200)", "rgb(230,240,100)", "rgb(255,170,140)", "rgb(100,240,175)",
    "rgb(255,215,100)", "rgb(120,255,90)", "rgb(100,250,225)", "rgb(180,250,0)",
    "rgb(175,255,140)", "rgb(135,255,85)", "rgb(130,250,240)", "rgb(35,200,255)",
    "rgb(250,190,255)", "rgb(245,128,255)", "rgb(190,150,220)", "rgb(170,60,230)"];
var main_map = document.getElementById('main_map');
var row = new Array(height);
var cell = new Array(height);
for (var i = 0; i < height; i++)
    cell[i] = new Array(width);
for (var i = 0; i < height; i++) {
    row[i] = main_map.insertRow(-1);
    for (var j = 0; j < width; j++) {
        cell[i][j] = row[i].insertCell(j);
        cell[i][j].setAttribute('id', 'td' + i + '_' + j);
    }
}
var tdArr = new Array(height);
for (var i = 0; i < height; i++)
    tdArr[i] = new Array(width);
for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++)
        tdArr[i][j] = document.getElementById('td' + i + '_' + j);

var main_arr = new Array(height);
for (var i = 0; i < height; i++)
    main_arr[i] = [0, 0, 0, 0];

function renewTable() {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var td_tmp = document.getElementById('td' + i + '_' + j);
            if (main_arr[i][j] != 0) {
                var val = main_arr[i][j];
                td_tmp.innerHTML = val;
                td_tmp.style.backgroundColor = colorArr[log(val, 2) - 1];
                td_tmp.style.fontSize = "30px";
                if (val >= 10000) {
                    td_tmp.style.fontSize = "20px";
                } else if (val >= 1000) {
                    td_tmp.style.fontSize = "25px";
                }
            } else {
                td_tmp.innerHTML = "";
                td_tmp.style.backgroundColor = zeroColor;
                td_tmp.style.fontSize = "30px";
            }
        }
    }
    renewScore();
}

function renewScore() {
    document.getElementById("score").innerHTML = score;
}

function createRand(rand_list) {
    var rand_i = Math.floor(Math.random() * 4);
    var rand_j = Math.floor(Math.random() * 4);
    var num = main_arr[rand_i][rand_j];
    while (num) {
        if (isFull()) {
            return;
        }
        var rand_i = Math.floor(Math.random() * 4);
        var rand_j = Math.floor(Math.random() * 4);
        num = main_arr[rand_i][rand_j];
    }
    var rand_index = Math.floor(Math.random() * rand_list.length);
    main_arr[rand_i][rand_j] = rand_list[rand_index];
    renewTable();
}
function gameStart() {
    isPlaying = 1;
    createRand([2]);
    createRand([2]);
}
gameStart();

function zeroPush(list) {
    var len = list.length;
    if (len != 4) {
        alert("¿À·ù! -zeroPush");
        return false;
    }
    for (var i = len - 1; i >= 0; i--) {
        for (var j = len - 1; j >= len - i; j--) {
            if (list[j] == 0) {
                var tmp = list[j];
                list[j] = list[j - 1];
                list[j - 1] = tmp;
            }
        }
    }
    return list;
}

function plusPush(list) {
    var len = list.length;
    if (len != 4) {
        alert("¿À·ù! -plusPush");
        return false;
    }
    var t_list = [];
    for (var i = 0; i < 4; i++)
        t_list[i] = list[i];
    zeroPush(list);
    for (var i = len - 1; i > 0; i--) {
        if (list[i] != 0 && list[i] == list[i - 1]) {
            list[i] = list[i] + list[i - 1];
            list[i - 1] = 0;
            zeroPush(list);
            score += list[i];
        }
    }
    for (var i = 0; i < 4; i++) {
        if (t_list[i] != list[i]) {
            return true;
        }
    }
    return false;
}

function goDown() {
    var tmp_list = new Array(width);
    var isChanged = new Array(width);
    for (var i = 0; i < width; i++)
        tmp_list[i] = new Array(height);
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++)
            tmp_list[i][j] = main_arr[j][i];
        isChanged[i] = plusPush(tmp_list[i]);
        for (var j = 0; j < height; j++)
            main_arr[j][i] = tmp_list[i][j];
    }
    var t = 0;
    for (var i = 0; i < width; i++)
        if (!isChanged[i])
            t++;
    if (t < width)
        createRand([2, 2, 2, 4]);
    checkOver();
}

function goUp() {
    var tmp_list = new Array(width);
    var isChanged = new Array(width);
    for (var i = 0; i < width; i++)
        tmp_list[i] = new Array(height);
    for (var i = 0; i < width; i++) {
        for (var j = height - 1; j >= 0; j--)
            tmp_list[i][height - j - 1] = main_arr[j][i];
        isChanged[i] = plusPush(tmp_list[i]);
        for (var j = height - 1; j >= 0; j--)
            main_arr[height - j - 1][i] = tmp_list[i][j];
    }
    var t = 0;
    for (var i = 0; i < width; i++)
        if (!isChanged[i])
            t++;
    if (t < width)
        createRand([2, 2, 2, 4]);
    checkOver();
}

function goRight() {
    var tmp_list = new Array(height);
    var isChanged = new Array(height);
    for (var i = 0; i < height; i++)
        tmp_list[i] = new Array(width);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++)
            tmp_list[i][j] = main_arr[i][j];
        isChanged[i] = plusPush(tmp_list[i]);
        for (var j = 0; j < width; j++)
            main_arr[i][j] = tmp_list[i][j];
    }
    var t = 0;
    for (var i = 0; i < height; i++)
        if (!isChanged[i])
            t++;
    if (t < height)
        createRand([2, 2, 2, 4]);
    checkOver();
}

function goLeft() {
    var tmp_list = new Array(height);
    var isChanged = new Array(height);
    for (var i = 0; i < height; i++)
        tmp_list[i] = new Array(width);
    for (var i = 0; i < height; i++) {
        for (var j = width - 1; j >= 0; j--)
            tmp_list[i][width - j - 1] = main_arr[i][j];
        isChanged[i] = plusPush(tmp_list[i]);
        for (var j = width - 1; j >= 0; j--)
            main_arr[i][width - j - 1] = tmp_list[i][j];
    }
    var t = 0;
    for (var i = 0; i < height; i++)
        if (!isChanged[i])
            t++;
    if (t < height)
        createRand([2, 2, 2, 4]);
    checkOver();
}

function isOver() {
    for (var i = 0; i < height; i++)
        for (j = 0; j < width; j++)
            if (main_arr[i][j] == 0)
                return false;
    for (var i = 0; i < height; i++)
        for (j = 0; j < width - 1; j++)
            if (main_arr[i][j] == main_arr[i][j + 1])
                return false;
    for (var i = 0; i < width; i++)
        for (j = 0; j < height - 1; j++)
            if (main_arr[j][i] == main_arr[j + 1][i])
                return false;
    return true;
}

function checkOver() {
    if (isOver() && isPlaying) {
        isPlaying = 0;
        alert("GAME OVER\nscore: " + score);
    }
}

function isFull() {
    for (var i = 0; i < height; i++)
        for (j = 0; j < width; j++)
            if (main_arr[i][j] == 0)
                return false;
    return true;
}

function log(num, r) {
    var result = 0;
    if (num % r) {
        alert("log function error");
        return false;
    }
    while (num != 1) {
        num /= r;
        result++;
    }
    return result;
}

document.onkeydown = function () {
    if (event.keyCode == 37) goLeft();
    else if (event.keyCode == 38) goUp();
    else if (event.keyCode == 39) goRight();
    else if (event.keyCode == 40) goDown();
}
