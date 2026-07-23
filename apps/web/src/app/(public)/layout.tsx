import { SiteAnnouncementBanner } from "@/components/site-announcement-banner";
import { SiteConfigProvider } from "@/components/site-config-provider";
import { DEFAULT_SITE_CONFIG } from "@/modules/platform-config/site-config.defaults";
import {
  getPublicSiteConfig,
  type PublicSiteConfig,
} from "@/modules/platform-config/site-config.service";

/**
 * Reads the platform owner's website configuration on the server so every
 * public page below renders owner-controlled copy, plans, and feature flags.
 * Revalidated rather than static, so a save in the admin portal shows up
 * without a redeploy.
 */
export const revalidate = 60;

/**
 * The marketing site must never 500 because the settings collection is
 * unreachable — fall back to the shipped defaults if the read fails.
 */
async function loadConfig(): Promise<PublicSiteConfig> {
  try {
    return await getPublicSiteConfig();
  } catch {
    return {
      ...DEFAULT_SITE_CONFIG,
      facilities: DEFAULT_SITE_CONFIG.facilities.filter((facility) => facility.enabled),
      locations: DEFAULT_SITE_CONFIG.locations.filter((location) => location.enabled),
    };
  }
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await loadConfig();

  return (
    <SiteConfigProvider config={config}>
      <SiteAnnouncementBanner />
      {children}
    </SiteConfigProvider>
  );
}
