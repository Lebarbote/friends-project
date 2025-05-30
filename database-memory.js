import { randomUUID } from 'crypto';

export class DatabaseMemory {
  #characters = new Map();

  list(search) {
    return Array.from(this.#characters.entries())
      .map(([id, data]) => {
        return { id, ...data };
      })
      .filter((character) => {
        if (search) {
          return character.name.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      });
  }

  create(character) {
    const id = randomUUID();
    this.#characters.set(id, character);
    return id;
  }

  update(id, character) {
    this.#characters.set(id, character);
  }

  delete(id) {
    this.#characters.delete(id);
  }

  exists(id) {
    return this.#characters.has(id);
  }
}
