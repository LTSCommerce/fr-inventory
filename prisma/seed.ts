import {
  PrismaClient,
  Prisma,
  Responder,
  ItemType,
  ResponderItem,
} from "@prisma/client";
import { connect } from "http2";
const prisma = new PrismaClient();

async function main() {
  // First we create some Responders.
  // This lets us get their IDs so we can use them to build the relation
  // define an empty typed array
  let responders: Responder[] = [];
  // fill the array with the created responders
  responders.push(
    await prisma.responder.create({
      data: {
        name: "Roger Dodger",
        callsign: "GR101",
      },
    }),
    await prisma.responder.create({
      data: {
        name: "Simple Simon",
        callsign: "GR102",
      },
    }),
    await prisma.responder.create({
      data: {
        name: "Fanny Adams",
        callsign: "GR103",
      },
    })
  );

  // Now we create some item types. Again we need to do this so we can get the IDs
  //deind an empty typed array
  let itemTypes: ItemType[] = [];
  // fill the array with created item types
  itemTypes.push(
    await prisma.itemType.create({
      data: {
        name: "Big Bandage",
        hasBattery: false,
        minimum: 1,
        hasExpiryDate: true,
      },
    }),
    await prisma.itemType.create({
      data: {
        name: "Metal Jobbie",
        hasBattery: false,
        minimum: 1,
        hasExpiryDate: false,
      },
    }),
    await prisma.itemType.create({
      data: {
        name: "electric doodah",
        hasBattery: true,
        minimum: 2,
        hasExpiryDate: false,
      },
    }),
    await prisma.itemType.create({
      data: {
        name: "optional ordonance",
        hasBattery: false,
        minimum: 0,
        hasExpiryDate: true,
      },
    })
  );

  /**
   * @returns random int beween 0 and 41
   */
  function randomQuantity(): number {
    return Math.floor(Math.random() * 42);
  }
  // Now loop through all the responders and item types
  // and create a responderItem for each combination
  for (let responder of responders) {
    for (let itemType of itemTypes) {
      await prisma.responderItem.create({
        data: {
          quantity: randomQuantity(),
          responder: {
            connect: { id: responder.id },
          },
          itemType: {
            connect: { id: itemType.id },
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
