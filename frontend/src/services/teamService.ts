import { api } from './api';
import type {
  Team,
  TeamCreatePayload,
  TeamUpdatePayload,
  JoinRequest,
  JoinRequestCreatePayload,
  JoinRequestReviewPayload,
  TeamStatus
} from '../types';

export const teamService = {
  async getTeams(params?: {
    skip?: number;
    limit?: number;
    status?: TeamStatus;
    skill_id?: number;
    search?: string;
  }): Promise<Team[]> {
    const response = await api.get<Team[]>('/teams', { params });
    return response.data;
  },

  async getMyTeams(): Promise<Team[]> {
    const response = await api.get<Team[]>('/teams/me');
    return response.data;
  },

  async getMyJoinRequests(): Promise<JoinRequest[]> {
    const response = await api.get<JoinRequest[]>('/teams/me/join-requests');
    return response.data;
  },

  async getTeamById(teamId: number): Promise<Team> {
    const response = await api.get<Team>(`/teams/${teamId}`);
    return response.data;
  },

  async createTeam(data: TeamCreatePayload): Promise<Team> {
    const response = await api.post<Team>('/teams', data);
    return response.data;
  },

  async updateTeam(teamId: number, data: TeamUpdatePayload): Promise<Team> {
    const response = await api.patch<Team>(`/teams/${teamId}`, data);
    return response.data;
  },

  async closeTeam(teamId: number): Promise<Team> {
    const response = await api.post<Team>(`/teams/${teamId}/close`);
    return response.data;
  },

  async submitJoinRequest(teamId: number, data: JoinRequestCreatePayload): Promise<JoinRequest> {
    const response = await api.post<JoinRequest>(`/teams/${teamId}/join-requests`, data);
    return response.data;
  },

  async getTeamJoinRequests(teamId: number): Promise<JoinRequest[]> {
    const response = await api.get<JoinRequest[]>(`/teams/${teamId}/join-requests`);
    return response.data;
  },

  async reviewJoinRequest(
    teamId: number,
    requestId: number,
    data: JoinRequestReviewPayload
  ): Promise<JoinRequest> {
    const response = await api.patch<JoinRequest>(`/teams/${teamId}/join-requests/${requestId}`, data);
    return response.data;
  },
};
