# QuiltPlannerPro Banner Package

## Professional Marketing Banners for All Platforms

Your QuiltPlannerPro banners feature the iconic Sawtooth Star logo with beautiful red gradient backgrounds and professional typography. Each banner is optimized for its specific platform.

---

## 📦 Available Banners

### 1. Website Hero Banner (1920x500)
**Files:** `qpp-banner-hero-1920x500.[svg|png|jpg|webp]`

**Perfect for:**
- Homepage header sections
- Landing pages
- Main website banner

**Design:** Logo on left, large "QuiltPlannerPro" text with tagline and decorative quilt patterns

**File Sizes:**
- PNG: 135 KB (universal compatibility)
- JPG: 135 KB (email/print)
- WebP: 23 KB (modern web - 6x smaller!) ⭐
- SVG: 2.7 KB (infinite scaling)

---

### 2. Twitter/X Header (1500x500)
**Files:** `qpp-banner-twitter-1500x500.[svg|png|jpg|webp]`

**Perfect for:**
- Twitter/X profile header
- Social media banners
- Wide format displays

**Design:** Centered logo with brand name, decorative pattern background

**File Sizes:**
- PNG: 56 KB
- JPG: 80 KB
- WebP: 12 KB ⭐
- SVG: 3.0 KB

**How to Upload:**
1. Go to your Twitter/X profile
2. Click "Edit profile"
3. Click the camera icon on the header
4. Upload `qpp-banner-twitter-1500x500.png` or `.webp`

---

### 3. LinkedIn Banner (1584x396)
**Files:** `qpp-banner-linkedin-1584x396.[svg|png|jpg|webp]`

**Perfect for:**
- LinkedIn company page cover
- Professional networking profiles
- Business presentations

**Design:** Logo with professional tagline, geometric background pattern

**File Sizes:**
- PNG: 41 KB
- JPG: 85 KB
- WebP: 15 KB ⭐
- SVG: 1.9 KB

**How to Upload:**
1. Go to your LinkedIn company page or profile
2. Click the camera icon on the cover photo
3. Upload `qpp-banner-linkedin-1584x396.png`

---

### 4. Facebook Cover Photo (820x312)
**Files:** `qpp-banner-facebook-820x312.[svg|png|jpg|webp]`

**Perfect for:**
- Facebook business page cover
- Facebook group headers
- Social media sharing

**Design:** Compact layout with logo badge and brand name

**File Sizes:**
- PNG: 29 KB
- JPG: 46 KB
- WebP: 9 KB ⭐
- SVG: 1.3 KB

**How to Upload:**
1. Go to your Facebook business page
2. Click "Edit Cover Photo"
3. Upload `qpp-banner-facebook-820x312.png`

---

### 5. Email Header (600x200)
**Files:** `qpp-banner-email-600x200.[svg|png|jpg|webp]`

**Perfect for:**
- Email newsletter headers
- Email marketing campaigns
- Email signatures (top banner)
- Mailchimp/Constant Contact templates

**Design:** Centered logo and text for email width

**File Sizes:**
- PNG: 14 KB
- JPG: 28 KB ⭐ (best for email)
- WebP: 5.5 KB
- SVG: 1.1 KB

---

## 🚀 Quick Implementation Guide

### For Your Website Hero Section

**Next.js / React:**
```jsx
<div className="relative w-full h-[500px]">
  <Image
    src="/qpp-banner-hero-1920x500.webp"
    alt="QuiltPlannerPro - AI-Powered Custom Quilt Patterns"
    fill
    priority
    className="object-cover"
  />
</div>
```

**HTML:**
```html
<div class="hero-banner">
  <img 
    src="/qpp-banner-hero-1920x500.webp" 
    alt="QuiltPlannerPro"
    style="width: 100%; height: auto;"
  >
</div>
```

---

### For Email Templates

**Mailchimp:**
1. Create new campaign
2. Add image block
3. Upload `qpp-banner-email-600x200.jpg`
4. Set width to 600px
5. Center align

**HTML Email:**
```html
<table width="600" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <img 
        src="https://yourdomain.com/qpp-banner-email-600x200.jpg" 
        alt="QuiltPlannerPro" 
        width="600" 
        height="200"
        style="display: block; width: 100%; max-width: 600px;"
      >
    </td>
  </tr>
</table>
```

---

### For Social Media

#### Twitter/X:
- Dimensions: 1500x500
- Upload: `qpp-banner-twitter-1500x500.png`
- Location: Profile → Edit Profile → Header Photo

#### LinkedIn:
- Dimensions: 1584x396
- Upload: `qpp-banner-linkedin-1584x396.png`
- Location: Company Page → Edit → Cover Image

#### Facebook:
- Dimensions: 820x312
- Upload: `qpp-banner-facebook-820x312.png`
- Location: Business Page → Edit Cover Photo

---

## 📊 Format Comparison & Recommendations

| Banner Type | Best Format | Why |
|------------|-------------|-----|
| Website Hero | WebP (23 KB) | 6x smaller than PNG, modern browsers |
| Twitter/X | PNG (56 KB) | Twitter handles PNG well |
| LinkedIn | PNG (41 KB) | Professional standard |
| Facebook | PNG (29 KB) | Best compatibility |
| Email | JPG (28 KB) | Universal email client support |

### Format Selection Rules:

**Use PNG when:**
- Uploading to social media platforms
- Universal compatibility needed
- File size isn't critical

**Use WebP when:**
- Website performance matters
- Modern browser support OK
- Want 5-6x smaller files

**Use JPG when:**
- Sending via email
- File size is critical
- No transparency needed

**Use SVG when:**
- Perfect scaling needed
- Design handoff to print shops
- Smallest possible file size

---

## 🎨 Design Elements

All banners feature:
- **Sawtooth Star logo** - Traditional quilt pattern
- **Red gradient background** - #DC2626 → #B91C1C → #7C2D12
- **Professional typography** - Clean, modern fonts
- **Shadow effects** - Premium depth and polish
- **Decorative elements** - Subtle quilt pattern backgrounds

### Color Palette:
- Primary Red: `#DC2626`
- Deep Red: `#B91C1C`
- Brown Red: `#7C2D12`
- Golden Yellow: `#FBBF24`
- Cream: `#FEE2E2`

---

## 💡 Pro Tips

1. **Always use WebP for websites** - It's 5-6x smaller with same quality!
2. **Use PNG for social media uploads** - Best compatibility
3. **Use JPG for email** - Most reliable in email clients
4. **Keep SVG files** - Perfect for print or scaling
5. **Test before launch** - Preview on actual platforms

---

## 📏 Banner Specifications

| Platform | Dimensions | Aspect Ratio | Safe Zone |
|----------|-----------|--------------|-----------|
| Website Hero | 1920x500 | 3.84:1 | Center 1200px |
| Twitter/X | 1500x500 | 3:1 | Full width |
| LinkedIn | 1584x396 | 4:1 | Center 1128px |
| Facebook | 820x312 | 2.6:1 | Center 640px |
| Email | 600x200 | 3:1 | Full width |

---

## 🔄 Updates & Variations

Need custom sizes or variations? The SVG files can be edited:
- Resize without quality loss
- Change colors via gradient stops
- Modify text content
- Add/remove decorative elements

Use any vector graphics editor (Figma, Adobe Illustrator, Inkscape) to customize.

---

## ✅ Checklist: Full Brand Launch

- [ ] Upload hero banner to website homepage
- [ ] Set Twitter/X header image
- [ ] Update LinkedIn cover photo
- [ ] Change Facebook cover image
- [ ] Add email banner to newsletter template
- [ ] Update email signature
- [ ] Test all banners on mobile devices
- [ ] Verify loading speeds (use WebP!)

---

## 🎯 Best Practices

### Website:
- Use WebP with PNG fallback
- Lazy load banners below fold
- Compress images before upload
- Add descriptive alt text

### Social Media:
- Preview before posting
- Check on mobile view
- Ensure text is readable
- Match platform dimensions exactly

### Email:
- Use JPG format
- Keep file size under 100KB
- Test in multiple email clients
- Include alt text for accessibility

---

## 📱 Mobile Responsiveness

All banners are designed to work on mobile:
- Text remains readable when scaled down
- Logo is prominent at any size
- Gradients render smoothly
- Key information stays visible

Test your banners at these breakpoints:
- Desktop: 1920px+
- Tablet: 768px-1024px
- Mobile: 320px-767px

---

## Questions?

Your QuiltPlannerPro banners are production-ready and optimized for every platform. Upload them today and establish a strong, professional brand presence across all your marketing channels!

**Remember:** The WebP versions are 5-6x smaller than PNG while maintaining the same quality - use them on your website for blazing-fast load times!
