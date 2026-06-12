# Next.js + Sanity (starter)

## Setup

W katalogu projektu utwórz plik **`.env`** (sam u siebie — nie idzie do gita) i wpisz:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=twoje_id_z_sanity
NEXT_PUBLIC_SANITY_DATASET=production
MUX_TOKEN_ID=twoj_mux_token_id
MUX_TOKEN_SECRET=twoj_mux_token_secret
```

Zobacz też `.env.example`.

Potem: `npm install` → `npm run dev`.

Studio: [http://localhost:3000/studio](http://localhost:3000/studio) — **Info**, **Categories**, **Projects**.

W Sanity Manage → **API → CORS** dodaj:
- `http://localhost:3000` (dev)
- adres produkcyjny, np. `https://jastudio-iota.vercel.app` — **z włączonym „Allow credentials”** (inaczej Studio/Mux zwróci „Forbidden - origin is not allowed”)

Albo z CLI: `npx sanity cors add https://twoja-domena.vercel.app --credentials`

### Mux (video)

1. W [Mux](https://dashboard.mux.com) utwórz **Access Token** (read + write video, read data).
2. Wklej `MUX_TOKEN_ID` i `MUX_TOKEN_SECRET` do `.env`.
3. Otwórz `/studio` — przy pierwszym uploadzie video plugin może poprosić o te same dane (zapisze je w dataset).
4. W projekcie: **Thumbnail** → typ Image lub Video + rozmiar (small / medium / big). **Gallery** → dodaj obraz albo **Video**.

Kategorię „Video” dodaj w Studio jak zwykłą kategorię (Categories), jeśli klient chce filtrować projekty wideo.

## Stack

Next.js (App Router), Tailwind, Sanity pod `/studio` (typy: **info**, **category**, **project**).
