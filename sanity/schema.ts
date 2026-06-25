import { type SchemaTypeDefinition } from 'sanity'

import category from './schemas/category'
import info from './schemas/info'
import project from './schemas/project'
import projectThumbnail from './schemas/projectThumbnail'
import seo from './schemas/seo'
import textPage from './schemas/textPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [seo, info, textPage, category, projectThumbnail, project],
}
