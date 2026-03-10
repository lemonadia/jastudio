import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'textImage',
  title: 'Text + Image',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (Rule) =>
        Rule.custom((text, ctx) =>
          !text && !(ctx.document as { smallText?: string })?.smallText
            ? 'Add text or small text (or both).'
            : true
        ),
    }),
    defineField({
      name: 'smallText',
      title: 'Small text',
      type: 'text',
    }),
    defineField({
      name: 'media',
      title: 'Media',
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
            {
              name: 'video',
              title: 'Video (alternative to image)',
              type: 'mux.video',
            },
          ],
          preview: {
            select: { media: 'image', video: 'video' },
            prepare({ media, video }) {
              return {
                title: video ? 'Video' : 'Image',
                media,
              }
            },
          },
          validation: (Rule) =>
            Rule.custom((item) => {
              const i = item as { image?: unknown; video?: unknown }
              return !i?.image && !i?.video ? 'Add an image or video.' : true
            }),
        },
      ],
      validation: (Rule) => Rule.min(1).max(3).required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Media position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
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
                  { title: 'External (URL)', value: 'url' },
                  { title: 'Internal (page)', value: 'internal' },
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
                  if (parent?.linkType === 'url' && !url) return 'Required for external link'
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
  ],
  preview: {
    select: {
      text: 'text',
      smallText: 'smallText',
      media: 'media.0.image',
      position: 'imagePosition',
    },
    prepare({ text, smallText, media, position }) {
      const content = text || smallText || ''
      return {
        title: content ? content.substring(0, 50) + '...' : 'Text + Image',
        subtitle: `Media ${position || 'left'}`,
        media,
      }
    },
  },
})
