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
  
  // Use direct LinkedIn profile image URLs from their actual profiles
  
  const getLinkedInProfileImage = (linkedinUrl: string, name: string) => {
    // Direct LinkedIn profile image URLs
    const profileImages: { [key: string]: string } = {
      'amy-cozart-lundin': 'https://media.licdn.com/dms/image/v2/D5603AQFzmDTXUVVzXg/profile-displayphoto-scale_400_400/B56ZgLiOYaG4Ak-/0/1752540180467?e=1755734400&v=beta&t=UlLdt2DiMyDBdASyozhZ_5tiAqLYp67nUCFqGnbZnuY',
      'andrea-cozart-lundin': 'https://media.licdn.com/dms/image/v2/D5603AQFWpqSzJ6oC2g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1698279390839?e=1755734400&v=beta&t=-uzEZZrkTguLuH1zZ9qxjYzNdZLdwnei_9g0VeUj4xg',
      'amy-perry-tipton': 'https://media.licdn.com/dms/image/v2/D4E03AQGcXjZ1SsSBog/profile-displayphoto-shrink_400_400/B4EZW6LVgBH0Ag-/0/1742585289642?e=1755734400&v=beta&t=VoikbV_NvIyvcdlOqyt5C7TyOVpClHIMiO8C3WkcVlY'
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