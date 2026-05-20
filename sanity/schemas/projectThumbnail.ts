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
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
      hidden: ({ parent }) => parent?.mediaType === 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string }
          if (parent?.mediaType === 'image' && !value) {
            return 'Image is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      hidden: ({ parent }) => parent?.mediaType === 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string }
          if (parent?.mediaType === 'video' && !value) {
            return 'Video is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'previewStart',
      title: 'Preview loop start (seconds)',
      type: 'number',
      description:
        'Where the homepage thumbnail loop begins. Use 0 for the start of the file.',
      initialValue: 0,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'previewDuration',
      title: 'Preview loop length (seconds)',
      type: 'number',
      description:
        'Only this segment loops on the homepage (e.g. 6). Full video still plays on the project page.',
      initialValue: 6,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      validation: (Rule) => Rule.min(1).max(60),
    }),
  ],
  preview: {
    select: {
      size: 'size',
      mediaType: 'mediaType',
      image: 'image',
      videoThumb: 'video.asset.thumbTime',
    },
    prepare({ size, mediaType, image }) {
      const labels: Record<string, string> = {
        big: 'Big',
        medium: 'Medium',
        small: 'Small',
      }
      const typeLabel = mediaType === 'video' ? 'Video' : 'Image'
      return {
        title: `${labels[size as string] ?? 'Thumbnail'} · ${typeLabel}`,
        media: mediaType === 'video' ? undefined : image,
      }
    },
  },
})
