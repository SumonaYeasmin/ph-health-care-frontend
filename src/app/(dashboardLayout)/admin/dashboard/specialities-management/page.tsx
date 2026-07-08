
import SpecialitiesManagementHeader from "@/src/components/modules/Admin/SpecialitiesManagement/SpecialitiesManagementHeader";
import SpecialitiesTable from "@/src/components/modules/Admin/SpecialitiesManagement/SpecialitiesTable";
import RefreshButton from "@/src/components/shared/RefreshButton";
import { TableSkeleton } from "@/src/components/shared/TableSkeleton";
import { getSpecialities } from "@/src/services/admin/specialitiesManagement";
import { Suspense } from "react";

const AdminSpecialitiesManagementPage = async () => {
  const result = await getSpecialities();
  return (
    <div className="space-y-6">
      <SpecialitiesManagementHeader />
    <RefreshButton/>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <SpecialitiesTable specialities={result.data} />
      </Suspense>
    </div>
  );
};

export default AdminSpecialitiesManagementPage;