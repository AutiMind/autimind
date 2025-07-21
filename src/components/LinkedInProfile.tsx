import React from 'react';
import { Linkedin } from 'lucide-react';

interface LinkedInProfileProps {
  name: string;
  linkedinUrl: string;
  initials: string;
  borderColor: string;
  children?: React.ReactNode;
}

const LinkedInProfile: React.FC<LinkedInProfileProps> = ({ 
  name, 
  linkedinUrl, 
  initials, 
  borderColor,
  children 
}) => {
  // Direct mapping based on name to avoid any URL parsing issues
  const getProfileImage = (name: string) => {
    switch (name) {
      case 'Amy Cozart-Lundin':
        return '/images/team/amy1.png';
      case 'Andrea Cozart-Lundin':
        return '/images/team/Cozy1.png';
      case 'Amy Perry Tipton':
        return '/images/team/AmyT1.png';
      default:
        return null;
    }
  };

  const profileImageUrl = getProfileImage(name);
  
  // Debug logging
  console.log('LinkedIn Profile Debug:', {
    name,
    profileImageUrl,
    willUseFallback: !profileImageUrl
  });
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=64748b&size=200&font-size=0.33`;

  return (
    <div className="relative mb-4">
      <div className={`w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 ${borderColor}`}>
        <img 
          src={profileImageUrl || fallbackImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Image load error for:', name, 'URL:', profileImageUrl);
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      </div>
      <a 
        href={linkedinUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <Linkedin className="w-4 h-4 text-white" />
      </a>
      {children}
    </div>
  );
};

export default LinkedInProfile;