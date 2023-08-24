import * as UniqTable from "../module/helpers/tu.mjs";

export async function TaskCheck({
    element = null,
    actor = null,
    item = null,
    difficulty = 0,
    tempMod = 0,
    margin = 0,
    disability = 0,

} = {}){
    const dataset = element.dataset;
    let checkOptions = await getTaskCheckOptions(dataset.tasktype);    
    let chatOptions = {};
    

    if (checkOptions.canceled){
      return;
    }
    difficulty = checkOptions.difficulty;
    tempMod = checkOptions.tempMod;
    let thresholds = 0;
    let formulas = null;
    switch (dataset.tasktype){
      case "stats": {
        console.log("stats");
        thresholds = actor.system.stats[dataset.label].value+tempMod; 
        formulas = `d6cs<=${thresholds}`;
        break;
      }
      case "obedience": {
        console.log("obedience");
        thresholds = actor.system.humans.obedience;
        formulas = `d6cs<=${thresholds}`;
        break;
      }
      case "skill": {
        console.log("skill");
        thresholds = difficulty;
        formulas = `{${item.points}d10kh+${tempMod}}cs>=${thresholds}`;
        break;
      }
      case "knowledge":{
        console.log("knowledge");
        thresholds = difficulty;
        formulas = `{${item.points}d10kh+${tempMod}}cs>=${thresholds}`;
        break;
      }
      case "competence":{
        console.log("competence");
        thresholds = difficulty;
        formulas = `{${item.points}d10kh+${tempMod}}cs>=${thresholds}`;
        break;
      }
      case "technique":{
        console.log("technique");
        if(item.category == "other" || item.category == "none"){
          thresholds = item.accuracy+difficulty;
            formulas = `{d100+${tempMod}}cs<=${thresholds}`;
        }else{
          margin = actor.system.stats[dataset.label].value;
          disability = item.accuracy+difficulty;
          thresholds = UniqTable.uniqTableResult(margin,disability);
          formulas = `{d10+${tempMod}}cs>=${thresholds}`;
        }
        break;
      }
    };
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const item = actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.tasktype) {
      let label = "";
      if (dataset.tasktype != "technique") {
        label = dataset.label ? `[roll] ${dataset.label}` : '';
      }else{
        label = dataset.label ? `[roll] ${item.name}` : '';
      }
      let chatTemplate = "systems/hakaikousen/templates/chat/basic-card.html";
      chatOptions = foundry.utils.mergeObject({
        user: game.user.id,
        flavor: label,
        template: chatTemplate
      }, chatOptions);
      const isPrivate = false;

      let rollResult = new Roll(formulas).evaluate({async: false});
        // Execute the roll, if needed
      if (!rollResult._evaluated) rollResult.evaluate();

      let cardData = {
        formula: isPrivate ? "???" : rollResult._formula,
        flavor: isPrivate ? null : chatOptions.flavor,
        user: chatOptions.user,
        tooltip: isPrivate ? "" : await rollResult.getTooltip(),
        total: isPrivate ? "?" : rollResult._total,
        item: item,
        owner: actor.id,
        actor: actor,
        tasktype: dataset.tasktype
      }
            // Define chat data
      let chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rollMode: game.settings.get("core", "rollMode"),
        formula: isPrivate ? "???" : rollResult._formula,
        flavor: isPrivate ? null : chatOptions.flavor,
        user: chatOptions.user,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        tooltip: isPrivate ? "" : await rollResult.getTooltip(),
        total: isPrivate ? "?" : rollResult._total,
        item: item,
        owner: actor.id,
        actor: actor,
        tasktype: dataset.tasktype,
        sound: CONFIG.sounds.dice
      };
      chatData.roll = rollResult;
      chatData.content = await renderTemplate(chatOptions.template, cardData);
      let message = ChatMessage.create(chatData);
    }
}

async function getTaskCheckOptions(tasktype){
  const template = "systems/hakaikousen/templates/dialog/task-check-dialog.html";
  const html = await renderTemplate(template, {tasktype});
  return new Promise(resolve => {
    const data = {
      title: "options",
      content: html,
      buttons:{
        normal: {
          label: 'roll',
          callback: html  => resolve(_processTaskCheckOptions(html[0].querySelector("form")))
        },
        cancel:{
          label: 'cancel',
          callback: html  =>  resolve({canceled: true})
        }
      },
      default: "normal",
      close:()  =>  resolve({canceled: true})
    };
    new Dialog(data, null).render(true);

  });
}

function _processTaskCheckOptions(form) {
  let tempMod = 0;
  let difficulty = 0;
  try {
    tempMod = parseInt(form.tempMod.value);
  } catch (error) {
    console.log("tempMod unavialable");
  }
  try {
    difficulty = parseInt(form.difficulty.value);
  } catch (error) {
    console.log("difficulty unavialable");
  }
  return {
    difficulty: difficulty,
    tempMod: tempMod,
  }
}