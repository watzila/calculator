var historyValue = document.getElementById("historyValue");//歷史紀錄文本
var btn = document.getElementsByClassName("btn");//全部的按鈕
var answerValue = document.getElementById("answerValue");//答案文本
var notNumber = true;//是否可以按符號按鈕
var dot = true;//是否可以按點點按鈕
var mathCustody = [];//存所有輸入的數據
var currentNum = "";//存當前確定的數字

//給每個按鈕加入點擊事件
for (i = 0; i < btn.length; i++) {
  btn[i].addEventListener("click", function () {
    getButton(this.value);
  });
}

//得到的按鍵是什麼
function getButton(value) {

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "%":
    case "/":
      notNum(currentNum, value);
      break;
    case "=":
      if (mathCustody.length != 0) {
        finish(currentNum);
      }
      break;
    case "C":
      answerValue.innerHTML = "0";
      mathCustody = [];
      currentNum = "";
      notNumber = true;
      dot = true;
      break;
    case ".":
      if (dot == true) {
        answerValue.innerHTML += value;
        currentNum += value;
        dot = false;
        notNumber = true;
      }
      break;
    default:
      //限制首次按鈕不能是符號
      if (notNumber == true && mathCustody.length == 0) {
        if (value > 0) {
          var t = (dot == false) ? answerValue.innerText : "";//判斷首次有無輸入點，沒有的話就覆蓋
          answerValue.innerHTML = t + value;
          currentNum += value;
          notNumber = false;
        }
      } else {
        answerValue.innerHTML += value;
        currentNum += value;
        notNumber = false;
        dot = true;
      }
      break;
  }
}

//按等於時
function finish(newNum) {
  mathCustody.push(newNum);
  answerValue.innerHTML = calculate();
  historyValue.innerHTML = answerValue.innerHTML;
  notNumber = true;
  mathCustody = [];
  currentNum = "";
  dot = true;
}

//不是按數字
function notNum(newNum, value) {
  //限制符號按鈕只能按一次
  if (notNumber == false) {
    mathCustody.push(newNum);
    mathCustody.push(value);
    answerValue.innerHTML += value;
    notNumber = true;
    dot = false;
    currentNum = "";
  }
}

//計算
function calculate() {
  var num1, num2, newNum;
  var multiply, divide, remainder, add, sub;

  //先乘除後加減
  //先判斷哪個符號不存在，如果存在在去判斷誰前誰後
  do {
    multiply = mathCustody.indexOf("*") + 1;
    divide = mathCustody.indexOf("/") + 1;
    remainder = mathCustody.indexOf("%") + 1;
    //console.log(multiply, divide, remainder);

    //每次都先判斷 /、*、% 是否還有，如果沒有了就跳下去算+、-，直到陣列裡剩下答案
    if (multiply > 0 || divide > 0 || remainder > 0) {
      if (((divide == false) || multiply - divide >= 0) && ((remainder == false) || multiply - remainder >= 0)) {
        multiply--;
        num1 = mathCustody[multiply - 1] * 1;
        num2 = mathCustody[multiply + 1] * 1;
        console.log(num1, num2, multiply - divide);
        newNum = num1 * num2;
        mathCustody.splice(multiply - 1, 3, newNum);
      } else if (((multiply == false) || divide - multiply >= 0) && ((remainder == false) || divide - remainder >= 0)) {
        divide--;
        num1 = mathCustody[divide - 1] * 1;
        num2 = mathCustody[divide + 1] * 1;
        console.log(num1, num2);
        newNum = num1 / num2;
        mathCustody.splice(divide - 1, 3, newNum);
      } else if (((multiply == false) || remainder - multiply >= 0) && ((divide == false) || remainder - divide >= 0)) {
        remainder--;
        num1 = mathCustody[remainder - 1] * 1;
        num2 = mathCustody[remainder + 1] * 1;
        newNum = (num1 * num2) / 100;
        mathCustody.splice(remainder - 1, 3, newNum);
      }
    } else {
      add = mathCustody.indexOf("+") + 1;
      sub = mathCustody.indexOf("-") + 1;

      if ((sub == false) || add - sub >= 0) {
        add--;
        num1 = mathCustody[add - 1] * 1;
        num2 = mathCustody[add + 1] * 1;
        newNum = num1 + num2;
        mathCustody.splice(add - 1, 3, newNum);
      } else if ((add == false) || sub - add >= 0) {
        sub--;
        num1 = mathCustody[sub - 1] * 1;
        num2 = mathCustody[sub + 1] * 1;
        newNum = num1 - num2;
        mathCustody.splice(sub - 1, 3, newNum);
      }
    }
    //console.log(mathCustody);
  } while (mathCustody.length > 1)

  return mathCustody[0];
}