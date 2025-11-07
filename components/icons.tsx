
import React from 'react';

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,11.45 21.35,11.1 21.35,11.1Z" />
  </svg>
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

export const MessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#paint0_linear_1_2)"/>
        <defs>
        <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8AB4B"/>
        <stop offset="1" stopColor="#F28B82"/>
        </linearGradient>
        </defs>
    </svg>
);

export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
);

export const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

export const ArticleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
  );
  
export const ArrowUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
);

export const ArrowDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
);
export const X1Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 291.69 291.69" fill="currentColor">
  <g transform="translate(0, 47.065)">
    <path d="M89.69,197h.69c1.73-1.07,2.49-2.3,1.28-4.2-.66-.48-1.3-.98-1.94-1.49-.45,1.9-.49,3.79-.04,5.69Z"/>
    <path d="M187.23,19.55c19.06,19.3,10.42,53.12-15.47,60.86-27.53,8.23-53.21-15.37-47.11-43.44,6.16-28.39,42.46-37.81,62.59-17.42Z"/>
    <path d="M291.55,187.88c-2.7-10.97-14.51-8.05-18.46-32.14-.53-3.06-1.09-7.7-1.05-10.17-.06-23.03-.12-84.38-.21-99.13-.01-2.01-2.38,1.32-3.2,1.97-8.17,9.15-20.67,14.86-32.93,14.53-3.74.23-9.23-2.14-11.67,1.55-.96,1.57-1.17,4.22-1.39,6.93-2.57,40.65,7.38,78.95-19.77,109.61-3.1,3.94-12.31,10.72-7.62,15.75,1.01.73,2.15.78,3.34.78,9.77-.02,53.28-.13,75.11-.18,4.28-.17,9.56.38,13.41-.37,3.41-1.27,5.02-5.45,4.47-8.94l-.03-.19Z"/>
    <path d="M269.08,38.76c3.22,0,3.22-5,0-5s-3.22,5,0,5h0Z"/>
    <path d="M269.1,38.76c3.22,0,3.22-5,0-5s-3.22,5,0,5h0Z"/>
    <path d="M269.1,38.82c3.22,0,3.22-5,0-5s-3.22,5,0,5h0Z"/>
    <path d="M269.13,38.82c3.22,0,3.22-5,0-5s-3.22,5,0,5h0Z"/>
    <path fill="none" d="M271.96,34.94c.2-.62.55-1.16,1.03-1.61.45-.49.99-.83,1.61-1.03.55-.29,1.13-.42,1.76-.43v-9.74h-4.5v13.04c.03-.08.06-.15.1-.23Z"/>
    <path d="M231.23,186.01c.16.22.34.42.51.63h40.67c.26-29.75-.52-70.92-.45-97.23v-.34c.44-23.28.3-46.99.17-70.3-.13-5.69.34-16.29-3.37-18.22-13.97-1.04-55.93-.16-69.01-.53-4.8-.34-7.43,3.85-3.03,11.82,4.38,7.39,10.59,14.45,14.38,22.83,23.11,44.24-1.13,118.3,20.13,151.33Z"/>
    <path d="M190.13,139.82c1.38-.52,2.73-1.11,4.04-1.84-2.36-1.14-3.84-.26-4.04,1.84Z"/>
    <g>
      <path d="M197.53,142.72l-7.22-3.45c-.05.18-.11.37-.17.54-.79,6.48-4.68,12.29-11.31,13.91-8.08,1.97-11.94-4.56-16.22-10.05L74.47,11.31C70.12,5.1,62.16,1.01,54.6.42c-16.83-1.32-35.32.99-52.32-.02-5.6.47.72,5.29,2.1,6.89,1.54,1.79,3.2,3.86,4.61,5.75,18.41,24.65,34.02,52.56,52.32,77.43,4.45,7.52,7.03,12.89,2.42,21.21L8.75,192.31c-1.11,2.18-.77,3.94,1.67,4.78l79.26-.1c-.46-1.9-.41-3.79.04-5.69-16.45-13.07-26.61-34.2-20.91-55.31,2.07-7.64,6.77-18.16,16.11-11.19,14.97,18.23,26.31,39.46,40.04,58.65,10.75,15.03,23.56,14.85,38.95,6.4,16.24-8.91,32.21-27.72,33.58-46.71,0-.01,0-.02,0-.03,0-.14.02-.27.03-.4Z"/>
      <path d="M197.47,142.2c-.18-1.9-1.85-4.03-3.68-4.24-2.25-.29-5.51,1.1-1.9,2.89.75.39,6.18,3.72,5.6,1.48l-.02-.14Z"/>
    </g>
  </g>
</svg>
);