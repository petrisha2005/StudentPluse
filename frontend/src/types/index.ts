export type UserRole = 'student' | 'club' | 'organizer' | 'admin';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface College {
  id: number;
  name: string;
  city?: string;
  state?: string;
  website?: string;
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface UserSkill {
  id: number;
  skill_id: number;
  skill: Skill;
  proficiency: ProficiencyLevel;
}

export interface Interest {
  id: number;
  name: string;
  category?: string;
}

export interface UserInterest {
  id: number;
  interest_id: number;
  interest: Interest;
}

export interface Profile {
  id: number;
  user_id: number;
  college_id?: number;
  college?: College;
  degree?: string;
  branch?: string;
  year?: string;
  city?: string;
  bio?: string;
  profile_image?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  skills: UserSkill[];
  interests: UserInterest[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ProfileUpdatePayload {
  full_name?: string;
  college_id?: number;
  college_name?: string;
  degree?: string;
  branch?: string;
  year?: string;
  city?: string;
  bio?: string;
  profile_image?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  skill_ids?: number[];
  interest_ids?: number[];
}
