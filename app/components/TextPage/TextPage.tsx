import './TextPage.css'

export type TextPageData = {
  title?: string | null
  body?: string | null
}

export default function TextPage({ page }: { page: TextPageData | null }) {
  if (!page?.title && !page?.body) {
    return (
      <div className="container text-page">
        <p className="text-page__empty">Add content in Sanity Studio → Text pages.</p>
      </div>
    )
  }

  return (
    <div className="container text-page">
      {page.title ? <h1 className="text-page__title">{page.title}</h1> : null}
      {page.body ? <p className="text-page__body">{page.body}</p> : null}
    </div>
  )
}
