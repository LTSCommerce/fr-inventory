import {
    PrismaClient,
    // Prisma,
    Responder,
    // ItemType,
    // ResponderItem,
} from "@prisma/client";


export default async function getResponderList():Promise<Responder[]>{
    const prisma = new PrismaClient();
    const responders: Responder[] = await prisma.responder.findMany()
    return responders
}