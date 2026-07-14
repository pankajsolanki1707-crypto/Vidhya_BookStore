import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const subjects = [
  'Indian Polity', 'State History', 'General Science', 'Geography of MP',
  'Logical Reasoning', 'Quantitative Aptitude', 'Administrative Ethics',
  'Advanced Physics', 'Organic Chemistry', 'Calculus Volume', 'English Grammar'
];

const publishers = [
  'McGraw Hill', 'Kautilya Academy Publications', 'Dhanpat Rai',
  'Pearson Education', 'Oxford University Press', 'S. Chand Publications'
];

const authors = [
  'M. Laxmikanth', 'Kautilya Academy Experts', 'H.C. Verma',
  'R.D. Sharma', 'S.N. Singh', 'J.P. Sharma'
];

const categories = [
  { name: 'Competitive Exams', formats: ['Paperback', 'Hardcover'] },
  { name: 'Academic Textbooks', formats: ['Paperback', 'Hardcover'] },
  { name: 'Used Books', formats: ['Paperback'] },
  { name: 'Stationery', formats: ['Loose Sheets', 'Hardcase', 'Notebook Pack'] }
];

const exams = ['UPSC', 'MPPSC', 'JEE', 'NEET', 'SSC', 'Banking'];
const boards = ['CBSE', 'ICSE', 'MP Board'];
const branches = ['Bhanwarkuan Branch', 'Payal Plaza Outlet'];

async function main() {
  console.log('Clearing old database tables (OrderItem, Order, Product, User, AuditLog)...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.auditLog.deleteMany({});

  const productsData: any[] = [];
  const productsJsonPath = path.join(__dirname, '../../..', 'apps/frontend/src/data/products.json');

  if (fs.existsSync(productsJsonPath)) {
    console.log(`Loading real products from: ${productsJsonPath}`);
    try {
      const fileContent = fs.readFileSync(productsJsonPath, 'utf-8');
      const products = JSON.parse(fileContent);
      
      for (const p of products) {
        productsData.push({
          id: p.id,
          title: p.title,
          author: p.author,
          publisher: p.publisher || null,
          price: parseFloat(p.price),
          originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          category: p.category,
          subcategory: p.subcategory || null,
          format: p.format,
          image: p.image,
          description: p.description || '',
          stockCount: p.stockCount !== undefined ? parseInt(p.stockCount) : 10,
          inStock: p.stockCount !== undefined ? parseInt(p.stockCount) > 0 : true,
          isbn: p.isbn || null,
          pages: p.pages ? parseInt(p.pages) : null,
          publishYear: p.publishYear ? parseInt(p.publishYear) : null,
          featured: !!p.featured,
          isBestseller: !!p.isBestseller,
          isNewArrival: !!p.isNewArrival,
          board: p.board || null,
          exam: p.exam || null,
          branch: p.branch || 'Bhanwarkuan Branch'
        });
      }
      console.log(`Loaded ${productsData.length} products from products.json.`);
    } catch (err) {
      console.error('Failed to parse products.json. Seeding dummy products instead.', err);
    }
  }

  // Fallback if products.json was empty or failed to load
  if (productsData.length === 0) {
    console.log('Generating 200 realistic demo books (fallback)...');
    for (let i = 1; i <= 200; i++) {
      const subject = subjects[i % subjects.length];
      const publisher = publishers[i % publishers.length];
      const author = authors[i % authors.length];
      const categoryObj = categories[i % categories.length];
      const format = categoryObj.formats[i % categoryObj.formats.length];
      
      const price = Math.floor(150 + (i * 7.5)) % 1800 + 50;
      const mrp = Math.floor(price * 1.15);
      const isBook = categoryObj.name !== 'Stationery';
      
      const title = isBook 
        ? `${subject} for Competitive Exams (Vol ${Math.floor(i / 10) + 1})`
        : `Premium Classmate Notebook pack - ${i} Pages`;

      const isbn = `978-${Math.floor(9000000000 + Math.random() * 900000000)}`;

      const exam = isBook && (categoryObj.name === 'Competitive Exams' || categoryObj.name === 'Used Books')
        ? exams[i % exams.length]
        : undefined;

      const board = isBook && categoryObj.name === 'Academic Textbooks'
        ? boards[i % boards.length]
        : undefined;

      productsData.push({
        id: `vbs-prod-slug-${i}`,
        title,
        author: isBook ? author : 'Classmate India',
        publisher,
        price,
        originalPrice: mrp,
        category: categoryObj.name,
        format,
        image: isBook 
          ? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60'
          : 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60',
        description: `Premium syllabus study guide and exam reference workbook sourced directly from our Indore hubs. Ideal for MP civil services study groups.`,
        stockCount: i % 15 === 0 ? 0 : Math.floor(3 + (i % 25)),
        inStock: i % 15 !== 0,
        isbn,
        pages: isBook ? 180 + (i * 4) : 200,
        publishYear: 2020 + (i % 7),
        featured: i % 12 === 0,
        isBestseller: i % 8 === 0,
        isNewArrival: i % 6 === 0,
        board,
        exam,
        branch: branches[i % branches.length]
      });
    }
  }

  // Bulk create products in SQLite / Postgres
  await prisma.product.createMany({
    data: productsData
  });
  console.log(`Successfully seeded ${productsData.length} products! ✓`);

  // Seed default admin and test student users
  console.log('Seeding default users...');
  await prisma.user.createMany({
    data: [
      {
        id: 'user-admin-id-2026',
        email: 'admin@vidhya.com',
        name: 'Vidhya Store Admin',
        phone: '9876543210',
        walletBalance: 5000.0,
        rewardPoints: 1200
      },
      {
        id: 'user-student-test',
        email: 'student@vidhya.com',
        name: 'Pankaj Solanki',
        phone: '1234567890',
        walletBalance: 150.0,
        rewardPoints: 340
      }
    ]
  });
  console.log('Successfully seeded default users! ✓');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
