"use strict";
//SCRIPTS FOR ALL PAGES

//set language display innerHTML to he user's lang choice
var usersNativeLang = localStorage.nativeLanguage;
var usersNativeLangFull = localStorage.nativeLanguageFull;
console.log(usersNativeLang + " : " + usersNativeLangFull);

var userNativeLangChoice = document.getElementById('users-native-lang-choice');
userNativeLangChoice.innerHTML = "Lang: " + usersNativeLangFull;
