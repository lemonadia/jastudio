# Konfiguracja Mux

## 1. Credentials w Sanity Studio

Przy pierwszym użyciu pola wideo w Sanity Studio pojawi się ekran konfiguracji. Wprowadź:

- **Access Token ID** – z [Mux Dashboard](https://dashboard.mux.com/settings/access-tokens)
- **Secret Key** – z tego samego miejsca

Token musi mieć uprawnienia: **Video read/write** i **Data read**.

## 2. Mux Data (opcjonalnie)

Dla analityki wideo dodaj do `.env.local`:

```
NEXT_PUBLIC_MUX_DATA_ENV_KEY=4oouu9u2vdto271nei746f3pf
```

(Environment key z dashboard.mux.com → Data)

## 3. Gdzie można dodać wideo

- **Home Page** – obraz lub wideo w tle
- **Text + Image** – każdy element media może być obrazem lub wideo
- **Gallery** – każdy element może być obrazem lub wideo

Istniejące zdjęcia pozostają bez zmian.
