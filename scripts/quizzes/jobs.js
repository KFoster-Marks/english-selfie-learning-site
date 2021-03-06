'use strict';

var cumulativeScoreObject = {
    total: 0,
    correct: 0,
    incorrect: 0,
    needToStudy: []
};

function ajax(method, url, handler) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if(req.status === 200) {
        handler(null, JSON.parse(req.responseText));
      } else {
        handler(req.status, null);
      }
    }
  };
  req.open(method, url);
  req.send();
}


// Global variables and event listeners
var backButton = document.getElementById('back-button-block');
backButton.addEventListener('click', goBack);
function goBack() {
    window.history.back();
}

var beginQuizButton = document.getElementById('begin-quiz');
beginQuizButton.addEventListener('click', setNewQuizItem);
var header = document.querySelector('#good-luck-text > h1');
header.style.fontFamily = "Ubuntu";
header.style.fontSize = '3.5em';
var quizItemBlock = document.getElementById('quiz-item-block');
quizItemBlock.style.display = "none";
var nativeLanguageWord = document.querySelector('#native-language-vocab > span');
var targetLanguageOptionArray = document.getElementsByClassName('quiz-response-hover');
//Creates nextQuestionButton and sets event listeners
var nextQuestionButton = document.querySelector('#next-question');
nextQuestionButton.style.display = "none";
nextQuestionButton.addEventListener('click', set3RandomEngWords);
nextQuestionButton.addEventListener('click', setNativeWordAndTranslate);
nextQuestionButton.addEventListener('click', setNewQuizItem);
var whatToStudyRow = document.getElementById('what-to-study-row');
var whatToStudyText = document.getElementById('what-to-study-text');


//QUIZ PROGRESS VARIABLES
var quizLength = 0; //sets the quiz length
var quizProgressBlock = document.getElementById('quiz-progress-block');
var quizProgressDisplay = document.getElementById('quiz-progress');
quizProgressDisplay.innerHTML = (cumulativeScoreObject.correct + cumulativeScoreObject.incorrect + 1);
var quizLengthDisplay = document.getElementById('quiz-length');
quizLengthDisplay.innerHTML = quizLength;
var quizLengthOptions = document.getElementById('quiz-length-options');
var quizLengthDiv = document.getElementById('quiz-length-div');
quizLengthOptions.addEventListener('change', storeQuizLength);
function storeQuizLength() {
  quizLength = (quizLengthOptions.options[quizLengthOptions.selectedIndex].value);
  quizLengthDisplay.innerHTML = quizLength;
}


//Converts vocab object to single array; used later to populate quiz items
function putAllModuleVocabInOneArray(object) {
    var allVocabArray = [];
    for (var key in object) {
        for (var i = 0; i < object[key].length; i++) {
            allVocabArray.push(object[key][i]);
        }
    }
    return allVocabArray;
}


//WORKING!!!  sets eventListener on the three target language options
for (var i = 0; i < targetLanguageOptionArray.length; i++) {
    //console.log("added an event listener");
    targetLanguageOptionArray[i].addEventListener('click', checkForCorrectAnswer);
}


////// START HERE ///////
//RE-WRITE FUNCTION BELOW SO THAT IT RECOGNIZES WHAT SHOULD BE PLACED IN VOCAB.BEGINNER.JOBS
// NOTE: REFACTOR THE ENTIRE SITE WITH EXPRESS...USE TEMPLATES AND VIEWS TO ACHIEVE THIS

//WORKING!!! chooses a random word for the new quiz item
function chooseRandomVocabWord() {
    var arr = putAllModuleVocabInOneArray(vocabulary.beginner.jobs); //function returns array
    //next: choose a random item in the array
    var randomWord = arr[Math.floor(Math.random() * arr.length)];
    //console.log("This word is random: " + randomWord);
    return randomWord;
}
chooseRandomVocabWord();

//WORKING: following randomly sets the three english words; also returns an array of these words to be used for native-language translation word
var threeEnglishVocabOptions = []; //this stores three english words
function set3RandomEngWords() {
    while (threeEnglishVocabOptions.length > 0) {
        threeEnglishVocabOptions.pop(); //this empties the array of three previous words
    }
    for (var i = 0; i < targetLanguageOptionArray.length; i++) {
        //for each [i], run chooseRandomVocabWord and set the innerHTML to returned random vocab item
        var theEngOption = chooseRandomVocabWord();
        console.log(theEngOption);
        //following makes sure that no two of the three english options are the same
        if (theEngOption === threeEnglishVocabOptions[0] || theEngOption === threeEnglishVocabOptions[1]) {
            console.log("That word has already been chosen!");
            set3RandomEngWords();
        }
        targetLanguageOptionArray[i].innerHTML = theEngOption;
        threeEnglishVocabOptions.push(theEngOption);
    }
}
set3RandomEngWords();

//WORKING!!! picks one word from 3-word array to use as native-language match
function setNativeWordAndTranslate() {
    var randomWord = threeEnglishVocabOptions[Math.floor(Math.random() * threeEnglishVocabOptions.length)];
    //randomWord translated to native language
    var randomWordTranslation;
    var urlString = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160520T131217Z.ce9eb7a558c632c6.b545c9193722b47e3faf7a417fe30acef59ab341&text=" + randomWord + "&lang=en-" + localStorage.nativeLanguage;
    //api request activated here
    ajax('GET', urlString, function(err, data) {
        if (!err) {
            randomWordTranslation = data.text[0];
        }
        //set this translation as innerHTML below
        nativeLanguageWord.innerHTML = randomWordTranslation;
    });
}
setNativeWordAndTranslate();


//WORKING!!! sets text and style for quiz item
function setNewQuizItem() {
    quizLengthDiv.style.display = "none";
    header.innerHTML = "Choose the correct translation.";
    whatToStudyRow.style.display = "none";
    beginQuizButton.style.display = "none";
    quizItemBlock.style.display = "block";
    nextQuestionButton.style.display = "";
    quizProgressBlock.style.display = "block";
    quizProgressDisplay.innerHTML = (cumulativeScoreObject.total + 1);
}

// Checks if user response is correct
var userChoiceTranslated;
function checkForCorrectAnswer(event) {
    var urlString = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160520T131217Z.ce9eb7a558c632c6.b545c9193722b47e3faf7a417fe30acef59ab341&text=" + event.target.innerHTML + "&lang=en-" + localStorage.nativeLanguage;
    ajax('GET', urlString, function(err, data) {
        if (!err) {
            userChoiceTranslated = data.text[0];
        }
        //Compares this to nativeLanguageWord.innerHTML in if statement
        if (userChoiceTranslated === nativeLanguageWord.innerHTML) {
            console.log(userChoiceTranslated + " : " + nativeLanguageWord.innerHTML);
            //give congrats message
            header.innerHTML = "Great job!";
            header.style.fontFamily = "Ubuntu";
            header.style.fontSize = '3.5em';
            //cumulativeScoreObject.correct increases by 1 when user answers correctly
            cumulativeScoreObject.correct += 1;
            cumulativeScoreObject.total += 1;
            checkForQuizCompletion();
        } else {
            console.log('nope, they do not match');
            header.innerHTML = "Not quite. Try again!";
            //cumulativeScoreObject.incorrect increases by 1 when user answers correctly
            cumulativeScoreObject.incorrect += 1;
            cumulativeScoreObject.needToStudy.push(event.target.innerHTML);
            cumulativeScoreObject.total += 1;
            quizProgressDisplay.innerHTML = (cumulativeScoreObject.total + 1);
            checkForQuizCompletion();
            //store incorrect answers randomWord in object
            console.log(cumulativeScoreObject.needToStudy);
            //re-sets the question
            set3RandomEngWords();
            setNativeWordAndTranslate();
        }
    });
}


//If # answered equals quizLength, completion message, score & study suggestion appear
function checkForQuizCompletion() {
    if (cumulativeScoreObject.total === Number(quizLength)) {
        console.log("You got " + cumulativeScoreObject.correct + " out of " + quizLength);
        header.innerHTML = "<b>Quiz completed!</b> <br>You scored " + cumulativeScoreObject.correct + " out of " + quizLength;
        header.style.marginTop = "0";
        quizItemBlock.style.display = "none";
        nextQuestionButton.style.display = "none";
        console.log("you need to study: " + cumulativeScoreObject.needToStudy);
        whatToStudyRow.style.display = "block";
        whatToStudyRow.style.backgroundColor = "orange";
        whatToStudyText.innerHTML = "<b>Study list:</b> " + cumulativeScoreObject.needToStudy;
        //add begin quiz button back tp page
        beginQuizButton.style.display = "block";
        beginQuizButton.style.marginTop = '3%';
        //remove quiz progress display
        quizProgressBlock.style.display = "none";
        cumulativeScoreObject.total = 0;
        cumulativeScoreObject.correct = 0;
        cumulativeScoreObject.incorrect = 0;
    }
}
