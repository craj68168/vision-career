"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTrainingCategory,
  createTrainingTopic,
  deleteTrainingCategory,
  deleteTrainingFile,
  deleteTrainingTopic,
  getTrainingCategories,
  getTrainingTopics,
  updateTrainingCategory,
  updateTrainingTopic,
  uploadTrainingFile,
} from "./api";

import type {
  GetTrainingCategoriesParams,
  GetTrainingTopicsParams,
} from "./types";

// ======================================================
// QUERY KEYS
// ======================================================

export const trainingQueryKeys = {
  all: ["training"] as const,

  categories: ["training", "categories"] as const,

  categoriesList: (params: GetTrainingCategoriesParams = {}) =>
    ["training", "categories", "list", params] as const,

  topics: ["training", "topics"] as const,

  topicsList: (params: GetTrainingTopicsParams = {}) =>
    ["training", "topics", "list", params] as const,

  topicDetails: (topicId: string) =>
    ["training", "topics", "details", topicId] as const,
};

// ======================================================
// CATEGORIES QUERY
// ======================================================

export function useTrainingCategories(
  params: GetTrainingCategoriesParams = {},
) {
  return useQuery({
    queryKey: trainingQueryKeys.categoriesList(params),

    queryFn: () => getTrainingCategories(params),

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
}

// ======================================================
// TOPICS QUERY
// ======================================================

export function useTrainingTopics(params: GetTrainingTopicsParams) {
  return useQuery({
    queryKey: trainingQueryKeys.topicsList(params),

    queryFn: () => getTrainingTopics(params),

    enabled: Boolean(params.category_id),

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
}

// ======================================================
// CREATE CATEGORY
// ======================================================

export function useCreateTrainingCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrainingCategory,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.categories,
      });
    },
  });
}

// ======================================================
// UPDATE CATEGORY
// ======================================================

export function useUpdateTrainingCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrainingCategory,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}

// ======================================================
// DELETE CATEGORY
// ======================================================

export function useDeleteTrainingCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrainingCategory,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}

// ======================================================
// CREATE TOPIC
// ======================================================

export function useCreateTrainingTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrainingTopic,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}

// ======================================================
// UPDATE TOPIC
// ======================================================

export function useUpdateTrainingTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrainingTopic,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}

// ======================================================
// DELETE TOPIC
// ======================================================

export function useDeleteTrainingTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrainingTopic,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}

// ======================================================
// UPLOAD FILE
// ======================================================

export function useUploadTrainingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadTrainingFile,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}

// ======================================================
// DELETE FILE
// ======================================================

export function useDeleteTrainingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrainingFile,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.categories,
        }),

        queryClient.invalidateQueries({
          queryKey: trainingQueryKeys.topics,
        }),
      ]);
    },
  });
}
