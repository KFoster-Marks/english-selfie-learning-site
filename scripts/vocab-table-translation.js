//5. create & append translated word using api

var tdTranslation = document.createElement('td');
tdTranslation.innerHTML = "t";
var urlString = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160520T131217Z.ce9eb7a558c632c6.b545c9193722b47e3faf7a417fe30acef59ab341&text=" + vocabWord + "&lang=en-" + localStorage.nativeLanguage;

ajax('GET', urlString, function(err, data) {
  if(!err) {
    translatedWord = data.text[0];
    tdTranslation.innerHTML = translatedWord;
  }
});
newTableRow.appendChild(tdTranslation);
