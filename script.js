const characters = {
    Aaron: {
        attributes: { Forza: 4, Destrezza: 3, stamina: 3, Carisma: 2, Persuasione: 2, autocontrollo: 2, intelligenza: 2, prontezza: 2, fermezza: 2 },
        skills: { Rissa: 4, Atletica: 2, Persuasione: 3 },
        weapons: ['Coltello', 'Pistola'],
        disciplines: {
            Celerità: 'Movimenti rapidissimi.',
            Potenza: 'Forza sovrumana.'
        }
    },
    Katherine: {
        attributes: { Forza: 1, Destrezza: 2, stamina: 2, Carisma: 4, Persuasione: 3, autocontrollo: 2, intelligenza: 3, prontezza: 3, fermezza: 2 },
        skills: { Intimidazione: 3, Empatia: 4, Investigazione: 2 },
        weapons: ['Katana', 'Revolver'],
        disciplines: {
            Auspex: 'Sensibilità e visione aumentata.',
            Dominazione: 'Controllo mentale.'
        }
    }
};

const charSelect = document.getElementById("character");
const attrSelect = document.getElementById("attribute");
const skillSelect = document.getElementById("skill");
const hungerSlider = document.getElementById("hunger");
const hungerValue = document.getElementById("hungerValue");
const weaponsList = document.getElementById("weaponsList");
const disciplinesAccordion = document.getElementById("disciplinesAccordion");
const resultDiv = document.getElementById("result");

function updateCharacter() {
    const char = characters[charSelect.value];
    attrSelect.innerHTML = '';
    skillSelect.innerHTML = '';
    weaponsList.innerHTML = '';
    disciplinesAccordion.innerHTML = '';

    for (let key in char.attributes) {
        attrSelect.innerHTML += <option value="${key}">${key} (${char.attributes[key]})</option>;
    }

    for (let key in char.skills) {
        skillSelect.innerHTML += <option value="${key}">${key} (${char.skills[key]})</option>;
    }

    char.weapons.forEach(w => {
        weaponsList.innerHTML += <li>${w}</li>;
    });

    for (let key in char.disciplines) {
        disciplinesAccordion.innerHTML += `
        <details class="bg-gray-700 p-2 rounded">
          <summary class="cursor-pointer font-semibold">${key}</summary>
          <p class="text-sm mt-1">${char.disciplines[key]}</p>
        </details>
      `;
    }
}

function rollDice() {
    const char = characters[charSelect.value];
    const attr = attrSelect.value;
    const skill = skillSelect.value;
    const total = char.attributes[attr] + char.skills[skill];
    const hunger = parseInt(hungerSlider.value);
    const norm = total - hunger;

    const normalDice = [];
    const hungerDice = [];

    for (let i = 0; i < norm; i++) normalDice.push(Math.ceil(Math.random() * 10));
    for (let i = 0; i < hunger; i++) hungerDice.push(Math.ceil(Math.random() * 10));

    let crits = [...normalDice, ...hungerDice].filter(n => n === 10).length;
    let pairs = Math.floor(crits / 2);
    let normalSuccess = [...normalDice, ...hungerDice].filter(n => n >= 6 && n < 10).length;
    let totalSuccess = normalSuccess + pairs * 4;

    resultDiv.innerHTML = `
      <h4 class="text-lg font-semibold mb-2">Risultati Tiro:</h4>
      <p><strong>Dadi Normali:</strong> ${normalDice.join(', ')}</p>
      <p><strong>Dadi Fame:</strong> ${hungerDice.join(', ')}</p>
      <p><strong>Successi Totali:</strong> ${totalSuccess}</p>
      <p><strong>Coppie di 10:</strong> ${pairs}</p>
    `;
}

charSelect.addEventListener('change', updateCharacter);
hungerSlider.addEventListener('input', () => {
    hungerValue.textContent = hungerSlider.value;
});

// Inizializzazione
for (let name in characters) {
    charSelect.innerHTML += <option value="${name}">${name}</option>;
}
updateCharacter();