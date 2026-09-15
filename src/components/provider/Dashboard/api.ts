import axiosInstance from "@/services/axiosInstance";

import type {
  CreatePlacementRequestPayload,
  CreateVacancyPayload,
  DeleteVacancyResponse,
  ItemResponse,
  ListResponse,
  PlacementRequest,
  Vacancy,
} from "./types";

const PROVIDER_ROUTES = {
  vacancies: "/providers/vacancies",
  placementRequests: "/providers/recruits",
};

// ======================================================
// VACANCIES
// ======================================================

export const getProviderVacancies = async (): Promise<
  ListResponse<Vacancy>
> => {
  const response = await axiosInstance.get<ListResponse<Vacancy>>(
    PROVIDER_ROUTES.vacancies,
  );

  return response.data;
};

export const createProviderVacancy = async (
  payload: CreateVacancyPayload,
): Promise<ItemResponse<Vacancy>> => {
  const response = await axiosInstance.post<ItemResponse<Vacancy>>(
    PROVIDER_ROUTES.vacancies,
    payload,
  );

  return response.data;
};

export const getProviderVacancyById = async (
  vacancyId: string,
): Promise<ItemResponse<Vacancy>> => {
  const response = await axiosInstance.get<ItemResponse<Vacancy>>(
    `${PROVIDER_ROUTES.vacancies}/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// PLACEMENT REQUESTS
// ======================================================

export const getProviderPlacementRequests = async (): Promise<
  ListResponse<PlacementRequest>
> => {
  const response = await axiosInstance.get<
    ListResponse<PlacementRequest> | PlacementRequest[]
  >(PROVIDER_ROUTES.placementRequests);

  if (Array.isArray(response.data)) {
    return {
      status: "success",
      count: response.data.length,
      data: response.data,
    };
  }

  return response.data;
};

export const createProviderPlacementRequest = async (
  payload: CreatePlacementRequestPayload,
): Promise<ItemResponse<PlacementRequest>> => {
  const response = await axiosInstance.post<
    ItemResponse<PlacementRequest> | PlacementRequest
  >(PROVIDER_ROUTES.placementRequests, payload);

  const data = response.data;

  if ("data" in data && data.data) {
    return data as ItemResponse<PlacementRequest>;
  }

  return {
    status: "success",
    message: "Placement request created successfully.",
    data: data as PlacementRequest,
  };
};

export const updateProviderVacancy = async (
  vacancyId: string,
  payload: CreateVacancyPayload,
): Promise<ItemResponse<Vacancy>> => {
  const response = await axiosInstance.put<ItemResponse<Vacancy>>(
    `/providers/vacancies/${vacancyId}`,
    payload,
  );

  return response.data;
};

export const deleteProviderVacancy = async (
  vacancyId: string,
): Promise<DeleteVacancyResponse> => {
  const response = await axiosInstance.delete<DeleteVacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

export const closeProviderVacancy = async (
  vacancyId: string,
): Promise<ItemResponse<Vacancy>> => {
  const response = await axiosInstance.put<ItemResponse<Vacancy>>(
    `/providers/vacancies/close/${vacancyId}`,
  );

  return response.data;
};
