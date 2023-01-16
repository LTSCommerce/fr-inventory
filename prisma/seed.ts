import {
  PrismaClient,
  Prisma,
  Responder,
  ItemType,
  ResponderItem,
  ItemTypeGroup,
} from '@prisma/client'
import { randomUUID } from 'crypto'
import { connect } from 'http2'
const prisma = new PrismaClient()

async function main() {
  // First we create some Responders.
  // This lets us get their IDs so we can use them to build the relation
  // define an empty typed array
  const responders: Responder[] = []
  // fill the array with the created responders
  responders.push(
    await prisma.responder.create({
      data: {
        name: 'Roger Dodger',
        callsign: 'GR101',
      },
    }),
    await prisma.responder.create({
      data: {
        name: 'Simple Simon',
        callsign: 'GR102',
      },
    }),
    await prisma.responder.create({
      data: {
        name: 'Fanny Adams',
        callsign: 'GR103',
      },
    })
  )

  const itemTypeGroup: ItemTypeGroup[] = []
  itemTypeGroup.push(
    await prisma.itemTypeGroup.create({
      data: {
        name: 'Razer Lift',
        notes: 'blah blah some notes lorem whatever',
      },
    }),
    await prisma.itemTypeGroup.create({
      data: {
        name: 'Thingyma Bob',
      },
    })
  )

  // Now we create some item types. Again we need to do this so we can get the IDs
  //deind an empty typed array
  const itemTypes: ItemType[] = []
  // fill the array with created item types
  itemTypes.push(
    await prisma.itemType.create({
      data: {
        name: 'Big Bandage',
        hasBattery: false,
        minimum: 1,
        hasExpiryDate: true,
        hasSerialNumber: false,
        infoUrl: 'https://www.google.com',
      },
    }),
    await prisma.itemType.create({
      data: {
        name: 'Metal Jobbie',
        hasBattery: false,
        minimum: 1,
        hasExpiryDate: false,
        hasModel: true,
        itemTypeGroupId: itemTypeGroup[0].id,
      },
    }),
    await prisma.itemType.create({
      data: {
        name: 'electric doodah',
        hasBattery: true,
        minimum: 2,
        hasExpiryDate: false,
        infoUrl: 'https://www.facebook.com',
      },
    }),
    await prisma.itemType.create({
      data: {
        name: 'optional ordonance',
        hasBattery: false,
        minimum: 0,
        hasExpiryDate: true,
        hasSwasft: true,
        hasModel: true,
        itemTypeGroupId: itemTypeGroup[1].id,
      },
    })
  )

  /**
   * @returns random int beween 0 and 41
   */
  function randomQuantity(): number {
    return Math.floor(Math.random() * 42)
  }
  function randomString(has: boolean): string | null {
    if (!has) {
      return null
    }
    if (Math.random() < 0.5) {
      return null
    }
    return randomUUID()
  }

  function randomDate(has: boolean): Date | null {
    if (!has) {
      return null
    }
    if (Math.random() < 0.5) {
      return null
    }
    const dayInMilliseconds = 86400000
    const nowTime = new Date()
    const fromTime = nowTime.getTime() - 150 * dayInMilliseconds
    const toTime = nowTime.getTime() + 900 * dayInMilliseconds
    return new Date(fromTime + Math.random() * (toTime - fromTime))
  }

  // Now loop through all the responders and item types
  // and create a responderItem for each combination
  for (const responder of responders) {
    for (const itemType of itemTypes) {
      await prisma.responderItem.create({
        data: {
          quantity: randomQuantity(),
          model: randomString(itemType.hasModel),
          serial: randomString(itemType.hasSerialNumber),
          swasft: randomString(itemType.hasSwasft),
          expiry: randomDate(itemType.hasExpiryDate),
          responder: {
            connect: { id: responder.id },
          },
          itemType: {
            connect: { id: itemType.id },
          },
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
