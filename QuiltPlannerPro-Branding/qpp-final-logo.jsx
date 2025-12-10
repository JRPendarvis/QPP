import React, { useState } from 'react';

const QuiltPlannerProFinalLogo = () => {
  const [showCode, setShowCode] = useState(false);
  const [selectedSize, setSelectedSize] = useState('512');

  // Main Logo Component with gradient background
  const LogoWithGradient = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#DC2626', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#B91C1C', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#7C2D12', stopOpacity:1}} />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Gradient Background with rounded corners */}
      <rect width="100" height="100" rx="16" fill="url(#bgGradient)"/>
      
      {/* Sawtooth Star Pattern */}
      <rect x="40" y="40" width="20" height="20" fill="#FEE2E2"/>
      <path d="M40 40 L30 30 L40 30 Z" fill="#FCA5A5"/>
      <path d="M60 40 L70 30 L60 30 Z" fill="#FCA5A5"/>
      <path d="M40 60 L30 70 L40 70 Z" fill="#FCA5A5"/>
      <path d="M60 60 L70 70 L60 70 Z" fill="#FCA5A5"/>
      <path d="M40 40 L30 40 L30 30 Z" fill="#EF4444"/>
      <path d="M60 40 L70 40 L70 30 Z" fill="#EF4444"/>
      <path d="M40 60 L30 60 L30 70 Z" fill="#EF4444"/>
      <path d="M60 60 L70 60 L70 70 Z" fill="#EF4444"/>
      <rect x="30" y="40" width="10" height="20" fill="#B91C1C"/>
      <rect x="60" y="40" width="10" height="20" fill="#B91C1C"/>
      <rect x="40" y="30" width="20" height="10" fill="#B91C1C"/>
      <rect x="40" y="60" width="20" height="10" fill="#B91C1C"/>
      
      {/* Golden center with QPP and shadow */}
      <circle cx="50" cy="50" r="13" fill="#FBBF24" filter="url(#shadow)"/>
      <text x="50" y="54" fontSize="10" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">QPP</text>
    </svg>
  );

  // Logo without background (transparent)
  const LogoTransparent = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadowTrans" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Sawtooth Star Pattern */}
      <rect x="40" y="40" width="20" height="20" fill="#FEE2E2"/>
      <path d="M40 40 L30 30 L40 30 Z" fill="#FCA5A5"/>
      <path d="M60 40 L70 30 L60 30 Z" fill="#FCA5A5"/>
      <path d="M40 60 L30 70 L40 70 Z" fill="#FCA5A5"/>
      <path d="M60 60 L70 70 L60 70 Z" fill="#FCA5A5"/>
      <path d="M40 40 L30 40 L30 30 Z" fill="#EF4444"/>
      <path d="M60 40 L70 40 L70 30 Z" fill="#EF4444"/>
      <path d="M40 60 L30 60 L30 70 Z" fill="#EF4444"/>
      <path d="M60 60 L70 60 L70 70 Z" fill="#EF4444"/>
      <rect x="30" y="40" width="10" height="20" fill="#B91C1C"/>
      <rect x="60" y="40" width="10" height="20" fill="#B91C1C"/>
      <rect x="40" y="30" width="20" height="10" fill="#B91C1C"/>
      <rect x="40" y="60" width="20" height="10" fill="#B91C1C"/>
      <circle cx="50" cy="50" r="13" fill="#FBBF24" filter="url(#shadowTrans)"/>
      <text x="50" y="54" fontSize="10" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">QPP</text>
    </svg>
  );

  const downloadSVG = (withBackground, size, filename) => {
    const svg = withBackground 
      ? document.getElementById('logo-with-bg').innerHTML
      : document.getElementById('logo-transparent').innerHTML;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const svgCodeWithGradient = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#B91C1C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C2D12;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="100" height="100" rx="16" fill="url(#bgGradient)"/>
  <rect x="40" y="40" width="20" height="20" fill="#FEE2E2"/>
  <path d="M40 40 L30 30 L40 30 Z" fill="#FCA5A5"/>
  <path d="M60 40 L70 30 L60 30 Z" fill="#FCA5A5"/>
  <path d="M40 60 L30 70 L40 70 Z" fill="#FCA5A5"/>
  <path d="M60 60 L70 70 L60 70 Z" fill="#FCA5A5"/>
  <path d="M40 40 L30 40 L30 30 Z" fill="#EF4444"/>
  <path d="M60 40 L70 40 L70 30 Z" fill="#EF4444"/>
  <path d="M40 60 L30 60 L30 70 Z" fill="#EF4444"/>
  <path d="M60 60 L70 60 L70 70 Z" fill="#EF4444"/>
  <rect x="30" y="40" width="10" height="20" fill="#B91C1C"/>
  <rect x="60" y="40" width="10" height="20" fill="#B91C1C"/>
  <rect x="40" y="30" width="20" height="10" fill="#B91C1C"/>
  <rect x="40" y="60" width="20" height="10" fill="#B91C1C"/>
  <circle cx="50" cy="50" r="13" fill="#FBBF24" filter="url(#shadow)"/>
  <text x="50" y="54" font-size="10" fill="#7C2D12" text-anchor="middle" font-weight="bold" font-family="sans-serif" letter-spacing="0.5">QPP</text>
</svg>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">QuiltPlannerPro</h1>
          <h2 className="text-3xl font-semibold text-red-600 mb-2">Official Logo</h2>
          <p className="text-gray-600">Sawtooth Star with Shadow Effect & Gradient Background</p>
        </div>

        {/* Main Logo Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-16 mb-8">
              <LogoWithGradient size={parseInt(selectedSize)} />
            </div>

            {/* Size Selector */}
            <div className="flex gap-3 mb-6">
              {['64', '128', '256', '512', '1024'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-5 py-2 rounded-lg font-medium transition-all ${
                    selectedSize === s 
                      ? 'bg-red-600 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3">🎨</span>
              With Gradient Background
            </h3>
            <p className="text-gray-600 mb-6">Perfect for app icons, social media, and branding materials</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => downloadSVG(true, 512, 'qpp-logo-512.svg')}
                className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                512px SVG
              </button>
              <button 
                onClick={() => downloadSVG(true, 1024, 'qpp-logo-1024.svg')}
                className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                1024px SVG
              </button>
              <button 
                onClick={() => downloadSVG(true, 256, 'qpp-logo-256.svg')}
                className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                256px SVG
              </button>
              <button 
                onClick={() => downloadSVG(true, 64, 'qpp-logo-favicon.svg')}
                className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                Favicon SVG
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-center">
                <LogoWithGradient size={128} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3">✨</span>
              Transparent Background
            </h3>
            <p className="text-gray-600 mb-6">For overlaying on different colored backgrounds</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => downloadSVG(false, 512, 'qpp-logo-transparent-512.svg')}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium"
              >
                512px SVG
              </button>
              <button 
                onClick={() => downloadSVG(false, 1024, 'qpp-logo-transparent-1024.svg')}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium"
              >
                1024px SVG
              </button>
              <button 
                onClick={() => downloadSVG(false, 256, 'qpp-logo-transparent-256.svg')}
                className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all font-medium"
              >
                256px SVG
              </button>
              <button 
                onClick={() => downloadSVG(false, 64, 'qpp-logo-transparent-favicon.svg')}
                className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all font-medium"
              >
                Favicon SVG
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-center">
                <LogoTransparent size={128} />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-3">
                <LogoWithGradient size={64} />
              </div>
              <p className="text-sm text-gray-600">Website Header</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 rounded-xl p-6 mb-3">
                <LogoWithGradient size={64} />
              </div>
              <p className="text-sm text-gray-600">Dark Mode</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 mb-3">
                <LogoWithGradient size={64} />
              </div>
              <p className="text-sm text-gray-600">Social Media</p>
            </div>
            <div className="text-center">
              <div className="bg-red-50 rounded-xl p-6 mb-3">
                <LogoWithGradient size={64} />
              </div>
              <p className="text-sm text-gray-600">Soft Background</p>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Implementation Guide</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-bold text-gray-900 mb-1">Favicon (16x16, 32x32, 64x64)</h4>
              <p className="text-gray-600 text-sm">Use the 64px or 256px version, browsers will scale down</p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-bold text-gray-900 mb-1">Website Header (48x48 to 64x64)</h4>
              <p className="text-gray-600 text-sm">Use the gradient version for maximum impact</p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-bold text-gray-900 mb-1">Social Media (512x512 or 1024x1024)</h4>
              <p className="text-gray-600 text-sm">High-res gradient version for profile pictures</p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-bold text-gray-900 mb-1">Email/Print (1024x1024)</h4>
              <p className="text-gray-600 text-sm">Use highest resolution for clarity</p>
            </div>
          </div>
        </div>

        {/* SVG Code Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">SVG Source Code</h3>
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
            >
              {showCode ? 'Hide' : 'Show'} Code
            </button>
          </div>
          {showCode && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
              <pre className="text-xs font-mono">{svgCodeWithGradient}</pre>
            </div>
          )}
        </div>

        {/* Hidden SVG elements for download */}
        <div style={{ display: 'none' }}>
          <div id="logo-with-bg">
            {svgCodeWithGradient}
          </div>
          <div id="logo-transparent">
            <svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="shadowTrans" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>
              <rect x="40" y="40" width="20" height="20" fill="#FEE2E2"/>
              <path d="M40 40 L30 30 L40 30 Z" fill="#FCA5A5"/>
              <path d="M60 40 L70 30 L60 30 Z" fill="#FCA5A5"/>
              <path d="M40 60 L30 70 L40 70 Z" fill="#FCA5A5"/>
              <path d="M60 60 L70 70 L60 70 Z" fill="#FCA5A5"/>
              <path d="M40 40 L30 40 L30 30 Z" fill="#EF4444"/>
              <path d="M60 40 L70 40 L70 30 Z" fill="#EF4444"/>
              <path d="M40 60 L30 60 L30 70 Z" fill="#EF4444"/>
              <path d="M60 60 L70 60 L70 70 Z" fill="#EF4444"/>
              <rect x="30" y="40" width="10" height="20" fill="#B91C1C"/>
              <rect x="60" y="40" width="10" height="20" fill="#B91C1C"/>
              <rect x="40" y="30" width="20" height="10" fill="#B91C1C"/>
              <rect x="40" y="60" width="20" height="10" fill="#B91C1C"/>
              <circle cx="50" cy="50" r="13" fill="#FBBF24" filter="url(#shadowTrans)"/>
              <text x="50" y="54" fontSize="10" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">QPP</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuiltPlannerProFinalLogo;
