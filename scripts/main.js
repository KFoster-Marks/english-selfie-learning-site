"use strict";
//SCRIPTS FOR ALL PAGES

//set language display innerHTML to he user's lang choice
var usersNativeLang = localStorage.nativeLanguage;
var usersNativeLangFull = localStorage.nativeLanguageFull;
console.log(usersNativeLang + " : " + usersNativeLangFull);

var userNativeLangChoice = document.getElementById('users-native-lang-choice');

var userNativeLangChoiceTranslated;
var urlString = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160520T131217Z.ce9eb7a558c632c6.b545c9193722b47e3faf7a417fe30acef59ab341&text=" + usersNativeLangFull + "&lang=en-" + localStorage.nativeLanguage;

ajax('GET', urlString, function(err, data) {
  if(!err) {
    userNativeLangChoiceTranslated = data.text[0];
    userNativeLangChoice.innerHTML = userNativeLangChoiceTranslated;
  }
});

//AJAX REQUESTS
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
