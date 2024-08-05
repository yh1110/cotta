import {
  world,
  system,
  BlockPermutation,
  EntityInventoryComponent,
  ItemStack,
  DisplaySlotId,
  ScoreboardObjective,
  Dimension,
  Entity,
  Player,
} from "@minecraft/server";

const START_TICK = 100;
const ARENA_X_SIZE = 30;
const ARENA_Z_SIZE = 30;
const ARENA_X_OFFSET = 0;
const ARENA_Y_OFFSET = -60;
const ARENA_Z_OFFSET = 0;

// global variables
let curTick: number = 0;

function initializeBreakTheTerracotta() {
  const overworld: Dimension = world.getDimension("overworld");

  let scoreObjective: ScoreboardObjective | undefined = world.scoreboard.getObjective("score");

  if (!scoreObjective) {
    scoreObjective = world.scoreboard.addObjective("score", "Level");
  }

  // eliminate pesky nearby mobs
  let entities: Entity[] = overworld.getEntities({
    excludeTypes: ["player"],
  });

  for (let entity of entities) {
    entity.kill();
  }

  // set up scoreboard
  world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
    objective: scoreObjective,
  });

  const players: Player[] = world.getAllPlayers();

  for (const player of players) {
    scoreObjective.setScore(player, 0);

    let inv: EntityInventoryComponent = player.getComponent("inventory") as EntityInventoryComponent;
    inv.container?.addItem(new ItemStack("diamond_sword"));
    inv.container?.addItem(new ItemStack("dirt", 64));

    player.teleport(
      {
        x: ARENA_X_OFFSET - 3,
        y: ARENA_Y_OFFSET,
        z: ARENA_Z_OFFSET - 3,
      },
      {
        dimension: overworld,
        rotation: { x: 0, y: 0 },
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
