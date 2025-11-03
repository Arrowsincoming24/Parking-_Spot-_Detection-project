import React from 'react';
import './Logo.css';

/**
 * Professional Logo Component for Advanced Parking Detection System
 * Features modern SVG design with gradient effects and animations
 */

const Logo = ({ size = 'medium', variant = 'full', animated = true }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'logo-small';
      case 'medium': return 'logo-medium';
      case 'large': return 'logo-large';
      case 'xlarge': return 'logo-xlarge';
      default: return 'logo-medium';
    }
  };

  const getLogoContent = () => {
    if (variant === 'icon-only') {
      return (
        <svg
          className={`logo-icon ${getSizeClass()} ${animated ? 'animated' : ''}`}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feFlood floodColor="#000000" floodOpacity="0.1"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Parking Spot Background */}
          <rect x="10" y="25" width="80" height="50" rx="8" fill="url(#logoGradient)" filter="url(#shadow)"/>
          
          {/* Parking Lines */}
          <line x1="10" y1="45" x2="90" y2="45" stroke="white" strokeWidth="2" opacity="0.8"/>
          <line x1="10" y1="55" x2="90" y2="55" stroke="white" strokeWidth="2" opacity="0.8"/>
          
          {/* Car Icon */}
          <g transform="translate(35, 35)">
            <rect x="0" y="8" width="30" height="14" rx="3" fill="url(#carGradient)"/>
            <rect x="5" y="5" width="8" height="8" rx="2" fill="url(#carGradient)"/>
            <rect x="17" y="5" width="8" height="8" rx="2" fill="url(#carGradient)"/>
            <circle cx="7" cy="24" r="3" fill="#0f172a"/>
            <circle cx="23" cy="24" r="3" fill="#0f172a"/>
          </g>
          
          {/* Detection Frame */}
          <rect x="8" y="23" width="84" height="54" rx="10" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" opacity="0.6">
            {animated && <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>}
          </rect>
          
          {/* Corner Detection Points */}
          <circle cx="12" cy="27" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>}
          </circle>
          <circle cx="88" cy="27" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>}
          </circle>
          <circle cx="12" cy="73" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="1s" repeatCount="indefinite"/>}
          </circle>
          <circle cx="88" cy="73" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="1.5s" repeatCount="indefinite"/>}
          </circle>
        </svg>
      );
    }

    return (
      <div className={`logo-container ${getSizeClass()}`}>
        <svg
          className={`logo-icon ${animated ? 'animated' : ''}`}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feFlood floodColor="#000000" floodOpacity="0.1"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Parking Spot Background */}
          <rect x="10" y="25" width="80" height="50" rx="8" fill="url(#logoGradient)" filter="url(#shadow)"/>
          
          {/* Parking Lines */}
          <line x1="10" y1="45" x2="90" y2="45" stroke="white" strokeWidth="2" opacity="0.8"/>
          <line x1="10" y1="55" x2="90" y2="55" stroke="white" strokeWidth="2" opacity="0.8"/>
          
          {/* Car Icon */}
          <g transform="translate(35, 35)">
            <rect x="0" y="8" width="30" height="14" rx="3" fill="url(#carGradient)"/>
            <rect x="5" y="5" width="8" height="8" rx="2" fill="url(#carGradient)"/>
            <rect x="17" y="5" width="8" height="8" rx="2" fill="url(#carGradient)"/>
            <circle cx="7" cy="24" r="3" fill="#0f172a"/>
            <circle cx="23" cy="24" r="3" fill="#0f172a"/>
          </g>
          
          {/* Detection Frame */}
          <rect x="8" y="23" width="84" height="54" rx="10" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" opacity="0.6">
            {animated && <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>}
          </rect>
          
          {/* Corner Detection Points */}
          <circle cx="12" cy="27" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>}
          </circle>
          <circle cx="88" cy="27" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>}
          </circle>
          <circle cx="12" cy="73" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="1s" repeatCount="indefinite"/>}
          </circle>
          <circle cx="88" cy="73" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="1.5s" repeatCount="indefinite"/>}
          </circle>
        </svg>
        
        <div className="logo-text">
          <div className="logo-title">
            <span className="logo-title-main">ParkVision</span>
            <span className="logo-title-sub">AI</span>
          </div>
          <div className="logo-tagline">Advanced Detection System</div>
        </div>
      </div>
    );
  };

  return getLogoContent();
};

export default Logo;
