/**
 * Hauptfunktion die nach dem Laden der Seite ausgeführt wird
 * Initialisiert alle Event-Listener und Variablen
 */
window.onload = function () {
	// Zähler für die Fortschrittsanzeige (wird bei jedem Wurf erhöht)
	let progress_index = 0;

	// Array zum Speichern der Würfelverlaufseinträge (max. 20 Einträge)
	let historyEntries = [];

	// Holt den Verlaufscontainer aus dem DOM
	const historyDiv = document.querySelector('#history');
	// Holt den Statistikcontainer aus dem DOM
	const statDiv = document.querySelector('#stat');

	/**
	 * Event-Listener für alle Würfel-Buttons (Hinzufügen/Entfernen)
	 * Wird für jeden Button im #dices-Container registriert
	 */
	document.querySelectorAll('#dices button').forEach(button => {
		// Fügt jedem Button einen Click-Event-Listener hinzu
		button.addEventListener('click', e => {
			// Das geklickte Button-Element
			let btn = e.target;
			// Findet das nächstgelegene übergeordnete .dice-Element
			let diceElement = btn.closest('.dice');
			// Holt den Würfeltyp aus dem data-type Attribut
			let diceType = diceElement.getAttribute('data-type');
			// Holt die Aktion (add/remove) aus dem data-button Attribut
			let action = btn.getAttribute('data-button');
			// Ruft die Funktion zum Hinzufügen/Entfernen auf
			removeOrAddDice(diceType, action);
		});
	});

	/**
	 * Event-Listener für den Würfel-Button (Hauptwürfelaktion)
	 * Führt den Wurf aus und aktualisiert alle Anzeigen
	 */
	document.querySelector('#roll button').addEventListener('click', e => {
		// Referenz zum Würfel-Anzeigebereich
		let diceArea = document.querySelector('#dice-area');
		// Alle aktuellen Würfel im Anzeigebereich
		let dices = diceArea.querySelectorAll('.area-dice');
		// Referenz zur Fortschrittsanzeige
		let progress = document.querySelector('#progress');

		// Initialisiert das Gesamtergebnis
		let result = 0;
		// Array für die einzelnen Würfelergebnisse
		let diceResults = [];

		// Erstellt ein neues div-Element für den Fortschrittsbalken
		let progressElement = document.createElement('div');
		// Fügt CSS-Klasse für Styling hinzu
		progressElement.classList.add('progress-line');
		// Setzt den Index für diesen Wurf
		progressElement.setAttribute('data-index', progress_index);
		// Erhöht den Index für den nächsten Wurf
		progress_index++;

		/**
		 * Verarbeitet jeden Würfel im Würfelbereich
		 */
		dices.forEach(dice => {
			// Holt den Würfeltyp und konvertiert ihn zu einer Zahl
			let diceType = parseInt(dice.getAttribute('data-type'));
			// Generiert eine Zufallszahl zwischen 1 und Würfeltyp
			let randomNumber = getRandomNumber(1, diceType);

			// Addiert zum Gesamtergebnis
			result += randomNumber;

			// Speichert Typ und Wert des Würfels
			diceResults.push({
				type: diceType,
				value: randomNumber
			});

			// Aktualisiert die Anzeige des Würfels
			let diceTypeSpan = dice.querySelector('.dice-type');
			let rolledValueSpan = dice.querySelector('.rolled-value');
			// Setzt den Würfeltyp (z.B. "W6")
			diceTypeSpan.textContent = `W${diceType}`;
			// Setzt den gewürfelten Wert (z.B. ": 4")
			rolledValueSpan.textContent = `: ${randomNumber}`;
		});

		// Speichert das Gesamtergebnis im Fortschritts-Element
		progress.setAttribute('data-result', result);
		// Fügt das neue Fortschrittselement hinzu
		progress.appendChild(progressElement);

		// Aktualisiert die Ergebnis-Anzeige
		document.querySelector('#result').innerHTML = result.toString();

		/**
		 * Erstellt einen neuen Verlaufseintrag
		 */
		const historyEntry = {
			time: new Date().toLocaleTimeString(),  // Aktuelle Uhrzeit
			dice: diceResults,                     // Array mit Würfelergebnissen
			total: result                          // Gesamtsumme
		};

		// Fügt den Eintrag zum Verlauf hinzu
		historyEntries.push(historyEntry);
		// Begrenzt den Verlauf auf 20 Einträge
		if (historyEntries.length > 20) {
			// Entfernt den ältesten Eintrag
			historyEntries.shift();
		}

		// Aktualisiert die Verlaufsanzeige
		updateHistoryDisplay();
	});

	/**
	 * Aktualisiert die Verlaufsanzeige im UI
	 */
	function updateHistoryDisplay() {
		// Setzt den Titel und löscht alte Einträge
		historyDiv.innerHTML = '<h3>Verlauf:</h3>';

		/**
		 * Geht alle Einträge rückwärts durch (neueste zuerst)
		 * slice() erstellt eine Kopie des Arrays, reverse() kehrt die Reihenfolge um
		 */
		historyEntries.slice().reverse().forEach(entry => {
			// Erstellt ein neues div-Element für den Eintrag
			const entryDiv = document.createElement('div');
			// Fügt CSS-Klasse für Styling hinzu
			entryDiv.classList.add('history-entry');

			/**
			 * Erstellt den Anzeigetext für die Würfel
			 * map() wandelt jedes Würfelobjekt in einen String um
			 * join() verbindet sie mit " + "
			 */
			const diceString = entry.dice.map(d => `W${d.type}: ${d.value}`).join(' + ');

			// Setzt den Inhalt des Eintrags
			entryDiv.innerHTML = `
                <span class="history-time">${entry.time}</span>
                <span class="history-dice">${diceString}</span>
                <span class="history-total">= ${entry.total}</span>
            `;

			// Fügt den Eintrag zum Verlaufscontainer hinzu
			historyDiv.appendChild(entryDiv);
		});
	}

	/* --- Hilfsfunktionen --- */

	/**
	 * Generiert eine Zufallszahl zwischen min und max (inklusive)
	 */
	function getRandomNumber(min, max) {
		// Math.random() gibt eine Zahl zwischen 0 (inkl.) und 1 (exkl.) zurück
		// Math.floor() rundet ab, um eine ganze Zahl zu erhalten
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Fügt Würfel hinzu oder entfernt sie aus dem Würfelbereich
	 */
	function removeOrAddDice(diceType, action) {
		// Referenz zum Würfelbereich
		let diceArea = document.querySelector('#dice-area');

		if (action === "remove") {
			// Findet den ersten Würfel des angegebenen Typs
			let elem = diceArea.querySelector(`.area-dice[data-type="${diceType}"]`);
			// Wenn gefunden, entfernt ihn
			if (elem) elem.remove();
		} else if (action === "add") {
			// Erstellt einen neuen Würfel und fügt ihn hinzu
			diceArea.appendChild(createHtmlDice(diceType));
		}

		// Aktualisiert die Button-Sichtbarkeit
		checkNumberInArea(diceArea);
		// Aktualisiert die Statistik
		updateStatsWindow(diceArea);
	}

	/**
	 * Erstellt ein HTML-Element für einen Würfel
	 */
	function createHtmlDice(type) {
		// Erstellt ein neues div-Element
		let div = document.createElement('div');
		// Fügt CSS-Klassen hinzu
		div.classList.add('area-dice');
		// Setzt den Würfeltyp als data-Attribut
		div.setAttribute('data-type', type);
		// Setzt den Inhalt mit zwei spans für Typ und Wert
		div.innerHTML = `
            <span class="dice-type">W${type}</span>
            <span class="rolled-value"></span>
        `;
		return div;
	}

	/**
	 * Steuert die Sichtbarkeit der Buttons basierend auf der Würfelanzahl
	 */
	function checkNumberInArea(area) {
		// Aktuelle Anzahl der Würfel
		let count = area.children.length;
		// Alle Buttons mit data-button Attribut
		let buttons = document.querySelectorAll('#dices button[data-button]');

		buttons.forEach(button => {
			// Holt die Aktion des Buttons (add/remove)
			let action = button.getAttribute('data-button');

			// Logik für die Button-Anzeige:
			if (count === 0) {
				// Keine Würfel - nur Plus-Buttons zeigen
				button.classList.toggle('hide', action !== 'add');
			} else if (count === 5) {
				// Maximale Würfel - nur Minus-Buttons zeigen
				button.classList.toggle('hide', action !== 'remove');
			} else {
				// 1-4 Würfel - alle Buttons zeigen
				button.classList.remove('hide');
			}
		});
	}

	/**
	 * Aktualisiert die Statistik-Anzeige mit Wahrscheinlichkeiten
	 */
	function updateStatsWindow(area) {
		// Alle Würfel im Bereich
		const dices = area.querySelectorAll('.area-dice');

		// Fallback wenn keine Würfel vorhanden sind
		if (dices.length === 0) {
			statDiv.innerHTML = '<h3>Statistik:</h3><p>Füge Würfel hinzu, um Wahrscheinlichkeiten zu sehen</p>';
			return;
		}

		// Wandelt NodeList in Array um und extrahiert die Würfeltypen
		let diceTypes = Array.from(dices).map(d => parseInt(d.getAttribute('data-type')));
		// Minimale Summe (jeder Würfel mindestens 1)
		let minPossible = diceTypes.length;
		// Maximale Summe (Summe aller Würfeltypen)
		let maxPossible = diceTypes.reduce((sum, type) => sum + type, 0);

		// Berechnet Wahrscheinlichkeiten
		let probMin = calculateProbability(diceTypes, minPossible);
		let probMax = calculateProbability(diceTypes, maxPossible);

		// Aktualisiert die Anzeige mit formatierten Prozentwerten
		statDiv.innerHTML = `
            <h3>Statistik:</h3>
            <p>Minimale Summe (${minPossible}): ${(probMin * 100).toFixed(2)}%</p>
            <p>Maximale Summe (${maxPossible}): ${(probMax * 100).toFixed(2)}%</p>
        `;
	}

	/**
	 * Berechnet die Wahrscheinlichkeit für eine bestimmte Summe
	 */
	function calculateProbability(diceTypes, target) {
		// Für einzelne Würfel exakte Berechnung
		if (diceTypes.length === 1) {
			// Prüft ob Ziel im Bereich liegt
			return (target >= 1 && target <= diceTypes[0]) ? 1 / diceTypes[0] : 0;
		}

		// Für mehrere Würfel vereinfachte Schätzung
		let minSum = diceTypes.length;
		let maxSum = diceTypes.reduce((sum, type) => sum + type, 0);

		// Für Min/Max genau berechnen
		if (target === minSum || target === maxSum) {
			// Berechnet die Anzahl möglicher Kombinationen
			let combinations = diceTypes.reduce((total, type) => total * type, 1);
			return 1 / combinations;
		}

		// Für andere Werte gleichmäßige Verteilung annehmen
		return 1 / (maxSum - minSum + 1);
	}
};