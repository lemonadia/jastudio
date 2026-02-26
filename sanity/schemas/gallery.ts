import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Gallery Section',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
            },
          ],
          preview: {
            select: { media: 'image' },
            prepare({ media }) {
              return { title: 'Image', media }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(5).required(),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }) {
      return {
        title: 'Gallery',
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})
