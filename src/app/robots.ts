import type { MetadataRoute } from "next";

import { SEO_INDEXING_ENABLED, SITE_URL } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  // ====================================================
  // STAGING / LOCAL
  //
  // Do not allow search engines to index staging.
  // ====================================================

  if (!SEO_INDEXING_ENABLED) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // ====================================================
  // PRODUCTION
  //
  // Public pages may be indexed.
  // Private application areas should not be crawled.
  // ====================================================

  return {
    rules: {
      userAgent: "*",

      allow: ["/", "/jobs/", "/en/jobs/"],

      disallow: [
        "/admin/",
        "/en/admin/",

        "/staff/",
        "/en/staff/",

        "/job-seekers/",
        "/en/job-seekers/",

        "/job-seekers-auth/",
        "/en/job-seekers-auth/",

        "/provider-dashboard/",
        "/en/provider-dashboard/",

        "/admin-login/",
        "/en/admin-login/",

        "/staff-login/",
        "/en/staff-login/",

        "/auth/",
        "/en/auth/",
      ],
    },

    sitemap: `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}
