# LawBot Pakistan — Prototype

This is a prototype for LawBot Pakistan:
- Monthly subscription service (Rs. 2,500) — users sign up and upload SadaPay payment screenshot.
- Admin reviews and approves/rejects payments.
- Approved users can chat with the AI legal assistant (Gemini).

Features in this prototype:
- Sign-up form (name, email, phone)
- Upload payment screenshot
- Admin panel to view pending screenshots and approve/reject
- Chat UI for approved users that proxies messages to your Gemini
Important: This is a prototype. Replace file storage, auth, and production secrets before going live.

Quick start
1. Copy files and run:
   npm install
   npx prisma migrate dev --name init
   npm run dev

2. Create `.env` from `.env.example` and set your GEMINI_API_KEY and GEMINI_API_URL.

Environment variables (.env)
- DATABASE_URL="file:./dev.db"
- NEXTAUTH_SECRET (for future auth)
- GEMINI_API_KEY — your Gemini API key
- GEMINI_API_URL — the endpoint the gemini key expects (see README)
- ADMIN_PASSWORD — prototype admin password

Gemini integration
This prototype uses a generic GEMINI_API_URL and GEMINI_API_KEY. Set GEMINI_API_URL to the REST endpoint you intend to use (for example Google Generative API endpoint or other provider). The server forwards user prompts and returns model output.

Security & production checklist
- Add proper authentication (NextAuth, JWT).
- Use cloud storage (S3, Supabase) for uploads and secure them.
- Use HTTPS and secure secrets.
- Add Terms of Service and a prominent legal disclaimer.
- Consider a lawyer/keeper to verify AI output and supervise for high risk cases.

If you want I can:
- Push to a GitHub repository and open a PR with CI.
- Add NextAuth, Supabase storage, and a real payment integration flow.
- Wire up a frontend/brand and deploy to Vercel.