import { sql } from './db.js'

const characters = [
  {
    name: "Rachel Green",
    profession: "Stylist",
    phrase: "It's like all my life everyone has always told me, ‘You’re a shoe!’",
    image_url: "Assets/rachel-green.jpg"
  },
  {
    name: "Ross Geller",
    profession: "Paleontologist",
    phrase: "We were on a break!",
    image_url: "Assets/ross-geller.jpg"
  },
  {
    name: "Monica Geller",
    profession: "Chef",
    phrase: "I KNOW!!",
    image_url: "Assets/monica-geller.jpg"
  },
  {
    name: "Chandler Bing",
    profession: "We don't know your profession",
    phrase: "Could I BE any more...?",
    image_url: "Assets/chandler-bing.jpg"
  },
  {
    name: "Joey Tribbiani",
    profession: "Actor",
    phrase: "How you doin'?",
    image_url: "Assets/joey-tribbiani.jpg"
  },
  {
    name: "Phoebe Buffay",
    profession: "Masseur / musician",
    phrase: "Smelly Cat, Smelly Cat, what are they feeding you?",
    image_url: "Assets/phoebe-buffay.jpg"
  }
]
await sql`DELETE FROM characters`;

for (const character of characters) {
  await sql`
    INSERT INTO characters (name, profession, phrase, image_url)
    VALUES (${character.name}, ${character.profession}, ${character.phrase}, ${character.image_url})
  `
}

console.log('Seed concluído!')
process.exit()
