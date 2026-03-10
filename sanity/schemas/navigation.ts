import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'leftLinks',
      title: 'Left items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'page',
              title: 'Page',
              type: 'reference',
              to: [{ type: 'page' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
            },
          ],
          preview: {
            select: { label: 'label', title: 'page.title' },
            prepare({ label, title }) {
              return { title: label || title || 'Page link' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'rightLinks',
      title: 'Right items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }) {
              return { title: label || 'External link' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mobileText',
      title: 'Mobile Text',
      type: 'blockContent',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
