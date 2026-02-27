const apikey = 'cd697b0a7e7ffb2a81ca90fb';

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
