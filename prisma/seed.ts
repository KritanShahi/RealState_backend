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
  await prisma.propertyImage.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.property.deleteMany();

  const properties = [
    {
      title: "2BHK Apartment",
      description: "Bright apartment with open kitchen.",
      price: 125000,
      address: "12 Downtown Avenue",
      city: "Dubai",
      country: "UAE",
      propertyType: "apartment",
      imageUrls: [
        "/property-images/house1.jpg",
        "/property-images/house2.jpg"
      ]
    },
    {
      title: "Villa with Garden",
      description: "Family villa with private garden and parking.",
      price: 340000,
      address: "8 Green Park",
      city: "Abu Dhabi",
      country: "UAE",
      propertyType: "house",
      imageUrls: [
        "/property-images/house3.jpg",
        "/property-images/house4.jpg"
      ]
    },
    {
      title: "Studio Flat",
      description: "Compact and modern studio near metro.",
      price: 90000,
      address: "21 City Center Road",
      city: "Sharjah",
      country: "UAE",
      propertyType: "apartment",
      imageUrls: [
        "/property-images/house5.jpg",
        "/property-images/house6.jpg"
      ]
    },
 
    {
      title: "Luxury Penthouse",
      description: "This stunning luxury penthouse offers breathtaking panoramic views of the city skyline. It features a spacious living area, floor-to-ceiling windows, modern interiors, and a private terrace perfect for relaxation and entertainment. Located in a prime area with easy access to shopping malls, restaurants, and business hubs, this property is ideal for high-end living.",
      price: 750000,
      address: "45 Skyline Tower",
      city: "Dubai",
      country: "UAE",
      propertyType: "apartment",
      imageUrls: [
        "/property-images/house7.jpg",
        "/property-images/house8.jpg"
      ]
    },
    {
      title: "Beachfront Villa",
      description: "Experience luxury living with this beautiful beachfront villa that provides direct access to the beach. The property includes spacious bedrooms, a private swimming pool, landscaped garden, and large balconies with sea views. Perfect for families looking for a peaceful yet premium lifestyle near the coast.",
      price: 950000,
      address: "Palm Beach Road",
      city: "Dubai",
      country: "UAE",
      propertyType: "house",
      imageUrls: [
        "/property-images/house9.jpg",
        "/property-images/house10.jpg"
      ]
    },
    {
      title: "Modern Townhouse",
      description: "A well-designed modern townhouse located in a quiet residential community. It offers multiple bedrooms, a fully equipped kitchen, parking space, and a small backyard. Close to schools, supermarkets, and public transport, making it ideal for families and working professionals.",
      price: 220000,
      address: "17 Maple Residency",
      city: "Abu Dhabi",
      country: "UAE",
      propertyType: "house",
      imageUrls: [
        "/property-images/house11.jpg",
        "/property-images/house12.jpg"
      ]
    },
    {
      title: "City Center Apartment",
      description: "This centrally located apartment provides easy access to all major facilities including offices, shopping centers, and entertainment zones. It features a modern interior design, spacious rooms, and excellent natural lighting, making it perfect for urban living.",
      price: 180000,
      address: "5 Central Plaza",
      city: "Sharjah",
      country: "UAE",
      propertyType: "apartment",
      imageUrls: [
        "/property-images/house13.jpg",
        "/property-images/house14.jpg"
      ]
    },
    {
      title: "Affordable Family Home",
      description: "A budget-friendly family home offering comfortable living spaces, a secure environment, and essential amenities. The house includes multiple bedrooms, a kitchen, and a small garden area. Ideal for first-time buyers looking for a cost-effective option.",
      price: 120000,
      address: "9 Sunrise Colony",
      city: "Ajman",
      country: "UAE",
      propertyType: "house",
      imageUrls: [
        "/property-images/house15.jpg",
        "/property-images/house16.jpg"
      ]
    },
    {
      title: "Luxury Smart Apartment",
      description: "A high-tech smart apartment equipped with the latest home automation systems including smart lighting, security, and climate control. The property offers a sleek design, premium finishes, and access to building amenities like a gym and swimming pool.",
      price: 300000,
      address: "88 Tech Tower",
      city: "Dubai",
      country: "UAE",
      propertyType: "apartment",
      imageUrls: [
        "/property-images/house17.jpg",
        "/property-images/house18.jpg"
      ]
    }
  ];

  for (const property of properties) {
    const { imageUrls, ...propertyData } = property;
    await prisma.property.create({
      data: {
        ...propertyData,
        images: imageUrls
          ? {
              create: imageUrls.map((imageUrl) => ({ imageUrl }))
            }
          : undefined
      }
    });
  }

  const total = await prisma.property.count();
  console.log(`Seed complete. Inserted ${properties.length} properties. Total in DB: ${total}`);
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
