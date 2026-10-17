# OVH MySQL Data Bridge - নির্দেশিকা (Instructions)

আপনার OVH Web Hosting (`uwenyoi.cluster131.hosting.ovh.net`)-এ ডাটাবেজ ব্রিজ সেটআপ করার সহজ ৩টি ধাপ:

### ধাপ ১: ফাইলটি আপলোড করুন
1. OVH Control Panel-এ যান -> **Web Cloud** -> **Hosting plans** -> `uwenyoi.cluster131.hosting.ovh.net`।
2. **FTP - SSH** ট্যাবে যান এবং **FTP Web Explorer / Net2FTP** বাটনে ক্লিক করুন (অথবা FileZilla দিয়ে লগইন করুন)।
3. `www` ফোল্ডারের ভেতর ঢুকুন।
4. একটি নতুন ফোল্ডার তৈরি করুন যার নাম দিন: `api` (পাথ হবে: `www/api/`)।
5. এই ফোল্ডারের মধ্যে আপনার লোকাল প্রোজেক্টের `ovh-deploy/bridge.php` ফাইলটি আপলোড করুন।
   (চূড়ান্ত পাথ হবে: `www/api/bridge.php`)

### ধাপ ২: কানেকশন টেস্ট করা
ব্রাউজারে গিয়ে এই লিঙ্কটি খুলুন:
`http://uwenyoi.cluster131.hosting.ovh.net/api/bridge.php?secret=goizet_ovh_sec_89d3a7e4b2f1c580&action=ping`

যদি সব ঠিক থাকে, আপনি দেখতে পাবেন:
```json
{
  "success": true,
  "message": "Connected to OVH MySQL database successfully!",
  "database": "uwenyoidb1",
  "mysql_version": "8.4.x"
}
```

### ধাপ ৩: অটো-টেবিল তৈরি ও সিডিং (One-Command Setup)
আপনার কম্পিউটারের টার্মিনালে এই কমান্ডটি রান করুন:
```bash
npm run db:seed:ovh
```
এটি নিজে নিজেই:
- OVH MySQL-এ সব টেবিল (`properties`, `crm_leads`, `owners`, `tenants`, `activity_logs`, `admin_users`) তৈরি করে দেবে।
- সব প্রোপার্টিজ এবং লিড ডাটা সেখানে ইনসার্ট করে দেবে।

### ধাপ ৪: OVH ডাটাবেজ এক্টিভ করা
`.env.local` ফাইলে এবং Vercel Environment Variables-এ শুধু এটি সেট করুন:
```env
DATABASE_PROVIDER=ovh
OVH_BRIDGE_URL=http://uwenyoi.cluster131.hosting.ovh.net/api/bridge.php
OVH_BRIDGE_SECRET=goizet_ovh_sec_89d3a7e4b2f1c580
```
তাহলেই আপনার ওয়েবসাইট সম্পূর্ণভাবে OVH MySQL-এর সাথে লাইভ হয়ে যাবে!
