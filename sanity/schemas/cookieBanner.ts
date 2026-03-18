import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cookieBanner',
  title: 'Cookie banner',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
  ],
  preview: {
    prepare() {
      return { title: 'Cookie banner' }
    },
  },
})

