//variables for the checkerboard game
var squareSize = 67;//size of the squares
var boardWidth = squareSize * 8;//width of the board
var boardHeight = squareSize * 8;//height of the board
var blackChecker = "#000000";//blackChecker piece
var redChecker = "#FF0000";//redChecker piece
var whosTurn = blackChecker;//the blackChecker piece will have the first turn
var boardPieceTracker = new Array();// Declare arrays to keep track of p locations
var checkerBoard;//checkerboard variable
var boardContext;//context of the board
var movingPiece;//current moving piece on the board
var currentGame;//curent game being played
var cursorLocation = [0,0];//location of the cursor
var jumpLocation = [0,0];//location of the jumped piece
var player1Score = 0;//score of player1
var player2Score = 0;//score of player2
//FUNCTIONS FOR CHECKERBOARD
function STARTGAME(){//to be able to display the canvas on the webpage
    checkerBoard = document.getElementById("idBoard");
    boardContext = checkerBoard.getContext("2d");
    //displays the scoreCounter for the players and the information on the scoreCounter
    scoreCounter=document.getElementById("idscoreCounter");
    scoreCounter.innerHTML="<div id='idrestartGame' onclick='RESTARTGAME(); return false;'>Start New Game</div>";
    scoreCounter.innerHTML=scoreCounter.innerHTML+"<div id='idplayer1' class='cplayers'>Player1Score(Black): <span id='idplayer1Score'></span></div>";
    scoreCounter.innerHTML=scoreCounter.innerHTML+"<div id='idplayer2' class='cplayers'>Player2Score(Red): <span id='idplayer2Score'></span></div>";
    scoreCounter.innerHTML=scoreCounter.innerHTML+"<div id='whosturn'></div>";
    if(SUPPORTSLOCALSTORAGE()) {// Check if local storage is supported
        currentGame=localStorage["current.game.exists"];// Check if there is already a game in progress
        if(currentGame=="true") {//if there is a current game, restore the previously saved variables
            player1Score=parseInt(localStorage["player1.score"]);//keeps track of the previously saved score for player1
            player2Score=parseInt(localStorage["player2.score"]);//keeps track of the previously saved score for player2
            boardPieceTracker=JSON.parse(localStorage["boardPiece.tracker"]);//keeps track of the previously saved piece locations
            whosTurn=localStorage["whos.Turn"];//keeps track of the last players turn
            SAVEDGAME();//will display the last game played
        }else{//will start a new game if there is no current game
            NEWGAME();
        }
    }else{//will start a new game if the local storage does not have a current game
        NEWGAME();
    }
}//end STARTGAME function
function NEWGAME(){//function that will start a new game if there is one that does not exist or restart game
    // Reset variables to the beginning
    whosTurn=blackChecker;//sets the first player to the blackChecker player
    boardPieceTracker=new Array();//tracks the boaard pieces
    currentGame=true;//there is a new current game
    cursorLocation=[0,0];//sets the location of cursor
    jumpLocation=[0,0];//sets location of jumping pieces
    player1Score=0;//score starts at 0
    player2Score=0;//score starts at 0
    document.getElementById("idplayer1Score").innerHTML=player1Score;//displays the reseted score to 0 on the scoreCounter
    document.getElementById("idplayer2Score").innerHTML=player2Score;//displays the reseted score to 0 on the scoreCounter
    STARTPIECES();// Set the checkerboard pieces on the checkerBoard
    SAVEDGAME();  // pull up the last games board and pieces
    NEWSAVEDGAME();//save the current game as new saved gave
}//end function
function STARTPIECES(){//will create the pieces for the board
    var blackCheckerCounter = 0;
    var redCheckerCounter = 0;
    var boardPieceCheckerCounter = 0
    for(var x=1;x<9;x++){
        for(var y=1;y<9;y+=2){
            if(x<4){// creates the blackChecker pieces and adds them to the tracking array
                boardPieceTracker.push(new PIECE(y+(x%2),x,false,blackChecker));
            }else if(x>5){// creates the redChecker pieces and adds them to the tracking array
                boardPieceTracker.push(new PIECE(y+(x%2),x,false,redChecker));
            }
        }
    }
}//end function
function PIECE(column,row,king,color){//creates a new piece for the board with its values
    this.col = column;
    this.row = row;
    this.king = king;
    this.color = color;
}
function SAVEDGAME(){//canvas will pull up last game played on webpage
    // Clear the canvas by resizing the checkerBoard
    checkerBoard.width = boardWidth;//sets the checkerBoard width
    checkerBoard.height = boardHeight;//sets the checkerBoard height
    REPOSITIONBOARD();//sets board up to last saved game
    DRAWBOARD();//draws the board from the last saved game
    DRAWPIECE();//draws the pieces for the board
    if(whosTurn == blackChecker) {//displays whos turn it is for the player
        document.getElementById("whosturn").innerHTML = "TURN: BlackChecker";
        document.getElementById("whosturn").style.color = whosTurn;
    } else if(whosTurn == redChecker) {
        document.getElementById("whosturn").innerHTML = "TURN: RedChecker";
        document.getElementById("whosturn").style.color = whosTurn;
    }//updates the score for the players
    document.getElementById("idplayer1Score").innerHTML = player1Score;
    document.getElementById("idplayer2Score").innerHTML = player2Score;
}//end function
function REPOSITIONBOARD(){
    // Set the canvas position
    if((browserWidth()-boardWidth)/2>250){
        checkerBoard.style.left=(browserWidth()-boardWidth)/2+"px";
        document.getElementById("idscoreCounter").style.width=checkerBoard.offsetLeft+"px";
    }else{
        checkerBoard.style.left="250px";
        document.getElementById("idscoreCounter").style.width="250px";
    }
}//end function
function DRAWBOARD(){//function for the squares to be drawn
    for(var r=1;r<9;r++){//rows of the board
        for(var c=1;c<9;c++){//columns of the board
            DRAWSQUARES(r,c);//function that draws the squares onto the board
        }
    }//eventlistener that will check if the piece is clicked on
    checkerBoard.addEventListener("mousedown",CLICKEDPIECE,false);
}//end function
function DRAWSQUARES(r,c){
    var colorSquare;//variable to color the squares
    // Switch between colors of squares
    if(((r%2==0)&&(c%2==0))||((r%2==1)&&(c%2==1))){
        colorSquare=blackChecker;//coloring the corresponding squares black
    } else if(((r%2==0)&&(c%2==1))||((r%2==1)&&(c%2==0))){
        colorSquare=redChecker;//coloring the corresponding squares red
    }// Draw squares onto the board
    boardContext.beginPath();//allows drawing path
    boardContext.fillStyle=colorSquare;//filling the square
    boardContext.moveTo((r-1)*squareSize,(c-1)*squareSize);
    boardContext.lineTo(r*squareSize,(c-1)*squareSize);
    boardContext.lineTo(r*squareSize,c*squareSize);
    boardContext.lineTo((r-1)*squareSize,c*squareSize);
    boardContext.lineTo((r-1)*squareSize,(c-1)*squareSize);
    boardContext.closePath();//stop drawing path
    boardContext.fill();
}//end function
function DRAWPIECE(){//draws the pieces onto the board
    for(var i = 0; i < boardPieceTracker.length; i++) {//going through the tracking array of checkerBoard pieces
        boardContext.beginPath();
        boardContext.fillStyle=boardPieceTracker[i].color;
        boardContext.lineWidth=5;
        boardContext.strokeStyle="#c47edd";//color of the rim of checker pieces
        boardContext.arc((boardPieceTracker[i].col-1)*squareSize+(squareSize*.5)+.5,(boardPieceTracker[i].row-1)*squareSize+(squareSize*.5)+.5,(squareSize*.5)-10,0,2*Math.PI,false);
        boardContext.closePath();
        boardContext.stroke();
        boardContext.fill();
        // Add a "crown" if the p is kinged!!
        if(boardPieceTracker[i].king) {
            boardContext.beginPath();
            boardContext.lineWidth=4;//width of the circle
            boardContext.strokeStyle="yellow";//color of the crown
            boardContext.arc((boardPieceTracker[i].col-1)*squareSize+(squareSize*.5)+.5,(boardPieceTracker[i].row-1)*squareSize+(squareSize*.5)+.5,(squareSize*.5)-30,0,2*Math.PI,false);
            boardContext.closePath();
            boardContext.stroke();
        }
    }
}//end function
function CLICKEDPIECE(e){//function is called when a checker piece is clicked on
    cursorLoc(e);//get the location of the square where the piece is located
    var squarePiece=CHECKPIECE();//checks if there exists a piece on the square
    if(squarePiece==whosTurn){//if the piece is part of current players turn
        for(var i=0;i<boardPieceTracker.length;i++){//remove from array as if it dragged
            if((boardPieceTracker[i].col==cursorLocation[0])&&(boardPieceTracker[i].row==cursorLocation[1])){
                movingPiece =boardPieceTracker[i];
                boardPieceTracker.splice(i,1);
            }
        }//eventlisteners to see when the piece is lifted and let go
        checkerBoard.addEventListener("mousemove",LIFTPIECE,false);
        checkerBoard.addEventListener("mouseup",DROPPIECE,false);
    }
}//end function
function CHECKPIECE(){// checks if square has a piece and returns the color
    var pieceColor=null;
    for(var i=0;i<boardPieceTracker.length;i++){//going through array of pieces
        if((boardPieceTracker[i].col==cursorLocation[0])&&(boardPieceTracker[i].row==cursorLocation[1])){
            pieceColor = boardPieceTracker[i].color;//the color will be color of piece on square
        }
    }
    return pieceColor;//returns the color of the checkerPiece that is clicked on
}//end function
function LIFTPIECE(e){//checcks the location and lifts piece from current square
    cursorLoc(e);
    SAVEDGAME();// Drag the p and redraw the game until you drop the p
    var canvasLocation=canvasLoc(e);
    boardContext.beginPath();
    boardContext.fillStyle=whosTurn;
    boardContext.lineWidth=15;//rim of checkerpiece will grow when selected to move
    boardContext.strokeStyle="#0de01f";//rim will change color to know which piece is moving
    boardContext.arc(canvasLocation[0],canvasLocation[1],(squareSize*.5)-10,0,2*Math.PI,false);
    boardContext.closePath();
    boardContext.stroke();
    boardContext.fill();
    // Add a "crown" if the p is kinged
    if(movingPiece.king) {//if the piece that is moving is already a king
        boardContext.beginPath();
        boardContext.lineWidth = 4;
        boardContext.strokeStyle = "yellow";
        boardContext.arc(canvasLocation[0],canvasLocation[1],(squareSize*.5)-30,0,2*Math.PI,false);
        boardContext.closePath();
        boardContext.stroke();
    }
}//end function
function DROPPIECE(e){//to let go of the piece that is being dragged
    cursorLoc(e);// Get location of cursor
    var cPiece = CHECKPIECE();//check if there is a piece on square
    var cDiagonal = CHECKDIAGONALSTATUS();//check if can move diagonal
    var cJump = CHECKJUMPSTATUS();//checks if can jump over diagonal
    if(!cPiece&&cDiagonal&&cJump){  // Check if the move is legal and if not, piece will not move
        // Create the new p and add to piecearray
        var newPiece=new PIECE(cursorLocation[0],cursorLocation[1],KINGME(),whosTurn);
        boardPieceTracker.push(newPiece);
        // If the p is jumping over an opponent, remove the p, check for a winner
        if(cJump==1){
            DELETEPIECE();//removes the opponents piece when it is jumped
        }CHECKWIN();
    }else{//move was not possible and will return piece were it was originally located
        boardPieceTracker.push(movingPiece);
    }
    NEWSAVEDGAME();// Save the current game as the new saved game
    // Remove the listeners and redraw the checkerBoard each time
    checkerBoard.removeEventListener("mousemove",LIFTPIECE,false);
    checkerBoard.removeEventListener("mouseup",DROPPIECE,false);
    SAVEDGAME();//pulls up the last saved game
    movingPiece=false;
}//end function
function CHECKDIAGONALSTATUS(){//checks if can move diagonal
    var cDiagonal = true;
    if(movingPiece.king) {// If the p has been kinged
        if((cursorLocation[0]==movingPiece.col)||(cursorLocation[1]==movingPiece.row)||(Math.abs(movingPiece.col-cursorLocation[0])!=Math.abs(movingPiece.row-cursorLocation[1]))){
            cDiagonal=false;
        }
    }else{//moving piece is not a king and sees whos turn it is
        if(whosTurn==blackChecker){//blackChecker is current moving piece
            if((cursorLocation[0]==movingPiece.col)||(cursorLocation[1]<=movingPiece.row)||(Math.abs(movingPiece.col-cursorLocation[0])>2)||(Math.abs(movingPiece.col-cursorLocation[0])!=Math.abs(movingPiece.row-cursorLocation[1]))){
                cDiagonal=false;
            }
        }else{//redChecker is current moving piece
            if((cursorLocation[0]==movingPiece.col)||(cursorLocation[1]>=movingPiece.row)||(Math.abs(movingPiece.col-cursorLocation[0])>2)||(Math.abs(movingPiece.col-cursorLocation[0])!=Math.abs(movingPiece.row-cursorLocation[1]))){
                cDiagonal=false;
            }
        }
    }
    return cDiagonal;//return the boolean
}//end function
function CHECKJUMPSTATUS(){//checks if can jump the piece
    var cJump=0;
    if(movingPiece.king){//if currentpiece is a king
        // Get the column and row difference from the initial p to the drop location
        var colDiff=movingPiece.col-cursorLocation[0];
        var rowDiff=movingPiece.row-cursorLocation[1];
        var colTemp=movingPiece.col;
        var rowTemp=movingPiece.row;
        var pieceCounter=0;
        var colorMatch=0;
        for(var i=0;i<Math.abs(colDiff);i++){//checks for oponnent pieces
            // Get the squares that are being jumped over
            colTemp=colTemp-colDiff/Math.abs(colDiff);
            rowTemp=rowTemp-rowDiff/Math.abs(rowDiff);
            // Check to see if that location contains a p and if it is its own color
            for(var j=0;j<boardPieceTracker.length;j++){//checks to see if square contains a piece of the same color being moved
                if((boardPieceTracker[j].col==colTemp)&&(boardPieceTracker[j].row==rowTemp)){
                    if(boardPieceTracker[j].color==movingPiece.color){
                        colorMatch++;
                    }else{
                        jumpLocation[0]=boardPieceTracker[j].col;
                        jumpLocation[1]=boardPieceTracker[j].row;
                        pieceCounter++;
                    }
                }
            }//end for loop
        }
        if(pieceCounter==0&&colorMatch==0){
            cJump=2;
        } else if(pieceCounter==1&&colorMatch==0){
            cJump=1;
        }
    }else{
        if((Math.abs(movingPiece.col-cursorLocation[0])==2)&&(Math.abs(movingPiece.row-cursorLocation[1])==2)){
            if(movingPiece.col-cursorLocation[0]>0){// Get the column and row values of the jumped square// Get the column and row values of the jumped square
                jumpLocation[0]=movingPiece.col-1;
            }else{
                jumpLocation[0]=movingPiece.col+1;
            }
            if(movingPiece.row-cursorLocation[1]<0){// Get the column and row values of the jumped square
                jumpLocation[1]=movingPiece.row+1;
            }else{
                jumpLocation[1]=movingPiece.row-1;
            }
            // Check to see if that location contains a p and if it is its own color
            for(var i=0;i<boardPieceTracker.length;i++){//checks to see if cpiece being jumped is of the same color
                if((boardPieceTracker[i].col==jumpLocation[0])&&(boardPieceTracker[i].row==jumpLocation[1])&&(boardPieceTracker[i].color!=movingPiece.color)){
                    cJump=1;
                }
            }
        }else{
            cJump = 2;
        }
    }return cJump;
}//end function
function DELETEPIECE(){//deletes piece
    for(var i=0;i<boardPieceTracker.length;i++){//going throuch the checker piecs in the tracking array
        if((boardPieceTracker[i].col==jumpLocation[0])&&(boardPieceTracker[i].row==jumpLocation[1])){
            if(boardPieceTracker[i].color==blackChecker){//updates the score
                player2Score=player2Score+1;//add point to the player2 redChecker
            }else{
                player1Score=player1Score+1;//add point to the player1 blackChecker
            }//deletes the piece
            boardPieceTracker.splice(i,1);
        }
    }
}//end function
function CHECKWIN(){// Check for a winner
    if((player1Score==12)||(player2Score==12)){//if either player gets 12 points
        //assigns the winner depending on the amount of points
        var gameWinner=(player1Score==12)?"Player1!":"Player2!";
        // Remove the listeners and redraw the checkerBoard
        checkerBoard.removeEventListener("mousedown",CLICKEDPIECE,false);
        checkerBoard.removeEventListener("mousemove",LIFTPIECE,false);
        checkerBoard.removeEventListener("mouseup",DROPPIECE,false);
        SAVEDGAME();//displays last saved game checkerBoard
        currentGame = false;//there is not current game anymore
        alert("The winner is " + gameWinner);//alerts that there is a winner
        NEWGAME();//will start a new game automatically
    }else{//no winner, continue playing ans switching players
        if(whosTurn==blackChecker) {
            whosTurn=redChecker;
        }else if(whosTurn==redChecker){
            whosTurn=blackChecker;
        }
    }
}//end function
function NEWSAVEDGAME(){//overwrites and saves current game
    if (SUPPORTSLOCALSTORAGE()){//Checks if browser supports storage and save currentgame
        localStorage["current.game.exists"] = currentGame;
        localStorage["player1.score"] = player1Score;
        localStorage["player2.score"] = player2Score;
        localStorage["boardPiece.tracker"] = JSON.stringify(boardPieceTracker);
        localStorage["whos.Turn"] = whosTurn;
    }
}//end function
function KINGME(){//if the piece reaches the opposite side of board
    var kingMe = false;
    //check if piece reached other side of baord
    if((movingPiece.color==blackChecker)&&(cursorLocation[1]==8)){
        kingMe=true;
    }else if((movingPiece.color==redChecker)&&(cursorLocation[1]==1)){
        kingMe=true;
    }else if(movingPiece.king){
        kingMe=true;
    }return kingMe;//return the king piece
}//end function
function RESTARTGAME(){//will restart game if the game is over
    var answer = prompt("Play again?(yes or no)");
    if(answer == "yes"||"YES"||"y"||"Y"||"Yes"){
        NEWGAME();
    }else{
      alert("Thank you for playing!. Come again.");
    }
}//end function
function SUPPORTSLOCALSTORAGE() {//function will check if the storage is supported by browser
    var localStorageSupport = (('localStorage' in window) && (window['localStorage'] !== null));
    return localStorageSupport;
}//end function
function browserHeight(){//function that deals with height of the browser
    var height;
    // Get the height of the browser window
    if (typeof window.innerWidth!="undefined"){
        height=window.innerHeight;
    }else if(typeof document.documentElement!="undefined"&&typeof document.documentElement.clientWidth!="undefined"&&document.documentElement.clientWidth!=0){
        height=document.documentElement.clientHeight;
    }else{
        height = document.getElementsByTagName('body')[0].clientHeight;
    }return height;
}//end function

function browserWidth(){//function that deals with the width of the browser
    var width;
    // Get the width of the browser window
    if (typeof window.innerWidth != 'undefined') {
        width = window.innerWidth;
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        width = document.documentElement.clientWidth;
    } else {
        width = document.getElementsByTagName('body')[0].clientWidth;
    }
    return width;
}//end function
function canvasLoc(e){
    var canvasLocation=[0,0];
    var canvasXOffset=document.getElementById("idBoard").offsetLeft;
    var canvasYOffset=document.getElementById("idBoard").offsetTop;
    // Get cursor location relative to the broswer
    if ((e.pageX!=undefined)&&(e.pageY!=undefined)){
        canvasLocation[0]=e.pageX;
        canvasLocation[1]=e.pageY;
    }else{
        canvasLocation[0]=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
        canvasLocation[1]=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
    }
    canvasLocation[0]=canvasLocation[0]-canvasXOffset;
    canvasLocation[1]=canvasLocation[1]-canvasYOffset;
    return canvasLocation;
}//end function
function cursorLoc(e){//returns cursor location
    var canvasLocation = canvasLoc(e);
    // Get the cursor location relative to the squares on the checkerBoard and store in an array
    var loc1 = Math.ceil(canvasLocation[0]*(1/squareSize));
    var loc2 = Math.ceil(canvasLocation[1] * (1/squareSize));
    cursorLocation = [loc1,loc2];
}//end function
