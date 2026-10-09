import { api } from './api';
import type { User, ProfileUpdatePayload } from '../types';

export const profileService = {
  async getMyProfile(): Promise<User> {
    const response = await api.get<User>('/profiles/me');
    return response.data;
  },

  async updateMyProfile(data: ProfileUpdatePayload): Promise<User> {
    const response = await api.put<User>('/profiles/me', data);
    return response.data;
  },

  async getProfileById(userId: number): Promise<User> {
    const response = await api.get<User>(`/profiles/${userId}`);
    return response.data;
  },
};
