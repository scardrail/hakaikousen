/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/hakaikousen/templates/actor/parts/actor-competences.html",
    "systems/hakaikousen/templates/actor/parts/actor-description.html",
    "systems/hakaikousen/templates/actor/parts/actor-items.html",
    "systems/hakaikousen/templates/actor/parts/actor-capacities.html",
    "systems/hakaikousen/templates/actor/parts/actor-features.html",

    // Pokemon partials.
    "systems/hakaikousen/templates/actor/parts/actor-pokemon-competences.html",

    //chat templates
    "systems/hakaikousen/templates/chat/basic-card.html",
    "systems/hakaikousen/templates/chat/rollCheck.html",
    "templates/dice/roll.html",

    //dialogs templates
    "systems/hakaikousen/templates/dialog/task-check-dialog.html",
  ]);
};
