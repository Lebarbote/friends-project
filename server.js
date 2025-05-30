import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { DatabasePostgres } from './database-postgres.js'
import { randomUUID } from 'node:crypto'

const server = fastify()

await server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

const database = new DatabasePostgres()

// GET fixed characters
server.get('/fixed-characters', async () => {
  return await database.listFixed()
})

// GET fixed character by ID
server.get('/fixed-characters/:id', async (request, reply) => {
  const id = request.params.id
  const character = await database.getFixedById(id)
  if (!character) {
    return reply.status(404).send({ error: 'Fixed character not found' })
  }
  return character
})

// POST saved character (created from fixed)
server.post('/character/from-fixed/:fixedId', async (request, reply) => {
  const fixedId = request.params.fixedId
  const fixedCharacter = await database.getFixedById(fixedId)

  if (!fixedCharacter) {
    return reply.status(404).send({ error: 'Fixed character not found' })
  }

  const newCharacter = {
    id: randomUUID(),
    fixed_id: fixedCharacter.id,
    name: fixedCharacter.name,
    profession: fixedCharacter.profession,
    phrase: fixedCharacter.phrase,
    image_url: fixedCharacter.image_url
  }

  await database.createSaved(newCharacter)
  return reply.status(201).send({ id: newCharacter.id })
})

// GET saved characters
server.get('/saved-characters', async () => {
  return await database.listSaved()
})

// PUT update saved character
server.put('/saved-characters/:id', async (request, reply) => {
  const savedId = request.params.id
  const { name, profession, phrase } = request.body

  const exists = await database.existsSaved(savedId)
  if (!exists) return reply.status(404).send({ error: 'Character not found' })

  await database.updateSaved(savedId, { name, profession, phrase })
  return reply.status(204).send()
})

// DELETE saved character
server.delete('/saved-characters/:id', async (request, reply) => {
  const savedId = request.params.id

  const exists = await database.existsSaved(savedId)
  if (!exists) return reply.status(404).send({ error: 'Character not found' })

  await database.deleteSaved(savedId)
  return reply.status(204).send()
})

server.listen({ port: 3333 }, () => {
  console.log('Server running on http://localhost:3333')
})
