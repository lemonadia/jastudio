import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'blockContent',
    }),
    defineField({
      name: 'links',
      title: 'Links (below text)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'linkType',
              title: 'Link type',
              type: 'string',
              options: {
                list: [
                  { title: 'URL', value: 'url' },
                  { title: 'Internal (page)', value: 'internal' },
                  { title: 'Email', value: 'email' },
                  { title: 'File (PDF)', value: 'file' },
                ],
                layout: 'radio',
              },
              initialValue: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              hidden: ({ parent }) => parent?.linkType !== 'url',
              validation: (Rule) =>
                Rule.custom((url, context) => {
                  const parent = context?.parent as { linkType?: string }
                  if (parent?.linkType === 'url' && !url) return 'Required for URL link'
                  return true
                }),
            },
            {
              name: 'internalRef',
              title: 'Page',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent?.linkType !== 'internal',
              validation: (Rule) =>
                Rule.custom((ref, context) => {
                  const parent = context?.parent as { linkType?: string }
                  if (parent?.linkType === 'internal' && !ref) return 'Select a page'
                  return true
                }),
            },
            {
              name: 'email',
              title: 'Email',
              type: 'string',
              hidden: ({ parent }) => parent?.linkType !== 'email',
              validation: (Rule) =>
                Rule.custom((email, context) => {
                  const parent = context?.parent as { linkType?: string }
                  if (parent?.linkType === 'email' && !email) return 'Required for email link'
                  if (parent?.linkType === 'email' && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email'
                  return true
                }),
            },
            {
              name: 'file',
              title: 'File (e.g. PDF)',
              type: 'file',
              options: {
                accept: '.pdf',
              },
              hidden: ({ parent }) => parent?.linkType !== 'file',
              validation: (Rule) =>
                Rule.custom((file, context) => {
                  const parent = context?.parent as { linkType?: string }
                  if (parent?.linkType === 'file' && !file) return 'Select a file'
                  return true
                }),
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }) {
              return { title: label || 'Link' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'alignment',
      title: 'Content alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      body: 'body',
    },
    prepare({ heading, body }) {
      const blocks = Array.isArray(body) ? body : []
      const firstBlock = blocks.find((b: { _type?: string }) => b._type === 'block')
      const text =
        firstBlock && 'children' in firstBlock
          ? (firstBlock.children as { text?: string }[])
              ?.map((c) => c.text)
              .join('') || ''
          : ''
      return {
        title: heading || (text ? text.substring(0, 40) + '...' : 'Text Block'),
      }
    },
  },
})
