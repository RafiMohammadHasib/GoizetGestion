import { resetAndSeedDb } from '../lib/db';
import { ovhDb } from '../lib/ovh_client';

console.log('🌱 Starting GOIZET GESTION -> OVH MySQL Database Setup & Seeding...');

async function seedOvh() {
  try {
    console.log('📡 1. Pinging OVH Data Bridge...');
    const pingRes = await ovhDb.ping();
    console.log('   Response:', pingRes);

    if (!pingRes.success) {
      throw new Error(`OVH Bridge ping failed: ${pingRes.error || JSON.stringify(pingRes)}`);
    }

    console.log('🔨 2. Creating MySQL Tables in OVH (install)...');
    const installRes = await ovhDb.install();
    console.log('   Response:', installRes);

    console.log('📦 3. Preparing Seed Data...');
    const seedData = resetAndSeedDb();

    // 1. Admin Users
    console.log('👤 Seeding Admin Users into OVH MySQL...');
    const formattedUsers = seedData.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      active: u.active ? 1 : 0,
      created_at: u.createdAt
    }));
    const userRes = await ovhDb.from('admin_users').upsert(formattedUsers);
    console.log(`   ✓ Admin Users:`, userRes.error ? `Error: ${userRes.error.message}` : 'Inserted successfully');

    // 2. Owners
    console.log('🏢 Seeding Property Owners into OVH MySQL...');
    const formattedOwners = seedData.owners.map((o: any) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      phone: o.phone,
      address: o.address,
      notes: o.notes,
      status: o.status,
      properties_count: o.propertiesCount,
      created_at: o.createdAt
    }));
    const ownerRes = await ovhDb.from('owners').upsert(formattedOwners);
    console.log(`   ✓ Owners:`, ownerRes.error ? `Error: ${ownerRes.error.message}` : 'Inserted successfully');

    // 3. Properties
    console.log('🏡 Seeding 36 Bordeaux Properties into OVH MySQL...');
    const formattedProperties = seedData.properties.map((p: any) => ({
      id: p.id,
      reference: p.reference,
      title: p.title,
      slug: p.slug,
      description: p.description,
      short_description: p.shortDescription,
      transaction_type: p.transactionType,
      property_type: p.propertyType,
      price: p.price,
      charges: p.charges || 0,
      deposit: p.deposit || 0,
      surface: p.surface,
      rooms: p.rooms,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      floor: p.floor,
      total_floors: p.totalFloors,
      year_built: p.yearBuilt,
      energy_rating: p.energyRating,
      ges_rating: p.gesRating,
      address: p.address,
      postal_code: p.postalCode,
      city: p.city,
      neighborhood_slug: p.neighborhoodSlug,
      neighborhood_name: p.neighborhoodName,
      is_exclusive: p.isExclusive ? 1 : 0,
      status: p.status,
      features: p.features,
      images: p.images,
      cover_image: p.coverImage,
      views: p.views || 0,
      enquiries_count: p.enquiriesCount || 0,
      owner_id: p.ownerId,
      owner_name: p.ownerName,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      created_at: p.updatedAt,
      updated_at: p.updatedAt
    }));
    const propRes = await ovhDb.from('properties').upsert(formattedProperties);
    console.log(`   ✓ Properties:`, propRes.error ? `Error: ${propRes.error.message}` : 'Inserted successfully');

    // 4. CRM Leads
    console.log('📊 Seeding CRM Leads into OVH MySQL...');
    const formattedLeads = seedData.leads.map((l: any) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      lead_type: l.leadType,
      status: l.status,
      subject: l.subject,
      message: l.message,
      property_address: l.propertyAddress,
      budget: l.budget,
      surface: l.surface,
      assigned_to: l.assignedTo,
      source: l.source,
      notes: l.notes,
      activities: l.activities,
      created_at: l.createdAt
    }));
    const leadRes = await ovhDb.from('crm_leads').upsert(formattedLeads);
    console.log(`   ✓ CRM Leads:`, leadRes.error ? `Error: ${leadRes.error.message}` : 'Inserted successfully');

    // 5. Activity Logs
    console.log('📜 Seeding Activity Logs into OVH MySQL...');
    const formattedLogs = seedData.activityLogs.map((a: any) => ({
      id: a.id,
      user_name: a.user,
      action: a.action,
      object: a.object,
      timestamp: a.timestamp
    }));
    const logRes = await ovhDb.from('activity_logs').upsert(formattedLogs);
    console.log(`   ✓ Activity Logs:`, logRes.error ? `Error: ${logRes.error.message}` : 'Inserted successfully');

    console.log('\n🎉 ALL DONE! OVH MySQL Database is fully initialized, seeded and ready for production!');
  } catch (err: any) {
    console.error('❌ Failed to setup/seed OVH database:', err.message);
  }
}

seedOvh();
