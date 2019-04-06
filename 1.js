var board=[]; //0:未走，1：玩家1，-1：电脑/玩家2
var show=[];
var group=[0,0,0,0,0,0,0,0,0];
var cross="X";
var circle="O";
var flag=1;//1:o走，2：x走
var modeFlag=0;//1:1playerMode 2:2playerMode;
var i,j;
var txt;
var text='';
var result;
var col,row;
var link1=document.getElementById("1player");
var link2=document.getElementById("2player");
var linkRestart=document.getElementById("restart");
var linkUndo = document.getElementById("Undo");

for(i=0;i<3;++i){
    board[i]=[];
    show[i]=[];
}
for(i=0;i<3;++i){
    for(j=0;j<3;++j){
      board[i][j]=0;
      show[i][j]=document.getElementById("tic-"+i+"-"+j);
    }
  };

function chooseMode1(){
  onePlayer();
  var choose = document.getElementById("choose");
  var body= document.getElementsByTagName("body")[0];
  var back= document.getElementById("back");
  body.removeChild(choose); //关闭选择界面
  body.removeChild(back);
}

function chooseMode2(){
  twoPlayer();
  var choose = document.getElementById("choose");
  var body= document.getElementsByTagName("body")[0];
  var back= document.getElementById("back");
  body.removeChild(choose);
  body.removeChild(back);
}

function newGame(){
  if(document.getElementById("result")){
    var resultDiv=document.getElementById("result");
    body.removeChild(resultDiv);
  }
  result=0;
    flag=1;
    group=[0,0,0,0,0,0,0,0,0];
    step=0;
    for(i=0;i<3;i++){
      for(j=0;j<3;j++){
        board[i][j]=0;
        txt="";
        show[i][j].text=txt;

      }
    }
  }


//检测输赢
  function checkWin(x,y){
    var sumx=0;
    var sumy=0;
    var sumCross1=0;
    var sumCross2=0;
    for(var i=0;i<3;i++){
      sumx+=board[x][i];
      sumy+=board[i][y];
      sumCross1+=board[i][i];
      sumCross2=board[2][0]+board[1][1]+board[0][2];
    }
    if(sumx==3||sumx==-3){
      return 1;
    }
    else if (sumy==3||sumy==-3){
      return 1;
    }
    else if(sumCross1==3||sumCross1==-3){
      return 1;
    }
    else if(sumCross2==3||sumCross2==-3){
      return 1;
    }
    else {
      return false;
    }
}
//检测平局情况
function checkEven(){
  var even=1;
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++){
      if(board[i][j]===0){
        even=0;
        break;
      }
    }
    if(even==0){
      break;
    }
  }
    return even;
}
//显示胜负结果
function gameOver(x,y){
  if(checkWin(x,y)){
    if(flag==2){
      text=document.createTextNode("Circle Wins!");
      showResult();
    }

    else{
      text=document.createTextNode("Cross Wins!");
      showResult();
    }
  }
  else{
    if(checkEven()){
      text=document.createTextNode("Draw");
      showResult();
    }
  }
  if(document.getElementById("result")){
    for(i=0;i<3;i++){
      for(j=0;j<3;j++){
        (function(i,j){
          show[i][j].onclick=function(){
          show[i][j].text="";
          board[i][j]=0;
        }
        })(i,j);
      }
    }
    var resultDiv=document.getElementById("result");
    //显示结果后自动重新开始
    setTimeout(
      function(){
        body.removeChild(resultDiv);
        restart()},3000);
  }
}

function showResult(){
  var resultDiv = document.createElement("div");
  var back=document.createElement("div");
  var para=document.createElement("p")
  back.setAttribute("id","back");
  resultDiv.appendChild(back);
  resultDiv.setAttribute("id","result");
  para.appendChild(text);
  para.setAttribute("id","para");
  resultDiv.appendChild(para);
  var body=document.getElementById("body");
  body.appendChild(resultDiv);
};
//重新开始
linkRestart.setAttribute("onclick","restart()");
var restart= function(){
  if(modeFlag==1){
    onePlayer();
  }
  else {
    twoPlayer();
  }
}
//单人模式下，AI部分
//走完两回合情况下检查是否能三连，返回能三连的位置
//kind：1检查玩家 -1检查AI
var checkTwo = function(kind,group){
  var allPossible = [[0,1,2],[0,3,6],[0,4,8],[3,4,5],[6,7,8],[1,4,7],[2,5,8],[2,4,6]];
  var place=[];//记录返回位置；
  for(i in allPossible){
  var x=allPossible[i][0];
  var y=allPossible[i][1];
  var z=allPossible[i][2];
  if((group[x]===kind&&group[y]===kind&&group[z]===0)||(group[x]===0&&group[y]===kind&&group[z]===kind)||(group[x]===kind&&group[y]===0&&group[z]===kind)){
    if(group[x]===0){
      place.push(x);
      continue;
    }
    else if(group[y]===0){
      place.push(y);
      continue;
    }
    else if(group[z]===0){
      place.push(z);
      continue;
    }
  }

  }
  return place;
}

var computer = function(){
  var step=0;
  //检查是第几步
  for(i in group){
      if(group[i]==1){
        ++step;
      }
    }
  if(step==1){
    if(group[4]==1){
      group[0]=-1;
      show[0][0].text=cross;
      row=0;
      col=0;
    }
    else{
      var pos=4;
      group[pos]=-1;
      show[1][1].text=cross;
      row=1;
      col=1;
    }
}
  else if (step==2){
    //第一步检查玩家是否可以三联珠；
    var array1=checkTwo(1,group);
    if(array1.length!==0){
      var pos=array1[0];
      col=pos%3;
      row=(pos-col)/3;
      group[pos]=-1;
      show[row][col].text=cross;
    }
    else{
      if(group[4]==1){
        group[1]=-1;
        show[0][1].text=cross;
        row=0;
        col=1;
      }
      else{
        if(group[5]==1||group[3]==1){
          if(group[7]==1){
            group[6]=-1;
            show[2][0].text=cross;
            row=2;
            col=0;
          }
          else{
          group[7]=-1;
          show[2][1].text=cross;
          row=2;
          col=1;}
        }
        else if((group[0]==1&&group[8]==1)||(group[2]==1&&group[6]==1)){
          group[3]=-1;
          show[1][0].text=cross;
          col=0;
          row=1;
        }
        else if(group[1]==1||group[7]==1){
          group[3]=-1;
          show[1][0].text=cross;
          col=0;
          row=1;
        }
      }
    }
  }
  else if(step==3||step==4){
    array3=checkTwo(-1,group);
    array4 = checkTwo(1,group);
    //检查电脑是否可以三联
    if(array3.length!==0){
    var pos=array3[0];
    col=pos%3;
    row=(pos-col)/3;
    group[pos]=-1;
    show[row][col].text=cross;
    }
    //检查玩家是否可三联
    else if(array4.length!==0){
      var pos=array4[0];
      col=pos%3;
      row=(pos-col)/3;
      group[pos]=-1;
      show[row][col].text=cross;
    }
    else{
      for(i in group){
        if(group[i]==0){
          var pos=i;
          col=pos%3;
          row=(pos-col)/3;
          group[pos]=-1;
          show[row][col].text=cross;
          break;
        }
      }
    }
  }
}
//单人模式下悔棋
var undoOne = function(i,j){

  show[i][j].text="";
  group[i*3+j]=0;
  board[i][j]=0;
  board[row][col]=0;
  group[row*3+col]=0;
  show[row][col].text = "";
}
//双人模式下悔棋
var undoTwo = function(i,j){
  if(flag==1){
  show[i][j].text="";
  board[i][j]=0;
  flag=2;
  }
  else{
  show[i][j].text="";
  board[i][j]=0;
  flag=1;
  }
}

  var onePlayer= function(){
  newGame();
  modeFlag=1;
    for(i=0;i<3;i++){
      for(j=0;j<3;j++){
        function click(i,j){
          show[i][j].onclick= function(){
            if(board[i][j]!==0){
              return false;
            }
               show[i][j].text=circle;
               board[i][j]=1;
               group[i*3+j]=1;
               flag=2;
              gameOver(i,j);
            computer();
              board[row][col]=-1
              flag=1;
          if(checkEven()!==1){
           gameOver(row,col);
         }
           linkUndo.onclick=function(){
             var resultDiv=document.getElementById("result");
             if(!resultDiv){
             undoOne(i,j)}
           };
        }
      }
      click(i,j)}
  }
}

var twoPlayer= function(){
  newGame();
  modeFlag=2;
  for(i=0;i<3;i++){
    for(j=0;j<3;j++){
      function click(i,j){
      show[i][j].onclick=function(){
        if(board[i][j]!==0){
          return false;
        }
           if(flag==1){
           show[i][j].text=circle;
           board[i][j]=1;
           flag=2;
          }
        else{
        show[i][j].text=cross;
        board[i][j]=-1;
        flag=1;
          }
      gameOver(i,j);
      linkUndo.onclick=function(){
        var resultDiv=document.getElementById("result");
        if(!resultDiv){
        undoTwo(i,j)};
        }
      }
     }
      click(i,j)}}
}
