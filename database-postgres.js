import { sql } from './db.js'

export class DatabasePostgres {
  // Personagens fixos
  async listFixed() {
    return await sql`SELECT * FROM fixed_characters`
  }

  // Personagens salvos
  async listSaved() {
    return await sql`SELECT * FROM saved_characters`
  }

  async getFixedById(id) {
    const [character] = await sql`
      SELECT * FROM fixed_characters WHERE id = ${id}
    `
    return character
  }

  async createSaved({ id, fixed_id, name, profession, phrase, image_url }) {
    await sql`
      INSERT INTO saved_characters (id, fixed_id, name, profession, phrase, image_url)
      VALUES (${id}, ${fixed_id}, ${name}, ${profession}, ${phrase}, ${image_url})
    `
  }

  async updateSaved(id, { name, profession, phrase }) {
    await sql`
      UPDATE saved_characters
      SET name = ${name}, profession = ${profession}, phrase = ${phrase}
      WHERE id = ${id}
    `
  }

  async deleteSaved(id) {
    await sql`
      DELETE FROM saved_characters WHERE id = ${id}
    `
  }

  async existsSaved(id) {
    const result = await sql`
      SELECT 1 FROM saved_characters WHERE id = ${id} LIMIT 1
    `
    return result.length > 0
  }
}
