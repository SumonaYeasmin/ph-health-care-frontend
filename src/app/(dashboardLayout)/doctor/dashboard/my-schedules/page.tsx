import MySchedulesFilters from "@/src/components/modules/Doctor/MySchedules/MyScheduleFilters";
import MySchedulesHeader from "@/src/components/modules/Doctor/MySchedules/MyScheduleHeader";
import MySchedulesTable from "@/src/components/modules/Doctor/MySchedules/MyScheduleTable";
import TablePagination from "@/src/components/shared/TablePagination";
import { TableSkeleton } from "@/src/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/src/lib/formatters";
import {
  getAvailableSchedules,
  getDoctorOwnSchedules,
} from "@/src/services/doctorScedule.services";
import { Suspense } from "react";

interface DoctorMySchedulesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    isBooked?: string;
  }>;
}

const DoctorMySchedulesPage = async ({
  searchParams,
}: DoctorMySchedulesPageProps) => {
  const params = await searchParams;

  const queryString = queryStringFormatter(params);
  const myDoctorsScheduleResponse = await getDoctorOwnSchedules(queryString);
  const availableSchedulesResponse = await getAvailableSchedules();

  const schedules = myDoctorsScheduleResponse?.data?.data || [];
  const meta = myDoctorsScheduleResponse?.data?.meta;
  const totalPages = Math.ceil((meta?.total || 1) / (meta?.limit || 10));

  return (
    <div className="space-y-6 p-6">
      <MySchedulesHeader
        availableSchedules={availableSchedulesResponse?.data || []}
      />

      <MySchedulesFilters />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <MySchedulesTable schedules={schedules} />
        <TablePagination
          currentPage={meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default DoctorMySchedulesPage;
