const DEFAULT_SITE_URL = "https://job-search.tokyo";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");

export const SEO_INDEXING_ENABLED =
  process.env.NEXT_PUBLIC_SEO_INDEXING_ENABLED === "true";
