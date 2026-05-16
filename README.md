# QuiltPlannerPro

An AI-powered quilt pattern generation service that creates custom quilt patterns from your fabric images.

## Features

- Upload fabric images to generate personalized patterns
- AI-powered pattern generation with skill level matching
- Multiple subscription tiers (Free, Hobbyist, Enthusiast, Pro)
- Download patterns in various formats
- Commercial use rights on Pro tier

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## App Versioning

QuiltPlannerPro uses a shared pre-launch version format:

`MAJOR.MINOR.BUILD` where BUILD is always 5 digits (example: `0.1.00003`).

From the repository root:

```bash
npm run version:show         # show root/backend/frontend versions and sync status
npm run version:sync         # sync backend/frontend to root version
npm run version:bump         # default increment/build bump
npm run version:bump:incr    # increment BUILD and sync all packages
npm run version:bump:minor   # increment MINOR, reset BUILD to 00000
npm run version:bump:major   # increment MAJOR, reset MINOR and BUILD
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [Privacy Policy](doc/privacy-policy.md)
- [Terms of Service](doc/terms-of-service.md)
- [Refund Policy](doc/refund-policy.md)
- [Pricing Structure](doc/pricing-structure.md)

## License

GPL-3.0
