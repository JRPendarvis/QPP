import React, { useState } from 'react';

const QuiltPlannerProBanners = () => {
  const [selectedBanner, setSelectedBanner] = useState('hero');
  const [selectedSize, setSelectedSize] = useState('standard');

  const sizes = {
    hero: { standard: { w: 1920, h: 500 }, preview: { w: 960, h: 250 } },
    twitter: { standard: { w: 1500, h: 500 }, preview: { w: 750, h: 250 } },
    linkedin: { standard: { w: 1584, h: 396 }, preview: { w: 792, h: 198 } },
    facebook: { standard: { w: 820, h: 312 }, preview: { w: 820, h: 312 } },
    email: { standard: { w: 600, h: 200 }, preview: { w: 600, h: 200 } }
  };

  // Banner Design 1: Hero Website Banner with Logo Left
  const HeroBanner = ({ width, height }) => {
    const scale = width / 1920;
    return (
      <svg width={width} height={height} viewBox="0 0 1920 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#DC2626', stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#B91C1C', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#7C2D12', stopOpacity:1}} />
          </linearGradient>
          <filter id="textShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.5"/>
          </filter>
        </defs>
        
        {/* Background */}
        <rect width="1920" height="500" fill="url(#heroGrad)"/>
        
        {/* Decorative quilt patterns in background */}
        <g opacity="0.15">
          <path d="M1600 100 L1700 100 L1700 200 L1600 200 Z" fill="#FEE2E2"/>
          <path d="M1600 150 L1700 150" stroke="#FFF" strokeWidth="2"/>
          <path d="M1650 100 L1650 200" stroke="#FFF" strokeWidth="2"/>
          
          <path d="M250 300 L350 350 L250 400 L150 350 Z" fill="#FCA5A5"/>
          <path d="M250 300 L250 400" stroke="#FFF" strokeWidth="2"/>
          <path d="M150 350 L350 350" stroke="#FFF" strokeWidth="2"/>
        </g>
        
        {/* Logo - Sawtooth Star */}
        <g transform="translate(150, 125)">
          <rect x="90" y="90" width="70" height="70" fill="#FEE2E2"/>
          <path d="M90 90 L55 55 L90 55 Z" fill="#FCA5A5"/>
          <path d="M160 90 L195 55 L160 55 Z" fill="#FCA5A5"/>
          <path d="M90 160 L55 195 L90 195 Z" fill="#FCA5A5"/>
          <path d="M160 160 L195 195 L160 195 Z" fill="#FCA5A5"/>
          <path d="M90 90 L55 90 L55 55 Z" fill="#EF4444"/>
          <path d="M160 90 L195 90 L195 55 Z" fill="#EF4444"/>
          <path d="M90 160 L55 160 L55 195 Z" fill="#EF4444"/>
          <path d="M160 160 L195 160 L195 195 Z" fill="#EF4444"/>
          <rect x="55" y="90" width="35" height="70" fill="#B91C1C"/>
          <rect x="160" y="90" width="35" height="70" fill="#B91C1C"/>
          <rect x="90" y="55" width="70" height="35" fill="#B91C1C"/>
          <rect x="90" y="160" width="70" height="35" fill="#B91C1C"/>
          <circle cx="125" cy="125" r="35" fill="#FBBF24" filter="url(#textShadow)"/>
          <text x="125" y="138" fontSize="28" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">QPP</text>
        </g>
        
        {/* Main Text */}
        <text x="500" y="220" fontSize="120" fill="#FFF" fontWeight="bold" fontFamily="sans-serif" filter="url(#textShadow)">QuiltPlannerPro</text>
        <text x="500" y="300" fontSize="48" fill="#FEE2E2" fontFamily="sans-serif" filter="url(#textShadow)">AI-Powered Custom Quilt Patterns</text>
        <text x="500" y="360" fontSize="36" fill="#FCD34D" fontFamily="sans-serif" fontStyle="italic">Design • Generate • Create</text>
      </svg>
    );
  };

  // Banner Design 2: Twitter/X Header
  const TwitterBanner = ({ width, height }) => {
    return (
      <svg width={width} height={height} viewBox="0 0 1500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="twitterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#7C2D12', stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#B91C1C', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#DC2626', stopOpacity:1}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="1500" height="500" fill="url(#twitterGrad)"/>
        
        {/* Multiple quilt patterns as background decoration */}
        <g opacity="0.2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`translate(${200 + i * 220}, 100)`}>
              <path d="M0 0 L30 30 L0 60 L-30 30 Z" fill="#FEE2E2"/>
              <circle cx="0" cy="30" r="12" fill="#FBBF24"/>
            </g>
          ))}
        </g>
        
        {/* Centered content */}
        <g transform="translate(750, 250)">
          {/* Logo */}
          <g transform="translate(-100, -100)">
            <rect x="60" y="60" width="80" height="80" fill="#FEE2E2"/>
            <path d="M60 60 L20 20 L60 20 Z" fill="#FCA5A5"/>
            <path d="M140 60 L180 20 L140 20 Z" fill="#FCA5A5"/>
            <path d="M60 140 L20 180 L60 180 Z" fill="#FCA5A5"/>
            <path d="M140 140 L180 180 L140 180 Z" fill="#FCA5A5"/>
            <path d="M60 60 L20 60 L20 20 Z" fill="#EF4444"/>
            <path d="M140 60 L180 60 L180 20 Z" fill="#EF4444"/>
            <path d="M60 140 L20 140 L20 180 Z" fill="#EF4444"/>
            <path d="M140 140 L180 140 L180 180 Z" fill="#EF4444"/>
            <rect x="20" y="60" width="40" height="80" fill="#B91C1C"/>
            <rect x="140" y="60" width="40" height="80" fill="#B91C1C"/>
            <rect x="60" y="20" width="80" height="40" fill="#B91C1C"/>
            <rect x="60" y="140" width="80" height="40" fill="#B91C1C"/>
            <circle cx="100" cy="100" r="40" fill="#FBBF24" filter="url(#glow)"/>
          </g>
          
          <text x="180" y="-30" fontSize="80" fill="#FFF" fontWeight="bold" fontFamily="sans-serif" filter="url(#glow)">QuiltPlannerPro</text>
          <text x="180" y="30" fontSize="36" fill="#FEE2E2" fontFamily="sans-serif">AI-Powered Pattern Generation</text>
        </g>
      </svg>
    );
  };

  // Banner Design 3: LinkedIn Cover
  const LinkedInBanner = ({ width, height }) => {
    return (
      <svg width={width} height={height} viewBox="0 0 1584 396" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="linkedinGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style={{stopColor:'#DC2626', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#7C2D12', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <rect width="1584" height="396" fill="url(#linkedinGrad)"/>
        
        {/* Geometric pattern background */}
        <g opacity="0.15">
          {[...Array(8)].map((_, i) => (
            <rect key={i} x={200 * i} y="0" width="100" height="100" fill="#FEE2E2" transform={`rotate(45 ${200 * i + 50} 50)`}/>
          ))}
        </g>
        
        <g transform="translate(100, 198)">
          {/* Logo */}
          <g transform="translate(0, -80)">
            <rect x="45" y="45" width="70" height="70" fill="#FEE2E2"/>
            <circle cx="80" cy="80" r="30" fill="#FBBF24"/>
            <text x="80" y="90" fontSize="24" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">QPP</text>
          </g>
          
          <text x="180" y="-30" fontSize="72" fill="#FFF" fontWeight="bold" fontFamily="sans-serif">QuiltPlannerPro</text>
          <text x="180" y="20" fontSize="32" fill="#FEE2E2" fontFamily="sans-serif">Transform Your Quilting with AI • Craft Beautiful Patterns</text>
        </g>
      </svg>
    );
  };

  // Banner Design 4: Facebook Cover
  const FacebookBanner = ({ width, height }) => {
    return (
      <svg width={width} height={height} viewBox="0 0 820 312" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#DC2626', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#B91C1C', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <rect width="820" height="312" fill="url(#fbGrad)"/>
        
        {/* Pattern decoration */}
        <g opacity="0.2" transform="translate(650, 80)">
          <path d="M0 0 L50 0 L50 50 L0 50 Z" fill="#FEE2E2"/>
          <path d="M0 60 L50 60 L50 110 L0 110 Z" fill="#FCA5A5"/>
          <path d="M60 0 L110 0 L110 50 L60 50 Z" fill="#EF4444"/>
          <path d="M60 60 L110 60 L110 110 L60 110 Z" fill="#FEE2E2"/>
        </g>
        
        <g transform="translate(60, 156)">
          {/* Compact logo */}
          <g transform="translate(0, -50)">
            <circle cx="50" cy="50" r="45" fill="#FBBF24"/>
            <text x="50" y="60" fontSize="28" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">QPP</text>
          </g>
          
          <text x="120" y="-10" fontSize="52" fill="#FFF" fontWeight="bold" fontFamily="sans-serif">QuiltPlannerPro</text>
          <text x="120" y="30" fontSize="24" fill="#FEE2E2" fontFamily="sans-serif">AI-Powered Quilt Pattern Generator</text>
        </g>
      </svg>
    );
  };

  // Banner Design 5: Email Header
  const EmailBanner = ({ width, height }) => {
    return (
      <svg width={width} height={height} viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#B91C1C', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#DC2626', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <rect width="600" height="200" fill="url(#emailGrad)"/>
        
        <g transform="translate(300, 100)">
          {/* Logo centered */}
          <g transform="translate(-170, -50)">
            <rect x="25" y="25" width="50" height="50" fill="#FEE2E2"/>
            <circle cx="50" cy="50" r="22" fill="#FBBF24"/>
            <text x="50" y="57" fontSize="16" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">QPP</text>
          </g>
          
          <text x="0" y="-10" fontSize="40" fill="#FFF" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">QuiltPlannerPro</text>
          <text x="0" y="25" fontSize="18" fill="#FEE2E2" fontFamily="sans-serif" textAnchor="middle">AI-Powered Custom Quilt Patterns</text>
        </g>
      </svg>
    );
  };

  const banners = {
    hero: { component: HeroBanner, name: 'Website Hero', desc: '1920x500 - Perfect for homepage headers', size: sizes.hero },
    twitter: { component: TwitterBanner, name: 'Twitter/X Header', desc: '1500x500 - Social media profile', size: sizes.twitter },
    linkedin: { component: LinkedInBanner, name: 'LinkedIn Banner', desc: '1584x396 - Professional profile', size: sizes.linkedin },
    facebook: { component: FacebookBanner, name: 'Facebook Cover', desc: '820x312 - Page header', size: sizes.facebook },
    email: { component: EmailBanner, name: 'Email Header', desc: '600x200 - Newsletter template', size: sizes.email }
  };

  const CurrentBanner = banners[selectedBanner].component;
  const currentSize = selectedSize === 'standard' 
    ? banners[selectedBanner].size.standard 
    : banners[selectedBanner].size.preview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-2 text-center">QuiltPlannerPro Banners</h1>
        <p className="text-gray-600 mb-8 text-center text-xl">Professional banners for all your marketing needs</p>

        {/* Selected Banner Preview */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">{banners[selectedBanner].name}</h2>
            <p className="text-gray-600 mb-6">{banners[selectedBanner].desc}</p>
            
            {/* Size Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedSize('preview')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedSize === 'preview'
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Preview Size
              </button>
              <button
                onClick={() => setSelectedSize('standard')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedSize === 'standard'
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Full Size ({currentSize.w}x{currentSize.h})
              </button>
            </div>

            {/* Banner Display */}
            <div className="bg-gray-100 rounded-xl p-4 mb-6 overflow-auto max-w-full">
              <CurrentBanner width={currentSize.w} height={currentSize.h} />
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg">
                Download PNG
              </button>
              <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all font-medium shadow-lg">
                Download JPG
              </button>
              <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all font-medium shadow-lg">
                Download WebP
              </button>
              <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium">
                Download SVG
              </button>
            </div>
          </div>
        </div>

        {/* Banner Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(banners).map(([key, banner]) => {
            const BannerComponent = banner.component;
            return (
              <button
                key={key}
                onClick={() => setSelectedBanner(key)}
                className={`bg-white rounded-xl p-4 transition-all hover:shadow-xl ${
                  selectedBanner === key 
                    ? 'ring-4 ring-red-500 shadow-2xl' 
                    : 'hover:scale-105'
                }`}
              >
                <div className="mb-3 overflow-hidden rounded-lg">
                  <BannerComponent width={banner.size.preview.w} height={banner.size.preview.h} />
                </div>
                <p className="font-bold text-gray-900 mb-1">{banner.name}</p>
                <p className="text-xs text-gray-600">{banner.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Usage Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Banner Usage Guide</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2 text-red-600">Website Hero Banner</h4>
              <p className="text-sm text-gray-700 mb-3">1920x500 - Use at the top of your homepage for maximum impact. Shows full branding with tagline.</p>
              
              <h4 className="font-bold text-lg mb-2 text-red-600">Twitter/X Header</h4>
              <p className="text-sm text-gray-700 mb-3">1500x500 - Centered design works perfectly for Twitter profile headers.</p>
              
              <h4 className="font-bold text-lg mb-2 text-red-600">LinkedIn Banner</h4>
              <p className="text-sm text-gray-700 mb-3">1584x396 - Professional layout for business networking platform.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-red-600">Facebook Cover</h4>
              <p className="text-sm text-gray-700 mb-3">820x312 - Compact design fits Facebook's cover photo dimensions perfectly.</p>
              
              <h4 className="font-bold text-lg mb-2 text-red-600">Email Header</h4>
              <p className="text-sm text-gray-700 mb-3">600x200 - Centered logo and text for email newsletters and campaigns.</p>
              
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-900">💡 Pro Tip: All banners use your official Sawtooth Star logo and brand colors!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuiltPlannerProBanners;
