import { api } from './api';
import type { Skill, Interest, College, User } from '../types';

export const dataService = {
  async getSkills(): Promise<Skill[]> {
    const response = await api.get<Skill[]>('/skills');
    return response.data;
  },

  async getInterests(): Promise<Interest[]> {
    const response = await api.get<Interest[]>('/interests');
    return response.data;
  },

  async getColleges(): Promise<College[]> {
    const response = await api.get<College[]>('/colleges');
    return response.data;
  },

  async getUsers(skip = 0, limit = 20): Promise<User[]> {
    const response = await api.get<User[]>(`/users?skip=${skip}&limit=${limit}`);
    return response.data;
  },
};
