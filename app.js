var PUZZLE_DIFFICULTY = 5;
const PUZZLE_HOVER_TINT = '#006600';
 
var canvas;
var stage;
var image;
var pieces;
var puzzleWidth;
var puzzleHeight;
var pcWidth;
var pcHeight;
var currentPc;
var currentDropPc;
var mouse_cursor;

function initialize(){
    image = new Image();
    image.addEventListener('load',onImage,false);
    image.src = "media/imagine3.jpg";
}
function onImage(e){
    pcWidth = Math.floor(image.width / PUZZLE_DIFFICULTY)
    pcHeight = Math.floor(image.height / PUZZLE_DIFFICULTY)
    puzzleWidth = pcWidth * PUZZLE_DIFFICULTY;
    puzzleHeight = pcHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    createPuzzle();
}
function setCanvas(){
    canvas = document.getElementById('canvas');
    stage = canvas.getContext('2d');
    canvas.width = puzzleWidth;
    canvas.height = puzzleHeight;
    canvas.style.border = "1px solid black";
}
function createPuzzle(){
    pieces = [];
    mouse_cursor = {x:0,y:0};
    currentPc = null;
    currentDropPc = null;
    stage.drawImage(image, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
    createTitle("Shuffle pieces -- JP1077");
    buildPieces();
}
function createTitle(msg){
    stage.fillStyle = "#000000";
    stage.globalAlpha = .4;
    stage.fillRect(100,puzzleHeight - 40,puzzleWidth - 200,40);
    stage.fillStyle = "#FFFFFF";
    stage.globalAlpha = 1;
    stage.textAlign = "center";
    stage.textBaseline = "middle";
    stage.font = "20px Arial";
    stage.fillText(msg,puzzleWidth / 2,puzzleHeight - 20);
}
function buildPieces(){
    var i;
    var piece;
    var posX = 0;
    var posY = 0;
    for(i = 0;i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;i++){
        piece = {};
        piece.ox = posX;
        piece.oy = posY;
        pieces.push(piece);
        posX += pcWidth;
        if(posX >= puzzleWidth){
            posX = 0;
            posY += pcHeight;
        }
    }
    document.onmousedown = shufflePuzzle;
}
for(i = 0;i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;i++){
    piece = {};
    piece.ox = posX;
    piece.oy = posY;
    pieces.push(piece);
    posX += pcWidth;
    if(posX >= puzzleWidth){
        posX = 0;
        posY += pcHeight;
    }
}
function shufflePuzzle() {

    pieces = shuffleArray(pieces);
    stage.clearRect(0,0,puzzleWidth,puzzleHeight);
    var i;
    var piece;
    var posX = 0;
    var posY = 0;
    for(i = 0;i < pieces.length;i++){
        piece = pieces[i];
        piece.posX = posX;
        piece.posY = posY;
        stage.drawImage(image, piece.ox, piece.oy, pcWidth, pcHeight, posX, posY, pcWidth, pcHeight);
        stage.strokeRect(posX, posY, pcWidth,pcHeight);
        posX += pcWidth;
        if(posX >= puzzleWidth){
            posX = 0;
            posY += pcHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
    playSound();

}
function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
function onPuzzleClick(e) {//after the puzzle has been clicked,we determine the selected piece and draw it again at the desired position after fading the old piece(the user can see the old piece while hovering)
    playSound();

    if(e.layerX || e.layerX == 0){
        mouse_cursor.x = e.layerX - canvas.offsetLeft;
        mouse_cursor.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        mouse_cursor.x = e.offsetX - canvas.offsetLeft;
        mouse_cursor.y = e.offsetY - canvas.offsetTop;
    }
    currentPc = checkPieceClicked();
    if(currentPc != null){
        stage.clearRect(currentPc.posX,currentPc.posY,pcWidth,pcHeight);
        stage.save();
        stage.globalAlpha = .9;
        stage.drawImage(image, currentPc.ox, currentPc.oy, pcWidth, pcHeight, mouse_cursor.x - (pcWidth / 2), mouse_cursor.y - (pcHeight / 2), pcWidth, pcHeight);
        stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}
function checkPieceClicked(){//check which piece of the array is currently selected
    var i;
    var piece;
    for(i = 0;i < pieces.length;i++){
        piece = pieces[i];
        if(mouse_cursor.x < piece.posX || mouse_cursor.x > (piece.posX + pcWidth) || mouse_cursor.y < piece.posY || mouse_cursor.y > (piece.posY + pcHeight)){
           
        }
        else{
            return piece;
        }
    }
    return null;
}
function updatePuzzle(e) {//redrawing the puzzle,clearing residual values, then redraw the dragged piece
    playSound();

    currentDropPc = null;
    if(e.layerX || e.layerX == 0){
        mouse_cursor.x = e.layerX - canvas.offsetLeft;
        mouse_cursor.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        mouse_cursor.x = e.offsetX - canvas.offsetLeft;
        mouse_cursor.y = e.offsetY - canvas.offsetTop;
    }
    stage.clearRect(0,0,puzzleWidth,puzzleHeight);
    var i;
    var piece;
    for(i = 0;i < pieces.length;i++){
        piece = pieces[i];
        if(piece == currentPc){
            continue;
        }
        stage.drawImage(image, piece.ox, piece.oy, pcWidth, pcHeight, piece.posX, piece.posY, pcWidth, pcHeight);
        stage.strokeRect(piece.posX, piece.posY, pcWidth,pcHeight);
        if(currentDropPc == null){
            if(mouse_cursor.x < piece.posX || mouse_cursor.x > (piece.posX + pcWidth) || mouse_cursor.y < piece.posY || mouse_cursor.y > (piece.posY + pcHeight)){
                
            }
            else{
                currentDropPc = piece;
                stage.save();
                stage.globalAlpha = .4;
                stage.fillStyle = PUZZLE_HOVER_TINT;
                stage.fillRect(currentDropPc.posX,currentDropPc.posY,pcWidth, pcHeight);
                stage.restore();
            }
        }
    }
    stage.save();
    stage.globalAlpha = .6;
    stage.drawImage(image, currentPc.ox, currentPc.oy, pcWidth, pcHeight, mouse_cursor.x - (pcWidth / 2), mouse_cursor.y - (pcHeight / 2), pcWidth, pcHeight);
    stage.restore();
    stage.strokeRect( mouse_cursor.x - (pcWidth / 2), mouse_cursor.y - (pcHeight / 2), pcWidth,pcHeight);
}
function pieceDropped(e){
    document.onmousemove = null;
    document.onmouseup = null;
    if(currentDropPc != null){
        var tmp = {posX:currentPc.posX,posY:currentPc.posY};
        currentPc.posX = currentDropPc.posX;
        currentPc.posY = currentDropPc.posY;
        currentDropPc.posX = tmp.posX;
        currentDropPc.posY = tmp.posY;
    }
    resetPuzzleAndCheckWin();
    playSound(); //function to handle the event whne the user drops the piece

}
function resetPuzzleAndCheckWin(){
    stage.clearRect(0,0,puzzleWidth,puzzleHeight);
    var win = true;
    var i;
    var piece;
    for(i = 0;i < pieces.length;i++){
        piece = pieces[i];
        stage.drawImage(image, piece.ox, piece.oy, pcWidth, pcHeight, piece.posX, piece.posY, pcWidth, pcHeight);
        stage.strokeRect(piece.posX, piece.posY, pcWidth,pcHeight);
        if(piece.posX != piece.ox || piece.posY != piece.oy){
            win = false;
        }
    }
    if(win){
        setTimeout(gameOver,500); //we set a timeout so that the image doesn't change instantly
    }
}
function gameOver(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    createPuzzle();
    playSound(); //clearing everything in case user wants to restart
}
function playSound() {
    var audio = document.getElementById("audio");
    audio.play();
}



