export async function TaskCheck({
    element = null,
    actor = null,
    item = null,
    difficulty = 0,
    tempMod = 0,

} = {}){
    const dataset = element.dataset;
    let checkOptions = await getTaskCheckOptions(dataset.tasktype);

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
        thresholds = actor.system.stats[dataset.label].value+actor.system.stats[dataset.label].mod+tempMod; 
        formulas = `d6cs<=${thresholds}`;
        break;
      }
      case "skill": {
        console.log("skill");
        thresholds = difficulty;
        formulas = `{${item.points}d10kh+${tempMod}}cs>=${thresholds}`;
        break;}
      case "knowledge":{
        console.log("knowledge");
        thresholds = difficulty;
        formulas = `{${item.points}d10kh+${tempMod}}cs>=${thresholds}`;
        break;}
    };
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const item = actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.tasktype) {
      let label = dataset.label ? `[roll] ${dataset.label}` : '';
      let chatTemplate = "systems/hakaikousen/templates/chat/basic-card.html";
      let rollResult = new Roll(formulas).evaluate({async: false});
      let renderedRoll = await rollResult.render({flavor: label, template: chatTemplate});

      let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        rollMode: game.settings.get('core', 'rollMode'),
        content: renderedRoll,
      }
      rollResult.toMessage(messageData);
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