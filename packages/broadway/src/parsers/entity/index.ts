

// some examples of things to parse:
/*
Basically we want to identify an entity (character or location)
and associated characteristics.

    A big, old, three-story brick house in a small Chicago
    suburb.
  
    adjectives, 

    Three days before Christmas. There are lights and Christmas
    decorations on the house and the surrounding houses.

    HEATHER McCALLISTER comes down
the stairs. She's nineteen and a cousin. She's wearing a
Northwestern University sweatshirt.

  CLOSE ON ARTHUR (30's), tears in his eyes from laughing so
    hard. He's trying to get it under control. His greasy,
    black hair hanging down over his forehead. He's wearing an
    old, faded green cardigan sweater, a threadbare gray scarf,
    thin from years of use, hangs loosely around his neck.

    He's sitting across from an overworked SOCIAL WORKER
    (50's), African American. 
    */

import { ClapEntity } from "@aitube/clap"

export function parseEntity(text: string, entities: ClapEntity[] = []) {
  // we assume we are given a short text containing information about
  
  for (const entity of entities) {
    const coordinates = text.indexOf(entity.triggerName)

  }

  const clothes = text.match(/(?:wears|wearing) ([a-zA-Z0-9\-\s]+)\./i)

  return {
    clothes: clothes?.[1] || ""
  }
}