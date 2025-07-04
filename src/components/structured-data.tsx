import Script from "next/script";

export interface WebsiteStructuredDataProps {
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export interface ArticleStructuredDataProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  category?: string;
  keywords?: string[];
}

export function WebsiteStructuredData({
  name,
  description,
  url,
  logo,
  sameAs = [],
}: WebsiteStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
    potentialAction: {
      "@type": "MagnifyingGlassAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/rules/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "VibeKit VDK",
      url,
      logo: logo || `${url}/images/logo.png`,
      sameAs,
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export interface SoftwareApplicationStructuredDataProps {
  name: string;
  description: string;
  url: string;
  downloadUrl?: string;
  applicationCategory: string;
  operatingSystem?: string[];
  softwareVersion?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

export function SoftwareApplicationStructuredData({
  name,
  description,
  url,
  downloadUrl,
  applicationCategory,
  operatingSystem = ["Windows", "macOS", "Linux"],
  softwareVersion,
  offers,
}: SoftwareApplicationStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    downloadUrl,
    applicationCategory,
    operatingSystem,
    softwareVersion,
    offers: offers && {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
    },
  };

  return (
    <Script
      id="software-application-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export interface RuleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
  datePublished?: string;
  author?: {
    name: string;
    url?: string;
  };
  category: string;
  tags?: string[];
}

export function RuleStructuredData({
  title,
  description,
  url,
  dateModified,
  datePublished,
  author,
  category,
  tags = [],
}: RuleStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    dateModified,
    datePublished,
    author: author && {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    about: {
      "@type": "Thing",
      name: category,
    },
    keywords: tags.join(", "),
    publisher: {
      "@type": "Organization",
      name: "VibeKit VDK Hub",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://vdk.tools",
    },
  };

  return (
    <Script
      id="rule-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
