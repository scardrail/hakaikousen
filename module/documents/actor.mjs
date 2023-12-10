import * as Natures from "../helpers/natures.mjs";
import * as Sensibilities from "../helpers/sensibilities.mjs";
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class HakaiKousenActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.hakaikousen || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._preparePokemonData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'trainer') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, stat] of Object.entries(systemData.stats)) {
      // Calculate the modifier using d20 rules.
      stat.value = stat.base+stat.points+stat.mod;
    }
  }

  /**
   * Prepare Pokemon type specific data
   */
  _preparePokemonData(actorData) {
    if (actorData.type !== 'pokemon') return;

    // Update Pokemon Data 
    const systemData = actorData.system;
    console.log("DATA : ",systemData);
    systemData.description.surname = actorData.name;
    systemData.humans.obedience = systemData.humans.trust + systemData.humans.training;
    
    // get natures relative informations
    let naturesResults = Natures.naturesResult(systemData.description.nature);
    console.log("DATA : ",naturesResults);
    systemData.food.favTaste = naturesResults.favTaste;
    systemData.food.detTaste = naturesResults.detTaste;
    systemData.stats.FOR.nature = +naturesResults.FOR;
    systemData.stats.END.nature = +naturesResults.END;
    systemData.stats.CON.nature = +naturesResults.CON;
    systemData.stats.VOL.nature = +naturesResults.VOL;
    systemData.stats.DEX.nature = +naturesResults.DEX;
    
    if(systemData.description.types.one != "none"){
      let sensibilitiesResultA = Sensibilities.sensibilitiesResult(systemData.description.types.one);
      
      for (const [key, value] of Object.entries(sensibilitiesResultA)) {
        systemData.sensibilities[key] *= value
      }
    }else{
      for (const [key, value] of Object.entries(systemData.sensibilities)) {
        systemData.sensibilities[key] = 1;
      }
    }
    if(systemData.description.types.two != "none" && systemData.description.types.two != systemData.description.types.one){
      let sensibilitiesResultB = Sensibilities.sensibilitiesResult(systemData.description.types.two);
      for (const [key, value] of Object.entries(sensibilitiesResultB)) {
        systemData.sensibilities[key] *= value
      }
    }
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, stat] of Object.entries(systemData.stats)) {
      // Calculate the modifier using d20 rules.
      // stat.value = stat.base+stat.ev+stat.iv+stat.nature+stat.mega+stat.mod;
      stat.max = stat.base+stat.ev+stat.iv+stat.nature+stat.mega+stat.mod;
    }
    
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getPokemonRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'trainer') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.stats) {
      for (let [k, v] of Object.entries(data.stats)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    // if (data.attributes.level) {
    //   data.lvl = data.attributes.level.value ?? 0;
    // }
  }

  /**
   * Prepare pokemon roll data.
   */
  _getPokemonRollData(data) {
    if (this.type !== 'pokemon') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.stats) {
      for (let [k, v] of Object.entries(data.stats)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    // if (data.attributes.level) {
    //   data.lvl = data.attributes.level.value ?? 0;
    // }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

}