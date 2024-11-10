declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import React, { useEffect } from 'react';

interface AdProps {
  slot: string;
  format?: string;
  responsive?: boolean;
}

const Advertisement: React.FC<AdProps> = ({ slot, format = 'auto', responsive = true }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default Advertisement; 