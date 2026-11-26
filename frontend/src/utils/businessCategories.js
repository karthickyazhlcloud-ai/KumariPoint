export const defaultBusinessCategories = [
  'Agriculture & Farming',
  'Automotive',
  'Bakery',
  'Banks & Finance',
  'Beauty & Personal Care',
  'Books & Stationery',
  'Building Materials & Hardware',
  'Business Services',
  'Car Rental & Taxi',
  'Clothing & Fashion',
  'Construction',
  'Courier & Delivery',
  'Education & Training',
  'Electronics & Appliances',
  'Event Planning & Management',
  'Fish & Seafood',
  'Florist & Gifts',
  'Food & Catering',
  'Furniture & Home Decor',
  'Grocery & Supermarkets',
  'Gym & Fitness',
  'Healthcare',
  'Home Services & Repairs',
  'Hotels & Accommodation',
  'Insurance',
  'Jewellery',
  'Laundry & Dry Cleaning',
  'Legal Services',
  'Medical & Pharmacy',
  'Mobile & Computer Services',
  'Optical Stores',
  'Pet Care & Veterinary',
  'Photography & Videography',
  'Plumbing & Electrical',
  'Printing',
  'Real Estate',
  'Restaurant',
  'Salon & Spa',
  'Security Services',
  'Sports & Recreation',
  'Telecommunications & Internet',
  'Tourism & Travel',
  'Transport & Logistics',
  'Water Supply & Purification',
  'Wedding Services & Venues',
];

export const mergeBusinessCategories = (categories = []) => {
  const merged = new Map();
  [...defaultBusinessCategories, ...(Array.isArray(categories) ? categories : [])].forEach((item) => {
    const category = typeof item === 'string' ? { name: item } : item;
    const name = String(category?.name || category?.categoryName || '').trim();
    if (!name) return;
    const key = name.toLocaleLowerCase();
    merged.set(key, { ...(merged.get(key) || {}), ...category, name });
  });
  return [...merged.values()].sort((left, right) => left.name.localeCompare(right.name));
};
