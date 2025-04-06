
window.addEventListener("DOMContentLoaded", async () => {




    // DICHIARAZIONE VARIABILI HTML
    const charSelect = document.getElementById("character");
    const xpInput = document.getElementById("xpInput");
    const notesArea = document.getElementById("notesArea");
    const healthBox = document.getElementById("healthBoxes");
    const exportBtn = document.getElementById("exportBtn")
    const importInput = document.getElementById("importInput")




    const characters = {
        Aaron: {
            attributes: {
                Forza: 4, Destrezza: 3, Stamina: 3, Carisma: 2,
                Persuasione: 1, Autocontrollo: 2, Intelligenza: 2,
                Prontezza: 2, Fermezza: 3
            },
            skills: {
                Athletics: 3, Brawl: 4, Firearms: 1, Larceny: 3,
                Melee: 4, Stealth: 2, Survival: 3, Insight: 1, Intimidation: 1, streetwise: 1, Awarness: 2
            },
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
            skills: {
                Athletics: 1, Firearm: 1, Melee: 4,
                Elysium: 2, Insight: 3, intimidation: 1, Leadership: 1, Performance: 2,
                Persuasion: 3, Subterfuge: 4, Academics: 2, Awarness: 3, Investigazione: 1
            },
            weapons: {
                "Pugnale di Akkad (+2 aggravati)": false,
                "Pugnale d’Argento (+2 superficiali)": false,
                "Pistola (+3 superficiali)": false
            },
            disciplines: {
                Auspex: ["Sensi Aumentati", "Premonizione"],
                Ascendente: ["Soggezione", "Spaventare"],
                Celerità: ["Grazia Felina", "Blink", "Fleetness"]
            }
        }
    };

    // === POPOLO IL SELECT DINAMICAMENTE ===
    function populateCharacterSelect() {
        charSelect.innerHTML = '<option value="">-- Seleziona un personaggio --</option>';
        for (const name in characters) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            charSelect.appendChild(option);
        }
    }

    populateCharacterSelect(); // chiamata all'avvio

    // === EXPORT JSON ===
    exportBtn.addEventListener("click", () => {
        const charName = charSelect.value;
        if (!charName) {
            alert("Seleziona un personaggio da esportare.");
            return;
        }
        const data = {
            name: charName,
            xp: parseInt(xpInput.value) || 0,
            note: notesArea.value || "",
            health: Array.from(healthBox.children).map(b => b.dataset.state || "vuoto")
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${charName}_backup.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

    // === IMPORT JSON ===
    importInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!characters[data.name]) {
                alert("Personaggio non trovato nel database!");
                return;
            }

            charSelect.value = data.name;
            xpInput.value = data.xp || 0;
            notesArea.value = data.note || "";
            if (Array.isArray(data.health)) updateHealthBoxes(data.health);

            updateCharacter(data.name); // trigger aggiornamento UI
            alert("Importazione completata!");
        } catch (err) {
            console.error("Errore durante l'importazione:", err);
            alert("Errore nel file importato");
        }
        e.target.value = ""; // reset input
    });

    // DICHIARAZIONI VARIABILI HTML (PRIMA di usarle!)

    const attrSelect = document.getElementById("attribute");
    const skillSelect = document.getElementById("skill");
    const hungerSlider = document.getElementById("hunger");
    const hungerValue = document.getElementById("hungerValue");
    const weaponsList = document.getElementById("weaponsList");

    const disciplinesAccordion = document.getElementById("disciplinesAccordion");
    const resultDiv = document.getElementById("result");

    const newWeaponName = document.getElementById("newWeaponName");
    const newWeaponEffect = document.getElementById("newWeaponEffect");
    const addWeaponBtn = document.getElementById("addWeaponBtn");


    const weaponsSelector = document.createElement("div");
    weaponsList.before(weaponsSelector);

    // === NOTE PERSONALI FUNZIONI GLOBALI ===
    function loadNotes() {
        const savedNote = localStorage.getItem(`notes-${charSelect.value}`);
        notesArea.value = savedNote || '';

    }

    // === EVENTO input = salvataggio note ===
    notesArea.addEventListener("input", () => {
        localStorage.setItem(`notes-${charSelect.value}`, notesArea.value);
    });




    // AGGIUNGI ARMA PERSONALIZZATA
    addWeaponBtn.addEventListener("click", () => {
        const name = newWeaponName.value.trim();
        const effect = newWeaponEffect.value.trim();
        if (!name || !effect) return;

        const fullLabel = `${name} (${effect})`;
        const charName = charSelect.value;

        let customWeapons = JSON.parse(localStorage.getItem(`customWeapons-${charName}`)) || [];
        customWeapons.push(fullLabel);
        localStorage.setItem(`customWeapons-${charName}`, JSON.stringify(customWeapons));

        newWeaponName.value = "";
        newWeaponEffect.value = "";

        updateCharacter();
    });

    // SALVATAGGIO XP INPUT
    xpInput.addEventListener("input", () => {
        localStorage.setItem(`xp-${charSelect.value}`, xpInput.value);

    });



    // Aggiunta dinamica al DOM per selezione armi

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

        // Armi selezionabili
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

        // Armi personalizzate da localStorage
        const customWeapons = JSON.parse(localStorage.getItem(`customWeapons-${charSelect.value}`)) || [];
        customWeapons.forEach((weapon, index) => {
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

            // ➕ Pulsante elimina arma
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon">
    <path fill="currentColor" d="M135.2 17.7C141.6 7.3 152.6 0 164.8 0h118.3c12.2 0 23.2 7.3 29.6 17.7L320 32h80c13.3 0 24 10.7 24 24s-10.7 24-24 24h-16l-20.1 368.6c-1.7 31.2-27.6 55.4-58.8 55.4H142.9c-31.2 0-57.1-24.2-58.8-55.4L64 80H48c-13.3 0-24-10.7-24-24S34.7 32 48 32h80l7.2-14.3zM192 160v224c0 13.3 10.7 24 24 24s24-10.7 24-24V160c0-13.3-10.7-24-24-24s-24 10.7-24 24zm88 0v224c0 13.3 10.7 24 24 24s24-10.7 24-24V160c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
  </svg> `;




            deleteBtn.classList.add("delete-weapon");
            deleteBtn.title = "Elimina arma";
            deleteBtn.addEventListener("click", (e) => {
                e.preventDefault();
                customWeapons.splice(index, 1);
                localStorage.setItem(`customWeapons-${charSelect.value}`, JSON.stringify(customWeapons));
                updateCharacter();
            });

            const wrapper = document.createElement("div");
            wrapper.classList.add("checkbox-wrapper");
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            wrapper.appendChild(deleteBtn);
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

        // Punti Vita
        const healthBox = document.getElementById("healthBoxes");
        healthBox.innerHTML = "";
        const hp = charSelect.value === "Katherine" ? 5 : 8;
        for (let i = 0; i < hp; i++) {
            const box = document.createElement("div");
            box.classList.add("health-box");
            box.dataset.state = "none";
            box.addEventListener("click", () => {
                if (box.dataset.state === "none") {
                    box.dataset.state = "superficiale";
                    box.classList.add("superficiale");
                    box.textContent = "/";
                } else if (box.dataset.state === "superficiale") {
                    box.dataset.state = "aggravato";
                    box.classList.remove("superficiale");
                    box.classList.add("aggravato");
                    box.textContent = "X";
                } else {
                    box.dataset.state = "none";
                    box.classList.remove("superficiale", "aggravato");
                    box.textContent = "";
                }
                // ➕ Salva stato PV aggiornato in localStorage (DENTRO l’evento click!)
                const currentStates = Array.from(healthBox.children).map(b => b.dataset.state);
                localStorage.setItem(`health-${charSelect.value}`, JSON.stringify(currentStates))



            });
            healthBox.appendChild(box);
        }

        // E qui fuori dal ciclo, ripristina eventuali PV salvati
        const savedStates = JSON.parse(localStorage.getItem(`health-${charSelect.value}`));
        if (savedStates && savedStates.length === hp) {
            Array.from(healthBox.children).forEach((box, i) => {
                const state = savedStates[i];
                box.dataset.state = state;
                if (state === "superficiale") {
                    box.classList.add("superficiale");
                    box.textContent = "/";
                } else if (state === "aggravato") {
                    box.classList.add("aggravato");
                    box.textContent = "X";
                }
            });
        }

        // Aggiorna lista armi selezionate
        updateWeaponsList();
        loadNotes();

        // Carica XP da localStorage
        const savedXP = localStorage.getItem(`xp-${charSelect.value}`);
        xpInput.value = savedXP !== null ? parseInt(savedXP) : 0;
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
    // :segno_spunta_bianco: Collega bottone TIRA DADI via JS
    const rollBtn = document.getElementById("rollBtn");
    rollBtn.addEventListener("click", () => rollDice());

    let bonus = 0;
    const bonusDisplay = document.getElementById("bonusValue");
    document.getElementById("increaseBonus").addEventListener("click", () => {
        bonus++;
        bonusDisplay.textContent = bonus;
    });
    document.getElementById("decreaseBonus").addEventListener("click", () => {
        if (bonus > -20) bonus--; // limite arbitrario
        bonusDisplay.textContent = bonus;
    });


    function rollDice() {
        const char = characters[charSelect.value];
        const attr = attrSelect.value;
        const skill = skillSelect.value;
        const total = (char.attributes[attr] || 0) + (char.skills[skill] || 0) + bonus;
        const hunger = parseInt(hungerSlider.value);
        const norm = Math.max(0, total - hunger); // non negativo
        const normalDice = [];
        const hungerDice = [];
        for (let i = 0; i < norm; i++) normalDice.push(Math.ceil(Math.random() * 10));
        for (let i = 0; i < hunger; i++) hungerDice.push(Math.ceil(Math.random() * 10));
        //Fix: Conteggia anche i 10 come successi!
        let successBase = 0;
        let tenCount = 0;

        let normalOutput = normalDice.map(n => {
            if (n === 10) {
                tenCount++;
                successBase++;
                return `<span class="success crit">${n}</span>`;
            }
            if (n >= 6) {
                successBase++;
                return `<span class="success">${n}</span>`;
            }
            return `${n}`;
        });
        let hungerOutput = hungerDice.map(n => {
            if (n === 10) {
                tenCount++;
                successBase++;
                return `<span class="hunger crit">${n}</span>`;
            }
            if (n >= 6) {
                successBase++;
                return `<span class="hunger success">${n}</span>`;
            }
            return `<span class="hunger">${n}</span>`;
        });
        // Ogni 10 vale 1 successo comunque (in qualunque caso),
        // ma ogni coppia di 10 porta 2 SUCCESSI IN PIÙ (perché già contati 1+1)
        let pairs = Math.floor(tenCount / 2);
        let totalSuccess = successBase + (pairs * 2);
        resultDiv.innerHTML = `
    <h4 class="text-lg font-semibold mb-2">Risultati Tiro:</h4>
    <p><strong>Dadi Normali:</strong> ${normalOutput.join(', ')}</p>
    <p><strong>Dadi Fame:</strong> ${hungerOutput.join(', ')}</p>
    <p><strong>Successi Totali:</strong> <span class="highlight">${totalSuccess}</span></p>
    <p><strong>Coppie di 10:</strong> ${pairs}</p>
  `
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

})

document.addEventListener("DOMContentLoaded", () => {
    const exportBtn = document.getElementById("exportBtn");
    if (!exportBtn) {
        alert("Bottone NON trovato!");
        return;
    }

    exportBtn.addEventListener("click", () => {
        alert("Hai cliccato su Esporta!");
        console.log("Export funziona.");
    });
});