"use server"

import { serverFetch } from "@/src/lib/serverFetch";

// Get doctor's own booked/added schedules with query filters (GET /doctor-schedule/my-schedule)
export async function getDoctorOwnSchedules(queryString: string = "") {
  try {
    const response = await serverFetch.get(`/doctor-schedule/my-schedule${queryString ? `?${queryString}` : ""}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || `Request failed with status ${response.status}`,
        data: [],
        meta: { total: 0, limit: 10, page: 1 }
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
        data: [],
        meta: { total: 0, limit: 10, page: 1 }
      };
    }
  } catch (error: any) {
    console.error("getDoctorOwnSchedules error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
      data: [],
      meta: { total: 0, limit: 10, page: 1 }
    };
  }
}

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

// Doctor deletes (cancels) a booked/added schedule by DELETE /doctor-schedule/:id
export async function deleteDoctorOwnSchedule(scheduleId: string) {
  try {
    const response = await serverFetch.delete(`/doctor-schedule/${scheduleId}`);

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
    console.error("deleteDoctorOwnSchedule error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}
