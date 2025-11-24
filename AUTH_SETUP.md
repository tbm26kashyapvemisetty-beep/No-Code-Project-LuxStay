# 🔐 Email Verification Setup

## Issue: Email Links Not Logging In?

If clicking the email verification link doesn't log you in, follow these steps:

## 1. Configure Supabase Site URL

Go to your **Supabase Dashboard**:

1. Navigate to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/onboarding`
4. Click **Save**

## 2. Check Environment Variables

Make sure your `.env.local` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Enable Email Confirmation

1. Go to **Authentication** → **Providers** → **Email**
2. Make sure **"Confirm email"** is **ENABLED**
3. Click **Save**

## 4. Test the Flow

### Sign Up Flow:
```
1. Sign up with email
2. See "Check Your Email" page
3. Check inbox (and spam folder)
4. Click verification link
5. Should auto-login and redirect to onboarding
```

### Console Logs to Check:
Open browser console (F12) when clicking the email link, you should see:
```
Auth code exchange: { data: true, error: null }
User after exchange: your-email@example.com
Profile: null or { role: 'guest' }
```

## 5. Alternative: Disable Email Confirmation (Dev Only)

For development, you can disable email confirmation:

1. Go to **Authentication** → **Providers** → **Email**
2. **Disable** "Confirm email"
3. Click **Save**

Now signups will work immediately without email verification.

## 6. Troubleshooting

### Still not working?

**Check browser console** for error messages:
- Open Developer Tools (F12)
- Click Console tab
- Click the email verification link
- Look for any red errors

**Common issues:**
- ❌ Site URL not configured in Supabase
- ❌ Wrong redirect URL in environment
- ❌ Email confirmation not enabled
- ❌ Cookies blocked in browser

### Test with Direct Login

Try logging in with the same email/password:
- If that works → Email verification issue
- If that fails → Different auth problem

## 7. Production Setup

Before deploying:

1. Update **Site URL** to your production domain
2. Update **Redirect URLs** to include production domain
3. Set `NEXT_PUBLIC_SITE_URL` environment variable
4. Test signup flow on production

## Need Help?

Check the browser console logs and Supabase auth logs:
- **Supabase Dashboard** → **Authentication** → **Users** (check if user was created)
- **Browser Console** (F12) → Look for error messages

