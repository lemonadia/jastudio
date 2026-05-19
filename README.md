# Next.js + Sanity (starter)

## Setup

W katalogu projektu utwórz plik **`.env`** (sam u siebie — nie idzie do gita) i wpisz:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=twoje_id_z_sanity
NEXT_PUBLIC_SANITY_DATASET=production
```

Potem: `npm install` → `npm run dev`.

Studio: [http://localhost:3000/studio](http://localhost:3000/studio) — **Site settings** → *Site title*.

W Sanity Manage → **API → CORS** dodaj `http://localhost:3000`.

## Stack

Next.js (App Router), Tailwind, Sanity pod `/studio`, typ **settings** (singleton `siteTitle`).
