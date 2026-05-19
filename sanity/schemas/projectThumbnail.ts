import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'projectThumbnail',
  title: 'Thumbnail',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Display size',
      type: 'string',
      options: {
        list: [
          { title: 'Big', value: 'big' },
          { title: 'Medium', value: 'medium' },
          { title: 'Small', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { size: 'size', media: 'image' },
    prepare({ size, media }) {
      const labels: Record<string, string> = {
        big: 'Big',
        medium: 'Medium',
        small: 'Small',
      }
      return {
        title: labels[size as string] ?? 'Thumbnail',
        media,
      }
    },
  },
})
