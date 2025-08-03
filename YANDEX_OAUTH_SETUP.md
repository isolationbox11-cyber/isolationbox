# Yandex ID OAuth Integration

This document explains how to configure and use the Yandex ID OAuth integration in Salem Cyber Vault.

## Setup

### 1. Yandex OAuth Application Setup

Before using the Yandex ID integration, you need to:

1. Go to [Yandex OAuth](https://oauth.yandex.com/) and create a new application
2. Set up your application with the following settings:
   - **Redirect URI**: `https://yourdomain.com/dashboard` (or your dashboard URL)
   - **Scopes**: `login:info` (minimum required for basic authentication)
3. Note down your **Client ID** from the application settings

### 2. Configuration

Update the client ID in the login page:

```typescript
// In app/login/page.tsx
const clientId = "your-yandex-client-id" // Replace with your actual Client ID
```

## Features

### Automatic SDK Integration
- The Yandex Passport SDK is automatically loaded via the login page layout
- Script is loaded with `beforeInteractive` strategy for optimal performance
- TypeScript declarations included for proper type checking

### Robust Fallback System
- **Primary**: Yandex SDK renders native OAuth button
- **Loading**: Shows spinner while SDK initializes
- **Fallback**: Manual OAuth redirect if SDK fails to load
- **Demo**: Alternative login method for testing

### Security Features
- OAuth 2.0 compliance with token-based authentication
- Secure credential handling through Yandex's servers
- HTTPS redirect URIs for production security

## Usage

### Accessing the Login Page
Navigate to `/login` to see the authentication options:

```bash
# Development
http://localhost:3000/login

# Production
https://yourdomain.com/login
```

### Authentication Flow
1. User visits `/login`
2. Yandex SDK initializes automatically
3. User clicks "Continue with Yandex ID"
4. Redirected to Yandex OAuth server
5. After successful authentication, redirected back to `/dashboard`

### Integration Points
- **Login Page**: `app/login/page.tsx` - Main authentication UI
- **Layout**: `app/login/layout.tsx` - SDK script loading
- **Dashboard**: Protected route that users access after login

## Customization

### Theming
The login page uses the Halloween theme consistent with the dashboard:
- Orange/black color scheme
- Spooky Halloween iconography
- Animated elements and transitions

### Button Customization
Yandex SDK button can be customized in the initialization:

```typescript
{
  view: "button",
  parentId: "yandex-auth-button",
  buttonView: "main",        // Options: main, additional, icon
  buttonTheme: "dark",       // Options: light, dark
  buttonSize: "m",           // Options: s, m, l, xl
  buttonBorderRadius: "0"    // Custom border radius
}
```

## Testing

### Development Testing
- Use the demo login button for local testing
- Check browser console for SDK loading status
- Test fallback behavior by blocking the Yandex script

### Production Testing
- Verify OAuth redirect URIs are properly configured
- Test with real Yandex accounts
- Confirm HTTPS redirects work correctly

## Troubleshooting

### SDK Loading Issues
- Check browser console for script loading errors
- Verify network connectivity to `yastatic.net`
- Ensure no ad blockers are interfering

### OAuth Configuration
- Verify Client ID is correct
- Check redirect URIs match exactly
- Ensure application is published on Yandex OAuth

### Browser Compatibility
- Modern browsers support the SDK natively
- Fallback mechanism handles older browsers
- Mobile browsers are fully supported