export async function TaskCheck({
    element = null,
    actor = null,
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
    let thresholds = {
      "stats": "(" + actor.system.stats[dataset.label].value+"+"+actor.system.stats[dataset.label].mod+")",
      "skill": difficulty,
      "knowledge": difficulty,
    };
    let formulas = {
      "stats": `d6cs<=${thresholds[dataset.tasktype]}df>${thresholds[dataset.tasktype]}+${tempMod}`,
    }
    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        // const itemId = element.closest('.item').dataset.itemId;
        const item = actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.tasktype) {
      if (dataset.tasktype == "stats") {
        let label = dataset.label ? `[roll] ${dataset.label}` : '';
        // let roll = new Roll(formula, actor.getRollData());
        let chatTemplate = "systems/hakaikousen/templates/chat/basic-card.html";

        let rollResult = new Roll(formulas[dataset.tasktype]).evaluate({async: false});
        console.log(rollResult);
        let renderedRoll = await rollResult.render({flavor: label, template: chatTemplate});

        let messageData = {
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          rollMode: game.settings.get('core', 'rollMode'),
          content: renderedRoll,
        }
        rollResult.toMessage(messageData);
      }
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