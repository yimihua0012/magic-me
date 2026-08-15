export interface HeadshotStyle {
  id: string
  name: string
  category: 'professional' | 'photo_tools' | 'student_kids'
}

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  { id: 'linkedin_professional', name: 'LinkedIn Professional', category: 'professional' },
  { id: 'linkedin_professional_female', name: 'LinkedIn Professional(Female)', category: 'professional' },
  { id: 'business_casual', name: 'Business Casual', category: 'professional' },
  { id: 'executive_portrait', name: 'Executive Portrait', category: 'professional' },
  { id: 'doctor_whitecoat', name: 'Doctor Whitecoat', category: 'professional' },
  { id: 'modern_tech', name: 'Modern Tech', category: 'professional' },
  { id: 'finance_professional', name: 'Financial Professional', category: 'professional' },
  { id: 'legal_professional', name: 'Legal Professional', category: 'professional' },
  { id: 'print_professional_transparent', name: 'Professional ID Photo(White)', category: 'photo_tools' },
  { id: 'print_professional_blue_png', name: 'Professional ID Photo(Blue)', category: 'photo_tools' },
  { id: 'print_professional_red_png', name: 'Professional ID Photo(Red)', category: 'photo_tools' },
  { id: 'print_men_suit', name: 'Men Suit ID Photo(White)', category: 'photo_tools' },
  { id: 'print_men_shirt', name: 'Men Shirt ID Photo(White)', category: 'photo_tools' },
  { id: 'print_women_suit', name: 'Women Suit ID Photo(White)', category: 'photo_tools' },
  { id: 'print_women_shirt', name: 'Women Shirt ID Photo(White)', category: 'photo_tools' },
  { id: 'print_student_id_transparent', name: 'Student ID Photo(White Female)', category: 'student_kids' },
  { id: 'print_student_id_transparent_male', name: 'Student ID Photo(White Male)', category: 'student_kids' },
  { id: 'print_student_id_blue_png', name: 'Student ID Photo(Blue)', category: 'student_kids' },
  { id: 'print_student_id_red_png', name: 'Student ID Photo(Red)', category: 'student_kids' },
  { id: 'print_child_boy', name: 'Boy ID Photo(White)', category: 'student_kids' },
  { id: 'print_child_girl', name: 'Girl ID Photo(White)', category: 'student_kids' },
]