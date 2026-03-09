import type { NextConfig } from "next";

const securityHeaders = [
  // Désactive le pre-fetch DNS non sollicité
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Empêche l'intégration dans des iframes externes (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Empêche le MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Politique de référent stricte
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive les accès caméra, micro, géolocalisation non nécessaires
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS pendant 2 ans (activer uniquement en production avec SSL)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requiert unsafe-inline et unsafe-eval en développement
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Images : local + Unsplash CDN
      "img-src 'self' data: blob: https://images.unsplash.com",
      // Connexions réseau : local uniquement
      "connect-src 'self'",
      // Iframes autorisées : uniquement OpenStreetMap
      "frame-src https://www.openstreetmap.org",
      // Empêche ce site d'être intégré dans une iframe externe
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirections 301 depuis l'ancien site PHP → nouveau site
      { source: "/circuit.php",     destination: "/excursions", permanent: true },
      { source: "/partenaire.php",  destination: "/partenaires", permanent: true },
      { source: "/contact.php",     destination: "/contact",    permanent: true },
      { source: "/reservation.php", destination: "/fleet",      permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
