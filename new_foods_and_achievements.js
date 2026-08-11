// New Foods + Achievements mod
// Adds a set of new ingredients and a small achievement system.
// Install by adding this filename to Infinite Chef's mod list (see README).

// Helper: safe unlock function that uses game's addAchievement if present
function _unlockAchievement(id, title, desc) {
    if (typeof addAchievement === 'function') {
        try { addAchievement(id, { title: title, description: desc }); return; } catch (e) {}
    }
    // fallback: store in localStorage and notify via console
    try {
        const key = 'r74n_new_foods_achievements_unlocked';
        const unlocked = JSON.parse(localStorage.getItem(key) || '[]');
        if (!unlocked.includes(id)) {
            unlocked.push(id);
            localStorage.setItem(key, JSON.stringify(unlocked));
            console.log('[NewFoodsMod] Achievement unlocked:', title, '-', desc);
            if (typeof alert === 'function') alert('Achievement unlocked: ' + title + "\n" + desc);
        }
    } catch (e) { /* noop */ }
}

// Ingredients list
addIngredient("juice",{
    type: "liquid",
    color: ["#FFD27F","#FFD6A5","#FFB4A2"],
    shape: "liquid",
    keywords: "juice,drink,liquid",
    dishName: "juice"
});

addIngredient("dreamberry",{
    type: "fruit",
    color: "#9b5fe0",
    shape: "fruit_bipod_stem",
    keywords: "dreamberry,berry,fruit",
    adj: "dreamy"
});

addIngredient("one_chip",{
    type: "snack",
    color: "#ff3b3b",
    shape: "triangle_round",
    keywords: "one chip,hot,spicy,chip",
    adj: "hot",
    onCollide: function(self, other) {
        // spicy chips make heat
        if (other && other.id === 'water') changeIngredient(other, 'steam');
    }
});

addIngredient("taki",{
    type: "snack",
    color: "#ff5a1f",
    shape: "triangle_round",
    keywords: "taki,takis,spicy,snack",
});

addIngredient("dorito",{
    type: "snack",
    color: "#ff9b1f",
    shape: "triangle_round",
    keywords: "dorito,doritos,chip",
});

addIngredient("wafer",{
    type: "candy",
    color: "#E7CFA6",
    shape: "rectangle_thinnest",
    brokenShape: "squares_some_flat",
    keywords: "wafer,cookie,cake"
});

// Oreo may already exist in other mods; keep this entry minimal and safe
try {
    if (!ingredients || !ingredients.oreo) {
        addIngredient("oreo",{
            type:"candy",
            shape:"disc_hole",
            brokenShape:"squares_some_flat",
            color:"#291d13",
            adj:"oreo"
        });
    }
} catch(e) { try { addIngredient("oreo",{type:"candy",shape:"disc_hole",brokenShape:"squares_some_flat",color:"#291d13",adj:"oreo"}); } catch(e2){} }

addIngredient("mutton",{
    type: "meat",
    color: "#c17860",
    shape: "cutlet",
    keywords: "mutton,lamb,sheep,meat",
    adj: "mutton"
});

addIngredient("heart_candy",{
    type: "candy",
    color: ["#FF5E7B","#FF9B5E"],
    shape: "heart_s",
    meltPoint: 120,
    meltInto: "caramel",
    keywords: "heart,candy,valentine"
});

addIngredient("lollipop",{
    type: "candy",
    color: ["#FFB9F3","#B9EEFF"],
    shape: "popsicle",
    adj: "lollipop",
    dropInto: "sugar",
    dropIntoV: 5,
    keywords: "lollipop,candy,stick"
});

// Additional foods
addIngredient("edible_paper",{
    type: "carb",
    color: "#FFF6E5",
    shape: "rectangle_thinnest",
    keywords: "paper,edible,wafer",
    adj: "paper"
});

addIngredient("porkchop",{
    type: "pork",
    color: "#d46b5a",
    shape: "cutlet",
    keywords: "pork,porkchop,chop",
    adj: "porky"
});

addIngredient("java_banana",{
    type: "fruit",
    color: "#FFD64D",
    shape: "banana",
    keywords: "banana,java,coffee",
    adj: "java"
});

addIngredient("embum_banana",{
    type: "fruit",
    color: "#FFEC99",
    shape: "banana",
    keywords: "embum,banana,exotic",
    adj: "exotic"
});

addIngredient("jam",{
    type: "jam",
    color: "#8B2D5C",
    shape: "jar",
    keywords: "jam,jelly,preserve",
    adj: "preserved",
});

addIngredient("matcha",{
    type: "powder",
    color: "#9EBF6B",
    shape: "powder_rough",
    keywords: "matcha,green tea,powder",
    adj: "green"
});

addIngredient("jabuticaba",{
    type: "fruit",
    color: "#4B0F3B",
    shape: "berry_small",
    keywords: "jabuticaba,fruit,berry",
    adj: "jabuticaba"
});

addIngredient("physalis_berry",{
    type: "fruit",
    color: "#FFC048",
    shape: "berry_small",
    keywords: "physalis,groundcherry,fruit",
    adj: "physalis"
});

// Simple recipes
addRecipe("jabuticaba+sugar","jam");
addRecipe("dreamberry+sugar","jam");
addRecipe("edible_paper+jam","sweet_note");
addRecipe("porkchop+salt","grilled_porkchop");
addRecipe("matcha+milk","matcha_latte");

// Achievement system (works with or without game's addAchievement API)
(function(){
    const TRACK_KEY = 'r74n_new_foods_seen';
    const TARGETS = [
        'juice','dreamberry','one_chip','taki','dorito','wafer','oreo','mutton','heart_candy','lollipop',
        'edible_paper','porkchop','java_banana','embum_banana','jam','matcha','jabuticaba','physalis_berry'
    ];

    function getSeen(){ try { return JSON.parse(localStorage.getItem(TRACK_KEY) || '[]'); } catch(e){ return []; } }
    function setSeen(arr){ try { localStorage.setItem(TRACK_KEY, JSON.stringify(arr)); } catch(e){} }

    function markSeen(id){
        const seen = getSeen();
        if (!seen.includes(id)) {
            seen.push(id);
            setSeen(seen);
            console.log('[NewFoodsMod] Seen:', id);
            _unlockAchievement('seen_'+id, 'Tasted: ' + id.replace(/_/g,' '), 'You placed or created ' + id.replace(/_/g,' ') + '.');
        }
        checkAll();
    }

    function checkAll(){
        const seen = getSeen();
        const missing = TARGETS.filter(t => !seen.includes(t));
        if (missing.length === 0) {
            _unlockAchievement('all_new_foods', 'New Foods Collector', 'You discovered all the new foods in this mod.');
        }
    }

    // Attach onPlace handlers for each ingredient so placing them counts as discovery
    TARGETS.forEach(id => {
        try {
            if (ingredients && ingredients[id]) {
                // If ingredient exists in the global ingredients list, edit to add onPlace
                editIngredient(id, {
                    onPlace: function() { markSeen(id); }
                });
            } else {
                // Fallthrough: handled by placeIngredient wrapper below
            }
        } catch(e){ /* ignore */ }
    });

    // Fallback: if ingredient was added after this script runs, or ingredients don't expose onPlace,
    // watch placements globally and mark seen when matching id.
    const oldPlaceIngredient = typeof placeIngredient === 'function' ? placeIngredient : null;
    if (oldPlaceIngredient) {
        window.placeIngredient = function(id,x,y) {
            try { markSeen(id); } catch(e) {}
            return oldPlaceIngredient.apply(this, arguments);
        };
    }

})();
