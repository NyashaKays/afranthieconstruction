

import { PHOTOS } from "./photos";

export const CONTACT = {
  addressLines: ["22 Childwall Rd", "Bluffhill, Harare", "Zimbabwe"],
  phones: ["+263 774 963 984", "+263 774 466 531"],
  whatsapp: "263774963984",
  email: "afranthie@gmail.com",
  lead: { name: "Anthwell Muchie Gwese", role: "Marketing Executive" },
};

export const NAV = [
  { name: "Home", path: "/", sheet: "01" },
  { name: "About", path: "/about", sheet: "02" },
  { name: "Services", path: "/services", sheet: "03" },
  { name: "Contact", path: "/contact", sheet: "04" },
];


export const SERVICES = [
  {
    ref: "S-01",
    title: "Welding of Steel Structures",
    scene: PHOTOS.s01,
    sceneAlt: "A welder joining steel sections in a fabrication shop",
    summary:
      "Fabrication and erection of beams, frames, columns and structural supports for industrial and domestic buildings.",
    includes: [
      "Structural beams, portal frames and trusses",
      "On-site erection and site welding",
      "Repairs and reinforcement of existing steelwork",
    ],
  },
  {
    ref: "S-02",
    title: "Construction of Houses",
    scene: PHOTOS.s02,
    sceneAlt: "Builders working on reinforced columns rising against the sky",
    summary:
      "Residential building from foundation to finish — excavation, bricklaying, roofing and final structural checks.",
    includes: [
      "Foundations, slabs and bricklaying",
      "Roof structure and cover",
      "Structural sign-off at each stage",
    ],
  },
  {
    ref: "S-03",
    title: "Maintenance & Repairing",
    scene: PHOTOS.s03,
    sceneAlt: "A tradesperson servicing a wall-mounted fixture",
    summary:
      "Planned property upkeep, structural repairs, fixture maintenance and general overhaul work.",
    includes: [
      "Structural and damp repairs",
      "Electrical fixture and fitting maintenance",
      "Scheduled building upkeep",
    ],
  },
  {
    ref: "S-04",
    title: "Demolition & Renovation",
    scene: PHOTOS.s04,
    sceneAlt: "The interior of a house mid-renovation with props in place",
    summary:
      "Controlled structural demolition, room remodelling, wall openings and full interior or exterior transformation.",
    includes: [
      "Controlled strip-out and demolition",
      "Structural openings and extensions",
      "Remodelling and refit",
    ],
  },
  {
    ref: "S-05",
    title: "Fencing & Paving",
    scene: PHOTOS.s05,
    sceneAlt: "An aerial view of walled residential plots",
    summary:
      "Boundary walls, chain-link and razor-wire fencing, and interlocking driveway or yard paving.",
    includes: [
      "Precast and brick boundary walls",
      "Chain-link, palisade and razor-wire fencing",
      "Interlocking paver driveways and yards",
    ],
  },
  {
    ref: "S-06",
    title: "Painting & Tiling",
    scene: PHOTOS.s06,
    sceneAlt: "A freshly tiled kitchen wall and sink",
    summary:
      "Interior and exterior painting, floor and wall tiling, and damp-proofing to finish a build.",
    includes: [
      "Interior and exterior painting",
      "Floor and wall tiling",
      "Damp-proofing and sealing",
    ],
  },
  {
    ref: "S-07",
    title: "Electric Gates & Carports",
    scene: PHOTOS.s07,
    sceneAlt: "A metal driveway gate between brick pillars at a house entrance",
    summary:
      "Automated sliding and swing gates, plus weather-proof steel carports built to the opening.",
    includes: [
      "Sliding and swing gate automation",
      "Steel carports and shade structures",
      "Motor supply, install and service",
    ],
  },
  {
    ref: "S-08",
    title: "Veranda Screens & Durawall Spikes",
    scene: PHOTOS.s08,
    sceneAlt: "A decorative steel security screen over a building window",
    summary:
      "Decorative veranda security screens and heavy-duty spikes for precast boundary walls.",
    includes: [
      "Custom veranda and burglar screens",
      "Durawall spikes and wall-top security",
      "Powder-coat and paint finish",
    ],
  },
];


export const PROCESS = [
  {
    ref: "P-01",
    title: "Site visit & brief",
    body: "We come to the site, look at the ground and the existing structure, and take down exactly what you want built.",
  },
  {
    ref: "P-02",
    title: "Quotation",
    body: "You get a written, itemised quotation — materials and labour separated, per trade, with nothing hidden.",
  },
  {
    ref: "P-03",
    title: "Fabrication & build",
    body: "Steel is fabricated and the build is run by the same team, so the frame and the finish answer to one contractor.",
  },
  {
    ref: "P-04",
    title: "Structural check & handover",
    body: "Each stage is checked before the next begins, and the work is handed over clean.",
  },
];
