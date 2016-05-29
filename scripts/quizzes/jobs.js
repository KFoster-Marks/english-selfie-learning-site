'use strict';
//This object holds the vocabulary for this module
var jobsObject = {
    noun: ['instructional designer', 'faculty', 'objectives', 'curriculum', 'process', 'materials', 'cleanup', 'code', 'e-learning', 'distance education', 'university', 'semester', 'office', 'activities', 'sessions', 'squirrel', 'paw', 'treats', 'horse', 'trainer', 'ranch', 'manager', 'duties', 'stalls', 'livestock', 'clients', 'husband', 'goats', 'chickens'],
    verb: ['building', 'develop', 'assess', 'shooting', 'editing', 'producing', 'teach', 'enjoy', 'meeting', 'find', 'grade', 'planning', 'exploring', 'napping', 'nap', 'bit'],
    adjective: ['online', 'audio', 'engaging', 'effective', 'American', 'group', 'international', 'full-time'],
    adverb: [],
    phrase: ['to make sure', 'to pick up', 'to deal with', 'to take care of']
};
var quizLength = 3; //sets the quiz length
var cumulativeScoreObject = {
    total: 0,
    correct: 0,
    incorrect: 0,
    needToStudy: []
};


//WORKING!!! global variables and event listeners
var beginQuizButton = document.getElementById('begin-quiz');
beginQuizButton.addEventListener('click', setNewQuizItem);
var header = document.querySelector('#good-luck-text > h1');
header.style.fontFamily = "Ubuntu";
header.style.fontSize = '3.5em';
var quizItemBlock = document.getElementById('quiz-item-block');
quizItemBlock.style.display = "none";
var nativeLanguageWord = document.querySelector('#native-language-vocab > span');
var targetLanguageOptionArray = document.getElementsByClassName('quiz-response-hover');
//WORKING!!! creates nextQuestionButton and sets event listeners
var nextQuestionButton = document.querySelector('#next-question');
nextQuestionButton.style.display = "none";
nextQuestionButton.addEventListener('click', set3RandomEngWords);
nextQuestionButton.addEventListener('click', setNativeWordAndTranslate);
nextQuestionButton.addEventListener('click', setNewQuizItem);

var quizProgressBlock = document.getElementById('quiz-progress-block');
var quizProgressDisplay = document.getElementById('quiz-progress');
quizProgressDisplay.innerHTML = (cumulativeScoreObject.correct + cumulativeScoreObject.incorrect + 1);
var quizLengthDisplay = document.getElementById('quiz-length');
quizLengthDisplay.innerHTML = quizLength;

var whatToStudyRow = document.getElementById('what-to-study-row');
var whatToStudyText = document.getElementById('what-to-study-text');
//create global object that tracks score and number of items completed



//WORKING!!! Takes a vocab object (defined above) and
//returns array of all vocab values for all word class keys
function putAllModuleVocabInOneArray(object) {
    var allVocabArray = [];
    for (var key in object) {
        for (var i = 0; i < object[key].length; i++) {
            allVocabArray.push(object[key][i]);
        }
    }
    //console.log(allVocabArray);
    return allVocabArray;
}


//WORKING!! if correct # of questions answered, completion message, score & study suggestion appear
function checkForQuizCompletion() {
    if (cumulativeScoreObject.total === quizLength) {
        console.log("You got " + cumulativeScoreObject.correct + " out of " + quizLength);
        header.innerHTML = "<b>Quiz completed!</b> <br>You scored " + cumulativeScoreObject.correct + " out of " + quizLength;
        header.style.marginTop = "0";
        quizItemBlock.style.display = "none";
        nextQuestionButton.style.display = "none";
        //for loop through cumulativeScoreObject.needToStudy and display them for user
        console.log("you need to study: " + cumulativeScoreObject.needToStudy);
        whatToStudyRow.style.display = "block";
        whatToStudyRow.style.backgroundColor = "orange";
        whatToStudyText.innerHTML = "<b>Study list:</b> " + cumulativeScoreObject.needToStudy;
        //add begin quiz button back tp page
        beginQuizButton.style.display = "block";
        beginQuizButton.style.marginTop = '3%';
        cumulativeScoreObject.total = 0;
        cumulativeScoreObject.correct = 0;
        cumulativeScoreObject.incorrect = 0;
    }
}


//WORKING!!!  sets eventListener on the three target language options
for (var i = 0; i < targetLanguageOptionArray.length; i++) {
    //console.log("added an event listener");
    targetLanguageOptionArray[i].addEventListener('click', checkForCorrectAnswer);
}


//WORKING!!! chooses a random word for the new quiz item
function chooseRandomVocabWord(arr) {
    arr = putAllModuleVocabInOneArray(jobsObject); //function returns array
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


//AJAX REQUEST
function ajax(method, url, handler) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                handler(null, JSON.parse(req.responseText));
            } else {
                handler(req.status, null);
            }
        }
    };
    req.open(method, url);
    req.send();
}

//WORKING!!! sets text and style for quiz item
function setNewQuizItem() {
    header.innerHTML = "Choose the correct translation.";
    whatToStudyRow.style.display = "none";
    beginQuizButton.style.display = "none";
    quizItemBlock.style.display = "";
    nextQuestionButton.style.display = "";
    quizProgressDisplay.innerHTML = (cumulativeScoreObject.total + 1);
}

// WORKING!!! checks if user response is correct
var theTranslatedWord;
function checkForCorrectAnswer(event) {
    var urlString = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160520T131217Z.ce9eb7a558c632c6.b545c9193722b47e3faf7a417fe30acef59ab341&text=" + event.target.innerHTML + "&lang=en-" + localStorage.nativeLanguage;
    ajax('GET', urlString, function(err, data) {
        if (!err) {
            theTranslatedWord = data.text[0];
        }
        //compare this to nativeLanguageWord.innerHTML in if statement
        if (theTranslatedWord === nativeLanguageWord.innerHTML) {
            console.log(theTranslatedWord + " : " + nativeLanguageWord.innerHTML);
            //give congrats message
            header.innerHTML = "Great job!";
            header.style.fontFamily = "Ubuntu";
            header.style.fontSize = '3.5em';
            //cumulativeScoreObject.correct increases by 1 when user answers correctly
            cumulativeScoreObject.correct += 1;
            cumulativeScoreObject.total += 1;
            console.log(cumulativeScoreObject);
            checkForQuizCompletion();
        } else {
            console.log('nope, they do not match');
            header.innerHTML = "Not quite. Try again!";
            //cumulativeScoreObject.incorrect increases by 1 when user answers correctly
            cumulativeScoreObject.incorrect += 1;
            cumulativeScoreObject.needToStudy.push(event.target.innerHTML);
            cumulativeScoreObject.total += 1;
            checkForQuizCompletion();
            //store incorrect answers randomWord in object
            console.log(cumulativeScoreObject.needToStudy);
            //re-sets the question
            set3RandomEngWords();
            setNativeWordAndTranslate();
        }
    });
}
