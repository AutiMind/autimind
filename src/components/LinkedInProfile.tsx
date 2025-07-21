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
  // Extract LinkedIn username from URL
  const getLinkedInUsername = (url: string) => {
    const match = url.match(/linkedin\.com\/in\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const username = getLinkedInUsername(linkedinUrl);
  
  // Use local profile images from public/images/team/ directory
  
  const getLinkedInProfileImage = (linkedinUrl: string, name: string) => {
    // Use local image files stored in public/images/team/
    const profileImages: { [key: string]: string } = {
      'amy-cozart-lundin': '/images/team/amy1.png',
      'andrea-cozart-lundin': '/images/team/Cozy1.png',
      'amy-perry-tipton': '/images/team/AmyT1.png'
    };
    
    const username = getLinkedInUsername(linkedinUrl);
    return username ? profileImages[username] : null;
  };

  const linkedinImageUrl = getLinkedInProfileImage(linkedinUrl, name);
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=64748b&size=200&font-size=0.33`;

  return (
    <div className="relative mb-4">
      <div className={`w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 ${borderColor}`}>
        <img 
          src={linkedinImageUrl || fallbackImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
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