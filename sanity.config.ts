import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schema'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  schema,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site settings')
              .child(S.document().schemaType('settings').documentId('siteSettings')),
            S.listItem()
              .title('Info')
              .child(S.document().schemaType('info').documentId('info')),
            S.divider(),
            S.documentTypeListItem('category').title('Categories'),
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects',
              S,
              context,
            }),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
