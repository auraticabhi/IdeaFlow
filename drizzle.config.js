/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://ideaflowdb_owner:uiHq7VStjy2d@ep-sparkling-glitter-a5flst8d.us-east-2.aws.neon.tech/ideaflowdb?sslmode=require",
    }
  };