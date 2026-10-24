import fs from "node:fs";
import path from "node:path";

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = { ...process.env, ...loadEnv() };
const SUPABASE_URL = (env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = env.SUPABASE_BUCKET_NAME || "pdfs";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables:");
  if (!SUPABASE_URL) console.error("   - SUPABASE_URL (e.g. https://your-project-id.supabase.co)");
  if (!SUPABASE_SERVICE_ROLE_KEY) console.error("   - SUPABASE_SERVICE_ROLE_KEY (Service Role Secret from Supabase Dashboard)");
  console.error("\nPlease add them to your .env file.");
  process.exit(1);
}

// Ensure bucket exists and is public
async function ensureBucket() {
  const getRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET_NAME}`, {
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
    },
  });

  if (getRes.ok) {
    const bucketInfo = await getRes.json();
    console.log(`📦 Bucket "${BUCKET_NAME}" found (public: ${bucketInfo.public}).`);
    return;
  }

  console.log(`📦 Bucket "${BUCKET_NAME}" does not exist. Creating public bucket...`);
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET_NAME,
      name: BUCKET_NAME,
      public: true,
      file_size_limit: 52428800, // 50 MB (Supabase free tier limit)
      allowed_mime_types: ["application/pdf"],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.warn(`⚠️ Note on bucket creation: HTTP ${createRes.status} - ${err}`);
  } else {
    console.log(`✅ Successfully created public bucket "${BUCKET_NAME}".`);
  }
}

// Convert string to lowercase, hyphenated slug
function slugifyFileName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, ext);
  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${cleanBase}${ext}`;
}

async function uploadPdf(filePath) {
  const rawFileName = path.basename(filePath);
  const sanitizedFileName = slugifyFileName(rawFileName);
  const fileBuffer = fs.readFileSync(filePath);

  // Check file size limit (50 MB)
  const MAX_SIZE = 50 * 1024 * 1024;
  if (fileBuffer.byteLength > MAX_SIZE) {
    console.error(`❌ Skipping "${rawFileName}": File size (${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)} MB) exceeds 50 MB limit.`);
    return null;
  }

  // Supabase Storage REST endpoint for object upload
  const uploadEndpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${sanitizedFileName}`;

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/pdf",
      "x-upsert": "true", // Overwrites if already exists so URL stays constant
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Failed to upload "${sanitizedFileName}": HTTP ${response.status} - ${errorText}`);
    return null;
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${sanitizedFileName}`;
  console.log(`✅ Uploaded: ${rawFileName} -> ${sanitizedFileName}`);
  console.log(`   🔗 Public URL: ${publicUrl}\n`);
  return publicUrl;
}

async function main() {
  const target = process.argv[2] || "public/catalogues/endless-collection-web.pdf";
  const resolvedTarget = path.resolve(process.cwd(), target);

  if (!fs.existsSync(resolvedTarget)) {
    console.error(`❌ Target path does not exist: ${resolvedTarget}`);
    console.log("Usage:");
    console.log("  node scripts/upload-pdf-to-supabase.mjs [path-to-pdf-or-folder]");
    process.exit(1);
  }

  const stat = fs.statSync(resolvedTarget);
  console.log(`\n🚀 Uploading to Supabase Storage Bucket: "${BUCKET_NAME}"...`);
  await ensureBucket();

  if (stat.isDirectory()) {
    const files = fs.readdirSync(resolvedTarget);
    const pdfFiles = files.filter((f) => f.toLowerCase().endsWith(".pdf"));
    if (pdfFiles.length === 0) {
      console.log(`No .pdf files found in directory: ${resolvedTarget}`);
      return;
    }
    console.log(`Found ${pdfFiles.length} PDF file(s) in folder.\n`);
    for (const file of pdfFiles) {
      await uploadPdf(path.join(resolvedTarget, file));
    }
  } else {
    if (!resolvedTarget.toLowerCase().endsWith(".pdf")) {
      console.error("❌ The provided file is not a .pdf file.");
      process.exit(1);
    }
    await uploadPdf(resolvedTarget);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
