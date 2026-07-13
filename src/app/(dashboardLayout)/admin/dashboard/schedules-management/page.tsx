import SchedulesManagementHeader from "@/src/components/modules/Admin/SchedulesManagement/SchedulesManagementHeader";
import SchedulesTable from "@/src/components/modules/Admin/SchedulesManagement/SchedulesTable";
import RefreshButton from "@/src/components/shared/RefreshButton";
import { TableSkeleton } from "@/src/components/shared/TableSkeleton";
import { getAllSchedules } from "@/src/services/admin/scheduleManagement";
import { Suspense } from "react";

const AdminSchedulesManagementPage = async () => {
  const result = await getAllSchedules();
  const schedules = result?.data || [];

  return (
    <div className="space-y-6">
      <SchedulesManagementHeader />
      <RefreshButton />
      <Suspense fallback={<TableSkeleton columns={3} rows={10} />}>
        <SchedulesTable schedules={schedules} />
      </Suspense>
    </div>
  );
};

export default AdminSchedulesManagementPage;
