export type UserRole = 'student' | 'club' | 'organizer' | 'admin';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type TeamStatus = 'open' | 'closed';

export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected';

export type TeamMemberRole = 'owner' | 'member';

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

export interface TeamRequirement {
  id: number;
  team_id: number;
  skill_id: number;
  skill: Skill;
  required_proficiency: ProficiencyLevel;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  user: User;
  role: TeamMemberRole;
  joined_at: string;
}

export interface JoinRequest {
  id: number;
  team_id: number;
  user_id: number;
  user: User;
  team?: Team;
  message?: string;
  status: JoinRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  project_title: string;
  description?: string;
  owner_id: number;
  owner: User;
  max_members: number;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
  requirements: TeamRequirement[];
  current_member_count: number;
  available_capacity: number;
}

export interface TeamRequirementCreate {
  skill_id: number;
  required_proficiency: ProficiencyLevel;
}

export interface TeamCreatePayload {
  name: string;
  project_title: string;
  description?: string;
  max_members: number;
  required_skills?: TeamRequirementCreate[];
}

export interface TeamUpdatePayload {
  name?: string;
  project_title?: string;
  description?: string;
  max_members?: number;
  status?: TeamStatus;
  required_skills?: TeamRequirementCreate[];
}

export interface JoinRequestCreatePayload {
  message?: string;
}

export interface JoinRequestReviewPayload {
  status: 'accepted' | 'rejected';
}
