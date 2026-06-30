export interface HeadshotStyle {
  id: string
  name: string
  category: 'professional' | 'artistic' | 'lifestyle' | 'seasonal'
}

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  { id: 'linkedin_professional', name: 'LinkedIn Professional', category: 'professional' },
  { id: 'corporate_office', name: 'Corporate Office', category: 'professional' },
  { id: 'business_casual', name: 'Business Casual', category: 'professional' },
  { id: 'executive_portrait', name: 'Executive Portrait', category: 'professional' },
  { id: 'doctor_whitecoat', name: 'Doctor Whitecoat', category: 'professional' },
  { id: 'modern_tech', name: 'Modern Tech', category: 'professional' },
  { id: 'creative_agency', name: 'Creative Agency', category: 'professional' },
  { id: 'oil_painting', name: 'Oil Painting', category: 'artistic' },
  { id: 'watercolor_art', name: 'Watercolor Art', category: 'artistic' },
  { id: 'anime_illustration', name: 'Anime Illustration', category: 'artistic' },
  { id: 'cyberpunk_neon', name: 'Cyberpunk Neon', category: 'artistic' },
  { id: 'pixel_art_retro', name: 'Pixel Art Retro', category: 'artistic' },
  { id: 'pop_art_comic', name: 'Pop Art Comic', category: 'artistic' },
  { id: 'coffee_shop', name: 'Coffee Shop', category: 'lifestyle' },
  { id: 'beach_golden_hour', name: 'Beach Golden Hour', category: 'lifestyle' },
  { id: 'autumn_park', name: 'Autumn Park', category: 'lifestyle' },
  { id: 'city_street', name: 'City Street', category: 'lifestyle' },
  { id: 'library_study', name: 'Library Study', category: 'lifestyle' },
  { id: 'garden_spring', name: 'Garden Spring', category: 'lifestyle' },
  { id: 'spring_blossom', name: 'Spring Blossom', category: 'seasonal' },
  { id: 'summer_sunshine', name: 'Summer Sunshine', category: 'seasonal' },
  { id: 'autumn_foliage', name: 'Autumn Foliage', category: 'seasonal' },
  { id: 'winter_snow', name: 'Winter Snow', category: 'seasonal' },
  { id: 'black_white_classic', name: 'Black & White Classic', category: 'artistic' },
  { id: 'vintage_film', name: 'Vintage Film', category: 'artistic' },
  { id: 'rembrandt_lighting', name: 'Rembrandt Lighting', category: 'artistic' },
  { id: 'soft_glamour', name: 'Soft Glamour', category: 'artistic' },
  { id: 'superhero_style', name: 'Superhero', category: 'artistic' },
  { id: 'royal_portrait', name: 'Royal Portrait', category: 'artistic' },
  { id: 'astronaut_space', name: 'Astronaut Space', category: 'artistic' },
]
