const apikey = 'cd697b0a7e7ffb2a81ca90fb';



const currencyNames = {};
(function grabNames(){
  const sel = document.getElementById('fromcurrency');
  Array.from(sel.options).forEach(o => {
    currencyNames[o.value] = o.textContent;
  });
})();

function allCurrencyCodes() {
  return Object.keys(currencyNames);
}

let favs = JSON.parse(localStorage.getItem('favs')) || [];

function saveFav(code) {
  if (!favs.includes(code)) {
    favs.unshift(code);
    if (favs.length > 20) favs.pop();
    localStorage.setItem('favs', JSON.stringify(favs));
    renderSelects();
  }
}

function renderSelects() {
  const codes = allCurrencyCodes();
  const fromSel = document.getElementById('fromcurrency');
  const toSel = document.getElementById('tocurrency');
  [fromSel, toSel].forEach(sel => {
    const current = sel.value;
    sel.innerHTML = '';
    favs.forEach(c => {
      if (codes.includes(c)) {
        sel.insertAdjacentHTML('beforeend', `<option value="${c}">${currencyNames[c] || c}</option>`);
      }
    });
    codes.forEach(c => {
      if (!favs.includes(c)) {
        sel.insertAdjacentHTML('beforeend', `<option value="${c}">${currencyNames[c] || c}</option>`);
      }
    });
    sel.value = current;
  });
}

renderSelects();

const convertbutton = document.getElementById('convertbutton');

convertbutton.addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('amount').value) || 0;
  const fromcurrency = document.getElementById('fromcurrency').value;
  const tocurrency = document.getElementById('tocurrency').value;
  const resultbox = document.querySelector('.result');

  if (!amount || amount <= 0) {
    alert('Skriv inn et gyldig beløp');
    return;
  }

  fetch(`https://v6.exchangerate-api.com/v6/${apikey}/latest/${fromcurrency}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.conversion_rates[tocurrency];
      const converted = (amount * rate).toFixed(2);
      resultbox.innerHTML = `${converted} ${tocurrency} <br> (1 ${fromcurrency} = ${rate} ${tocurrency})`;
      resultbox.classList.add('show');
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
