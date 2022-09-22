//---------------------------------------------------------------
/* const {readFileSync, promises: fsPromises} = require('fs'); // bu kod bloğunda "require" node.js kütüphane eksikliğinden kaynaklı hata verdiği için aşağıdaki kod bloğunu kullandım.

function syncReadFile(filename) {
	const contents = readFileSync(filename, 'utf-8');
	const fileList = contents.split(/\r?\n/);
	console.log(fileList);
	return fileList;
}

syncReadFile("./word.txt"); */
//---------------------------------------------------------------

// VARİABLES

const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById("final-message-reveal-word");
const startplay = document.getElementById("game-section");
const startbtn = document.getElementById("start-button");
const closebtn = document.getElementById("close-button");
const closeHintButton = document.getElementById("close-hint");
const closeHintArea = document.getElementById("hint");
const wordElement = document.getElementById("correctword");
const figureParts = document.querySelectorAll(".figure-part");
let givenWords;
let selection;
let hintWord;
let hintMessage;
let mainSelection;
let indexOfSelection;
let playable = true;
const correctLetters = [];
const wrongLetters = [];

//COMMAND TO RETURN TEXT

function readTextFile(file) {
  //bu kodu da stackoverflowdan buldum
  var allText = "";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
      }
    }
  };
  rawFile.send(null);
  return allText;
}
//console.log(readTextFile("./word.txt"));

//RANDOM WORD SELECTİON FROM TEXT

function getRandomWord() {
  const readText = readTextFile("./word.txt");
  const splitReadText = readText.split("\n");
  const listText = [];
  splitReadText.forEach((element) => {
    listText.push(element.trim());
  });
  //console.log(listText);
  givenWords = listText;

  return givenWords[Math.floor(Math.random() * givenWords.length)];
}
//console.log(getRandomWord());

hintMessage = document.getElementById("hint-word");
mainSelection = getRandomWord();

//DISPLAY WORD AND HINT AREA

function displayWord() {
  indexOfSelection = mainSelection.indexOf("-");
  selection = mainSelection.slice(0, indexOfSelection);
  hintWord = mainSelection.slice(indexOfSelection + 1, mainSelection.length);
  hintMessage.innerHTML = `${hintWord}`;
  wordElement.innerHTML = ` ${selection
    .split("")
    .map(
      (letter) => ` <div class="letter"> 
	${correctLetters.includes(letter) ? letter : ""}
	</div>
	`
    )
    .join("")}`;

  const enteredWord = wordElement.innerText.replace(/[ \n]/g, "");

  if (enteredWord === selection) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    popup.style.display = "flex";

    playable = false;
  }
}
displayWord();

// UPDATE WRONG LETTERS

function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong-Letters</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (errors == 7) {
      closeHintArea.style.display = "block";
    }
    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately 😕 you lost."; //😕
    finalMessageRevealWord.innerText = `...the corret
		word was: ${selection}`;
    popup.style.display = "flex";

    playable = false;
  }
}

//RESTART AND PLAY AGAIN BUTTON

playAgainBtn.addEventListener("click", () => {
  playable = true;
  //  Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  mainSelection = getRandomWord();

  displayWord();

  updateWrongLettersEl();

  popup.style.display = "none";
  closeHintArea.style.display = "none";
});
displayWord();

// SHOW NOTIFICATION

function showNotification() {
  notification.classList.add("show");

  setTimeout(function () {
    notification.classList.remove("show");
  }, 1300);
}

// KEYDOWN keycode kullanımdan kaldırıldığı için aşadığıdaki 3 lü keyeventi kullanmaya çalışacağım.
/* var dispatchForCode = function(event, callback) {
	var code;
  
	if (event.key !== undefined) {
	  code = event.key;
	} else if (event.keyIdentifier !== undefined) {
	  code = event.keyIdentifier;
	} else if (event.keyCode !== undefined) {
	  code = event.keyCode;
	}
  
	callback(code);
  };
*/

function keyDownListen() {
  window.addEventListener("keydown", function (e) {
    if (playable) {
      if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 219 ) {
        const letter = e.key.toLowerCase();

        if (selection.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            correctLetters.push(letter);

            displayWord();
          } else {
            showNotification();
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);

            updateWrongLettersEl();
          } else {
            showNotification();
          }
        }
      }
    }
  });
}

// START BUTTON  (TAMAMLANDI ŞİMDİLİK DÜZGÜN ÇALIŞIYOR)

function changeGameArea() {
  keyDownListen();
  startplay.classList.remove("game-section");
  startplay.classList.add("game-section-start");
  startbtn.style.display = "none";
  closebtn.style.display = "block";
}

function closeGame() {
  startplay.classList.remove("game-section-start");
  startplay.classList.add("game-section");
  startbtn.style.display = "block";
  closebtn.style.display = "none";
}

function closeHint() {
  closeHintButton.classList.remove("hint");
  closeHintArea.style.display = "none";
}

//CLOSE BUTTON (TAMAMLANDI ŞİMDİLİK DÜZGÜN ÇALIŞIYOR)

closebtn.addEventListener("click", () => {
  playable = true;

  //  Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  mainSelection = getRandomWord();

  displayWord();

  updateWrongLettersEl();
  closeHintArea.style.display = "none";
});
displayWord();

//window.location.reload();  SAYFAYI YENİLEME
