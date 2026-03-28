// 🚀 LITHIUM TECH: GitHub Repository Vault Bridge
// Reads lithium_db.json from the raw GitHub URL (no auth needed for public repos).
// Writes use the GitHub Contents API with a fine-grained PAT (Contents: R/W only).

const OWNER = "MrSlimey33";
const REPO = "LithiumOS";
const PATH = "lithium_db.json";
const BRANCH = "master";

// Fine-grained PAT scoped to MrSlimey33/LithiumOS → Contents: Read & Write
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Raw URL for public read — works without auth on public repos
const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}`;
const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

// Local cache key
const LOCAL_CACHE_KEY = "LITHIUM_VAULT_CACHE";

/**
 * Read the vault. Tries raw GitHub URL first, falls back to localStorage cache.
 * Reads NEVER require authentication on public repos.
 */
export async function getVault() {
  try {
    const res = await fetch(RAW_URL + `?t=${Date.now()}`, { cache: 'no-store' });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
      return { data, source: 'github' };
    }

    if (res.status === 404) {
      return { data: [], source: 'empty' };
    }

    throw new Error(`GitHub returned ${res.status}`);
  } catch (err) {
    console.warn("GitHub fetch failed, trying local cache:", err.message);
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      return { data: JSON.parse(cached), source: 'cache' };
    }
    return { data: [], source: 'empty' };
  }
}

/**
 * Get the current SHA of the vault file (needed for GitHub API updates).
 */
async function getFileSha() {
  const res = await fetch(API_URL, {
    headers: { Authorization: `token ${TOKEN}` }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to get file SHA");
  const data = await res.json();
  return data.sha;
}

/**
 * Write the vault back to the repo via the GitHub Contents API.
 * Uses the hardcoded PAT — scoped to Contents only on this single repo.
 */
export async function saveVault(content) {
  // Always update local cache first
  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(content));

  try {
    const sha = await getFileSha();
    const json = JSON.stringify(content, null, 2);
    const contentBase64 = btoa(unescape(encodeURIComponent(json)));

    const body = {
      message: "vault: lithium cloud sync",
      content: contentBase64,
      branch: BRANCH,
    };
    if (sha) body.sha = sha;

    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        Authorization: `token ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update vault.");
    return data.content.sha;
  } catch (err) {
    console.warn("GitHub write failed, saved to local cache only:", err.message);
    return 'local';
  }
}
