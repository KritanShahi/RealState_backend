import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const properties = [
    { title: "2BHK Apartment", location: "Downtown", price: 125000 },
    { title: "Villa with Garden", location: "Green Park", price: 340000 },
    { title: "Studio Flat", location: "City Center", price: 90000 }
  ];

  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: properties.indexOf(property) + 1 },
      update: property,
      create: property
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
