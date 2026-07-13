import { PrismaClient } from '@prisma/client';

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
  console.log('Clearing old catalog products...');
  await prisma.product.deleteMany({});
  
  console.log('Generating 200 realistic demo books...');

  const productsData = [];

  for (let i = 1; i <= 200; i++) {
    const subject = subjects[i % subjects.length];
    const publisher = publishers[i % publishers.length];
    const author = authors[i % authors.length];
    const categoryObj = categories[i % categories.length];
    const format = categoryObj.formats[i % categoryObj.formats.length];
    
    // Calculate realistic price/MRP
    const price = Math.floor(150 + (i * 7.5)) % 1800 + 50;
    const mrp = Math.floor(price * 1.15);
    const discount = Math.round(((mrp - price) / mrp) * 100);

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
      stockCount: i % 15 === 0 ? 0 : Math.floor(3 + (i % 25)), // Generate some out-of-stock items for alerts
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

  // Bulk create in SQLite / Postgres
  await prisma.product.createMany({
    data: productsData
  });

  console.log(`Successfully seeded ${productsData.length} products! ✓`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
