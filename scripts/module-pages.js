'use strict';


// START HERE //
//REWRITE VARIABLE ASSIGNMENT BELOW SO THAT IT KNOWS WHICH VOCAB OBJECT TO GRAB


//WORKING: POPULATES HTML VOCAB TABLE
var vocabTable = document.querySelector('#vocab-table');
var jobsVocabObj = vocabulary.beginner.jobs;
// WORKING loop through part of speech keys in object
var count = 1;
for (var key in jobsVocabObj) {
  for (var i = 0; i < jobsVocabObj[key].length; i++) {
    var vocabWord = jobsVocabObj[key][i];
    // WORKING for each i, create row
    var newTableRow = document.createElement('tr');
    // WORKING create & append td with number starting from 1,
    var tdNumber = document.createElement('td');
    tdNumber.innerHTML = count;
    newTableRow.appendChild(tdNumber);
    // WORKING create & append td with jobsVocabObj[key][i],
    var tdWord = document.createElement('td');
    tdWord.innerHTML = vocabWord;
    tdWord.style.textAlign = "center";
    newTableRow.appendChild(tdWord);
    // WORKING create & append td with jobsVocabObj[key],
    var tdPartOfSpeech = document.createElement('td');
    tdPartOfSpeech.innerHTML = key;
    tdPartOfSpeech.style.textAlign = "center";
    newTableRow.appendChild(tdPartOfSpeech);
    // WORKING append row to table
    vocabTable.appendChild(newTableRow);
    count +=1;
  }
}

// WORKING: SHOW/HIDE VOCABULARY & GRAMMAR ON CLICK
var vocabGrammarButton = document.getElementById('vocab-grammar-button');
vocabGrammarButton.addEventListener('click', showVocabAndGrammar);
var table = document.querySelector('#main-content > div:nth-child(4)');
table.style.display = "none"; //default display is none
function showVocabAndGrammar() {
  console.log("vocab button was clicked");
  if (table.style.display !== "none") {
    table.style.display = "none";
  } else {
    table.style.display = "block";
    vocabGrammarButton.innerHTML = "Hide Vocabulary & Grammar";
  }
}


//WORKING: VOCAB WORDS HIGHLIGHTED
  //Following creates variable (array-like-object) that holds all p elements
  var pElements = document.getElementsByClassName("video-transcript");
  //Loops through p elements
  for (var i = 0; i < pElements.length; i++) {
    //Converts paragraph to an array of words
    var paragraph = pElements[i].innerHTML;
    var paragraphSplitArray = paragraph.split(' ');
    //Loops through these words
    for (var j = 0; j < paragraphSplitArray.length; j++) {
      //Removes all periods and commas
      var arrayWord = paragraphSplitArray[j];
      var arrayWordClean = arrayWord.replace(/[,.]/g, "");
      //Loop through vocabObj keys
      for (var key in jobsVocabObj) {
        //Loops through vocabObj[key][i]
        for (var v = 0; v < jobsVocabObj[key].length; v++) {
          //Adds class of vocab-highlight to matches
          if ((jobsVocabObj[key][v]).toLowerCase() === (arrayWordClean).toLowerCase()) {
            arrayWordClean = "<span class='vocab-highlight'>" + arrayWordClean + "</span>";
            //Inserts elements with span class into old array
            paragraphSplitArray[j] = arrayWordClean;
            //Converts old array to string
            var highlightedParagraph = paragraphSplitArray.join(" ");
            pElements[i].innerHTML = highlightedParagraph;
          }
        }
      }
    }
  }


//WORKING: SHOW/HIDE TRANSCRIPT
var hideTranscriptButtons = document.getElementsByClassName('hide-transcript');
var showTranscriptButtons = document.getElementsByClassName('show-transcript');
for (var i = 0; i < hideTranscriptButtons.length; i++) {
  hideTranscriptButtons[i].addEventListener('click', hideShowTranscript);
}
for (var i = 0; i < showTranscriptButtons.length; i++) {
  showTranscriptButtons[i].addEventListener('click', hideShowTranscript);
}
function hideShowTranscript() {
  console.log("button was clicked");
  if (this.previousElementSibling.style.display !== "none") {
    var theParagraph = this.previousElementSibling;
    theParagraph.style.display = "none";
    console.log("paragraph disappears");
    this.style.display = "none";
    console.log("button disappears");
    console.log(this.nextElementSibling);
    this.nextElementSibling.style.display = "block";
  } else {
    console.log("paragraph should appear");
    var theUpArrow = this.previousElementSibling;
    var theHiddenParagraph = theUpArrow.previousElementSibling;
    theHiddenParagraph.style.display = "block";
    theUpArrow.style.display = "block";
    this.style.display = "none";
  }
}


//WORKING: SHOW VOCAB TRANSLATION ON HOVER
//Grabs all elements with class of vocab-highlight
var vocabHighlightClassElements = document.getElementsByClassName('vocab-highlight');
//Adds mouseenter & mouseout event listeners
for (var i = 0; i < vocabHighlightClassElements.length; i++) {
  vocabHighlightClassElements[i].addEventListener('mouseenter', hoverTranslateOn);
  vocabHighlightClassElements[i].addEventListener('mouseout', hoverTranslateOff);
}
var englishWord;
function hoverTranslateOn(event) {
  englishWord = this.innerHTML;
  this.style.backgroundColor = 'lightgray';
  this.style.borderColor = 'lightgray';
  //urlString modifies the request string
  var urlString = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160520T131217Z.ce9eb7a558c632c6.b545c9193722b47e3faf7a417fe30acef59ab341&text=" + englishWord + "&lang=en-" + localStorage.nativeLanguage;
  ajax('GET', urlString, function(err, data) {
    if(!err) {
      event.target.innerHTML = data.text[0];
    }
  });
}
function hoverTranslateOff() {
  this.innerHTML = englishWord;
  this.style.backgroundColor = '#f6dcb6';
}
