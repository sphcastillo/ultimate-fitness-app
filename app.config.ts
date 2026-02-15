import "dotenv/config";

export default ({ config }: any) => {
  const isProd = process.env.APP_ENV === "production";

  return {
    ...config,
    extra: {
      EXPO_PUBLIC_SANITY_PROJECT_ID: isProd
        ? process.env.EXPO_PUBLIC_SANITY_PROJECT_ID_PROD
        : process.env.EXPO_PUBLIC_SANITY_PROJECT_ID_DEV,

      EXPO_PUBLIC_SANITY_DATASET: isProd
        ? process.env.EXPO_PUBLIC_SANITY_DATASET_PROD
        : process.env.EXPO_PUBLIC_SANITY_DATASET_DEV,

      EXPO_PUBLIC_SANITY_API_VERSION:
        process.env.EXPO_PUBLIC_SANITY_API_VERSION || "2024-01-01",

      EXPO_PUBLIC_SANITY_USE_CDN: isProd ? "true" : "false",
    },
  };
};
