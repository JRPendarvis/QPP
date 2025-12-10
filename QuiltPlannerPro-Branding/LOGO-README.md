# QuiltPlannerPro Logo Package

## Logo Design: Sawtooth Star with Shadow Effect & Gradient Background

The official QuiltPlannerPro logo features:
- **Traditional Sawtooth Star** quilt pattern (recognized by quilters worldwide)
- **Red gradient background** (from bright red #DC2626 to dark brown #7C2D12)
- **Golden center badge** with "QPP" lettering
- **Shadow effects** for depth and premium feel

---

## Files Included

### SVG (Vector) - Scales Infinitely
- `qpp-logo-512.svg` - Standard size with gradient background
- `qpp-logo-favicon.svg` - Favicon size with gradient background
- `qpp-logo-transparent-512.svg` - Transparent background version

### PNG Format (Recommended for Web)
- `qpp-logo-1024.png` - High resolution (1024x1024) with gradient background
- `qpp-logo-512.png` - Standard size (512x512) with gradient background
- `qpp-logo-256.png` - Medium size (256x256) with gradient background
- `qpp-logo-64.png` - Small/favicon size (64x64) with gradient background
- `qpp-logo-transparent-512.png` - 512x512 with transparent background

### JPG Format (For Email/Print)
- `qpp-logo-512.jpg` - 512x512, high quality (95%), gradient background

### WebP Format (Modern Web Optimized)
- `qpp-logo-512.webp` - 512x512, highly compressed, gradient background

### GIF Format (Legacy Support)
- `qpp-logo-512.gif` - 512x512, gradient background

### TIFF Format (Print Production)
- `qpp-logo-512.tiff` - 512x512, uncompressed, gradient background

### HEIF Format (Apple Devices)
- `qpp-logo-512.heif` - 512x512, modern format, gradient background

---

## Usage Guide

### Format Selection Guide

**PNG** - Best for:
- Website headers and UI elements (use 256px or 512px)
- Transparent backgrounds needed
- Lossless quality required
- General web use

**JPG** - Best for:
- Email signatures
- Print materials
- When file size matters and transparency not needed
- Blog posts and articles

**WebP** - Best for:
- Modern websites (smallest file size: 5.7KB vs 30KB PNG!)
- Fast loading times
- SEO optimization
- Progressive web apps

**GIF** - Use only for:
- Legacy browser support
- Very old email clients
- Not recommended for new projects

**TIFF** - Best for:
- Professional printing
- High-quality archival
- Design handoff to print shops

**HEIF** - Best for:
- iOS/Apple ecosystem
- Modern mobile apps
- Efficient storage

### 1. Website Favicon
**Recommended:** `qpp-logo-64.png`

Add to your HTML `<head>`:
```html
<link rel="icon" type="image/png" href="/qpp-logo-64.png">
```

Or for multiple sizes:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/qpp-logo-64.png">
<link rel="icon" type="image/png" sizes="16x16" href="/qpp-logo-64.png">
<link rel="apple-touch-icon" sizes="180x180" href="/qpp-logo-512.png">
```

### 2. Website Header/Navigation
**Recommended:** `qpp-logo-512.webp` or `qpp-logo-256.png`

```html
<!-- Modern browsers (smaller file) -->
<img src="/qpp-logo-512.webp" alt="QuiltPlannerPro" width="48" height="48">

<!-- Universal compatibility -->
<img src="/qpp-logo-256.png" alt="QuiltPlannerPro" width="48" height="48">
```

Or in React with Next.js Image:
```jsx
<Image 
  src="/qpp-logo-512.png" 
  alt="QuiltPlannerPro" 
  width={48} 
  height={48}
  priority
/>
```

### 3. Social Media Profile Pictures
**Recommended:** `qpp-logo-1024.png` or `qpp-logo-512.png`

Recommended for:
- Twitter/X: 400x400 minimum (use 512px)
- Facebook: 180x180 minimum (use 512px)
- Instagram: 320x320 minimum (use 512px)
- LinkedIn: 300x300 minimum (use 512px)

### 4. Email Signatures
**Recommended:** `qpp-logo-512.jpg` or `qpp-logo-256.png`

Scale down to ~100-150px width in your email template:
```html
<img src="qpp-logo-512.jpg" alt="QuiltPlannerPro" width="120" height="120">
```

### 5. Print Materials
**Recommended:** `qpp-logo-1024.png` or `qpp-logo-512.tiff`

For high-quality printing:
- Business cards: 1024px version
- Flyers/brochures: TIFF format
- Professional printing: Provide SVG to print shop

### 6. Open Graph / Social Sharing
**Recommended:** `qpp-logo-1024.png`

```html
<meta property="og:image" content="https://yourdomain.com/qpp-logo-1024.png" />
<meta name="twitter:image" content="https://yourdomain.com/qpp-logo-1024.png" />
```

---

## Implementation in Your Next.js App

### Update public/favicon
Replace your current favicon with the new logo:

1. Copy `qpp-logo-64.png` to your `public/` folder and rename it to `favicon.png`
2. Update your `app/layout.tsx` or `_app.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QuiltPlannerPro',
  description: 'AI-Powered Custom Quilt Pattern Generator',
  icons: {
    icon: [
      { url: '/qpp-logo-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/qpp-logo-256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: '/qpp-logo-512.png',
  },
}
```

### Add Logo to Navigation Bar
In your navigation component:

```tsx
import Image from 'next/image'

<div className="flex items-center gap-2">
  <Image 
    src="/qpp-logo-512.png" 
    alt="QuiltPlannerPro" 
    width={48} 
    height={48}
    priority
  />
  <span className="text-xl font-bold">QuiltPlannerPro</span>
</div>
```

### Optimize with WebP (Best Performance)
For even better performance, use WebP format:

```tsx
<Image 
  src="/qpp-logo-512.webp" 
  alt="QuiltPlannerPro" 
  width={48} 
  height={48}
  priority
/>
```

**Note:** WebP is 5x smaller than PNG (5.7KB vs 30KB) with same quality!

### Add Meta Tags for Social Sharing
Update your metadata for better social media preview:

```tsx
export const metadata: Metadata = {
  // ... other metadata
  openGraph: {
    images: [
      {
        url: '/qpp-logo-1024.png',
        width: 1024,
        height: 1024,
        alt: 'QuiltPlannerPro Logo',
      }
    ],
  },
  twitter: {
    card: 'summary',
    images: ['/qpp-logo-1024.png'],
  },
}
```

---

## Color Reference

### Primary Colors (from gradient)
- **Bright Red**: #DC2626 (rgb(220, 38, 38))
- **Deep Red**: #B91C1C (rgb(185, 28, 28))
- **Brown Red**: #7C2D12 (rgb(124, 45, 18))

### Pattern Colors
- **Cream/White**: #FEE2E2 (center square)
- **Light Pink**: #FCA5A5 (corner triangles)
- **Red**: #EF4444 (side triangles)
- **Dark Red**: #B91C1C (rectangular strips)

### Accent
- **Golden Yellow**: #FBBF24 (center badge)
- **Dark Brown**: #7C2D12 (QPP text)

---

## Brand Guidelines

### DO:
✅ Use the gradient background version for primary branding
✅ Maintain the aspect ratio (always square)
✅ Ensure minimum size of 32x32px for clarity
✅ Use on white, light gray, or dark backgrounds

### DON'T:
❌ Stretch or distort the logo
❌ Change the colors
❌ Add drop shadows or effects (already included)
❌ Place on busy background patterns
❌ Use sizes smaller than 32x32px

---

## File Size Comparison

Understanding file sizes helps you choose the right format:

| Format | File Size | Use Case |
|--------|-----------|----------|
| WebP   | 5.7 KB    | ✅ Best for web - 5x smaller than PNG! |
| PNG 64px | 2.0 KB  | Favicons |
| PNG 256px | 12 KB  | Small UI elements |
| PNG 512px | 30 KB  | Standard web images |
| PNG 1024px | 81 KB | High-res / social media |
| JPG 512px | 34 KB  | Email signatures |
| GIF 512px | 29 KB  | Legacy browsers only |
| TIFF 512px | 32 KB | Print production |
| HEIF 512px | 30 KB | Apple ecosystem |
| SVG | 1.6 KB      | ⭐ Scales infinitely! |

**Recommendation:** Use WebP for modern websites (smallest size), PNG for universal compatibility, and SVG when you need perfect scaling at any size.

---

## Questions?

The logo combines traditional quilting heritage with modern AI innovation:
- **Sawtooth Star**: One of the most beloved traditional quilt patterns
- **Red/Gold Colors**: Classic Americana quilting palette
- **Shadow Effect**: Modern, premium digital touch
- **QPP Badge**: Clear, memorable branding

Perfect for appealing to your quilter audience while showcasing technological innovation!
