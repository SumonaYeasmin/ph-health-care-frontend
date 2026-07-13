"use server"

import { serverFetch } from "@/src/lib/serverFetch";

export async function createSchedulesAction(_prevState: any, formData: FormData) {
  try {
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    if (!startDate || !endDate || !startTime || !endTime) {
      return {
        success: false,
        message: "All fields are required"
      };
    }

    const payload = {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      startTime,
      endTime
    };

    const response = await serverFetch.post("/schedule", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || `Request failed with status ${response.status}`
      };
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("createSchedulesAction error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function getAllSchedules(queryString: string = "") {
  try {
    const response = await serverFetch.get(`/schedule${queryString ? `?${queryString}` : ""}`);
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || `Request failed with status ${response.status}`,
        data: []
      };
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("getAllSchedules error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
      data: []
    };
  }
}

export async function deleteSchedule(id: string) {
  try {
    const response = await serverFetch.delete(`/schedule/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || `Request failed with status ${response.status}`
      };
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("deleteSchedule error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}
