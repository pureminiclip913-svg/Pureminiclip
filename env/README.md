# VOXIA AI - Environment Keys Directory

This directory provides a safe, git-ignored place to configure your private API keys.

## Supported Keys

### 1. Sarvam AI (`SARVAM_API_KEY`)
- **Purpose**: Powers the 12 expressive Bulbul v3 neural Hindi & Indic voices (Aditya, Shubh, Priya, Ritu, Ishita, Pooja, Simran, Neha, Rohan, Rahul, Dev, Kabir).
- **How to get it**:
  1. Go to [https://www.sarvam.ai/](https://www.sarvam.ai/)
  2. Create an account or sign in to your dashboard.
  3. Navigate to **API Keys** and copy your subscription key.
  4. Paste it into `.env` or `env/keys.env`:
     ```env
     SARVAM_API_KEY=sk_auu6evmk_r6fyjvwwetWwcbm5TGHGtfqp
     ```

### 2. ElevenLabs (`ELEVENLABS_API_KEY`)
- **Purpose**: Powers ElevenLabs Multilingual v2 studio voices.
- **How to get it**:
  1. Sign in at [https://elevenlabs.io/](https://elevenlabs.io/)
  2. Go to Profile / API Keys and copy your key.
  3. Paste it into `.env` or `env/keys.env`:
     ```env
     ELEVENLABS_API_KEY=your_elevenlabs_key_here
     ```

## Security Guarantee
- All `.env*` files and the `env/` directory are listed in `.gitignore`.
- Keys are kept **strictly server-side** and are never exposed to the client browser.
- Any changes made here are detected automatically by VOXIA AI without rebuilding.
