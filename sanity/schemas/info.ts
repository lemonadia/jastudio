import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'info',
  title: 'Info',
  type: 'document',
  fields: [
    defineField({
      name: 'body',
      title: 'Text',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact heading',
      type: 'string',
    }),
    defineField({
      name: 'contactText',
      title: 'Contact text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'instagramHeading',
      title: 'Instagram heading',
      type: 'string',
    }),
    defineField({
      name: 'instagramName',
      title: 'Instagram name',
      type: 'string',
      description: 'Handle shown on the site, e.g. @studio or studio.',
    }),
    defineField({
      name: 'instagramLink',
      title: 'Instagram URL (optional)',
      type: 'url',
      description: 'If empty, the profile link is built from Instagram name.',
    }),
    defineField({
      name: 'downloadHeading',
      title: 'Download heading',
      type: 'string',
    }),
    defineField({
      name: 'downloadLink',
      title: 'Download link',
      type: 'url',
      description: 'Link to a PDF (or other file). Opens in a new tab.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Info' }
    },
  },
})
