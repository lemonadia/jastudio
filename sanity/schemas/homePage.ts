import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'image',
      title: 'Image (full size)',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'content',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video (alternative to image)',
      type: 'mux.video',
      group: 'content',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'content',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
      group: 'seo',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((doc) =>
      !doc?.image && !doc?.video ? 'Add an image or video.' : true
    ),
  preview: {
    prepare() {
      return {
        title: 'Home Page',
      }
    },
  },
})
