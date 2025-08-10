// context/offers.ts

export interface Offer {
  id: string
  title: string
  description: string
  features: string[]
  provider: string
  location: string
  useCase: string[]
  // Plan specifications
  cpu: number // vCPUs
  ram: number // RAM in GB
  storage: number // Storage in GB
  bandwidth: number // Monthly bandwidth in GB
  // Pricing tiers
  pricingTiers: {
    id: string
    billingCycle: 'MONTHLY' | 'SEMI_ANNUAL' | 'ANNUAL'
    price: number
    currency: string
    discountPercent?: number
    displayPrice: string // Formatted price for display
  }[]
}

export const offersData: Offer[] = [
  {
    id: "vps-bronze",
    title: "VPS Bronze",
    description: "VPS for light workloads, unlimited traffic.",
    features: [
      "1 vCore CPU",
      "2 GB RAM",
      "20 GB SSD",
      "Unlimited bandwidth",
      "1 Public IPv4",
      "Optional managed support",
    ],
    provider: "not available yet",
    location: "Algeria",
    useCase: ["Personal Projects", "Small Websites"],
    // Plan specs
    cpu: 1,
    ram: 2,
    storage: 20,
    bandwidth: -1, // -1 for unlimited
    // Pricing tiers
    pricingTiers: [
      {
        id: "bronze-monthly",
        billingCycle: 'MONTHLY',
        price: 2400,
        currency: 'DZD',
        displayPrice: '2,400 DZD/mo'
      },
      {
        id: "bronze-semi-annual",
        billingCycle: 'SEMI_ANNUAL',
        price: 13600,
        currency: 'DZD',
        discountPercent: 5.6,
        displayPrice: '13,600 DZD/6mo'
      },
      {
        id: "bronze-annual",
        billingCycle: 'ANNUAL',
        price: 26000,
        currency: 'DZD',
        discountPercent: 9.7,
        displayPrice: '26,000 DZD/yr'
      }
    ]
  },
  {
    id: "vps-silver",
    title: "VPS Silver",
    description: "Small VPS for personal projects, unlimited traffic.",
    features: [
      "1 vCore CPU", 
      "2 GB RAM", 
      "40 GB SSD", 
      "Unlimited bandwidth",
      "1 Public IPv4", 
      "Optional backups"
    ],
    provider: "not available yet",
    location: "Algeria",
    useCase: ["Personal Projects", "Small Websites", "Development"],
    // Plan specs
    cpu: 1,
    ram: 2,
    storage: 40,
    bandwidth: -1, // unlimited
    // Pricing tiers
    pricingTiers: [
      {
        id: "silver-monthly",
        billingCycle: 'MONTHLY',
        price: 2900,
        currency: 'DZD',
        displayPrice: '2,900 DZD/mo'
      },
      {
        id: "silver-semi-annual",
        billingCycle: 'SEMI_ANNUAL',
        price: 16400,
        currency: 'DZD',
        discountPercent: 5.7,
        displayPrice: '16,400 DZD/6mo'
      },
      {
        id: "silver-annual",
        billingCycle: 'ANNUAL',
        price: 31000,
        currency: 'DZD',
        discountPercent: 10.6,
        displayPrice: '31,000 DZD/yr'
      }
    ]
  },
  {
    id: "vps-gold",
    title: "VPS Gold",
    description: "Medium tier for web apps or small databases.",
    features: [
      "2 vCore CPU", 
      "4 GB RAM", 
      "80 GB SSD", 
      "Unlimited bandwidth",
      "1 Public IPv4", 
      "cPanel available"
    ],
    provider: "not available yet",
    location: "Algeria",
    useCase: ["Web Applications", "Small Databases", "Small Business"],
    // Plan specs
    cpu: 2,
    ram: 4,
    storage: 80,
    bandwidth: -1, // unlimited
    // Pricing tiers
    pricingTiers: [
      {
        id: "gold-monthly",
        billingCycle: 'MONTHLY',
        price: 5500,
        currency: 'DZD',
        displayPrice: '5,500 DZD/mo'
      },
      {
        id: "gold-semi-annual",
        billingCycle: 'SEMI_ANNUAL',
        price: 31000,
        currency: 'DZD',
        discountPercent: 5.8,
        displayPrice: '31,000 DZD/6mo'
      },
      {
        id: "gold-annual",
        billingCycle: 'ANNUAL',
        price: 59000,
        currency: 'DZD',
        discountPercent: 10.6,
        displayPrice: '59,000 DZD/yr'
      }
    ]
  }
]

// export const offersData: Offer[] = [
//   {
//     title: "ADEX Cloud • XS •",
//     price: "2 400 DZD/mo",
//     description: "VPS for light workloads, unlimited traffic.",
//     features: [
//       "1 vCore CPU",
//       "2 GB RAM",
//       "20 GB SSD",
      
//       "1 Public IPv4",
//       "Optional managed support",
//     ],
//     provider: "ADEX Cloud",
//   },
//   {
//     title: "ADEX Cloud • S •",
//     price: "2 900 DZD/mo",
//     description: "Small VPS for personal projects, unlimited traffic.",
//     features: ["1 vCore CPU", "2 GB RAM", "40 GB SSD",  "1 Public IPv4", "Optional backups"],
//     provider: "ADEX Cloud",
//   },
//   {
//     title: "ADEX Cloud • M •",
//     price: "5 500 DZD/mo",
//     description: "Medium tier for web apps or small databases.",
//     features: ["2 vCore CPU", "4 GB RAM", "80 GB SSD",  "1 Public IPv4", "cPanel available"],
//     provider: "ADEX Cloud",
//   },
//   {
//     title: "ADEX Cloud • L •",
//     price: "8 700 DZD/mo",
//     description: "High‑performance for business workloads.",
//     features: ["4 vCore CPU", "8 GB RAM", "80 GB SSD",  "1 Public IPv4", "Infogérance option"],
//     provider: "ADEX Cloud",
//   },
//   {
//     title: "ADEX Cloud • XL •",
//     price: "10 450 DZD/mo",
//     description: "XL VPS with extra storage for intensive tasks.",
//     features: ["4 vCore CPU", "8 GB RAM", "150 GB SSD",  "1 Public IPv4", "Daily snapshots"],
//     provider: "ADEX Cloud",
//   },
//   {
//     title: "ISSAL Net • ECO •",
//     price: "2 900 DZD/mo",
//     description: "Budget FleXCompute ECO plan, unlimited traffic.",
//     features: ["2 vCPU cores", "4 GB RAM", "100 GB disk",  "1 Public IPv4", "SSH/RDP access"],
//     provider: "ISSAL Net",
//   },
//   {
//     title: "ISSAL Net • ESSENTIAL •",
//     price: "3 900 DZD/mo",
//     description: "Balanced FleXCompute plan for small services.",
//     features: ["4 vCPU cores", "6 GB RAM", "150 GB disk",  "1 Public IPv4", "Automated backups"],
//     provider: "ISSAL Net",
//   },
//   {
//     title: "ISSAL Net • BOOST •",
//     price: "4 900 DZD/mo",
//     description: "Performance‑boost plan for moderate loads.",
//     features: ["6 vCPU cores", "8 GB RAM", "200 GB disk",  "1 Public IPv4", "Priority support"],
//     provider: "ISSAL Net",
//   },
//   {
//     title: "ISSAL Net • Standard •",
//     price: "7 100 DZD/mo",
//     description: "Standard VPS with SLA-backed uptime.",
//     features: ["2 vCPU cores", "4 GB RAM", "100 GB disk",  "1 Public IPv4", "99.9% SLA"],
//     provider: "ISSAL Net",
//   },
//   {
//     title: "ISSAL Net • Business •",
//     price: "10 200 DZD/mo",
//     description: "Business‑grade VPS for web and app hosting.",
//     features: ["4 vCPU cores", "8 GB RAM", "150 GB disk",  "1 Public IPv4", "Managed firewall"],
//     provider: "ISSAL Net",
//   },
//   {
//     title: "ISSAL Net • Enterprise •",
//     price: "15 500 DZD/mo",
//     description: "Enterprise VPS for mission‑critical workloads.",
//     features: [
//       "6 vCPU cores",
//       "12 GB RAM",
//       "250 GB disk",
      
//       "1 Public IPv4",
//       "Dedicated support line",
//     ],
//     provider: "ISSAL Net",
//   },
//   {
//     title: "Ayrade • VPS 1 •",
//     price: "6 900 DZD/mo",
//     description: "Entry VPS with generous storage.",
//     features: ["1 vCPU", "2 GB RAM", "400 GB SSD",  "1 Public IPv4", "Control panel"],
//     provider: "Ayrade",
//   },
//   {
//     title: "Ayrade • VPS 2 •",
//     price: "9 000 DZD/mo",
//     description: "Powerful VPS for larger applications.",
//     features: ["2 vCPU", "16 GB RAM", "400 GB SSD",  "1 Public IPv4", "Daily backups"],
//     provider: "Ayrade",
//   },
//   {
//     title: "Ayrade • VPS 3 •",
//     price: "12 500 DZD/mo",
//     description: "High‑end VPS for heavy compute tasks.",
//     features: ["8 vCPU", "24 GB RAM", "1.2 TB SSD",  "1 Public IPv4", "Premium support"],
//     provider: "Ayrade",
//   },
//   {
//     title: "Ayrade • VPS 4 •",
//     price: "22 500 DZD/mo",
//     description: "Top‑tier VPS for enterprise workloads.",
//     features: ["12 vCPU", "48 GB RAM", "1.6 TB SSD",  "1 Public IPv4", "Custom SLAs"],
//     provider: "Ayrade",
//   },
//   {
//     title: "Icosnet • Plan 1 •",
//     price: "5 500 DZD/mo",
//     description: "Local VMware VPS, perfect for dev/test.",
//     features: ["1 vCore CPU", "4 GB RAM", "80 GB SSD",  "1 Public IPv4", "VMware virtualization"],
//     provider: "Icosnet",
//   },
//   {
//     title: "Icosnet • Plan 2 •",
//     price: "8 900 DZD/mo",
//     description: "Enhanced RAM for smoother performance.",
//     features: [
//       "1 vCore CPU",
//       "6 GB RAM",
//       "150 GB SSD",
      
//       "1 Public IPv4",
//       "VMware virtualization",
//     ],
//     provider: "Icosnet",
//   },
//   {
//     title: "Icosnet • Plan 3 •",
//     price: "13 900 DZD/mo",
//     description: "Double cores for multi‑threaded apps.",
//     features: [
//       "2 vCore CPU",
//       "8 GB RAM",
//       "300 GB SSD",
      
//       "1 Public IPv4",
//       "VMware virtualization",
//     ],
//     provider: "Icosnet",
//   },
//   {
//     title: "Icosnet • Plan 4 •",
//     price: "29 000 DZD/mo",
//     description: "Quad‑core VPS for database hosting.",
//     features: [
//       "4 vCore CPU",
//       "16 GB RAM",
//       "600 GB SSD",
      
//       "1 Public IPv4",
//       "VMware virtualization",
//     ],
//     provider: "Icosnet",
//   },
//   {
//     title: "Icosnet • Plan 5 •",
//     price: "59 000 DZD/mo",
//     description: "Ultra‑performance VPS for high‑load services.",
//     features: [
//       "8 vCore CPU",
//       "32 GB RAM",
//       "1.2 TB SSD",
      
//       "1 Public IPv4",
//       "VMware virtualization",
//     ],
//     provider: "Icosnet",pco
//   },
// ]