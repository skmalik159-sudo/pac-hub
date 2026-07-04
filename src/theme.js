export const COLORS = {
  paper: '#F5EFE1',
  card: '#FFFDF7',
  ink: '#1B2A44',
  inkSoft: '#4A5773',
  seal: '#8B2A2A',
  brass: '#A8792E',
  rule: '#D9CEB0',
  muted: '#8A8062',
  white: '#FFFFFF'
};

export const FONTS = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodyBold: 'WorkSans_700Bold',
  mono: 'IBMPlexMono_500Medium',
  monoBold: 'IBMPlexMono_600SemiBold'
};

export const CATEGORIES = [
  {
    key: 'discussion',
    label: 'Discussion',
    icon: '💬',
    fields: [
      { key: 'title', label: 'Topic', placeholder: 'e.g. Reunion ka programme', multiline: false },
      { key: 'body', label: 'Message', placeholder: 'Apni baat likhen...', multiline: true }
    ]
  },
  {
    key: 'buysell',
    label: 'Buy & Sell',
    icon: '🛒',
    fields: [
      { key: 'title', label: 'Item ka naam', placeholder: 'e.g. Sofa set (used)', multiline: false },
      { key: 'price', label: 'Price (Rs)', placeholder: 'e.g. 15,000', multiline: false },
      { key: 'body', label: 'Tafseel', placeholder: 'Condition, contact number...', multiline: true }
    ]
  },
  {
    key: 'jobs',
    label: 'Jobs',
    icon: '💼',
    fields: [
      { key: 'title', label: 'Job Title', placeholder: 'e.g. Office Assistant', multiline: false },
      { key: 'price', label: 'Salary (optional)', placeholder: 'e.g. Rs 30,000/month', multiline: false },
      { key: 'body', label: 'Tafseel', placeholder: 'Company, requirements, contact number...', multiline: true }
    ]
  },
  {
    key: 'services',
    label: 'Services',
    icon: '🔧',
    fields: [
      { key: 'title', label: 'Service (Plumber, Electrician, etc.)', placeholder: 'e.g. Plumber', multiline: false },
      { key: 'body', label: 'Tajurba / Tafseel', placeholder: 'Experience, rate, contact number...', multiline: true }
    ]
  },
  {
    key: 'rentals',
    label: 'Rentals',
    icon: '🏠',
    fields: [
      { key: 'title', label: 'Type (House/Flat/Room)', placeholder: 'e.g. 2 Bed Flat', multiline: false },
      { key: 'location', label: 'Location/Area', placeholder: 'e.g. Model Town', multiline: false },
      { key: 'price', label: 'Rent (Rs/month)', placeholder: 'e.g. 25,000', multiline: false },
      { key: 'body', label: 'Tafseel', placeholder: 'Floor, facilities, contact number...', multiline: true }
    ]
  },
  {
    key: 'vehicles',
    label: 'Vehicles',
    icon: '🚗',
    fields: [
      { key: 'title', label: 'Vehicle Type', placeholder: 'e.g. Van', multiline: false },
      { key: 'route', label: 'Route (From - To)', placeholder: 'e.g. Model Town to Cantt', multiline: false },
      { key: 'body', label: 'Timing / Tafseel', placeholder: 'Roz ka waqt, fare, contact number...', multiline: true }
    ]
  }
];
