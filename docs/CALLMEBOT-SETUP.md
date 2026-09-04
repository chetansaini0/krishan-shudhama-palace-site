# CallMeBot setup — Krishan Shudhama Palace

Owner WhatsApp booking alerts need a CallMeBot API key on **Vercel**.

## Target

- Phone: `918003402154` (8003402154)
- Env vars on Vercel project `krishan-shudhama-palace-site`:
  - `OWNER_WHATSAPP=918003402154`
  - `CALLMEBOT_APIKEY=<your key>`

## Get the key (5 minutes)

1. Save **+34 644 54 73 59** as a contact (CallMeBot) on the owner phone.
2. Send this WhatsApp message to that number:  
   `I allow callmebot to send me messages`
3. CallMeBot replies with your **apikey**.
4. Paste it into Vercel → Project → Settings → Environment Variables → Production (and Preview if you want).
5. Redeploy production.

Code already supports this via `site/src/lib/owner-whatsapp.ts` when `CALLMEBOT_APIKEY` is set.

## Status

- [ ] API key obtained  
- [ ] `OWNER_WHATSAPP` set on Vercel  
- [ ] `CALLMEBOT_APIKEY` set on Vercel  
- [ ] Test booking triggers WhatsApp to 8003402154  

**Blocked until Chetan pastes the API key** (do not commit secrets to git).
