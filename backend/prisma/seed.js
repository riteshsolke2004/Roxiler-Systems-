const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing tables
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
  const userPassword = await bcrypt.hash('UserPassword123!', 10);
  const ownerPassword = await bcrypt.hash('OwnerPassword123!', 10);

  // 1. Create System Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator User Account',
      email: 'admin@storerating.com',
      passwordHash: hashedPassword,
      address: '100 System Admin Parkway, Technology Building 1, Suite 500, New York, NY 10001',
      role: 'SYSTEM_ADMIN',
    },
  });

  // 2. Create Store Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'David Store Owner Professional',
      email: 'owner.david@storerating.com',
      passwordHash: ownerPassword,
      address: '10 Commerce Way, Business District, San Francisco, CA 94105',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Emma Retailer Owner Executive',
      email: 'owner.emma@storerating.com',
      passwordHash: ownerPassword,
      address: '20 Market Plaza, Suite 300, Austin, TX 78701',
      role: 'STORE_OWNER',
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Frank Boutique Owner Manager',
      email: 'owner.frank@storerating.com',
      passwordHash: ownerPassword,
      address: '30 Fashion Boulevard, Retail Mall, Miami, FL 33101',
      role: 'STORE_OWNER',
    },
  });

  // 3. Create Normal Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Robinson Smith Johnson',
      email: 'alice@example.com',
      passwordHash: userPassword,
      address: '123 Main Street, Apartment 4B, Springfield, IL 62701',
      role: 'NORMAL_USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Miller Davies Anderson',
      email: 'bob@example.com',
      passwordHash: userPassword,
      address: '456 Oak Avenue, Suite 12, Chicago, IL 60601',
      role: 'NORMAL_USER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Charlie Brown Vance Wilson',
      email: 'charlie@example.com',
      passwordHash: userPassword,
      address: '789 Pine Road, Unit 99, Seattle, WA 98101',
      role: 'NORMAL_USER',
    },
  });

  // 4. Create Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Tech Gadgets Central Store',
      email: 'info@techgadgetscentral.com',
      address: '500 Innovation Boulevard, Tech Park, Silicon Valley, CA 94025',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Gourmet Bakery Delight Store',
      email: 'contact@gourmetbakerydelight.com',
      address: '75 Sweet Pastry Lane, Culinary Quarter, Boston, MA 02108',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Urban Fashion Apparel Hub',
      email: 'support@urbanfashionapparel.com',
      address: '88 Trendsetting Street, Fashion Row, New York, NY 10012',
      ownerId: owner3.id,
    },
  });

  // 5. Create Ratings
  await prisma.rating.createMany({
    data: [
      { rating: 5, userId: user1.id, storeId: store1.id },
      { rating: 4, userId: user1.id, storeId: store2.id },
      { rating: 4, userId: user2.id, storeId: store1.id },
      { rating: 5, userId: user2.id, storeId: store3.id },
      { rating: 3, userId: user3.id, storeId: store2.id },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
