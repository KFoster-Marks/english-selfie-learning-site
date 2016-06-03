'use strict';

//USER'S NATIVE LANGUAGE WAS STORED IN localStorage
//console.log(localStorage.nativeLanguage);

//AJAX REQUEST
var translatedWord = ""; //global variable

//rws: you only need to include the ajax function once,
// when a script is loaded, all the global functions and variables
// are available to all other scripts.
// You have to be carefull, you have to load the script with the functions
// before you are able to use them.
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

//WORKING: POPULATE HTML VOCAB TABLE
var vocabTable = document.querySelector('#vocab-table');
//console.log(vocabTable);
//loop through vocabulary object for this module (vocabulary.beginner.jobs)
var jobsVocabObj = vocabulary.beginner.jobs;
//console.log(jobsVocabObj);
// WORKING loop through part of speech keys in object
var count = 1;
for (var key in jobsVocabObj) {
  //console.log(key);
  // WORKING loop through each i in array
  for (var i = 0; i < jobsVocabObj[key].length; i++) {
    var vocabWord = jobsVocabObj[key][i];
    //console.log(vocabWord);
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
    table.style.display = "";
    vocabGrammarButton.innerHTML = "Hide Vocabulary & Grammar";
  }
}


//WORKING: VOCAB WORDS HIGHLIGHTED
  //create variable (array-like-object) that holds all p elements
  var pElements = document.getElementsByClassName("video-transcript");
  // //loop through these p elements
  for (var i = 0; i < pElements.length; i++) {
    //convert to array of words
    var paragraph = pElements[i].innerHTML;
    var paragraphSplitArray = paragraph.split(' ');
    //console.log(paragraphSplitArray);
    //loop through these words
    for (var j = 0; j < paragraphSplitArray.length; j++) {
      //console.log(paragraphSplitArray[j]);
      //replace all periods and commas with nothing
      var arrayWord = paragraphSplitArray[j];
      var arrayWordClean = arrayWord.replace(/[,.]/g, "");
      //console.log(arrayWordClean);
      //loop through vocabObj keys
      for (var key in jobsVocabObj) {
        //console.log(key);
        //loop through vocabObj[key][i]
        for (var v = 0; v < jobsVocabObj[key].length; v++) {
          //console.log(jobsVocabObj[key][v]);
          //if vocabObj[key][v] === p element array[i], add class of vocab-highlight
          if ((jobsVocabObj[key][v]).toLowerCase() === (arrayWordClean).toLowerCase()) {
            //console.log("We have a match!");
            //add span class to (arrayWordClean)
            arrayWordClean = "<span class='vocab-highlight'>" + arrayWordClean + "</span>";
            //console.log(arrayWordClean);
            //Insert elements with span class into old array
            paragraphSplitArray[j] = arrayWordClean;
            //console.log(paragraphSplitArray);
            //turn old array into string again
            var highlightedParagraph = paragraphSplitArray.join(" ");
            pElements[i].innerHTML = highlightedParagraph;
            //console.log(highlightedParagraph);
          }
        }
      }
    }
  }


//FUCKING YES!!!! SHOW/HIDE TRANSCRIPT
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


//WORKING!!! --> SHOW VOCAB TRANSLATION ON HOVER
//grab all elements with class of vocab-highlight
var vocabHighlightClassElements = document.getElementsByClassName('vocab-highlight');
//console.log(vocabHighlightClassElements);
//add the two event listeners
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
  //makes the request
  //below, don't define variable with returned value...causing 'undefined' to show while function executes
  ajax('GET', urlString, function(err, data) {
    if(!err) {
      console.log(data.text[0]); //calling ajax returns translated text
      event.target.innerHTML = data.text[0];
    }
  });
}
function hoverTranslateOff() {
  this.innerHTML = englishWord;
  this.style.backgroundColor = '#f6dcb6';
}
