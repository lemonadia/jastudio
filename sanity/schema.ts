import { type SchemaTypeDefinition } from 'sanity'

import category from './schemas/category'
import info from './schemas/info'
import project from './schemas/project'
import projectThumbnail from './schemas/projectThumbnail'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [info, category, projectThumbnail, project],
}
