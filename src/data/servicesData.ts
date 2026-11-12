import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'photo-shoots',
    serviceKey: 'Photo Shoot',
    title: 'Professional Photo Shoots',
    tagline: 'Portraits, Families & Milestone Celebrations',
    category: 'Photography',
    shortDescription: 'Professional photography for portraits, families, celebrations, events and special occasions.',
    fullDescription: 'From heartfelt family portraits to grand celebrations, our studio and on-location photography sessions capture genuine emotions with flattering lighting, artful composition, and natural poses.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Camera',
    features: [
      'Indoor studio & scenic outdoor outdoor shoots in Vijayawada',
      'High-resolution edited digital copies with color grading',
      'Candid & traditional portrait posing guidance',
      'Flexible family, individual & group packages',
      'Fast turnaround & online private gallery'
    ],
    deliveryTime: '3 - 5 Days',
    isPopular: true
  },
  {
    id: 'pre-wedding-shoots',
    serviceKey: 'Pre-Wedding Shoot',
    title: 'Pre-Wedding Shoots',
    tagline: 'Cinematic Stories of Love & Togetherness',
    category: 'Photography',
    shortDescription: 'Creative and cinematic photography and videography to beautifully capture your love story.',
    fullDescription: 'Celebrate the magic of your engagement with dreamy, romantic, and cinematic pre-wedding sessions. We scout the most breathtaking locations around Vijayawada, Krishna riverfront, and scenic heritage spots.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Heart',
    features: [
      'Cinematic 4K teaser reel for Instagram & wedding invites',
      'Scenic destination scouting (Riverbanks, Palaces, Resorts)',
      'Multiple costume & mood changes support',
      'Aerial drone shots & slow-motion video captures',
      'Includes teaser video & framed portrait print'
    ],
    deliveryTime: '5 - 7 Days',
    isPopular: true
  },
  {
    id: 'pre-birthday-shoots',
    serviceKey: 'Pre-Birthday Shoot',
    title: 'Pre-Birthday & Kids Shoots',
    tagline: 'Cherishing Childhood Milestones & Pure Smiles',
    category: 'Photography',
    shortDescription: 'Beautiful and creative photoshoots for babies and children to celebrate their special milestones.',
    fullDescription: 'Children grow in the blink of an eye. We craft themed, playful, and comfortable sets for half-birthday, 1st birthday cake smashes, and kid portraits that capture their innocent expressions and boundless joy.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Sparkles',
    features: [
      'Custom creative themes (Royal, Fairy, Jungle, Minimalist)',
      'Cake smash set design & props provided',
      'Gentle baby-friendly studio environment & safe lighting',
      'Expressive candid moments of child & parents',
      'Cute mini photobook options available'
    ],
    deliveryTime: '3 - 5 Days',
    isPopular: true
  },
  {
    id: 'event-management',
    serviceKey: 'Event Management',
    title: 'Event Management & Coverage',
    tagline: 'Flawless Coordination for Grand Celebrations',
    category: 'Events',
    shortDescription: 'Creative planning and professional management for memorable celebrations and events.',
    fullDescription: 'From intimate engagement functions to grand weddings, cradle ceremonies, and corporate events, we manage end-to-end stage decor, lighting setups, sound, and comprehensive multi-camera live coverage.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Calendar',
    features: [
      'Complete stage decor, lighting & floral styling',
      'Multi-camera live mixing & LED screen streaming',
      'Candid & traditional photography crew coverage',
      'Sound system & anchor/entertainment coordination',
      'Dedicated on-site event coordinator'
    ],
    deliveryTime: 'Event Scheduled',
    isPopular: false
  },
  {
    id: 'video-editing',
    serviceKey: 'Video Editing',
    title: 'Cinematic Video Editing',
    tagline: 'Turning Raw Footage into Heart-Touching Films',
    category: 'Cinematography',
    shortDescription: 'Professional video editing for weddings, events, celebrations, reels and cinematic memories.',
    fullDescription: 'Great editing turns recorded clips into emotional cinema. We specialize in color grading, audio synchronization, beat-matched reels, and highlight films that make you relive every feeling over and over again.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Film',
    features: [
      'Hollywood-style color grading & cinematic LUTs',
      'Instagram 9:16 reels & TikTok-ready short highlights',
      'Traditional full-length wedding video editing with chapters',
      'Licensed background music scoring & crisp sound mastering',
      'VFX titles, custom 3D intro animations & motion graphics'
    ],
    deliveryTime: '4 - 7 Days',
    isPopular: false
  },
  {
    id: 'album-design',
    serviceKey: 'Album Design',
    title: 'Luxury Album Design & Printing',
    tagline: 'Heirloom Photo Books Crafted to Last Generations',
    category: 'Albums & Design',
    shortDescription: 'Beautifully designed and customized premium photo albums that preserve your memories forever.',
    fullDescription: 'A photograph comes alive when held in hands. We craft custom-designed panoramic lay-flat photo books with premium velvet, metallic, or matte laminations, archival waterproof sheets, and bespoke leatherette or acrylic covers.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
    iconName: 'BookOpen',
    features: [
      'Seamless 180° lay-flat panoramic binding',
      'Ultra-HD archival photographic paper with anti-scratch coating',
      'Custom embossed leather, velvet or acrylic glass covers',
      'Personalized layout design with client preview & approval',
      'Comes in an elegant premium wooden or silk presentation box'
    ],
    deliveryTime: '7 - 10 Days',
    isPopular: true
  },
  {
    id: 'photo-frames',
    serviceKey: 'Photo Frame',
    title: 'Customized Photo Frames',
    tagline: 'Elegant Framing for Your Most Cherished Wall Art',
    category: 'Personalized Gifts',
    shortDescription: 'Customized and high-quality photo frames designed to display your most precious memories.',
    fullDescription: 'Turn your favorite portraits into gallery-grade wall art. We offer high-quality synthetic wood frames, minimalist metallic frames, borderless acrylic glass mounts, and multi-photo collage frames tailored to your home decor.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Frame',
    features: [
      'High-grade synthetic wood, Italian moulding & acrylic frames',
      'Non-glare UV-protective glass & moisture-resistant backing',
      'Wide variety of sizes from 6x8 inches to 24x36 inch canvas',
      'Multi-picture family collage & calendar frame designs',
      'Ready to hang with sturdy hooks & wall anchors'
    ],
    deliveryTime: '2 - 3 Days',
    isPopular: false
  },
  {
    id: 'photo-cups',
    serviceKey: 'Photo Cup',
    title: 'Personalized Photo Cups',
    tagline: 'Start Every Morning with a Cherished Smile',
    category: 'Personalized Gifts',
    shortDescription: 'Personalized photo cups with your favorite photographs, names and creative designs.',
    fullDescription: 'Custom high-gloss ceramic coffee mugs printed with your selected portraits, heartfelt quotes, and customized themes. Microwave and dishwasher safe with vivid, scratch-resistant sublimation printing.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Coffee',
    features: [
      'Grade-A premium ceramic with glossy white finish',
      'Durable dye-sublimation print that will never fade or peel',
      'Custom name, photo, anniversary date or quote customization',
      'Microwave & dishwasher safe design',
      'Gift packaging with personalized greeting card'
    ],
    deliveryTime: '24 - 48 Hours',
    isPopular: false
  },
  {
    id: 'magic-cups',
    serviceKey: 'Magic Cup',
    title: 'Thermo-Sensitive Magic Cups',
    tagline: 'Pour Hot Coffee & Watch the Mystery Reveal',
    category: 'Personalized Gifts',
    shortDescription: 'Creative personalized magic cups that reveal special photos or designs when hot.',
    fullDescription: 'An enchanting gift experience! At room temperature, the cup appears sleek matte black. As soon as you pour hot coffee or tea, the thermo-chromic coating magically turns transparent to reveal your vibrant photo underneath!',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Sparkles',
    features: [
      'Heat-activated color changing thermal technology',
      'Matte black exterior transforms into high-vibrancy photo',
      'Available in classic cylindrical & romantic heart-handle styles',
      'Surprise gift favorite for anniversaries, birthdays & Valentine’s',
      'Eco-friendly non-toxic thermal coating'
    ],
    deliveryTime: '24 - 48 Hours',
    isPopular: true
  },
  {
    id: 'magic-pillows',
    serviceKey: 'Magic Pillow',
    title: 'Customized Magic Pillows',
    tagline: 'Reversible Sequin Cushions with Hidden Memories',
    category: 'Personalized Gifts',
    shortDescription: 'Customized photo pillows and personalized gifts perfect for memorable occasions.',
    fullDescription: 'Interactive reversible sequin cushions! Swipe your hand across the sparkling sequins in one direction to reveal a stunning high-resolution photo, and swipe the other way to hide it under glamorous gold, red, or silver sequins.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Gift',
    features: [
      'High-density two-way reversible mermaid sequins',
      'Soft plush velvet back for luxurious cozy cuddling',
      'Hidden zipper design with premium hypoallergenic fiber filling',
      'Available in Gold, Rose Gold, Royal Blue, Silver & Red',
      'Eye-catching decor piece for bedroom or living room sofa'
    ],
    deliveryTime: '2 - 3 Days',
    isPopular: true
  }
];
