import { resetAndSeedDb } from '../lib/db';

console.log('🌱 Starting GOIZET GESTION Database Seeding Process...');

try {
  const seed = resetAndSeedDb();
  console.log(`✅ Database successfully seeded!`);
  console.log(`   - ${seed.properties.length} Bordeaux Properties`);
  console.log(`   - ${seed.leads.length} CRM Leads & Enquiries`);
  console.log(`   - ${seed.owners.length} Property Owners`);
  console.log(`   - ${seed.users.length} Admin Users & Roles`);
} catch (err) {
  console.error('❌ Failed to seed database:', err);
  process.exit(1);
}
