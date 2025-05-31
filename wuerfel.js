// Wartet, bis das DOM vollständig geladen ist
window.onload = function () {
	// Zähler für Fortschrittsindex (wird für jede Würfelrunde erhöht)
	let progress_index = 0;
	// Array zum Speichern des Würfelverlaufs
	let historyEntries = [];

	// Holt das Div-Element für die Verlaufsanzeige
	const historyDiv = document.querySelector('#history');

	// Event-Listener für alle Buttons im #dices-Container
	document.querySelectorAll('#dices button').forEach(button => {
		button.addEventListener('click', e => {
			// Das geklickte Button-Element
			let btn = e.target,
				// Holt den Würfeltyp vom übergeordneten .dice-Element
				dice = btn.closest('.dice').getAttribute('data-type');
			// Ruft Funktion zum Hinzufügen/Entfernen von Würfeln auf
			removeOrAddDice(dice, btn.getAttribute('data-button'));
		});
	});

	// Event-Listener für den Würfel-Button
	document.querySelector('#roll button').addEventListener('click', e => {
		// Holt den Bereich, wo die Würfel angezeigt werden
		let diceArea = document.querySelector('#dice-area'),
			// Alle Würfel-Elemente im Würfelbereich
			dices = diceArea.querySelectorAll('.area-dice'),
			// Fortschritts-Anzeige-Element
			progress = document.querySelector('#progress');
		// Initialisiert das Gesamtergebnis
		let result = 0;
		// Array für einzelne Würfelergebnisse
		let diceResults = [];

		// Erstellt ein neues Div für die aktuelle Würfelrunde
		let element = document.createElement('div');
		// Fügt CSS-Klasse hinzu
		element.classList.add('progress-line');
		// Setzt Index-Attribut
		element.setAttribute('data-index', progress_index.toString());
		// Erhöht den Index für den nächsten Wurf
		progress_index++;

		// Geht alle Würfel durch
		dices.forEach(dice => {
			// Generiert Zufallszahl basierend auf Würfeltyp
			let randomNumber = getRandomNumber(1, parseInt(dice.getAttribute('data-type')));
			// Addiert zum Gesamtergebnis
			result += randomNumber;
			// Fügt Ergebnis zum Array hinzu
			diceResults.push(randomNumber);
			// Setzt Attribut mit gewürfelter Zahl
			dice.setAttribute('data-rolled', randomNumber.toString());
			// Klont den Würfel und fügt ihn zum Runden-Div hinzu
			element.appendChild(dice.cloneNode(true));
		});

		// Speichert Gesamtergebnis im Fortschritts-Element
		progress.setAttribute('data-result', result);
		// Fügt die Runde zum Fortschrittsbereich hinzu
		progress.appendChild(element);

		// Aktualisiert die Ergebnis-Anzeige
		let result_div = document.querySelector('#result');
		result_div.innerHTML = result.toString();

		// Erstellt Verlaufseintrag mit aktueller Zeit
		const time = new Date().toLocaleTimeString();
		const historyEntry = {
			time: time,          // Uhrzeit des Wurfs
			dice: diceResults,   // Array der Einzelergebnisse
			total: result        // Gesamtsumme
		};

		// Fügt Eintrag zum Verlauf hinzu
		historyEntries.push(historyEntry);

		// Begrenzt den Verlauf auf 10 Einträge
		if (historyEntries.length > 10) {
			historyEntries.shift(); // Entfernt ältesten Eintrag
		}

		// Aktualisiert die Verlaufsanzeige
		updateHistoryDisplay();
	});

	// Funktion zur Aktualisierung der Verlaufsanzeige
	function updateHistoryDisplay() {
		// Setzt Titel im Verlaufs-Div
		historyDiv.innerHTML = '<h3>Verlauf:</h3>';

		// Geht Verlauf in umgekehrter Reihenfolge durch (neueste zuerst)
		historyEntries.slice().reverse().forEach(entry => {
			// Erstellt Container für jeden Eintrag
			const entryDiv = document.createElement('div');
			entryDiv.classList.add('history-entry');

			// Erstellt lesbare Würfel-Ergebnisse (z.B. "D6 + D4")
			const diceString = entry.dice.map(d => `D${d}`).join(' + ');

			// Füllt den Eintrag mit Inhalt
			entryDiv.innerHTML = `
                <span class="history-time">${entry.time}</span>
                <span class="history-dice">${diceString}</span>
                <span class="history-total">= ${entry.total}</span>
            `;

			// Fügt Eintrag zum Verlaufs-Div hinzu
			historyDiv.appendChild(entryDiv);
		});
	}

	/**
	 * Generiert eine Zufallszahl zwischen min und max
	 * @param {number} min - Mindestwert
	 * @param {number} max - Maximalwert
	 * @returns {number} Zufallszahl
	 */
	function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Fügt Würfel hinzu oder entfernt sie
	 * @param {string} dice - Würfeltyp (z.B. "6" für D6)
	 * @param {string} type - "add" oder "remove"
	 */
	function removeOrAddDice(dice, type) {
		let dice_area = document.querySelector('#dice-area');

		if (type === "remove") {
			// Findet ersten Würfel des angegebenen Typs
			let elem = dice_area.querySelector(".area-dice[data-type='" + dice + "']");
			if (elem) {
				elem.remove(); // Entfernt den Würfel
			}
		} else if (type === "add") {
			// Fügt neuen Würfel hinzu
			dice_area.appendChild(createHtmlDice(dice));
		} else {
			console.log("Ungültiger Button-Typ");
		}

		// Aktualisiert Button-Status
		checkNumberInArea(dice_area);
		// Aktualisiert Statistik (TODO)
		updateStatsWindow(dice_area);
	}

	/**
	 * Erstellt ein Würfel-HTML-Element
	 * @param {string} type - Würfeltyp
	 * @returns {HTMLDivElement} Würfel-Element
	 */
	function createHtmlDice(type) {
		let div = document.createElement('div');
		div.classList.add('area-dice');
		div.setAttribute('data-type', type);
		return div;
	}

	/**
	 * Steuert Sichtbarkeit der Buttons basierend auf Würfelanzahl
	 * @param {HTMLElement} area - Würfelbereich
	 */
	function checkNumberInArea(area) {
		let i = area.children.length,
			dices = document.querySelector('#dices');

		switch (i) {
			case 0: // Keine Würfel - nur Plus-Buttons anzeigen
				dices.querySelectorAll('button[data-button]').forEach(b => {
					if (b.getAttribute('data-button') === 'add') {
						b.classList.remove('hide');
					} else {
						b.classList.add('hide');
					}
				});
				break;
			case 1:
			case 2:
			case 3:
			case 4: // 1-4 Würfel - alle Buttons anzeigen
			default:
				dices.querySelectorAll('button[data-button]').forEach(b => {
					b.classList.remove('hide');
				});
				break;
			case 5: // Maximale Würfel - nur Minus-Buttons anzeigen
				dices.querySelectorAll('button[data-button]').forEach(b => {
					if (b.getAttribute('data-button') === 'add') {
						b.classList.add('hide');
					} else {
						b.classList.remove('hide');
					}
				});
				break;
		}
	}

	/**
	 * (Platzhalter) Würde Statistik-Anzeige aktualisieren
	 * @param {HTMLElement} area - Würfelbereich
	 */
	function updateStatsWindow(area) {
		// TODO: Implementierung fehlt noch
	}
};

