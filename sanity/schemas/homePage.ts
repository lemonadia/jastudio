import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image (full size)',
      type: 'image',
      options: {
        hotspot: true,
      },
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
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
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
