import { type SchemaTypeDefinition } from 'sanity'

import blockContent from './schemas/blockContent'
import homePage from './schemas/homePage'
import textImage from './schemas/textImage'
import textBlock from './schemas/textBlock'
import gallery from './schemas/gallery'
import page from './schemas/page'
import navigation from './schemas/navigation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, page, navigation, blockContent, textImage, textBlock, gallery],
}
