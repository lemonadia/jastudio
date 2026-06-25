import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'project' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'Project page: yoursite.com/project/[slug]',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year of the shoot or publication.',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'projectThumbnail',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Add images or Mux videos. Mix freely.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
        }),
        defineArrayMember({
          type: 'mux.video',
          name: 'galleryVideo',
          title: 'Video',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'thumbnail.image' },
    prepare({ title, slug }) {
      return { title, subtitle: slug ? `/project/${slug}` : '' }
    },
  },
})
