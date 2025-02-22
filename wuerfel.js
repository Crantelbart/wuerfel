window.onload = function () {
	let progress_index = 0;

	// add and remove buttons click event
	document.querySelectorAll('#dices button').forEach(button => {
		button.addEventListener('click', e => {
			let btn = e.target,
				dice = btn.closest('.dice').getAttribute('data-type');

			removeOrAddDice(dice, btn.getAttribute('data-button'))
		})
	})

	// Auf den Würfeln-Button klicken
	document.querySelector('#roll button').addEventListener('click', e => {
		let diceArea = document.querySelector('#dice-area'), // dice-area (Html-Element) holen
			dices = diceArea.querySelectorAll('.area-dice'), // alle würfel unter dice-area holen
			progress = document.querySelector('#progress'), // progress (Html-Element) holen
			result = 0;

		let element = document.createElement('div'); // div-Element erstellen
		element.classList.add('progress-line'); // div-Element Klasse hinzufügen (progress-line)
		element.setAttribute('data-index', progress_index.toString()); // div-Element ein Attribut geben und in einen Sting umwandeln
		progress_index++; // index um 1 erhöhen

		dices.forEach(dice => { // alle Würfel unter dice-area durchgehen
			// random Zahl wurde geholt (min = 1, max = Typ des Würfels (wird in eine Ganzzahl umgewandelt))
			let randomNumber = getRandomNumber(1, parseInt(dice.getAttribute('data-type')));
			result += randomNumber;

			// Attribut wird hinzugefügt namens data-rolled
			// und mit dem Wert random Zahl welche in ein String umgewandelt wird
			dice.setAttribute('data-rolled', randomNumber.toString());

			// Würfel-Html-Element wird kopiert und in das div-Element als Kind am Ende eingefügt
			element.appendChild(dice.cloneNode(true));
		})

		progress.setAttribute('data-result', result);
		// Element-Html-Element mit samt den würfeln wir in das Progress-Fenster eingefügt
		progress.appendChild(element);

		// Ausgabe zwischen Dice-Area und Würfel-Button
		let result_div = document.querySelector('#result');
		result_div.innerHTML = result.toString();
	})
}

/**
 * Eine random Number mit min und max holen
 *
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * Fügt Würfel mit einem bestimmten Typen hinzuz
 * oder entfernt Würfel eines bestimmtes Types
 *
 * @param dice max. Augenanzahl eines Würfels
 * @param type remove/add
 */
function removeOrAddDice (dice, type) {
	let dice_area = document.querySelector('#dice-area');

	if (type === "remove") {

		let elem = dice_area.querySelector(".dice-area[data-type='" + dice + "']");

		if (elem) {
			elem.remove();
		}
	} else if (type === "add") {
		dice_area.appendChild(createHtmlDice(dice))
	} else {
		console.log("???")
	}

	checkNumberInArea(dice_area)

	updateStatsWindow(dice_area);
}

/**
 * Erzeugt das Html-Element für einen Würfel
 *
 * @param type
 * @returns {HTMLDivElement}
 */
function createHtmlDice (type) {
	let div = document.createElement('div');
	div.classList.add('area-dice');
	div.setAttribute('data-type', type);

	return div;
}

/**
 * schaut sich das Würfelfeld an und prüft,
 * ob Plus oder Minus Buttons entfernt werden müssen
 *
 * @param area
 */
function checkNumberInArea (area) {
	let i = area.children.length,
		dices = document.querySelector('#dices');

	switch (i) {
		case 0: // keine Elemente sind vorhanden => Nur plus soll angezeigt werden
			dices.querySelectorAll('button[data-button]').forEach(b => {
				if (b.getAttribute('data-button') === 'add') {
					if (b.classList.contains('hide')) {
						b.classList.remove('hide');
					}
				} else {
					if (!b.classList.contains('hide')) {
						b.classList.add('hide');
					}
				}
			})
			break;
		case 1:
		case 2:
		case 3:
		case 4: // Plus und Minus soll angezeigt werden
		default:
			dices.querySelectorAll('button[data-button]').forEach(b => {
				if (b.classList.contains('hide')) {
					b.classList.remove('hide');
				}
			})

			break;
		case 5: // Alle Elemente sind vorhanden => Nur Minus anzeigen
			dices.querySelectorAll('button[data-button]').forEach(b => {
				if (b.getAttribute('data-button') === 'add') {
					if (!b.classList.contains('hide')) {
						b.classList.add('hide');
					}
				} else {
					if (b.classList.contains('hide')) {
						b.classList.remove('hide');
					}
				}
			})
			break;
	}
}

/**
 * die möglichen Augenzahlen der Würfel anschauen
 * und als Balkendiagram darstellen
 *
 * @param area
 */
function updateStatsWindow (area) {
	// TODO :3
}