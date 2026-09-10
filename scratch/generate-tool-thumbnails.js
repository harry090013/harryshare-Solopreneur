const sharp = require('sharp');
const path = require('path');

async function createThumbnails() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');

  // 1. QR Code Tool Thumbnail (SVG to WebP)
  const qrSvg = `
  <svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FBF8F4" />
        <stop offset="100%" stop-color="#ECE5D8" />
      </linearGradient>
      <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#2C3527" flood-opacity="0.12" />
      </filter>
      <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.15" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="800" height="450" fill="url(#bgGrad)" />

    <!-- Subtle Ambient Circles -->
    <circle cx="200" cy="120" r="180" fill="#2C3527" opacity="0.03" />
    <circle cx="620" cy="340" r="220" fill="#C98A42" opacity="0.04" />

    <!-- Central Floating Card -->
    <g filter="url(#cardShadow)">
      <rect x="270" y="55" width="260" height="340" rx="24" fill="#FFFFFF" stroke="#E8E2D5" stroke-width="1.5" />
      
      <!-- Card Header Accent -->
      <rect x="360" y="75" width="80" height="6" rx="3" fill="#EAE5DC" />

      <!-- QR Code Matrix Container -->
      <rect x="300" y="95" width="200" height="200" rx="14" fill="#FAF9F6" stroke="#ECE7DE" stroke-width="1" />

      <!-- QR Finder Pattern 1: Top-Left -->
      <rect x="316" y="111" width="46" height="46" rx="6" fill="#2C3527" />
      <rect x="323" y="118" width="32" height="32" rx="4" fill="#FAF9F6" />
      <rect x="330" y="125" width="18" height="18" rx="2" fill="#2C3527" />

      <!-- QR Finder Pattern 2: Top-Right -->
      <rect x="438" y="111" width="46" height="46" rx="6" fill="#2C3527" />
      <rect x="445" y="118" width="32" height="32" rx="4" fill="#FAF9F6" />
      <rect x="452" y="125" width="18" height="18" rx="2" fill="#2C3527" />

      <!-- QR Finder Pattern 3: Bottom-Left -->
      <rect x="316" y="233" width="46" height="46" rx="6" fill="#2C3527" />
      <rect x="323" y="240" width="32" height="32" rx="4" fill="#FAF9F6" />
      <rect x="330" y="247" width="18" height="18" rx="2" fill="#2C3527" />

      <!-- QR Data Pixels (Stylized clean dots & modules) -->
      <!-- Row 1 -->
      <rect x="372" y="114" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="392" y="114" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="412" y="114" width="12" height="12" rx="2" fill="#2C3527" />

      <!-- Row 2 -->
      <rect x="382" y="132" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="402" y="132" width="12" height="12" rx="2" fill="#2C3527" />

      <!-- Row 3 -->
      <rect x="372" y="150" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="392" y="150" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="412" y="150" width="12" height="12" rx="2" fill="#2C3527" />

      <!-- Center Area -->
      <rect x="324" y="172" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="344" y="172" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="444" y="172" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="464" y="172" width="12" height="12" rx="2" fill="#2C3527" />

      <rect x="316" y="192" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="336" y="192" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="452" y="192" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="472" y="192" width="12" height="12" rx="2" fill="#2C3527" />

      <rect x="324" y="212" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="344" y="212" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="444" y="212" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="464" y="212" width="12" height="12" rx="2" fill="#2C3527" />

      <!-- Bottom Right Data Modules -->
      <rect x="372" y="234" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="392" y="234" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="412" y="234" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="438" y="234" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="458" y="234" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="478" y="234" width="12" height="12" rx="2" fill="#2C3527" />

      <rect x="382" y="254" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="402" y="254" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="428" y="254" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="448" y="254" width="12" height="12" rx="2" fill="#2C3527" />

      <rect x="372" y="272" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="392" y="272" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="412" y="272" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="438" y="272" width="12" height="12" rx="2" fill="#2C3527" />
      <rect x="468" y="272" width="12" height="12" rx="2" fill="#2C3527" />

      <!-- Center Logo Capsule -->
      <g filter="url(#badgeShadow)">
        <rect x="376" y="171" width="48" height="48" rx="12" fill="#2C3527" />
        <circle cx="400" cy="195" r="14" fill="#FBF8F4" />
        <path d="M 395 195 L 399 199 L 406 191" stroke="#2C3527" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <!-- Bottom Card Tag -->
      <rect x="330" y="318" width="140" height="28" rx="14" fill="#2C3527" opacity="0.08" />
      <text x="400" y="336" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="#2C3527" text-anchor="middle" letter-spacing="0.5">VIETQR • WI-FI • LINK</text>

      <!-- Scan Dots / Stars Accent -->
      <circle cx="310" cy="358" r="3" fill="#C98A42" />
      <circle cx="400" cy="358" r="3" fill="#2C3527" />
      <circle cx="490" cy="358" r="3" fill="#C98A42" />
    </g>

    <!-- Side Floating Badges -->
    <!-- Left Badge: VietQR -->
    <g filter="url(#cardShadow)">
      <rect x="130" y="170" width="115" height="50" rx="14" fill="#FFFFFF" stroke="#ECE6DA" stroke-width="1.2" />
      <circle cx="155" cy="195" r="13" fill="#005A9C" />
      <text x="155" y="199" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">V</text>
      <text x="178" y="192" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#2C3527">VietQR</text>
      <text x="178" y="205" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="600" fill="#888888">Napas 24/7</text>
    </g>

    <!-- Right Badge: 100% Free -->
    <g filter="url(#cardShadow)">
      <rect x="555" y="210" width="115" height="50" rx="14" fill="#FFFFFF" stroke="#ECE6DA" stroke-width="1.2" />
      <circle cx="580" cy="235" r="13" fill="#2C3527" />
      <text x="580" y="239" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#FDFBF7">⚡</text>
      <text x="603" y="232" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#2C3527">Miễn phí</text>
      <text x="603" y="245" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="600" fill="#888888">Không logo rác</text>
    </g>
  </svg>
  `;

  // 2. Mockup Tool Thumbnail (SVG to WebP)
  const mockupSvg = `
  <svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mockupBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FAF6F0" />
        <stop offset="100%" stop-color="#EBE2D3" />
      </linearGradient>
      <filter id="mShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#2C3527" flood-opacity="0.16" />
      </filter>
      <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2D2E30" />
        <stop offset="100%" stop-color="#151618" />
      </linearGradient>
      <linearGradient id="screenArt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F2EDE4" />
        <stop offset="50%" stop-color="#E8DFCF" />
        <stop offset="100%" stop-color="#D9CCBA" />
      </linearGradient>
      <linearGradient id="goldFrame" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#DFBA67" />
        <stop offset="50%" stop-color="#F7E6A1" />
        <stop offset="100%" stop-color="#A87F1C" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="800" height="450" fill="url(#mockupBg)" />

    <!-- Ambient circles -->
    <circle cx="220" cy="100" r="160" fill="#C98A42" opacity="0.04" />
    <circle cx="600" cy="360" r="200" fill="#2C3527" opacity="0.04" />

    <!-- Left Object: Classic Polaroid Frame (Angled -8 deg) -->
    <g filter="url(#mShadow)" transform="rotate(-7, 260, 240)">
      <rect x="170" y="80" width="190" height="235" rx="6" fill="#FAF8F5" stroke="#E6E0D4" stroke-width="1.5" />
      <rect x="186" y="96" width="158" height="158" fill="#D5CBB9" />
      <!-- Polaroid photo landscape drawing -->
      <circle cx="265" cy="160" r="30" fill="#E8DEC9" />
      <path d="M 186 230 Q 230 180 265 210 T 344 195 L 344 254 L 186 254 Z" fill="#7D6F5B" opacity="0.65" />
      <path d="M 186 242 Q 220 205 285 235 T 344 220 L 344 254 L 186 254 Z" fill="#4B3F31" opacity="0.85" />
      <!-- Handwritten style caption -->
      <line x1="210" y1="285" x2="310" y2="285" stroke="#9A8F7E" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 4" />
      <circle cx="325" cy="285" r="2.5" fill="#9A8F7E" />
    </g>

    <!-- Center-Right Object: iPhone 16 Pro Mockup -->
    <g filter="url(#mShadow)" transform="rotate(4, 520, 220)">
      <!-- Phone Body -->
      <rect x="430" y="55" width="180" height="340" rx="36" fill="url(#phoneBody)" stroke="#4A4B4F" stroke-width="1.5" />
      
      <!-- Inner Screen -->
      <rect x="440" y="65" width="160" height="320" rx="28" fill="url(#screenArt)" />
      
      <!-- Artwork on screen -->
      <circle cx="520" cy="190" r="45" fill="#C98A42" opacity="0.7" />
      <path d="M 440 330 Q 480 250 530 280 T 600 260 L 600 385 L 440 385 Z" fill="#2C3527" opacity="0.85" />

      <!-- Dynamic Island Pill -->
      <rect x="495" y="78" width="50" height="16" rx="8" fill="#000000" />
      <circle cx="533" cy="86" r="3.5" fill="#080E1C" />
      <circle cx="532" cy="85" r="1" fill="#38558A" />

      <!-- Subtle Glass Reflection -->
      <path d="M 440 65 L 560 65 L 440 220 Z" fill="#FFFFFF" opacity="0.1" />
    </g>

    <!-- Decorative Mini Floating Badge -->
    <g filter="url(#mShadow)">
      <rect x="130" y="325" width="140" height="42" rx="12" fill="#FFFFFF" stroke="#E6E0D4" stroke-width="1.2" />
      <circle cx="152" cy="346" r="10" fill="#2C3527" />
      <text x="152" y="350" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" fill="#FFFFFF" text-anchor="middle">✨</text>
      <text x="170" y="344" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#2C3527">Studio Frames</text>
      <text x="170" y="357" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="600" fill="#888888">iPhone • Polaroid</text>
    </g>

    <!-- Side Badge Right -->
    <g filter="url(#mShadow)">
      <rect x="635" y="110" width="120" height="42" rx="12" fill="#FFFFFF" stroke="#E6E0D4" stroke-width="1.2" />
      <circle cx="657" cy="131" r="10" fill="#C98A42" />
      <text x="657" y="135" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" fill="#FFFFFF" text-anchor="middle">🎨</text>
      <text x="675" y="129" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#2C3527">Magic Blur</text>
      <text x="675" y="142" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="600" fill="#888888">Khung gỗ • Vàng</text>
    </g>
  </svg>
  `;

  console.log('Generating thumb-tao-ma-qr.webp...');
  await sharp(Buffer.from(qrSvg))
    .resize({ width: 800, height: 450 })
    .webp({ quality: 90 })
    .toFile(path.join(imagesDir, 'thumb-tao-ma-qr.webp'));
  console.log('  => thumb-tao-ma-qr.webp created.');

  console.log('Generating thumb-ghep-anh-mockup.webp...');
  await sharp(Buffer.from(mockupSvg))
    .resize({ width: 800, height: 450 })
    .webp({ quality: 90 })
    .toFile(path.join(imagesDir, 'thumb-ghep-anh-mockup.webp'));
  console.log('  => thumb-ghep-anh-mockup.webp created.');

  console.log('--- ALL THUMBNAILS GENERATED SUCCESSFULLY ---');
}

createThumbnails().catch(console.error);
