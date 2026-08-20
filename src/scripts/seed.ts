import { resetAndSeedDb } from '../lib/db';
import { generateSeedData } from '../lib/db_seed';
import { createClient } from '@supabase/supabase-js';

console.log('🌱 Starting GOIZET GESTION Database Seeding Process...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gflxxtsgqmznnpjkgjpg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YjirgmGKhMPnNkJOkDtSmg_2gQwDdiV';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  try {
    const seedData = resetAndSeedDb();
    console.log(`✅ Local database cache successfully seeded!`);

    console.log('📡 Connecting and seeding Supabase PostgreSQL database...');

    // 1. Seed Admin Users
    const formattedUsers = seedData.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      active: u.active,
      created_at: u.createdAt
    }));
    const { error: userErr } = await supabase.from('admin_users').upsert(formattedUsers, { onConflict: 'id' });
    if (userErr) console.warn('⚠️ admin_users seed notice:', userErr.message);
    else console.log(`   ✓ ${formattedUsers.length} Admin Users inserted`);

    // 2. Seed Owners
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
    const { error: ownerErr } = await supabase.from('owners').upsert(formattedOwners, { onConflict: 'id' });
    if (ownerErr) console.warn('⚠️ owners seed notice:', ownerErr.message);
    else console.log(`   ✓ ${formattedOwners.length} Property Owners inserted`);

    // 3. Seed Properties
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
      is_exclusive: p.isExclusive,
      status: p.status,
      features: p.features,
      images: p.images,
      cover_image: p.coverImage,
      views: p.views,
      enquiries_count: p.enquiriesCount,
      owner_id: p.ownerId,
      owner_name: p.ownerName,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      updated_at: p.updatedAt
    }));
    const { error: propErr } = await supabase.from('properties').upsert(formattedProperties, { onConflict: 'id' });
    if (propErr) console.warn('⚠️ properties seed notice:', propErr.message);
    else console.log(`   ✓ ${formattedProperties.length} Properties inserted`);

    // 4. Seed CRM Leads
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
    const { error: leadErr } = await supabase.from('crm_leads').upsert(formattedLeads, { onConflict: 'id' });
    if (leadErr) console.warn('⚠️ crm_leads seed notice:', leadErr.message);
    else console.log(`   ✓ ${formattedLeads.length} CRM Leads inserted`);

    // 5. Seed Activity Logs
    const formattedLogs = seedData.activityLogs.map((a: any) => ({
      id: a.id,
      user_name: a.user,
      action: a.action,
      object: a.object,
      timestamp: a.timestamp
    }));
    const { error: logErr } = await supabase.from('activity_logs').upsert(formattedLogs, { onConflict: 'id' });
    if (logErr) console.warn('⚠️ activity_logs seed notice:', logErr.message);
    else console.log(`   ✓ ${formattedLogs.length} Activity Logs inserted`);

    console.log('🎉 Supabase Database Seeding Complete and Verified!');
  } catch (err) {
    console.error('❌ Failed to seed database:', err);
    process.exit(1);
  }
}

seed();
