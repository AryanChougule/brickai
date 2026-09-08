/**
 * Remote asset manifest.
 *
 * Every third-party image and video used on the site is declared here with its
 * source, its licence and the local path it is vendored to. `npm run media`
 * downloads them into `public/media` — the site never hotlinks a CDN, so it
 * cannot break when a remote URL rotates and it costs nothing at runtime.
 *
 * LICENCE — all assets are Pexels (https://www.pexels.com/license/):
 * commercial use permitted, no attribution required, modification permitted,
 * no watermark. Credit is recorded here anyway, because provenance is worth
 * keeping even when it is not legally required.
 *
 * Adding an asset: append an entry, run `npm run media`, commit both the entry
 * and the downloaded file.
 */

export type AssetKind = "photo" | "video";

export interface RemoteAsset {
  /** Matches the `id` of the MediaSlot or VideoSlot it fills. */
  id: string;
  kind: AssetKind;
  /** Path under /public, and where the fetch script writes it. */
  file: string;
  /** Direct CDN URL the fetch script downloads. */
  url: string;
  /** Pexels numeric id, for the provenance link. */
  photoId: string;
  /** What the image actually shows — becomes the alt text. */
  description: string;
  licence: "Pexels";
}

/** Requested width before DPR. The script fetches at 2× this. */
export const PHOTO_WIDTH = 1600;

export const remoteAssets: RemoteAsset[] = [
  /* — Industrial automation narrative ——————————————————————————————— */
  {
    id: "auto-see",
    kind: "photo",
    file: "/media/auto-see.jpg",
    url: "https://images.pexels.com/photos/8438976/pexels-photo-8438976.jpeg",
    photoId: "8438976",
    description:
      "Robotic arm carrying a machine-vision camera, inspecting at close range",
    licence: "Pexels",
  },
  {
    id: "auto-predict",
    kind: "photo",
    file: "/media/auto-predict.jpg",
    url: "https://images.pexels.com/photos/32845700/pexels-photo-32845700.jpeg",
    photoId: "32845700",
    description: "Engineer monitoring plant systems across screens in a control room",
    licence: "Pexels",
  },
  {
    id: "auto-act",
    kind: "photo",
    file: "/media/auto-act.jpg",
    url: "https://images.pexels.com/photos/34194567/pexels-photo-34194567.jpeg",
    photoId: "34194567",
    description: "Industrial robot arm executing a programmed motion on the line",
    licence: "Pexels",
  },

  /* — Case-study cards ————————————————————————————————————————————— */
  {
    id: "work-vision-qc-packaging-line",
    kind: "photo",
    file: "/media/work-vision-qc.jpg",
    url: "https://images.pexels.com/photos/16544056/pexels-photo-16544056.jpeg",
    photoId: "16544056",
    description:
      "Close-up of an industrial robotic arm in a production environment",
    licence: "Pexels",
  },
  {
    id: "work-autonomous-freight-quoting-agent",
    kind: "photo",
    file: "/media/work-freight-agent.jpg",
    url: "https://images.pexels.com/photos/34902065/pexels-photo-34902065/free-photo-of-semi-truck-on-scenic-highway-with-mountains.jpeg",
    photoId: "34902065",
    description: "Articulated freight truck on a mountain highway",
    licence: "Pexels",
  },
  {
    id: "work-oee-platform-machine-builder",
    kind: "photo",
    file: "/media/work-oee-platform.jpg",
    url: "https://images.pexels.com/photos/34221993/pexels-photo-34221993/free-photo-of-industrial-manufacturing-assembly-line-equipment.jpeg",
    photoId: "34221993",
    description: "Manufacturing assembly line equipment on a plant floor",
    licence: "Pexels",
  },
  {
    id: "work-claims-document-intelligence",
    kind: "photo",
    file: "/media/work-claims.jpg",
    url: "https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg",
    photoId: "3844581",
    description: "Clinical monitoring equipment in a hospital treatment room",
    licence: "Pexels",
  },
  {
    id: "work-field-service-offline-app",
    kind: "photo",
    file: "/media/work-field-service.jpg",
    url: "https://images.pexels.com/photos/4487383/pexels-photo-4487383.jpeg",
    photoId: "4487383",
    description: "Workers moving through a distribution warehouse aisle",
    licence: "Pexels",
  },

  /* — Industry page headers ————————————————————————————————————————— */
  {
    id: "industry-manufacturing",
    kind: "photo",
    file: "/media/industry-manufacturing.jpg",
    url: "https://images.pexels.com/photos/34207359/pexels-photo-34207359/free-photo-of-industrial-robot-arm-in-a-manufacturing-facility.jpeg",
    photoId: "34207359",
    description: "Industrial robot arm working in a manufacturing facility",
    licence: "Pexels",
  },
  {
    id: "industry-healthcare",
    kind: "photo",
    file: "/media/industry-healthcare.jpg",
    url: "https://images.pexels.com/photos/13176452/pexels-photo-13176452.jpeg",
    photoId: "13176452",
    description: "CT scanner in a hospital imaging room",
    licence: "Pexels",
  },
  {
    id: "industry-retail",
    kind: "photo",
    file: "/media/industry-retail.jpg",
    url: "https://images.pexels.com/photos/16211537/pexels-photo-16211537/free-photo-of-shelves-in-grocery-store.jpeg",
    photoId: "16211537",
    description: "Stocked grocery shelving viewed down a store aisle",
    licence: "Pexels",
  },
  {
    id: "industry-logistics",
    kind: "photo",
    file: "/media/industry-logistics.jpg",
    url: "https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg",
    photoId: "1427541",
    description: "Intermodal shipping containers stacked at a port terminal",
    licence: "Pexels",
  },
  {
    id: "industry-construction",
    kind: "photo",
    file: "/media/industry-construction.jpg",
    url: "https://images.pexels.com/photos/30396647/pexels-photo-30396647/free-photo-of-red-tower-cranes-at-a-construction-site.jpeg",
    photoId: "30396647",
    description: "Tower cranes standing over an active construction site",
    licence: "Pexels",
  },
  {
    id: "industry-agriculture",
    kind: "photo",
    file: "/media/industry-agriculture.jpg",
    url: "https://images.pexels.com/photos/34182370/pexels-photo-34182370/free-photo-of-high-tech-drone-spraying-crops-in-field.jpeg",
    photoId: "34182370",
    description: "Agricultural drone spraying a crop field",
    licence: "Pexels",
  },
  {
    id: "industry-education",
    kind: "photo",
    file: "/media/industry-education.jpg",
    url: "https://images.pexels.com/photos/356065/pexels-photo-356065.jpeg",
    photoId: "356065",
    description: "Tiered university lecture hall seating",
    licence: "Pexels",
  },
  {
    id: "industry-finance",
    kind: "photo",
    file: "/media/industry-finance.jpg",
    url: "https://images.pexels.com/photos/936721/pexels-photo-936721.jpeg",
    photoId: "936721",
    description: "Financial district towers seen from street level",
    licence: "Pexels",
  },
  {
    id: "industry-government",
    kind: "photo",
    file: "/media/industry-government.jpg",
    url: "https://images.pexels.com/photos/34223492/pexels-photo-34223492/free-photo-of-dome-of-the-california-state-capitol-building.jpeg",
    photoId: "34223492",
    description: "Dome of a state capitol building",
    licence: "Pexels",
  },
  {
    id: "industry-automotive",
    kind: "photo",
    file: "/media/industry-automotive.jpg",
    url: "https://images.pexels.com/photos/19319639/pexels-photo-19319639/free-photo-of-boston-dynamics-robot-in-a-car-factory.jpeg",
    photoId: "19319639",
    description: "Robotics operating inside a car factory",
    licence: "Pexels",
  },

  /* — Video ————————————————————————————————————————————————————————— */
  {
    id: "auto-walkthrough",
    kind: "video",
    file: "/media/plant-walkthrough.mp4",
    url: "https://videos.pexels.com/video-files/32386590/13814640_2560_1440_100fps.mp4",
    photoId: "32386590",
    description: "Robotics operating on an automated factory line",
    licence: "Pexels",
  },
];

const byId = new Map(remoteAssets.map((asset) => [asset.id, asset]));

/** The vendored public path for a slot id, or undefined if it has no asset. */
export function assetFor(id: string): RemoteAsset | undefined {
  return byId.get(id);
}

/** Provenance link for the admin page. */
export function sourcePage(asset: RemoteAsset) {
  return asset.kind === "video"
    ? `https://www.pexels.com/video/${asset.photoId}/`
    : `https://www.pexels.com/photo/${asset.photoId}/`;
}
