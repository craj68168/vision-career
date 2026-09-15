import axiosInstance from "@/services/axiosInstance";

import type { DashboardProfileResponse } from "./types";

export const getDashboardProfileStatus =
  async (): Promise<DashboardProfileResponse> => {
    const response =
      await axiosInstance.get<DashboardProfileResponse>("/seekers/profile");

    return response.data;
  };
