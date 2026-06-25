import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { visionTool } from '@sanity/vision'
import { muxInput } from 'sanity-plugin-mux-input'
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
              .title('Info')
              .child(S.document().schemaType('info').documentId('info')),
            S.documentTypeListItem('textPage').title('Text pages'),
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
    muxInput({
      tool: { title: 'Videos' },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
