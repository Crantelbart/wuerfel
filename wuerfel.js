window.onload = function () {
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
		// Bei jedem Würfel eine Zahl würfeln

		// Die würfel im Verlauf speichern

		// Ergebnis über dem Würfeln-Button anzeigen
	})
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
	div.classList.add('dice-area');
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