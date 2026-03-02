const apikey = 'cd697b0a7e7ffb2a81ca90fb'; // dette er API nøkkelen som brukes for å hente valutakurser fra app.exchangerate-api.com



const currencyNames = {}; // denne laget et tomt objekt som senere skal fylled med valutakoder og navn
(function grabNames(){ //lager en funksjon som umiddelbart kjører
  const sel = document.getElementById('fromcurrency'); //henter select elementet for fromcurrency
  Array.from(sel.options).forEach(o => { //går gjennom alle option elementene i select menyen
    currencyNames[o.value] = o.textContent; // Lagrer valutakode og navn i currencyNames
  });
})();

//denne funksjonen henter alle valutakodene fra currencynames
function allCurrencyCodes() {
  return Object.keys(currencyNames);
}

// denne ser om du har noen valutaer lagret som favoritter i localstorage og om du ikke har det så lager den en ny liste
let favs = JSON.parse(localStorage.getItem('favs')) || [];

// denne funksjonen legger til en valutakode i favorittlisten og oppdaterer localstorage og menyene
function saveFav(code) {
  if (!favs.includes(code)) { // sjekker om koden allerede er i favorittlisten
    favs.unshift(code); // legger til den nye favoritten først i listen
    if (favs.length > 20) favs.pop(); // hvis listen blir for lang så fjerner den den eldste favoritten
    localStorage.setItem('favs', JSON.stringify(favs)); // lagrer favorittlisten i localstorage noe som gjør at den ikke blir borte når du lukker nettsiden
    renderSelects(); // oppdaterer menyene slik at favorittene vises øverst når bruker velger valutta
  }
}

function renderSelects() { //dette er starten på en funksjon som oppdaterer menyene for å velge valuta
  const codes = allCurrencyCodes(); // den samler alle valutakodene som skal være tilgjengelige menyen funker med favoritter og ikke favortiter.
  const fromSel = document.getElementById('fromcurrency'); // henter select elementet for fromcurrency
  const toSel = document.getElementById('tocurrency'); // henter select elementet for tocurrency
  [fromSel, toSel].forEach(sel => { // denne gjør så begge menyene blir oppdatert på samme måte og ser like ut
    const current = sel.value; // lagrer hvilken valuta som er valgt i menyen før den oppdateres
    sel.innerHTML = ''; // tømmer menyen slik at den kan fylles på nytt med favoritter først og så resten av valutakodene
    favs.forEach(c => { //starter en loop som går igjennom alle favortitene og plaserer de øverst i menyen
      if (codes.includes(c)) { // sjekker om favoritt valutaen finnes i listen over alle valutakoder for å unngå å legge til ugyldige koder i menyen
        sel.insertAdjacentHTML('beforeend', `<option value="${c}">${currencyNames[c] || c}</option>`); // lager et nytt menyvalg med valutakoden og legger det til i menyen
      }
    });
    codes.forEach(c => { // legger inn andre valutaer som ikke er favoritter i menyen
      if (!favs.includes(c)) {
        sel.insertAdjacentHTML('beforeend', `<option value="${c}">${currencyNames[c] || c}</option>`); // lager et nytt menyvalg med valutakoden og legger det til i menyen
      }
    });
    sel.value = current; // husker hvilker valuta som var valgt siden menyen ble tømt
  });
}

renderSelects(); 

const convertbutton = document.getElementById('convertbutton'); // den kjører koden når du klikker på konverter knappen

convertbutton.addEventListener('click', () => { // den venter på et klikk og når det skjer så kjøres koden som henter valutakursen
  const amount = parseFloat(document.getElementById('amount').value) || 0; // her tar den beløpet som brukeren har skrevet inn og gjør det om til et tall
  const fromcurrency = document.getElementById('fromcurrency').value; // her tar den valutakoden som brukeren har valgt i fromcurrency menyen
  const tocurrency = document.getElementById('tocurrency').value; // her tar den valutakoden som brukeren har valgt i tocurrency menyen
  const resultbox = document.querySelector('.result'); // her henter den elementet som skal vise resultatet av konverteringen

  // skjekker om beløpet er gyldig og hvis ikke så viser den en feilmelding og stopper koden
  if (!amount || amount <= 0) {
    alert('Skriv inn et gyldig beløp');
    return;
  }

  fetch(`https://v6.exchangerate-api.com/v6/${apikey}/latest/${fromcurrency}`) // her sender den en fetch forespørsel ti APIet for å hente valutakursen
    .then(res => res.json()) // den gjør svarene om til json format
    .then(data => { 
      const rate = data.conversion_rates[tocurrency]; // den henter kursen for den valuttaen som brukeren valgte å konvertere til
      const converted = (amount * rate).toFixed(2); // /her regner den ut beløpet med å multiplisere med kursen
      resultbox.innerHTML = `${converted} ${tocurrency} <br> (1 ${fromcurrency} = ${rate} ${tocurrency})`; // den setter teksten som skal vises til brukeren i resultat boksen
      resultbox.classList.add('show'); // denne legger den til i css classen fordi boksen vises ikke før det kommer et resultat
    })
    .catch(err => {
      console.error(err);
      alert('Noe gikk galt. Sjekk konsollen.');
    });
});

Array.from(document.querySelectorAll('.favoriteknapp')).forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sel = document.getElementById(target);
    if (sel) saveFav(sel.value);
  });
});
