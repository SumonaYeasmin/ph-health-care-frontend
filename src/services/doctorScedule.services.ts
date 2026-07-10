"use server"

import { serverFetch } from "@/src/lib/serverFetch";

// Available schedules (which are not booked by the doctor yet) are fetched from GET /schedule
export async function getAvailableSchedules() {
  try {
    const response = await serverFetch.get("/schedule");

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || `Request failed with status ${response.status}`,
        data: []
      };
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      return result;
    } else {
      const text = await response.text();
      return {
        success: false,
        message: text || "Invalid response format from server",
        data: []
      };
    }
  } catch (error: any) {
    console.error("getAvailableSchedules error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
      data: []
    };
  }
}

// Doctor books selected schedules by POST /doctor-schedule
export async function createDoctorSchedule(scheduleIds: string[]) {
  try {
    const response = await serverFetch.post("/doctor-schedule", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scheduleIds }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || `Request failed with status ${response.status}`
      };
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      return result;
    } else {
      const text = await response.text();
      return {
        success: false,
        message: text || "Invalid response format from server"
      };
    }
  } catch (error: any) {
    console.error("createDoctorSchedule error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}
