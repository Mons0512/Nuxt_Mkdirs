import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { markdownSchema } from 'sanity-plugin-markdown';
import { schemaTypes } from './sanity/schemas';

// 硬编码 projectId，因为 Sanity CLI 不会读取 .env 中的 NUXT_* 变量
const projectId = 'eblhosig';
const dataset = 'production';
const apiVersion = '2024-01-01';

export default defineConfig({
  name: 'Studio',
  basePath: '/studio',
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool(),
    visionTool({
      title: 'Query',
      defaultApiVersion: apiVersion,
      defaultDataset: dataset,
    }),
    markdownSchema(),
  ],
});
