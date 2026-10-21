import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3000';
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'admin_db.json');

const testResults = {
  timestamp: new Date().toISOString(),
  environment: {
    nodeVersion: process.version,
    baseUrl: BASE_URL,
    dbPath: DB_PATH
  },
  suites: []
};

async function readDb(waitMs = 250) {
  if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function timedFetch(url, options = {}) {
  const start = performance.now();
  let status = 0;
  let data = null;
  let headers = {};
  let error = null;

  try {
    const res = await fetch(url, options);
    status = res.status;
    res.headers.forEach((v, k) => { headers[k] = v; });
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  } catch (err) {
    error = err.message;
  }
  const durationMs = Math.round((performance.now() - start) * 10) / 10;
  return { status, data, headers, error, durationMs };
}

async function runSuite(name, fn) {
  console.log(`\n========================================`);
  console.log(`RUNNING SUITE: ${name}`);
  console.log(`========================================`);
  const suiteResult = { name, tests: [], passed: 0, failed: 0, startTime: new Date().toISOString() };
  
  async function test(testName, testFn) {
    process.stdout.write(`  - ${testName} ... `);
    const start = performance.now();
    try {
      const details = await testFn();
      const durationMs = Math.round((performance.now() - start) * 10) / 10;
      console.log(`✅ PASS (${durationMs}ms)`);
      suiteResult.tests.push({ name: testName, status: 'PASS', durationMs, details });
      suiteResult.passed++;
    } catch (err) {
      const durationMs = Math.round((performance.now() - start) * 10) / 10;
      console.log(`❌ FAIL (${durationMs}ms): ${err.message}`);
      suiteResult.tests.push({ name: testName, status: 'FAIL', durationMs, error: err.message, stack: err.stack });
      suiteResult.failed++;
    }
  }

  await fn(test);
  suiteResult.endTime = new Date().toISOString();
  testResults.suites.push(suiteResult);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Global state shared across suites
let authCookie = '';

async function main() {
  console.log(`Starting Goizet Gestion Full System Test Suite against ${BASE_URL}...`);

  // SUITE 1: Auth & Session Security
  await runSuite('1. Authentication & Session Security', async (test) => {
    await test('Reject invalid credentials with HTTP 401', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gg.fr.com', password: 'wrong_password_xyz' })
      });
      assert(res.status === 401, `Expected 401, got ${res.status}`);
      assert(res.data?.error, 'Expected error message');
      return { status: res.status, durationMs: res.durationMs };
    });

    await test('Session check without cookie returns HTTP 401', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/auth/session`);
      assert(res.status === 401, `Expected 401, got ${res.status}`);
      assert(res.data?.authenticated === false, 'Expected authenticated: false');
      return { status: res.status, durationMs: res.durationMs };
    });

    await test('Accept valid credentials (admin@gg.fr.com / @dmin@gg.fr) with HTTP 200 & JWT cookie', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gg.fr.com', password: '@dmin@gg.fr' })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.data?.success === true, 'Expected success: true');
      assert(res.data?.user?.email === 'admin@gg.fr.com', 'Expected user email match');

      const rawCookie = res.headers['set-cookie'];
      assert(rawCookie, 'Expected Set-Cookie header');
      authCookie = rawCookie.split(';')[0];
      assert(authCookie.includes('maison_admin_session='), 'Expected maison_admin_session cookie');
      return { status: res.status, user: res.data.user, cookieSet: true, durationMs: res.durationMs };
    });

    await test('Verify authenticated session with valid cookie returns HTTP 200', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/auth/session`, {
        headers: { Cookie: authCookie }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.data?.authenticated === true, 'Expected authenticated: true');
      assert(res.data?.user?.role === 'Super Admin', 'Expected role Super Admin');
      return { status: res.status, user: res.data.user, durationMs: res.durationMs };
    });
  });

  // SUITE 2: Database Store & Unit Parity
  await runSuite('2. Database Storage & Unit Parity Check', async (test) => {
    const db = await readDb(0);

    await test('Database schema structure validation', async () => {
      assert(Array.isArray(db.properties), 'db.properties must be an array');
      assert(Array.isArray(db.leads), 'db.leads must be an array');
      assert(Array.isArray(db.users), 'db.users must be an array');
      assert(Array.isArray(db.owners), 'db.owners must be an array');
      assert(typeof db.settings === 'object', 'db.settings must be an object');
      assert(db.properties.length >= 30, `Expected at least 30 properties, found ${db.properties.length}`);
      assert(db.leads.length >= 20, `Expected at least 20 leads, found ${db.leads.length}`);
      return {
        propertiesCount: db.properties.length,
        leadsCount: db.leads.length,
        ownersCount: db.owners.length,
        usersCount: db.users.length
      };
    });

    await test('Property Units Parity (DB vs API)', async () => {
      const apiRes = await timedFetch(`${BASE_URL}/api/properties`);
      assert(apiRes.status === 200, `Expected 200, got ${apiRes.status}`);
      const apiProps = apiRes.data?.properties;
      assert(Array.isArray(apiProps), 'Expected properties array from API');

      let checkedProps = 0;
      for (const dbProp of db.properties.slice(0, 10)) {
        const apiProp = apiProps.find(p => p.id === dbProp.id);
        assert(apiProp, `Property ${dbProp.id} missing in API response`);
        
        // Exact numeric value comparisons
        assert(apiProp.price === dbProp.price, `Price mismatch on ${dbProp.id}: DB=${dbProp.price}, API=${apiProp.price}`);
        assert(typeof apiProp.price === 'number', `Price must be numeric, got ${typeof apiProp.price}`);
        assert(apiProp.surface === dbProp.surface, `Surface mismatch on ${dbProp.id}: DB=${dbProp.surface}, API=${apiProp.surface}`);
        assert(typeof apiProp.surface === 'number', `Surface must be numeric, got ${typeof apiProp.surface}`);
        
        if (dbProp.charges !== undefined && dbProp.charges !== null) {
          assert(apiProp.charges === dbProp.charges, `Charges mismatch on ${dbProp.id}`);
        }
        if (dbProp.deposit !== undefined && dbProp.deposit !== null) {
          assert(apiProp.deposit === dbProp.deposit, `Deposit mismatch on ${dbProp.id}`);
        }
        
        // Energy & GES rating units
        assert(apiProp.energyRating === dbProp.energyRating, `Energy rating mismatch on ${dbProp.id}`);
        assert(['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(apiProp.energyRating), `Invalid energy rating ${apiProp.energyRating}`);
        assert(apiProp.gesRating === dbProp.gesRating, `GES rating mismatch on ${dbProp.id}`);

        // Price suffix unit (/ mois CC)
        if (dbProp.transactionType === 'louer') {
          assert(apiProp.priceSuffix.includes('mois') || apiProp.priceSuffix.includes('CC'), `Expected price suffix unit on rental ${dbProp.id}`);
        }

        checkedProps++;
      }
      return { sampledCount: checkedProps, sampleProperty: { id: db.properties[0].id, price: `${db.properties[0].price} €`, surface: `${db.properties[0].surface} m²`, rating: `DPE ${db.properties[0].energyRating}` } };
    });

    await test('Agency Settings Units Parity', async () => {
      const s = db.settings;
      assert(typeof s.managementFeeRate === 'number', 'managementFeeRate must be numeric');
      assert(s.managementFeeRate > 0 && s.managementFeeRate < 20, `managementFeeRate out of reasonable % range: ${s.managementFeeRate}%`);
      assert(typeof s.gliInsuranceRate === 'number', 'gliInsuranceRate must be numeric');
      assert(s.financialGuarantee.includes('€'), `financialGuarantee should include € unit: ${s.financialGuarantee}`);
      assert(s.siret && s.siret.length >= 9, `SIRET invalid: ${s.siret}`);
      return {
        managementFeeRate: `${s.managementFeeRate}%`,
        gliInsuranceRate: `${s.gliInsuranceRate}%`,
        financialGuarantee: s.financialGuarantee,
        siret: s.siret
      };
    });
  });

  // SUITE 3: Public Forms Ingestion & DB Value/Unit Verification
  await runSuite('3. Public Forms Ingestion & Storage Parity', async (test) => {
    const testId = Date.now();

    await test('Contact Form submission (POST /api/contact) with budget & surface units', async () => {
      const testEmail = `test.contact.${testId}@automated-audit.fr`;
      const payload = {
        fullName: `Audit Contact ${testId}`,
        email: testEmail,
        phone: '06 12 34 56 78',
        subject: 'Demande de renseignement gestion',
        message: 'Audit automatique de stockage et rendu unitaire.',
        budget: '1 750 € / mois',
        surface: '68 m² • 3 pièces'
      };

      const res = await timedFetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
      assert(res.data?.success === true, 'Expected success: true');

      // Verify direct in database
      const db = await readDb(100);
      const savedLead = db.leads.find(l => l.email === testEmail);
      assert(savedLead, 'Lead was not found in admin_db.json after contact form submit');
      assert(savedLead.name === payload.fullName, `Name mismatch in DB: ${savedLead.name}`);
      assert(savedLead.budget === payload.budget, `Budget unit mismatch: DB=${savedLead.budget}, Expected=${payload.budget}`);
      assert(savedLead.surface === payload.surface, `Surface unit mismatch: DB=${savedLead.surface}, Expected=${payload.surface}`);
      assert(savedLead.status === 'NEW', `Expected status NEW, got ${savedLead.status}`);

      return { leadId: savedLead.id, storedBudget: savedLead.budget, storedSurface: savedLead.surface, durationMs: res.durationMs };
    });

    await test('Owner Enquiry Form (POST /api/owner-enquiry) with numeric surface & rooms', async () => {
      const testEmail = `test.owner.${testId}@automated-audit.fr`;
      const payload = {
        fullName: `Audit Propriétaire ${testId}`,
        email: testEmail,
        phone: '06 98 76 54 32',
        serviceType: 'Rental management',
        propertyType: 'appartement',
        neighborhood: 'Chartrons',
        address: '22 Cours Portal',
        surface: '82',
        rooms: '4',
        budget: '1950',
        message: 'Audit automatique de conversion d unités.'
      };

      const res = await timedFetch(`${BASE_URL}/api/owner-enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
      assert(res.data?.success === true, 'Expected success: true');

      // Verify direct in database
      const db = await readDb(100);
      const savedLead = db.leads.find(l => l.email === testEmail);
      assert(savedLead, 'Lead was not found in admin_db.json after owner-enquiry submit');
      assert(savedLead.surface === '82 m² • 4 pièces', `Surface unit mismatch: DB="${savedLead.surface}", Expected="82 m² • 4 pièces"`);
      assert(savedLead.budget === '1950 €', `Budget unit mismatch: DB="${savedLead.budget}", Expected="1950 €"`);
      assert(savedLead.leadType === 'Owner Enquiry', `Expected leadType Owner Enquiry, got ${savedLead.leadType}`);

      return { leadId: savedLead.id, storedBudget: savedLead.budget, storedSurface: savedLead.surface, durationMs: res.durationMs };
    });

    await test('Rental Valuation Form (POST /api/estimation) with auto-computed rent brackets', async () => {
      const testEmail = `test.estimation.${testId}@automated-audit.fr`;
      const payload = {
        name: `Audit Estimateur ${testId}`,
        email: testEmail,
        phone: '06 55 44 33 22',
        propertyType: 'Appartement',
        neighborhood: 'Triangle d\'Or',
        surface: '70',
        rooms: '3'
      };

      const res = await timedFetch(`${BASE_URL}/api/estimation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
      assert(res.data?.success === true, 'Expected success: true');
      assert(res.data?.estimation?.min && res.data?.estimation?.max, 'Expected min and max in estimation response');

      // Check formula: 70 * 14.5 * 0.95 = 964, 70 * 17.5 * 1.05 = 1286
      const expectedMin = Math.round(70 * 14.5 * 0.95);
      const expectedMax = Math.round(70 * 17.5 * 1.05);
      assert(res.data.estimation.min === expectedMin, `Expected min=${expectedMin}, got ${res.data.estimation.min}`);
      assert(res.data.estimation.max === expectedMax, `Expected max=${expectedMax}, got ${res.data.estimation.max}`);

      // Verify direct in database
      const db = await readDb(100);
      const savedLead = db.leads.find(l => l.email === testEmail);
      assert(savedLead, 'Lead was not found in admin_db.json after estimation submit');
      assert(savedLead.surface === '70 m² • 3 pièces', `Surface unit mismatch: DB="${savedLead.surface}"`);
      assert(savedLead.budget === `Est. ${expectedMin} € - ${expectedMax} € / mois`, `Budget unit mismatch: DB="${savedLead.budget}"`);

      return { leadId: savedLead.id, min: `${expectedMin} €`, max: `${expectedMax} €`, durationMs: res.durationMs };
    });
  });

  // SUITE 4: Property Views & Enquiry Counter Mutation
  await runSuite('4. Counter Mutation & Atomic DB Sync', async (test) => {
    const dbBefore = await readDb(0);
    const targetProp = dbBefore.properties[0];
    const initialViews = Number(targetProp.views || 0);

    await test(`Increment view counter on ${targetProp.id} via POST /api/properties/view`, async () => {
      const res = await timedFetch(`${BASE_URL}/api/properties/view?id=${targetProp.id}`, {
        method: 'POST'
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.data?.success === true, 'Expected success: true');

      // Verify updated count in DB
      const dbAfter = await readDb(280);
      const updatedProp = dbAfter.properties.find(p => p.id === targetProp.id);
      assert(Number(updatedProp.views) === initialViews + 1, `Expected views to be ${initialViews + 1}, got ${updatedProp.views}`);

      return { propertyId: targetProp.id, initialViews, updatedViews: updatedProp.views, durationMs: res.durationMs };
    });
  });

  // SUITE 5: Admin CRM Lifecycle & Converted Owner Hook
  await runSuite('5. CRM Lifecycle & Automatic Entity Provisioning', async (test) => {
    const db = await readDb(0);
    const testLead = db.leads.find(l => l.email?.includes('automated-audit.fr'));
    assert(testLead, 'Expected automated test lead to exist');

    await test('Fetch unified leads pipeline via GET /api/admin/crm', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/crm`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(Array.isArray(res.data?.leads), 'Expected leads array');
      const found = res.data.leads.find(l => l.id === testLead.id);
      assert(found, `Expected test lead ${testLead.id} to be present in CRM response`);
      assert(found.budget === testLead.budget, 'Budget unit mismatch in CRM endpoint');
      assert(found.surface === testLead.surface, 'Surface unit mismatch in CRM endpoint');
      return { totalLeads: res.data.total, durationMs: res.durationMs };
    });

    await test('Update lead status to QUALIFIED via PATCH /api/admin/crm', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/crm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testLead.id, status: 'QUALIFIED' })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      return { leadId: testLead.id, newStatus: 'QUALIFIED', durationMs: res.durationMs };
    });

    await test('Update lead status to CONVERTED and trigger auto-provisioning', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/crm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testLead.id, status: 'CONVERTED' })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);

      // Verify lead is marked CONVERTED
      const dbAfter = await readDb(280);
      const convertedLead = dbAfter.leads.find(l => l.id === testLead.id);
      assert(convertedLead.status === 'CONVERTED', `Expected status CONVERTED, got ${convertedLead.status}`);

      // Check if Owner was auto-created in db.owners
      const createdOwner = dbAfter.owners.find(o => o.email === testLead.email || o.id === `own_${testLead.id.replace('lead_', '')}`);
      assert(createdOwner, 'Expected automatic owner record in db.owners upon CONVERTED status');
      assert(createdOwner.name === testLead.name, `Owner name mismatch: ${createdOwner.name}`);
      return { leadId: testLead.id, status: 'CONVERTED', autoOwnerId: createdOwner.id, durationMs: res.durationMs };
    });
  });

  // SUITE 6: Admin Management Endpoints
  await runSuite('6. Admin Dashboard & Backoffice Endpoints', async (test) => {
    await test('Admin Dashboard KPIs (GET /api/admin/dashboard)', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/dashboard`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(typeof res.data?.kpis === 'object', 'Expected kpis object');
      assert(res.data.kpis.totalProperties >= 30, 'Expected >=30 total properties in KPIs');
      assert(res.data.kpis.activeMandates > 0, 'Expected active mandates > 0');
      assert(res.data.kpis.retentionRate === 98, 'Expected retentionRate = 98');
      return { kpis: res.data.kpis, durationMs: res.durationMs };
    });

    await test('Admin Settings endpoint (GET /api/admin/settings) with session cookie', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/settings`, {
        headers: { Cookie: authCookie }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.data?.settings?.siteName === 'GOIZET GESTION', 'Expected siteName GOIZET GESTION');
      return { siteName: res.data.settings.siteName, email: res.data.settings.email, durationMs: res.durationMs };
    });

    await test('Admin Owners list (GET /api/admin/owners)', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/owners`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(Array.isArray(res.data?.owners), 'Expected owners array');
      assert(res.data.owners.length > 0, 'Expected at least 1 owner');
      return { ownersCount: res.data.owners.length, durationMs: res.durationMs };
    });

    await test('Admin Tenants list (GET /api/admin/tenants)', async () => {
      const res = await timedFetch(`${BASE_URL}/api/admin/tenants`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(Array.isArray(res.data?.tenants), 'Expected tenants array');
      assert(res.data.tenants.length > 0, 'Expected at least 1 tenant');
      return { tenantsCount: res.data.tenants.length, durationMs: res.durationMs };
    });
  });

  // SUITE 7: Property Filters & Catalog Queries
  await runSuite('7. Search Filters & Property Catalog Queries', async (test) => {
    await test('Filter by transactionType=louer', async () => {
      const res = await timedFetch(`${BASE_URL}/api/properties?type=louer`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const props = res.data.properties;
      assert(props.length > 0, 'Expected rental properties');
      assert(props.every(p => p.transactionType === 'louer'), 'All properties must have transactionType=louer');
      return { count: props.length, durationMs: res.durationMs };
    });

    await test('Filter by maxPrice=1200', async () => {
      const res = await timedFetch(`${BASE_URL}/api/properties?maxPrice=1200`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const props = res.data.properties;
      assert(props.length > 0, 'Expected properties with price <= 1200');
      assert(props.every(p => p.price <= 1200), 'All properties must have price <= 1200');
      return { count: props.length, maxReturned: Math.max(...props.map(p => p.price)), durationMs: res.durationMs };
    });

    await test('Filter by minSurface=70', async () => {
      const res = await timedFetch(`${BASE_URL}/api/properties?minSurface=70`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const props = res.data.properties;
      assert(props.length > 0, 'Expected properties with surface >= 70');
      assert(props.every(p => p.surface >= 70), 'All properties must have surface >= 70');
      return { count: props.length, minReturned: Math.min(...props.map(p => p.surface)), durationMs: res.durationMs };
    });

    await test('Lookup single property by slug', async () => {
      const db = await readDb(0);
      const sampleSlug = db.properties[0].slug;
      const res = await timedFetch(`${BASE_URL}/api/properties?slug=${sampleSlug}`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.data?.property?.slug === sampleSlug, 'Slug mismatch in lookup response');
      return { propertyTitle: res.data.property.title, durationMs: res.durationMs };
    });
  });

  // SUITE 8: Public SSR Page Health & Status Codes
  await runSuite('8. Public SSR Pages & Asset Health', async (test) => {
    const pages = [
      { name: 'Homepage (with Maison Calvé workspace section)', path: '/' },
      { name: 'Property Catalog', path: '/biens' },
      { name: 'Rental Management (Gestion Locative)', path: '/gestion-locative' },
      { name: 'Rental Valuation Calculator', path: '/estimation' },
      { name: 'Entrust Property Form', path: '/confier-un-bien' },
      { name: 'Contact Agency Page', path: '/contact' },
      { name: 'About Agency Page', path: '/a-propos' },
      { name: 'Admin Login / Portal', path: '/admin' },
      { name: 'Robots.txt', path: '/robots.txt' },
      { name: 'Sitemap XML', path: '/sitemap.xml' }
    ];

    for (const p of pages) {
      await test(`GET ${p.path} (${p.name})`, async () => {
        const res = await timedFetch(`${BASE_URL}${p.path}`);
        assert(res.status === 200, `Expected 200 for ${p.path}, got ${res.status}`);
        return { status: res.status, durationMs: res.durationMs };
      });
    }
  });

  // SUITE 9: Performance & Latency Benchmarks
  await runSuite('9. Latency & Response Speed Benchmarks', async (test) => {
    const benchmarkEndpoints = [
      { label: 'API Properties List', url: `${BASE_URL}/api/properties` },
      { label: 'API Admin Dashboard', url: `${BASE_URL}/api/admin/dashboard` },
      { label: 'API Admin CRM Leads', url: `${BASE_URL}/api/admin/crm` },
      { label: 'API Admin Settings', url: `${BASE_URL}/api/admin/settings`, options: { headers: { Cookie: authCookie } } },
      { label: 'Page Homepage (SSR)', url: `${BASE_URL}/` },
      { label: 'Page Catalog (SSR)', url: `${BASE_URL}/biens` },
      { label: 'Page Estimation (SSR)', url: `${BASE_URL}/estimation` },
      { label: 'Page Contact (SSR)', url: `${BASE_URL}/contact` }
    ];

    for (const ep of benchmarkEndpoints) {
      await test(`Benchmark ${ep.label} (3 iterations)`, async () => {
        const timings = [];
        for (let i = 0; i < 3; i++) {
          const res = await timedFetch(ep.url, ep.options);
          assert(res.status === 200, `Expected 200, got ${res.status}`);
          timings.push(res.durationMs);
        }
        const min = Math.min(...timings);
        const max = Math.max(...timings);
        const avg = Math.round((timings.reduce((a, b) => a + b, 0) / timings.length) * 10) / 10;
        return { runs: timings, minMs: min, avgMs: avg, maxMs: max };
      });
    }
  });

  // SUITE 10: Security, Sanitization & Edge Cases
  await runSuite('10. Security, Rate Limiting & Input Sanitization', async (test) => {
    await test('Input Sanitization strips/escapes HTML/Script tags in Contact form', async () => {
      const maliciousName = '<script>alert("xss")</script>Jean Dupont';
      const maliciousMsg = '<img src=x onerror=alert(1)>Demande urgente';
      const testEmail = `xss.test.${Date.now()}@automated-audit.fr`;

      const res = await timedFetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.10.10.3' },
        body: JSON.stringify({
          fullName: maliciousName,
          email: testEmail,
          phone: '06 11 22 33 44',
          message: maliciousMsg
        })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);

      const db = await readDb(280);
      const savedLead = db.leads.find(l => l.email === testEmail);
      assert(savedLead, 'Lead was not saved');
      assert(!savedLead.name.includes('<script>'), 'Script tag must be stripped/escaped from name');
      assert(!savedLead.message.includes('<img'), 'Img tag must be stripped/escaped from message');
      return { sanitizedName: savedLead.name, sanitizedMsg: savedLead.message, durationMs: res.durationMs };
    });

    await test('Reject invalid email format with HTTP 400', async () => {
      const res = await timedFetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.10.10.1' },
        body: JSON.stringify({
          fullName: 'Valid Name',
          email: 'not-a-valid-email',
          phone: '06 11 22 33 44',
          message: 'Test validation'
        })
      });
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.data?.errorCode === 'INVALID_EMAIL', `Expected INVALID_EMAIL, got ${res.data?.errorCode}`);
      return { status: res.status, errorCode: res.data.errorCode, durationMs: res.durationMs };
    });

    await test('Reject missing name with HTTP 400', async () => {
      const res = await timedFetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.10.10.2' },
        body: JSON.stringify({
          fullName: '',
          email: 'valid@email.com',
          phone: '06 11 22 33 44',
          message: 'Test validation'
        })
      });
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.data?.errorCode === 'NAME_REQUIRED', `Expected NAME_REQUIRED, got ${res.data?.errorCode}`);
      return { status: res.status, errorCode: res.data.errorCode, durationMs: res.durationMs };
    });

    await test('Rate limiting triggers HTTP 429 upon request flooding', async () => {
      // Rapidly fire requests to /api/contact to trigger the 5 req/min threshold
      let got429 = false;
      const results = [];
      const burstIp = `203.0.113.${Math.floor(10 + Math.random() * 80)}`;
      for (let i = 0; i < 7; i++) {
        const res = await timedFetch(`${BASE_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-forwarded-for': burstIp },
          body: JSON.stringify({
            fullName: `Flood Test ${i}`,
            email: `flood_${Date.now()}_${i}@test.fr`,
            phone: '06 12 34 56 78',
            message: 'Flood test'
          })
        });
        results.push(res.status);
        if (res.status === 429) {
          got429 = true;
          break;
        } else if (res.status !== 200) {
          console.log(`[Flood Debug #${i}] Status=${res.status}, Data=`, res.data);
        }
      }
      assert(got429, `Expected rate limit 429 to trigger within 7 burst requests, got statuses: ${results.join(', ')}`);
      return { burstAttempts: results.length, finalStatus: 429 };
    });
  });

  // SUMMARY & REPORT DUMP
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  testResults.suites.forEach(s => {
    totalTests += s.tests.length;
    totalPassed += s.passed;
    totalFailed += s.failed;
  });

  testResults.summary = {
    totalSuites: testResults.suites.length,
    totalTests,
    totalPassed,
    totalFailed,
    successRate: `${Math.round((totalPassed / totalTests) * 100)}%`
  };

  console.log(`\n========================================`);
  console.log(`TEST RUN COMPLETED`);
  console.log(`Suites: ${testResults.suites.length} | Tests: ${totalTests} | Passed: ${totalPassed} | Failed: ${totalFailed}`);
  console.log(`Success Rate: ${testResults.summary.successRate}`);
  console.log(`========================================\n`);

  const outPath = path.join(process.cwd(), 'scratch', 'test_results.json');
  fs.writeFileSync(outPath, JSON.stringify(testResults, null, 2), 'utf-8');
  console.log(`Saved detailed test results to ${outPath}`);
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
