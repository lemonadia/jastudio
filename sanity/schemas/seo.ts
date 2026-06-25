import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Browser tab and social share title. Falls back to page title when empty.',
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'SEO image',
      type: 'image',
      description: 'Open Graph / social share image.',
      options: { hotspot: true },
    }),
  ],
})
