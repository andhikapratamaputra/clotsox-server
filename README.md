# Clotso-X Server

Backend API untuk aplikasi Clotso-X.

## Endpoint

- `POST /api/auth/login` — login user
- `GET /api/app/features` — daftar fitur sesuai tier
- `GET /api/admin/seed` — buat admin pertama
- `POST /api/admin/create-user` — buat user baru (butuh admin secret)

## Deploy

Deploy ke Vercel, set environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `HMAC_SECRET`
- `ADMIN_SECRET`
