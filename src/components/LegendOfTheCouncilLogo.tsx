import React, { useState, useEffect } from 'react';

interface LegendOfTheCouncilLogoProps {
  className?: string;
  variant?: 'auto' | 'gold' | 'ink';
  theme?: 'obsidian' | 'parchment';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  customSrc?: string;
}

export const LegendOfTheCouncilLogo: React.FC<LegendOfTheCouncilLogoProps> = ({
  className = '',
  variant = 'auto',
  theme = 'obsidian',
  size = 'md',
  showSubtitle = false,
  customSrc,
}) => {
  // Determine whether to show gold or ink version
  const isGold =
    variant === 'gold' || (variant === 'auto' && theme === 'obsidian');

  // Height / scale based on size
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-30 md:h-36',
    hero: 'h-32 sm:h-44 md:h-52 lg:h-60',
  }[size];

  // Custom logo detection (from prop, localStorage, or /game-logo.png)
  const [activeLogoSrc, setActiveLogoSrc] = useState<string | null>(() => {
    if (customSrc) return customSrc;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stallhart_custom_logo');
      if (stored) return stored;
    }
    return null;
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (customSrc) {
      setActiveLogoSrc(customSrc);
      setImgError(false);
      return;
    }

    const checkStorageOrFile = () => {
      const stored = localStorage.getItem('stallhart_custom_logo');
      if (stored) {
        setActiveLogoSrc(stored);
        setImgError(false);
        return;
      }

      // Check if /game-logo.png or /logo.png is available in public/
      const testImg = new Image();
      testImg.src = '/game-logo.png';
      testImg.onload = () => {
        setActiveLogoSrc('/game-logo.png');
        setImgError(false);
      };
      testImg.onerror = () => {
        const testImg2 = new Image();
        testImg2.src = '/logo.png';
        testImg2.onload = () => {
          setActiveLogoSrc('/logo.png');
          setImgError(false);
        };
        testImg2.onerror = () => {
          setActiveLogoSrc(null);
        };
      };
    };

    checkStorageOrFile();

    // Listen for custom logo change events
    const handleLogoUpdate = () => checkStorageOrFile();
    window.addEventListener('stallhart_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('stallhart_logo_updated', handleLogoUpdate);
  }, [customSrc]);

  // If a valid custom PNG logo is provided, render the image tag with matching atmospheric effects
  if (activeLogoSrc && !imgError) {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src={activeLogoSrc}
          alt="Legend of the Council Logo"
          onError={() => setImgError(true)}
          className={`${sizeClasses} w-auto max-w-full object-contain transition-all duration-300 drop-shadow-2xl`}
          style={{
            filter: isGold
              ? 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.35))'
              : 'drop-shadow(0 4px 8px rgba(45, 28, 15, 0.35)) drop-shadow(0 0 12px rgba(184, 134, 11, 0.2))',
          }}
        />
        {showSubtitle && (
          <span
            className={`font-serif italic text-center tracking-widest text-[11px] sm:text-xs mt-2 transition-colors ${
              isGold ? 'text-amber-400/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-[#634832]'
            }`}
          >
            Fate Tabanlı Karanlık Fantezi Masaüstü RPG • Stallhart Kurultayı
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 1400 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} w-auto max-w-full transition-all duration-300 drop-shadow-2xl`}
        style={{
          filter: isGold
            ? 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.35))'
            : 'drop-shadow(0 4px 8px rgba(45, 28, 15, 0.35)) drop-shadow(0 0 12px rgba(184, 134, 11, 0.2))',
        }}
      >
        <defs>
          {/* Ultra High-Fidelity Chiseled Gold Sheen (Masterpiece Gradient) */}
          <linearGradient id="councilGoldUltra" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="5%" stopColor="#fff8db" />
            <stop offset="14%" stopColor="#fde398" />
            <stop offset="28%" stopColor="#eec366" />
            <stop offset="48%" stopColor="#cb9b3b" />
            <stop offset="68%" stopColor="#9a6c1e" />
            <stop offset="85%" stopColor="#64410f" />
            <stop offset="96%" stopColor="#3b2406" />
            <stop offset="100%" stopColor="#1f1102" />
          </linearGradient>

          {/* Secondary Bevel Mid-Tone (Simulates angular 3D chiseled light reflection) */}
          <linearGradient id="councilGoldBevel" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a2e0a" />
            <stop offset="25%" stopColor="#875c1c" />
            <stop offset="50%" stopColor="#d8ab48" />
            <stop offset="75%" stopColor="#fde49d" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Deep 3D Underlay Extrusion Gradient */}
          <linearGradient id="councilExtrudeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2b1a08" />
            <stop offset="50%" stopColor="#150c04" />
            <stop offset="100%" stopColor="#080401" />
          </linearGradient>

          {/* Specular Highlight Rim Stroke Gradient */}
          <linearGradient id="councilSpecularEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#fff3c6" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e5be5e" stopOpacity="0.45" />
            <stop offset="75%" stopColor="#6f4912" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#180e03" stopOpacity="0.95" />
          </linearGradient>

          {/* Parchment Antique Ink Gradients */}
          <linearGradient id="councilInkWash" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f3521" />
            <stop offset="30%" stopColor="#392515" />
            <stop offset="70%" stopColor="#24160c" />
            <stop offset="100%" stopColor="#130b06" />
          </linearGradient>

          <linearGradient id="councilInkBronze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8d6337" />
            <stop offset="50%" stopColor="#4c331e" />
            <stop offset="100%" stopColor="#1a0f06" />
          </linearGradient>

          {/* Ambient Warm Golden Aura */}
          <radialGradient id="councilCenterGlow" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#b38728" stopOpacity="0.14" />
            <stop offset="65%" stopColor="#5c3c0a" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Radiant Glint Star Definition */}
          <g id="councilGlintStar">
            <path
              d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
              fill="url(#councilGoldUltra)"
            />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        </defs>

        {/* Ambient Center Golden Radiance */}
        {isGold && <rect width="100%" height="100%" fill="url(#councilCenterGlow)" />}

        {/* ========================================================
            LAYER 1: DEEP 3D EXTRUSION & SHADOW CAST (dy=7)
        ======================================================== */}
        <g
          transform="translate(0, 6)"
          fill={isGold ? 'url(#councilExtrudeShadow)' : '#0d0703'}
          opacity={isGold ? '0.95' : '0.4'}
        >
          {/* Top Row: LEGEND Extrusion */}
          <path d="M 235 24 L 277 24 L 277 34 L 265 37 L 265 125 L 322 125 C 336 125 344 121 346 109 L 354 109 L 350 148 L 235 148 L 235 137 L 248 134 L 248 37 L 235 34 Z" />
          <path d="M 378 24 L 466 24 L 470 54 L 460 54 C 456 42 447 37 433 37 L 408 37 L 408 76 L 436 76 C 445 76 450 72 452 64 L 458 64 L 458 98 L 452 98 C 450 90 445 86 436 86 L 408 86 L 408 135 L 436 135 C 453 135 464 129 468 114 L 476 114 L 471 148 L 378 148 L 378 137 L 391 134 L 391 37 L 378 34 Z" />
          <path d="M 585 22 L 612 38 C 596 46 580 61 574 81 C 565 108 578 135 606 145 C 625 151 645 147 658 135 L 658 94 L 626 94 L 626 84 L 674 84 L 674 136 C 657 150 633 156 610 152 C 570 146 544 118 544 82 C 544 54 562 31 585 22 Z" />
          <path d="M 698 24 L 786 24 L 790 54 L 780 54 C 776 42 767 37 753 37 L 728 37 L 728 76 L 756 76 C 765 76 770 72 772 64 L 778 64 L 778 98 L 772 98 C 770 90 765 86 756 86 L 728 86 L 728 135 L 756 135 C 773 135 784 129 788 114 L 796 114 L 791 148 L 698 148 L 698 137 L 711 134 L 711 37 L 698 34 Z" />
          <path d="M 818 24 L 858 24 L 858 34 L 847 37 L 847 134 L 858 137 L 858 148 L 828 148 L 828 137 L 838 134 L 838 48 L 835 48 L 892 138 L 892 37 L 880 34 L 880 24 L 922 24 L 922 34 L 910 37 L 910 128 L 928 152 L 910 172 L 902 172 L 902 144 L 847 48 Z" />
          <path d="M 948 24 L 995 24 L 995 34 L 984 37 L 984 134 L 995 137 L 995 148 L 948 148 L 948 137 L 960 134 L 960 37 L 948 34 Z M 984 26 L 1042 26 L 1108 86 L 1042 146 L 984 146 L 984 134 L 1032 134 L 1084 86 L 1032 38 L 984 38 Z" fillRule="evenodd" />

          {/* Bottom Row: COUNCIL Extrusion */}
          <path d="M 288 288 C 265 272 235 272 208 288 C 176 308 162 344 162 384 C 162 426 182 458 222 466 C 252 472 278 460 294 438 L 285 432 C 274 446 254 454 234 450 C 205 444 190 418 190 384 C 190 348 204 316 235 304 C 255 296 274 300 284 312 Z" />
          <path d="M 404 274 C 445 274 480 306 480 372 C 480 438 445 470 404 470 C 363 470 328 438 328 372 C 328 306 363 274 404 274 Z M 404 290 C 382 290 362 316 362 372 C 362 428 382 454 404 454 C 426 454 446 428 446 372 C 446 316 426 290 404 290 Z" fillRule="evenodd" />
          <path d="M 508 278 L 548 278 L 548 288 L 536 291 L 536 394 C 536 432 556 454 588 454 C 620 454 640 432 640 394 L 640 291 L 628 288 L 628 278 L 668 278 L 668 288 L 656 291 L 656 394 C 656 446 626 470 588 470 C 550 470 520 446 520 394 L 520 291 L 508 288 Z" />
          <path d="M 692 278 L 732 278 L 732 288 L 721 291 L 721 445 L 732 448 L 732 458 L 702 458 L 702 448 L 712 445 L 712 308 L 709 308 L 778 418 L 778 291 L 766 288 L 766 278 L 806 278 L 806 288 L 795 291 L 795 408 L 814 436 L 795 458 L 787 458 L 787 426 L 721 308 Z" />
          <path d="M 954 288 C 931 272 901 272 874 288 C 842 308 828 344 828 384 C 828 426 848 458 888 466 C 918 472 944 460 960 438 L 951 432 C 940 446 920 454 900 450 C 871 444 856 418 856 384 C 856 348 870 316 901 304 C 921 296 940 300 950 312 Z" />
          <path d="M 988 278 L 1040 278 L 1040 288 L 1026 291 L 1026 445 L 1040 448 L 1040 458 L 988 458 L 988 448 L 1002 445 L 1002 291 L 988 288 Z" />
          <path d="M 1064 278 L 1106 278 L 1106 288 L 1094 291 L 1094 435 L 1172 435 C 1192 435 1204 428 1208 408 L 1218 408 L 1212 458 L 1064 458 L 1064 448 L 1076 445 L 1076 291 L 1064 288 Z" />
        </g>

        {/* ========================================================
            LAYER 2: 3D CHISELED BEVEL FACET (dy=2)
        ======================================================== */}
        <g
          transform="translate(0, 2)"
          fill={isGold ? 'url(#councilGoldBevel)' : '#261609'}
          opacity={isGold ? '0.75' : '0.5'}
        >
          {/* Top Row: LEGEND Bevel */}
          <path d="M 235 24 L 277 24 L 277 34 L 265 37 L 265 125 L 322 125 C 336 125 344 121 346 109 L 354 109 L 350 148 L 235 148 L 235 137 L 248 134 L 248 37 L 235 34 Z" />
          <path d="M 378 24 L 466 24 L 470 54 L 460 54 C 456 42 447 37 433 37 L 408 37 L 408 76 L 436 76 C 445 76 450 72 452 64 L 458 64 L 458 98 L 452 98 C 450 90 445 86 436 86 L 408 86 L 408 135 L 436 135 C 453 135 464 129 468 114 L 476 114 L 471 148 L 378 148 L 378 137 L 391 134 L 391 37 L 378 34 Z" />
          <path d="M 585 22 L 612 38 C 596 46 580 61 574 81 C 565 108 578 135 606 145 C 625 151 645 147 658 135 L 658 94 L 626 94 L 626 84 L 674 84 L 674 136 C 657 150 633 156 610 152 C 570 146 544 118 544 82 C 544 54 562 31 585 22 Z" />
          <path d="M 698 24 L 786 24 L 790 54 L 780 54 C 776 42 767 37 753 37 L 728 37 L 728 76 L 756 76 C 765 76 770 72 772 64 L 778 64 L 778 98 L 772 98 C 770 90 765 86 756 86 L 728 86 L 728 135 L 756 135 C 773 135 784 129 788 114 L 796 114 L 791 148 L 698 148 L 698 137 L 711 134 L 711 37 L 698 34 Z" />
          <path d="M 818 24 L 858 24 L 858 34 L 847 37 L 847 134 L 858 137 L 858 148 L 828 148 L 828 137 L 838 134 L 838 48 L 835 48 L 892 138 L 892 37 L 880 34 L 880 24 L 922 24 L 922 34 L 910 37 L 910 128 L 928 152 L 910 172 L 902 172 L 902 144 L 847 48 Z" />
          <path d="M 948 24 L 995 24 L 995 34 L 984 37 L 984 134 L 995 137 L 995 148 L 948 148 L 948 137 L 960 134 L 960 37 L 948 34 Z M 984 26 L 1042 26 L 1108 86 L 1042 146 L 984 146 L 984 134 L 1032 134 L 1084 86 L 1032 38 L 984 38 Z" fillRule="evenodd" />

          {/* Bottom Row: COUNCIL Bevel */}
          <path d="M 288 288 C 265 272 235 272 208 288 C 176 308 162 344 162 384 C 162 426 182 458 222 466 C 252 472 278 460 294 438 L 285 432 C 274 446 254 454 234 450 C 205 444 190 418 190 384 C 190 348 204 316 235 304 C 255 296 274 300 284 312 Z" />
          <path d="M 404 274 C 445 274 480 306 480 372 C 480 438 445 470 404 470 C 363 470 328 438 328 372 C 328 306 363 274 404 274 Z M 404 290 C 382 290 362 316 362 372 C 362 428 382 454 404 454 C 426 454 446 428 446 372 C 446 316 426 290 404 290 Z" fillRule="evenodd" />
          <path d="M 508 278 L 548 278 L 548 288 L 536 291 L 536 394 C 536 432 556 454 588 454 C 620 454 640 432 640 394 L 640 291 L 628 288 L 628 278 L 668 278 L 668 288 L 656 291 L 656 394 C 656 446 626 470 588 470 C 550 470 520 446 520 394 L 520 291 L 508 288 Z" />
          <path d="M 692 278 L 732 278 L 732 288 L 721 291 L 721 445 L 732 448 L 732 458 L 702 458 L 702 448 L 712 445 L 712 308 L 709 308 L 778 418 L 778 291 L 766 288 L 766 278 L 806 278 L 806 288 L 795 291 L 795 408 L 814 436 L 795 458 L 787 458 L 787 426 L 721 308 Z" />
          <path d="M 954 288 C 931 272 901 272 874 288 C 842 308 828 344 828 384 C 828 426 848 458 888 466 C 918 472 944 460 960 438 L 951 432 C 940 446 920 454 900 450 C 871 444 856 418 856 384 C 856 348 870 316 901 304 C 921 296 940 300 950 312 Z" />
          <path d="M 988 278 L 1040 278 L 1040 288 L 1026 291 L 1026 445 L 1040 448 L 1040 458 L 988 458 L 988 448 L 1002 445 L 1002 291 L 988 288 Z" />
          <path d="M 1064 278 L 1106 278 L 1106 288 L 1094 291 L 1094 435 L 1172 435 C 1192 435 1204 428 1208 408 L 1218 408 L 1212 458 L 1064 458 L 1064 448 L 1076 445 L 1076 291 L 1064 288 Z" />
        </g>

        {/* ========================================================
            LAYER 3: MAIN FACE VECTOR OUTLINES (Exact 1:1 Stencil)
        ======================================================== */}
        <g>
          {/* 1. TOP ROW: "LEGEND" */}
          <g
            fill={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkWash)'}
            stroke={isGold ? 'url(#councilSpecularEdge)' : 'url(#councilInkBronze)'}
            strokeWidth="1.8"
            strokeLinejoin="round"
          >
            {/* L */}
            <path d="M 235 24 L 277 24 L 277 34 L 265 37 L 265 125 L 322 125 C 336 125 344 121 346 109 L 354 109 L 350 148 L 235 148 L 235 137 L 248 134 L 248 37 L 235 34 Z" />
            {/* E */}
            <path d="M 378 24 L 466 24 L 470 54 L 460 54 C 456 42 447 37 433 37 L 408 37 L 408 76 L 436 76 C 445 76 450 72 452 64 L 458 64 L 458 98 L 452 98 C 450 90 445 86 436 86 L 408 86 L 408 135 L 436 135 C 453 135 464 129 468 114 L 476 114 L 471 148 L 378 148 L 378 137 L 391 134 L 391 37 L 378 34 Z" />
            {/* G (Diamond apex at 612, 38) */}
            <path d="M 585 22 L 612 38 C 596 46 580 61 574 81 C 565 108 578 135 606 145 C 625 151 645 147 658 135 L 658 94 L 626 94 L 626 84 L 674 84 L 674 136 C 657 150 633 156 610 152 C 570 146 544 118 544 82 C 544 54 562 31 585 22 Z" />
            {/* E */}
            <path d="M 698 24 L 786 24 L 790 54 L 780 54 C 776 42 767 37 753 37 L 728 37 L 728 76 L 756 76 C 765 76 770 72 772 64 L 778 64 L 778 98 L 772 98 C 770 90 765 86 756 86 L 728 86 L 728 135 L 756 135 C 773 135 784 129 788 114 L 796 114 L 791 148 L 698 148 L 698 137 L 711 134 L 711 37 L 698 34 Z" />
            {/* N (Dagger spur to 910, 172) */}
            <path d="M 818 24 L 858 24 L 858 34 L 847 37 L 847 134 L 858 137 L 858 148 L 828 148 L 828 137 L 838 134 L 838 48 L 835 48 L 892 138 L 892 37 L 880 34 L 880 24 L 922 24 L 922 34 L 910 37 L 910 128 L 928 152 L 910 172 L 902 172 L 902 144 L 847 48 Z" />
            {/* D (Geometric Chevron bow) */}
            <path d="M 948 24 L 995 24 L 995 34 L 984 37 L 984 134 L 995 137 L 995 148 L 948 148 L 948 137 L 960 134 L 960 37 L 948 34 Z M 984 26 L 1042 26 L 1108 86 L 1042 146 L 984 146 L 984 134 L 1032 134 L 1084 86 L 1032 38 L 984 38 Z" fillRule="evenodd" />
          </g>

          {/* 2. MIDDLE ROW: "OF THE" & FLANKING HERALDIC FLOURISHES */}
          <g
            fill={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkWash)'}
            stroke={isGold ? 'url(#councilSpecularEdge)' : 'url(#councilInkBronze)'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          >
            {/* Left Ornamental Wing Filigree */}
            <path
              d="M 330 222 L 492 222 M 492 222 L 484 218 L 470 222 L 484 226 Z M 504 222 L 498 217 L 492 222 L 498 227 Z"
              stroke={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkBronze)'}
              strokeWidth="2"
              fill={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkBronze)'}
            />

            {/* O in OF */}
            <path d="M 562 192 C 580 192 596 204 596 222 C 596 240 580 252 562 252 C 544 252 528 240 528 222 C 528 204 544 192 562 192 Z M 562 201 C 551 201 543 210 543 222 C 543 234 551 243 562 243 C 573 243 581 234 581 222 C 581 210 573 201 562 201 Z" fillRule="evenodd" />
            {/* F in OF */}
            <path d="M 612 194 L 656 194 L 658 210 L 652 210 C 650 203 645 201 638 201 L 627 201 L 627 220 L 642 220 C 646 220 649 217 650 212 L 654 212 L 654 230 L 650 230 C 649 225 646 223 642 223 L 627 223 L 627 245 L 634 246 L 634 251 L 606 251 L 606 246 L 613 245 L 613 201 L 606 200 L 606 194 Z" />
            {/* T in THE */}
            <path d="M 686 194 L 738 194 L 738 210 L 733 210 C 731 204 727 201 720 201 L 717 201 L 717 245 L 724 246 L 724 251 L 699 251 L 699 246 L 706 245 L 706 201 L 703 201 C 696 201 692 204 690 210 L 686 210 Z" />
            {/* H in THE */}
            <path d="M 750 194 L 766 194 L 766 199 L 760 200 L 760 220 L 782 220 L 782 200 L 776 199 L 776 194 L 792 194 L 792 199 L 786 200 L 786 245 L 792 246 L 792 251 L 776 251 L 776 246 L 782 245 L 782 225 L 760 225 L 760 245 L 766 246 L 766 251 L 750 251 L 750 246 L 756 245 L 756 200 L 750 199 Z" />
            {/* E in THE */}
            <path d="M 808 194 L 848 194 L 850 210 L 845 210 C 843 204 838 201 831 201 L 821 201 L 821 220 L 834 220 C 838 220 841 218 842 213 L 846 213 L 846 230 L 842 230 C 841 225 838 223 834 223 L 821 223 L 821 245 L 832 245 C 840 245 845 242 847 235 L 852 235 L 849 251 L 802 251 L 802 246 L 809 245 L 809 200 L 802 199 L 802 194 Z" />

            {/* Right Ornamental Wing Filigree */}
            <path
              d="M 1070 222 L 908 222 M 908 222 L 916 218 L 930 222 L 916 226 Z M 896 222 L 902 217 L 908 222 L 902 227 Z"
              stroke={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkBronze)'}
              strokeWidth="2"
              fill={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkBronze)'}
            />
          </g>

          {/* 3. BOTTOM ROW: "COUNCIL" */}
          <g
            fill={isGold ? 'url(#councilGoldUltra)' : 'url(#councilInkWash)'}
            stroke={isGold ? 'url(#councilSpecularEdge)' : 'url(#councilInkBronze)'}
            strokeWidth="2.2"
            strokeLinejoin="round"
          >
            {/* C */}
            <path d="M 288 288 C 265 272 235 272 208 288 C 176 308 162 344 162 384 C 162 426 182 458 222 466 C 252 472 278 460 294 438 L 285 432 C 274 446 254 454 234 450 C 205 444 190 418 190 384 C 190 348 204 316 235 304 C 255 296 274 300 284 312 Z" />
            {/* O */}
            <path d="M 404 274 C 445 274 480 306 480 372 C 480 438 445 470 404 470 C 363 470 328 438 328 372 C 328 306 363 274 404 274 Z M 404 290 C 382 290 362 316 362 372 C 362 428 382 454 404 454 C 426 454 446 428 446 372 C 446 316 426 290 404 290 Z" fillRule="evenodd" />
            {/* U */}
            <path d="M 508 278 L 548 278 L 548 288 L 536 291 L 536 394 C 536 432 556 454 588 454 C 620 454 640 432 640 394 L 640 291 L 628 288 L 628 278 L 668 278 L 668 288 L 656 291 L 656 394 C 656 446 626 470 588 470 C 550 470 520 446 520 394 L 520 291 L 508 288 Z" />
            {/* N (Dagger spur down to 795, 458) */}
            <path d="M 692 278 L 732 278 L 732 288 L 721 291 L 721 445 L 732 448 L 732 458 L 702 458 L 702 448 L 712 445 L 712 308 L 709 308 L 778 418 L 778 291 L 766 288 L 766 278 L 806 278 L 806 288 L 795 291 L 795 408 L 814 436 L 795 458 L 787 458 L 787 426 L 721 308 Z" />
            {/* C */}
            <path d="M 954 288 C 931 272 901 272 874 288 C 842 308 828 344 828 384 C 828 426 848 458 888 466 C 918 472 944 460 960 438 L 951 432 C 940 446 920 454 900 450 C 871 444 856 418 856 384 C 856 348 870 316 901 304 C 921 296 940 300 950 312 Z" />
            {/* I */}
            <path d="M 988 278 L 1040 278 L 1040 288 L 1026 291 L 1026 445 L 1040 448 L 1040 458 L 988 458 L 988 448 L 1002 445 L 1002 291 L 988 288 Z" />
            {/* L (Curved upward hook) */}
            <path d="M 1064 278 L 1106 278 L 1106 288 L 1094 291 L 1094 435 L 1172 435 C 1192 435 1204 428 1208 408 L 1218 408 L 1212 458 L 1064 458 L 1064 448 L 1076 445 L 1076 291 L 1064 288 Z" />
          </g>
        </g>

        {/* ========================================================
            LAYER 4: SPECULAR STAR GLINTS ON PROMINENT VERTICES
        ======================================================== */}
        {isGold && (
          <g opacity="0.88" className="pointer-events-none">
            {/* Apex of G */}
            <use href="#councilGlintStar" x="612" y="36" transform="scale(0.85)" />
            {/* Dagger of N (Top Row) */}
            <use href="#councilGlintStar" x="910" y="172" transform="scale(0.7)" />
            {/* Arrow Tip of D */}
            <use href="#councilGlintStar" x="1108" y="86" transform="scale(0.9)" />
            {/* C top terminal */}
            <use href="#councilGlintStar" x="288" y="288" transform="scale(0.75)" />
            {/* Dagger of N (Bottom Row) */}
            <use href="#councilGlintStar" x="795" y="458" transform="scale(0.85)" />
            {/* Hook tip of L (Bottom Row) */}
            <use href="#councilGlintStar" x="1212" y="458" transform="scale(0.8)" />
          </g>
        )}
      </svg>

      {showSubtitle && (
        <span
          className={`font-serif italic text-center tracking-widest text-[11px] sm:text-xs mt-2 transition-colors ${
            isGold ? 'text-amber-400/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-[#634832]'
          }`}
        >
          Fate Tabanlı Karanlık Fantezi Masaüstü RPG • Stallhart Kurultayı
        </span>
      )}
    </div>
  );
};

