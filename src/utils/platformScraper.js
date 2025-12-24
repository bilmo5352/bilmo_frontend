// src/utils/platformScraper.js

export const PLATFORM_BASE = {
  zepto: "https://quickcomzepto.up.railway.app",
  dmart: "https://quickcomdmart.up.railway.app",
  jiomart: "https://quickcomjiomart.up.railway.app",
  naturesbasket: "https://quickcomnaturesbasket.up.railway.app",
  swiggy: "https://quickcomswiggy.up.railway.app",
};

const LOCATION = "madurai";

async function startPlatformJob(platform, productName) {
  const base = PLATFORM_BASE[platform];
  const params = new URLSearchParams({ product: productName, location: LOCATION });

  const res = await fetch(`${base}/api/${platform}?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || !data.success || !data.jobId) {
    throw new Error(data.error || `Failed to start job (${res.status})`);
  }

  return { jobId: data.jobId, base };
}

// poll /api/job/:jobId and unwrap job.result.data when done
async function waitForPlatformResult(base, jobId) {
  const start = Date.now();

  while (Date.now() - start < 300000) {
    const res = await fetch(`${base}/api/job/${jobId}`);

    const data = await res.json().catch(() => ({}));

    // job completed
    if (res.status === 200 && data.status === "completed") {
      const result = data.result || {};
      const raw = result.data;

      // normalize to array of sites
      const sites = Array.isArray(raw) ? raw : raw ? [raw] : [];

      if (!sites.length) return [];

      // for single‑website deployments, sites[0] is that website
      return (sites[0].products || []).map((p) => ({
        name: p.name,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount ?? null,
        discountAmount: p.discountAmount ?? null,
        isOutOfStock: p.isOutOfStock ?? false,
        imageUrl: p.imageUrl ?? null,
        productUrl: p.productUrl ?? null,
      }));
    }

    // still queued/processing
    if (res.status === 200 && (data.status === "queued" || data.status === "processing")) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }

    // failed job
    if (res.status === 200 && data.status === "failed") {
      throw new Error(data.error || "Scraping failed");
    }

    throw new Error(data.error || `Scraping failed (${res.status})`);
  }

  throw new Error("Timeout after 5 minutes");
}

export async function scrapeOnPlatform(platform, productName) {
  try {
    const { jobId, base } = await startPlatformJob(platform, productName);
    const products = await waitForPlatformResult(base, jobId);
    return { status: "success", products };
  } catch (err) {
    return {
      status: "error",
      products: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
