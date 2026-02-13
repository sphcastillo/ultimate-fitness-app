import { createClient } from "@sanity/client";
import {createImageUrlBuilder} from '@sanity/image-url'
import type { SanityImageSource } from "@sanity/image-url";

const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET || "development";
const apiVersion = process.env.EXPO_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const useCdn = (process.env.EXPO_PUBLIC_SANITY_USE_CDN || "false") === "true";


export const config = {
    projectId,
    dataset,
    apiVersion,
    useCdn,
};

console.log("🔥 Sanity Config:", config);
  
export const client = createClient(config);

//Admin level client, used for backend
// Admin client for mutations

const adminConfig = {
    ...config,
    token: process.env.SANITY_API_TOKEN,
};

export const adminClient = createClient(adminConfig);

console.log("🔥 Sanity Admin Config:", adminConfig);

// Image URL builder
const builder = createImageUrlBuilder(config);
export const urlFor = (source: SanityImageSource) => builder.image(source);