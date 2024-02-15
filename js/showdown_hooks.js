var boxImports = `<div class="trainer-poks "><div class="trainer-pok-list player-poks"></div></div>`;
var trainerImports = `<div class="trainer-poks "><div class="trainer-pok-list"></div></div>`;

// Override custom sets to always be under "My Box"
function addToDex(poke) {
	var dexObject = {};
	if ($("#randoms").prop("checked")) {
		if (GEN9RANDOMBATTLE[poke.name] == undefined)
			GEN9RANDOMBATTLE[poke.name] = {};
		if (GEN8RANDOMBATTLE[poke.name] == undefined)
			GEN8RANDOMBATTLE[poke.name] = {};
		if (GEN7RANDOMBATTLE[poke.name] == undefined)
			GEN7RANDOMBATTLE[poke.name] = {};
		if (GEN6RANDOMBATTLE[poke.name] == undefined)
			GEN6RANDOMBATTLE[poke.name] = {};
		if (GEN5RANDOMBATTLE[poke.name] == undefined)
			GEN5RANDOMBATTLE[poke.name] = {};
		if (GEN4RANDOMBATTLE[poke.name] == undefined)
			GEN4RANDOMBATTLE[poke.name] = {};
		if (GEN3RANDOMBATTLE[poke.name] == undefined)
			GEN3RANDOMBATTLE[poke.name] = {};
		if (GEN2RANDOMBATTLE[poke.name] == undefined)
			GEN2RANDOMBATTLE[poke.name] = {};
		if (GEN1RANDOMBATTLE[poke.name] == undefined)
			GEN1RANDOMBATTLE[poke.name] = {};
	} else {
		if (SETDEX_SV[poke.name] == undefined) SETDEX_SV[poke.name] = {};
		if (SETDEX_SS[poke.name] == undefined) SETDEX_SS[poke.name] = {};
		if (SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = {};
		if (SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = {};
		if (SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = {};
		if (SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = {};
		if (SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = {};
		if (SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = {};
		if (SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = {};
	}
	if (poke.ability !== undefined) {
		dexObject.ability = poke.ability;
	}
	if (poke.teraType !== undefined) {
		dexObject.teraType = poke.teraType;
	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.item = poke.item;
	dexObject.isCustomSet = poke.isCustomSet;
	var customsets;
	if (localStorage.customsets) {
		customsets = JSON.parse(localStorage.customsets);
	} else {
		customsets = {};
	}
	if (!customsets[poke.name]) {
		customsets[poke.name] = {};
	}
	customsets[poke.name]["My Box"] = dexObject;
	if (poke.name === "Aegislash-Blade") {
		if (!customsets["Aegislash-Shield"]) {
			customsets["Aegislash-Shield"] = {};
		}
		customsets["Aegislash-Shield"][poke.nameProp] = dexObject;
	}
	updateDex(customsets);
	get_box();
}

// Refreshes .player-poks with imported mons
function get_box() {
	var names = get_trainer_names();

	var box = [];

	var box_html = "";

	for (i in names) {
		if (names[i].includes("My Box")) {
			box.push(names[i].split("[")[0]);

			var pok_name = names[i]
				.split(" (")[0]
				.toLowerCase()
				.replace(" ", "-")
				.replace(".", "")
				.replace(".", "")
				.replace("’", "")
				.replace("-totem", "");
			var pok = `<img class="trainer-pok left-side" src="./img/pokesprite/${pok_name}.png" data-id="${
				names[i].split("[")[0]
			}">`;

			box_html += pok;
		}
	}
	$(".player-poks").html(box_html);
	return box;
}

function get_trainer_preview(poks) {
	var trainer_poks = $(".trainer-poks").last();
	var box_html = "";

	for (i in poks) {
		pok = poks[i];
		var pok_name = pok
			.split(" (")[0]
			.toLowerCase()
			.replace(" ", "-")
			.replace(".", "")
			.replace(".", "")
			.replace("’", "")
			.replace("-totem", "");
		var pok_html = `<img class="trainer-pok right-side" src="./img/pokesprite/${pok_name}.png" data-id="${
			poks[i].split("[")[0]
		}">`;

		box_html += pok_html;
	}

	trainer_poks.html(box_html);
}

// Get list of all trainer names
function get_trainer_names() {
	var all_poks = setdex;
	var trainer_names = [];

	for (const [pok_name, poks] of Object.entries(all_poks)) {
		var pok_tr_names = Object.keys(poks);
		for (i in pok_tr_names) {
			var trainer_name = pok_tr_names[i];

			// sub_index used for switchin in preview
			var sub_index = poks[trainer_name]["sub_index"];

			trainer_names.push(`${pok_name} (${trainer_name})[${sub_index}]`);
		}
	}
	return trainer_names;
}

// sets calc info with selected set
function getSet(setName, selector) {
	var fullSetName = setName;
	var pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
	var setName = fullSetName.substring(
		fullSetName.indexOf("(") + 1,
		fullSetName.lastIndexOf(")")
	);
	var pokemon = pokedex[pokemonName];
	if (pokemon) {
		var pokeObj = $(selector).closest(".poke-info");
		if (stickyMoves.getSelectedSide() === pokeObj.prop("id")) {
			stickyMoves.clearStickyMove();
		}
		pokeObj.find(".teraToggle").prop("checked", false);
		pokeObj.find(".analysis").attr("href", smogonAnalysis(pokemonName));
		pokeObj.find(".type1").val(pokemon.types[0]);
		pokeObj.find(".type2").val(pokemon.types[1]);
		pokeObj.find(".hp .base").val(pokemon.bs.hp);
		var i;
		for (i = 0; i < LEGACY_STATS[gen].length; i++) {
			pokeObj
				.find("." + LEGACY_STATS[gen][i] + " .base")
				.val(pokemon.bs[LEGACY_STATS[gen][i]]);
		}
		pokeObj.find(".boost").val(0);
		pokeObj.find(".percent-hp").val(100);
		pokeObj.find(".status").val("Healthy");
		$(".status").change();
		var moveObj;
		var abilityObj = pokeObj.find(".ability");
		var itemObj = pokeObj.find(".item");
		var randset = $("#randoms").prop("checked")
			? randdex[pokemonName]
			: undefined;
		var regSets = pokemonName in setdex && setName in setdex[pokemonName];

		if (randset) {
			var listItems = randdex[pokemonName].items
				? randdex[pokemonName].items
				: [];
			var listAbilities = randdex[pokemonName].abilities
				? randdex[pokemonName].abilities
				: [];
			if (gen >= 3)
				$(selector).closest(".poke-info").find(".ability-pool").show();
			$(selector)
				.closest(".poke-info")
				.find(".extraSetAbilities")
				.text(listAbilities.join(", "));
			if (gen >= 2)
				$(selector).closest(".poke-info").find(".item-pool").show();
			$(selector)
				.closest(".poke-info")
				.find(".extraSetItems")
				.text(listItems.join(", "));
			if (gen >= 9) {
				$(selector).closest(".poke-info").find(".role-pool").show();
				$(selector).closest(".poke-info").find(".tera-type-pool").show();
			}
			var listRoles = randdex[pokemonName].roles
				? Object.keys(randdex[pokemonName].roles)
				: [];
			$(selector)
				.closest(".poke-info")
				.find(".extraSetRoles")
				.text(listRoles.join(", "));
			var listTeraTypes = [];
			if (randdex[pokemonName].roles) {
				for (var roleName in randdex[pokemonName].roles) {
					var role = randdex[pokemonName].roles[roleName];
					for (var q = 0; q < role.teraTypes.length; q++) {
						if (listTeraTypes.indexOf(role.teraTypes[q]) === -1) {
							listTeraTypes.push(role.teraTypes[q]);
						}
					}
				}
			}
			pokeObj.find(".teraType").val(listTeraTypes[0] || pokemon.types[0]);
			$(selector)
				.closest(".poke-info")
				.find(".extraSetTeraTypes")
				.text(listTeraTypes.join(", "));
		} else {
			$(selector).closest(".poke-info").find(".ability-pool").hide();
			$(selector).closest(".poke-info").find(".item-pool").hide();
			$(selector).closest(".poke-info").find(".role-pool").hide();
			$(selector).closest(".poke-info").find(".tera-type-pool").hide();
		}
		if (regSets || randset) {
			var set = regSets
				? correctHiddenPower(setdex[pokemonName][setName])
				: randset;
			if (regSets) {
				pokeObj.find(".teraType").val(set.teraType || pokemon.types[0]);
			}
			pokeObj.find(".level").val(set.level);
			pokeObj
				.find(".hp .evs")
				.val(set.evs && set.evs.hp !== undefined ? set.evs.hp : 0);
			pokeObj
				.find(".hp .ivs")
				.val(set.ivs && set.ivs.hp !== undefined ? set.ivs.hp : 31);
			pokeObj
				.find(".hp .dvs")
				.val(set.dvs && set.dvs.hp !== undefined ? set.dvs.hp : 15);
			for (i = 0; i < LEGACY_STATS[gen].length; i++) {
				pokeObj
					.find("." + LEGACY_STATS[gen][i] + " .evs")
					.val(
						set.evs && set.evs[LEGACY_STATS[gen][i]] !== undefined
							? set.evs[LEGACY_STATS[gen][i]]
							: $("#randoms").prop("checked")
							? 84
							: 0
					);
				pokeObj
					.find("." + LEGACY_STATS[gen][i] + " .ivs")
					.val(
						set.ivs && set.ivs[LEGACY_STATS[gen][i]] !== undefined
							? set.ivs[LEGACY_STATS[gen][i]]
							: 31
					);
				pokeObj
					.find("." + LEGACY_STATS[gen][i] + " .dvs")
					.val(
						set.dvs && set.dvs[LEGACY_STATS[gen][i]] !== undefined
							? set.dvs[LEGACY_STATS[gen][i]]
							: 15
					);
			}
			setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
			var abilityFallback =
				typeof pokemon.abilities !== "undefined"
					? pokemon.abilities[0]
					: "";
			if ($("#randoms").prop("checked")) {
				setSelectValueIfValid(
					abilityObj,
					randset.abilities && randset.abilities[0],
					abilityFallback
				);
				setSelectValueIfValid(
					itemObj,
					randset.items && randset.items[0],
					""
				);
			} else {
				setSelectValueIfValid(abilityObj, set.ability, abilityFallback);
				setSelectValueIfValid(itemObj, set.item, "");
			}
			var setMoves = set.moves;
			if (randset) {
				if (gen < 9) {
					setMoves = randset.moves;
				} else {
					setMoves = [];
					for (var role in randset.roles) {
						for (var q = 0; q < randset.roles[role].moves.length; q++) {
							var moveName = randset.roles[role].moves[q];
							if (setMoves.indexOf(moveName) === -1)
								setMoves.push(moveName);
						}
					}
				}
			}
			var moves = selectMovesFromRandomOptions(setMoves);
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				moveObj.attr("data-prev", moveObj.val());
				setSelectValueIfValid(moveObj, moves[i], "(No Move)");
				moveObj.change();
			}
			if (randset) {
				$(selector).closest(".poke-info").find(".move-pool").show();
				$(selector)
					.closest(".poke-info")
					.find(".extraSetMoves")
					.html(formatMovePool(setMoves));
			}
		} else {
			pokeObj.find(".teraType").val(pokemon.types[0]);
			pokeObj.find(".level").val(100);
			pokeObj.find(".hp .evs").val(0);
			pokeObj.find(".hp .ivs").val(31);
			pokeObj.find(".hp .dvs").val(15);
			for (i = 0; i < LEGACY_STATS[gen].length; i++) {
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .evs").val(0);
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .ivs").val(31);
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .dvs").val(15);
			}
			pokeObj.find(".nature").val("Hardy");
			setSelectValueIfValid(abilityObj, pokemon.ab, "");
			itemObj.val("");
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				moveObj.attr("data-prev", moveObj.val());
				moveObj.val("(No Move)");
				moveObj.change();
			}
			if ($("#randoms").prop("checked")) {
				$(selector).closest(".poke-info").find(".move-pool").hide();
			}
		}
		if (typeof getSelectedTiers === "function") {
			// doesn't exist when in 1vs1 mode
			var format = getSelectedTiers()[0];
			var is50lvl =
				startsWith(format, "VGC") || startsWith(format, "Battle Spot");
			//var isDoubles = format === 'Doubles' || has50lvl; *TODO*
			if (format === "LC") pokeObj.find(".level").val(5);
			if (is50lvl) pokeObj.find(".level").val(50);
			//if (isDoubles) field.gameType = 'Doubles'; *TODO*
		}
		var formeObj = $(selector).siblings().find(".forme").parent();
		itemObj.prop("disabled", false);
		var baseForme;
		if (pokemon.baseSpecies && pokemon.baseSpecies !== pokemon.name) {
			baseForme = pokedex[pokemon.baseSpecies];
		}
		if (pokemon.otherFormes) {
			showFormes(formeObj, pokemonName, pokemon, pokemonName);
		} else if (baseForme && baseForme.otherFormes) {
			showFormes(formeObj, pokemonName, baseForme, pokemon.baseSpecies);
		} else {
			formeObj.hide();
		}
		calcHP(pokeObj);
		calcStats(pokeObj);
		abilityObj.change();
		itemObj.change();
		if (pokemon.gender === "N") {
			pokeObj.find(".gender").parent().hide();
			pokeObj.find(".gender").val("");
		} else pokeObj.find(".gender").parent().show();
	}
}

// Add more search functionality to set search
function loadDefaultLists() {
	$(".set-selector").select2({
		formatResult: function (object) {
			if ($("#randoms").prop("checked")) {
				return object.pokemon;
			} else {
				// return object.text;
				return object.set
					? "&nbsp;&nbsp;&nbsp;" + object.text
					: "<b>" + object.text + "</b>";
			}
		},
		query: function (query) {
			var pageSize = 30;
			var results = [];
			var options = getSetOptions();
			for (var i = 0; i < options.length; i++) {
				var option = options[i];
				// var pokeName = option.pokemon.toUpperCase();
				var fullName = option.text.toUpperCase();
				if (
					!query.term ||
					query.term
						.toUpperCase()
						.split(" ")
						.every(function (term) {
							// return pokeName.indexOf(term) === 0 || pokeName.indexOf("-" + term) >= 0;
							return (
								fullName.indexOf(term) === 0 ||
								fullName.indexOf("-" + term) >= 0 ||
								fullName.indexOf(" " + term) >= 0 ||
								fullName.indexOf("(" + term) >= 0
							);
							// return fullName.indexOf(term) === 0 || fullName.indexOf("-" + term) >= 0 || fullName.indexOf("(" + term) >= 0;
						})
				) {
					if ($("#randoms").prop("checked")) {
						if (option.id) results.push(option);
					} else {
						results.push(option);
					}
				}
			}
			query.callback({
				results: results.slice(
					(query.page - 1) * pageSize,
					query.page * pageSize
				),
				more: results.length >= query.page * pageSize,
			});
		},
		initSelection: function (element, callback) {
			callback(getFirstValidSetOption());
		},
	});
}

// Get current trainer poks
function get_trainer_poks(trainer_name) {
	var all_poks = setdex;
	var matches = [];
	for (i in TR_NAMES) {
		if (TR_NAMES[i].includes(trainer_name)) {
			matches.push(TR_NAMES[i]);
		}
	}
	return matches;
}

function get_current_trainer() {
	var currentSet = $(".set-selector")[3].value;
	return currentSet.split("(").slice(1).join("(");
}

$(document).on("click", ".trainer-pok.left-side", function () {
	var set = $(this).attr("data-id");
	$(".player").val(set);
	getSet(set, $(".player")[0]);
	$(".player .select2-chosen").text(set);
	if ($(".info-group:not(.opp) > * > .forme").is(":visible")) {
		$(".info-group:not(.opp) > * > .forme").change();
	}

	var right_max_hp = $("#p1 .max-hp").text();
	$("#p1 .current-hp").val(right_max_hp).change();
});

$(document).on("click", ".trainer-pok.right-side", function () {
	var set = $(this).attr("data-id");
	// $('.opposing').val(set)
	getSet(set, $(".opposing")[0]);
	$(".opposing .select2-chosen").text(set);
	// if ($('.info-group:not(.opp) > * > .forme').is(':visible')) {
	//     $('.info-group:not(.opp) > * > .forme').change()
	// }

	var left_max_hp = $("#p2 .max-hp").text();
	$("#p2 .current-hp").val(left_max_hp).change();
});

$(document).on("change", ".opposing", function () {
	if ($(this).val().includes("Blank Set")) {
		return;
	}
	CURRENT_OPPOSING_MONS = get_trainer_poks(get_current_trainer());
	get_trainer_preview(CURRENT_OPPOSING_MONS);
});

$(document).ready(function () {
	// add box view
	$(".move4").first().after(boxImports);
	$(".move4").last().after(trainerImports);

	// designate set selector to be modified by box
	$(".set-selector").first().addClass("player");
	$(".set-selector").last().addClass("opposing");

	// load custom sets and trainer names
	TR_NAMES = get_trainer_names();
	get_box();
});
