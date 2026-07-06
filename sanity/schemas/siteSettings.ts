import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      description:
        'Default title, description and OG image for the whole site. Used on the homepage and as fallback on pages without their own SEO.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' }
    },
  },
})
