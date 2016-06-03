'use strict';
//SCRIPTS FOR LANDING PAGE

// FOLLOWING CHECKS IF USERS BROWSER SUPPORTS LOCALSTORAGE OBJECT
function supports_html5_storage() {
  try {
    console.log("Local storage exists.");
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    window.alert("Sorry, but your browser won't allow us to save your native language for use on this site.");
    return false;
  }
}

// rws: supports_html5_storage() returns true/false, you are not using that information
// when you invoke it. If you are not using that information, dont return it.
supports_html5_storage();
// END LOCAL STORAGE CHECK




//WORKING!!! GRAB USER NATIVE LANGUAGE
//adds change event to the dropdown menu; function is triggered whenever value changes
var userNativeLang = ""; //set to store userLang code on change event
var userNativeLangFull = ""; //set to store full word
var langOptions = document.getElementById('language-choice-dropdown');


langOptions.addEventListener("change", storeUserLanguage);

function storeUserLanguage() {
  var langDropdown = document.getElementById("language-choice-dropdown");
  var langSelection = langDropdown.options[langDropdown.selectedIndex].value;
  var langSelectionFull = langDropdown.options[langDropdown.selectedIndex].innerHTML;
  console.log("The native language selection is: " + langSelection + " : " + langSelectionFull);
  userNativeLang = langSelection;
  userNativeLangFull = langSelectionFull;
  localStorage.setItem('nativeLanguage', langSelection); //stores lang in localStorage & resets on new language choice
  localStorage.setItem('nativeLanguageFull', langSelectionFull);
}
