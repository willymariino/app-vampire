window.addEventListener("DOMContentLoaded", () => {
    const characters = {
        Aaron: {
            attributes: {
                Forza: 4, Destrezza: 3, Stamina: 3, Carisma: 2,
                Persuasione: 2, Autocontrollo: 2, Intelligenza: 2,
                Prontezza: 2, Fermezza: 2
            },
            skills: { Rissa: 4, Atletica: 2, Persuasione: 3 },
            weapons: {
                "Spadone di Akrasiel (+4 aggravati)": false,
                "Scimitarra Sabbat (+3 superficiali)": false,
                "Pugnale Argento (+2 superficiali)": false,
                "Pistola (+3 superficiali)": false,
                "Coltello a Serramanico (+2 superficiali)": false
            },
            disciplines: {
                Proteide: [
                    "Occhi della Bestia",
                    "Armi Ferali",
                    "Peso della Piuma",
                    "Forma Bestiale",
                    "Metamorfosi"
                ],
                Robustezza: ["Resilienza", "Robustezza"]
            }
        },
        Katherine: {
            attributes: {
                Forza: 1, Destrezza: 2, Stamina: 2, Carisma: 4,
                Persuasione: 3, Autocontrollo: 2, Intelligenza: 3,
                Prontezza: 3, Fermezza: 2
            },
            skills: { Intimidazione: 3, Empatia: 4, Investigazione: 2 },
            weapons: {
                "Pugnale di Akkad (+2 aggravati)": false,
                "Pugnale d’Argento (+2 superficiali)": false,
                "Pistola (+3 superficiali)": false
            },
            disciplines: {
                Auspex: ["Sensi Aumentati", "Preveggenza"],
                Ascendente: ["Soggezione", "Spaventare"],
                Celerità: ["Grazia Felina", "Blink", "Fleetness"]
            }
        }
    };
    const charSelect = document.getElementById("character");
    const attrSelect = document.getElementById("attribute");
    const skillSelect = document.getElementById("skill");
    const hungerSlider = document.getElementById("hunger");
    const hungerValue = document.getElementById("hungerValue");
    const weaponsList = document.getElementById("weaponsList");
    const weaponsSelector = document.createElement("div");
    const disciplinesAccordion = document.getElementById("disciplinesAccordion");
    const resultDiv = document.getElementById("result");
    // Aggiunta dinamica al DOM per selezione armi
    weaponsList.before(weaponsSelector);
    function updateCharacter() {
        const char = characters[charSelect.value];
        attrSelect.innerHTML = '';
        skillSelect.innerHTML = '';
        weaponsList.innerHTML = '';
        weaponsSelector.innerHTML = '<p class="label">Seleziona Equipaggiamento:</p>';
        disciplinesAccordion.innerHTML = '';
        // Attributi
        Object.entries(char.attributes).forEach(([key, val]) => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = `${key} (${val})`;
            attrSelect.appendChild(option);
        });
        // Skill
        Object.entries(char.skills).forEach(([key, val]) => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = `${key} (${val})`;
            skillSelect.appendChild(option);
        });
        // Armi selezionabili (checkbox)
        Object.keys(char.weapons).forEach(weapon => {
            const id = `equip-${weapon.replace(/\W/g, '')}`;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = id;
            checkbox.name = weapon;
            checkbox.classList.add("checkbox");
            checkbox.addEventListener("change", () => updateWeaponsList());
            const label = document.createElement("label");
            label.setAttribute("for", id);
            label.textContent = weapon;
            label.classList.add("weapon-label");
            const wrapper = document.createElement("div");
            wrapper.classList.add("checkbox-wrapper");
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            weaponsSelector.appendChild(wrapper);
        });
        // Discipline Accordion
        Object.entries(char.disciplines).forEach(([disc, abilities]) => {
            const details = document.createElement("details");
            details.classList.add("accordion-item");
            const summary = document.createElement("summary");
            summary.textContent = disc;
            details.appendChild(summary);
            const content = document.createElement("ul");
            abilities.forEach(ab => {
                const li = document.createElement("li");
                li.textContent = ab;
                content.appendChild(li);
            });
            details.appendChild(content);
            disciplinesAccordion.appendChild(details);
        });
        updateWeaponsList();
    }
    function updateWeaponsList() {
        const char = characters[charSelect.value];
        weaponsList.innerHTML = '';
        const checkboxes = weaponsSelector.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach(box => {
            if (box.checked) {
                weaponsList.innerHTML += `<li>${box.name}</li>`;
            }
        });
    }
    function rollDice() {
        const char = characters[charSelect.value];
        const attr = attrSelect.value;
        const skill = skillSelect.value;
        const total = (char.attributes[attr] || 0) + (char.skills[skill] || 0);
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
    // Eventi
    charSelect.addEventListener("change", updateCharacter);
    hungerSlider.addEventListener("input", () => {
        hungerValue.textContent = hungerSlider.value;
    });
    // Inizializza Personaggi
    for (let name in characters) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        charSelect.appendChild(opt);
    }
    updateCharacter();
});























