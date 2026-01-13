import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            {/* Outer gradient circle */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                </linearGradient>
                <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                </filter>
            </defs>
            
            {/* Main circular background */}
            <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" filter="url(#logoShadow)" opacity="0.15"/>
            
            {/* Book/Page elements representing education */}
            <g transform="translate(32, 32)">
                {/* Left page */}
                <path
                    d="M -12 -14 L -4 -14 L -4 14 L -12 12 Z"
                    fill="currentColor"
                    opacity="0.6"
                />
                
                {/* Right page */}
                <path
                    d="M 4 -14 L 12 -12 L 12 12 L 4 14 Z"
                    fill="currentColor"
                    opacity="0.8"
                />
                
                {/* Center binding */}
                <rect x="-2" y="-14" width="4" height="28" fill="currentColor" opacity="0.9" rx="2"/>
                
                {/* Lines on pages representing content */}
                <line x1="-10" y1="-8" x2="-6" y2="-8" stroke="white" strokeWidth="1.5" opacity="0.7"/>
                <line x1="-10" y1="-3" x2="-6" y2="-3" stroke="white" strokeWidth="1.5" opacity="0.7"/>
                <line x1="-10" y1="2" x2="-6" y2="2" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                
                <line x1="6" y1="-8" x2="10" y2="-8" stroke="white" strokeWidth="1.5" opacity="0.85"/>
                <line x1="6" y1="-3" x2="10" y2="-3" stroke="white" strokeWidth="1.5" opacity="0.85"/>
                <line x1="6" y1="2" x2="10" y2="2" stroke="white" strokeWidth="1.5" opacity="0.75"/>
                
                {/* Top accent - lightbulb for idea/innovation */}
                <circle cx="0" cy="-20" r="3" fill="currentColor" opacity="0.9"/>
                <path d="M -1.5 -16 Q -2.5 -12 -1 -9 L 1 -9 Q 2.5 -12 1.5 -16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8"/>
                <line x1="-1.5" y1="-8" x2="1.5" y2="-8" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                
                {/* School name - NAYA */}
                <text 
                    x="0" 
                    y="2" 
                    textAnchor="middle" 
                    fontSize="7" 
                    fontWeight="bold" 
                    fill="white" 
                    opacity="0.95"
                    fontFamily="Arial, sans-serif"
                    letterSpacing="0.5"
                >
                    NAYA
                </text>
            </g>
        </svg>
    );
}
