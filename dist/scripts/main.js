// scripts/main.ts
import { world, system, ItemStack, DisplaySlotId } from "@minecraft/server";
var START_TICK = 100;
var ARENA_X_OFFSET = 0;
var ARENA_Y_OFFSET = -60;
var ARENA_Z_OFFSET = 0;
var curTick = 0;
function initializeBreakTheTerracotta() {
  const overworld = world.getDimension("overworld");
  let scoreObjective = world.scoreboard.getObjective("score");
  if (!scoreObjective) {
    scoreObjective = world.scoreboard.addObjective("score", "Level");
  }
  let entities = overworld.getEntities({
    excludeTypes: ["player"]
  });
  for (let entity of entities) {
    entity.kill();
  }
  world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
    objective: scoreObjective
  });
  const players = world.getAllPlayers();
  for (const player of players) {
    scoreObjective.setScore(player, 0);
    let inv = player.getComponent("inventory");
    inv.container?.addItem(new ItemStack("diamond_sword"));
    inv.container?.addItem(new ItemStack("dirt", 64));
    player.teleport(
      {
        x: ARENA_X_OFFSET - 3,
        y: ARENA_Y_OFFSET,
        z: ARENA_Z_OFFSET - 3
      },
      {
        dimension: overworld,
        rotation: { x: 0, y: 0 }
      }
    );
  }
  world.sendMessage("BREAK THE TERRACOTTA");
}
function gameTick() {
  try {
    curTick++;
    if (curTick === START_TICK) {
      initializeBreakTheTerracotta();
    }
  } catch (e) {
    console.warn("Tick error: " + e);
  }
  system.run(gameTick);
}
system.run(gameTick);

//# sourceMappingURL=../debug/main.js.map
