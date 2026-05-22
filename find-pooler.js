const { PrismaClient } = require('@prisma/client');

// Project ref from the direct URL
const PROJECT_REF = 'qwcmyjlixfnonqfisazy';
const PASSWORD = 'SZ8DEC2zsqp7XTPS';

// Common Supabase pooler regions
const REGIONS = [
  'ap-southeast-1',  // Singapore
  'us-east-1',       // US East (Virginia)
  'us-west-1',       // US West (N. California)
  'eu-west-1',       // EU (Ireland)
  'eu-central-1',    // EU (Frankfurt)
  'ap-northeast-1',  // Asia (Tokyo)
  'ap-south-1',      // Asia (Mumbai)
  'ap-southeast-2',  // Asia (Sydney)
  'sa-east-1',       // South America (São Paulo)
  'ca-central-1',    // Canada (Central)
  'eu-west-2',       // EU (London)
  'us-east-2',       // US East (Ohio)
  'us-west-2',       // US West (Oregon)
  'eu-west-3',       // EU (Paris)
  'eu-north-1',      // EU (Stockholm)
];

async function findPoolerRegion() {
  console.log('🔍 Searching for correct Supabase Pooler region...\n');
  
  for (const region of REGIONS) {
    const poolerUrl = `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`;
    
    process.stdout.write(`Testing ${region}... `);
    
    const prisma = new PrismaClient({
      datasources: { db: { url: poolerUrl } },
      log: [],
    });
    
    try {
      const result = await Promise.race([
        prisma.$queryRaw`SELECT 1 as test`,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      
      console.log('✅ CONNECTED!');
      console.log(`\n🎉 Found correct pooler URL!`);
      console.log(`\nDATABASE_URL="${poolerUrl}"`);
      console.log(`DIRECT_URL="postgresql://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"`);
      
      await prisma.$disconnect();
      return poolerUrl;
    } catch (error) {
      console.log('❌');
      await prisma.$disconnect().catch(() => {});
    }
  }
  
  console.log('\n❌ Could not find a working pooler region.');
  return null;
}

findPoolerRegion();
