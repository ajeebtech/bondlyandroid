# 🗺️ Google Maps API Setup Guide

## Step 1: Get Your Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the required APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ **Places API**
     - ✅ **Maps SDK for Android** 
     - ✅ **Maps SDK for iOS**

4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key (starts with `AIza...`)

## Step 2: Set Your API Key

### Option A: Environment Variable (Recommended)
```bash
export NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option B: Update .env.local file
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option C: Direct in app.config.js (Not recommended for production)
```javascript
googleMapsApiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Step 3: Restart Your App
```bash
npx expo start --clear
```

## Step 4: Test the Autocomplete
1. Open "Plan a Date" screen
2. Tap "Create Plan" 
3. Type in "Starting Point" field
4. You should see live suggestions!

## Troubleshooting

### ❌ REQUEST_DENIED Error
- **Check API Key**: Make sure it's correct and not the placeholder
- **Enable APIs**: Ensure Places API is enabled
- **Restrictions**: Check if API key has restrictions that block your app

### ❌ No Suggestions Appearing
- **Check Console**: Look for error messages
- **API Quota**: Check if you've exceeded daily quota
- **Network**: Ensure internet connection

### ❌ Environment Variable Not Loading
- **Restart App**: `npx expo start --clear`
- **Check File**: Make sure .env.local exists and has correct format
- **No Spaces**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here` (no spaces around =)

## API Key Security
- **Restrict your API key** to specific apps/bundle IDs
- **Set usage quotas** to prevent unexpected charges
- **Never commit API keys** to public repositories
- **Use environment variables** for production apps

## Cost Information
- **Places API**: $2.83 per 1,000 requests
- **Free Tier**: $200 credit per month (≈70,000 requests)
- **Autocomplete**: Usually very affordable for normal usage
