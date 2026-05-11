const openApiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://pet-rescue-api-0uhx.onrender.com/api-docs";

module.exports = {
  petRescueApi: {
    input: {
      target: openApiUrl,
    },
    output: {
      target: "./src/infrastructure/api/generated/pet-rescue-api.ts",
      schemas: "./src/infrastructure/api/generated/model",
      client: "axios-functions",
      clean: true,
      override: {
        mutator: {
          path: "./src/infrastructure/api/client/orval-mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
};
