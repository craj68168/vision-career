import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://vision-career.co.jp";

export type PlacementRequestStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "recruiting"
  | "interviewing"
  | "filled"
  | "cancelled"
  | "closed";

export type UpdatePlacementRequestStatusPayload = {
  request_id: number;
  request_status: PlacementRequestStatus;
  admin_note?: string;
  rejection_reason?: string;
  assigned_staff_id?: number;
};

export type UpdatePlacementRequestStatusResponse = {
  status: "success" | "error";
  message: string;
  placement_request?: any;
  updated_by?: {
    id: number | null;
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

async function updatePlacementRequestStatus(
  token: string,
  payload: UpdatePlacementRequestStatusPayload,
): Promise<UpdatePlacementRequestStatusResponse> {
  const response = await fetch(
    `${API_BASE_URL}/admin-update-placement-request-status.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(
      data?.message || "Failed to update placement request status",
    );
  }

  return data;
}

export function useUpdatePlacementRequestStatus(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePlacementRequestStatusPayload) => {
      if (!token) {
        throw new Error("Admin token is missing");
      }

      return updatePlacementRequestStatus(token, payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-placement-requests"],
      });
    },
  });
}
