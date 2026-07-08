import DoctorFilters from "@/src/components/modules/Admin/DoctorManagement/DoctorFilters";
import DoctorsManagementHeader from "@/src/components/modules/Admin/DoctorManagement/DoctorsManagementHeader";
import DoctorsTable from "@/src/components/modules/Admin/DoctorManagement/DoctorsTable";
import TablePagination from "@/src/components/shared/TablePagination";
import HeartbeatLoader from "@/src/components/shared/HearbeatLoader";
import { queryStringFormatter } from "@/src/lib/formatters";
import { getDoctors } from "@/src/services/admin/doctorManagement";
import { getSpecialities } from "@/src/services/admin/specialitiesManagement";
import { Suspense } from "react";

const AdminDoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj); // {searchTerm: "John", speciality: "Cardiology" => "?searchTerm=John&speciality=Cardiology"}
  const specialitiesResult = await getSpecialities();
  const doctorsResult = await getDoctors(queryString);
  console.log({ doctorsResult });
  const totalPages = Math.ceil(
    (doctorsResult?.meta?.total || 1) / (doctorsResult?.meta?.limit || 1)
  );
  return (
    <div className="space-y-6">
      <DoctorsManagementHeader specialities={specialitiesResult?.data || []} />
      <DoctorFilters specialties={specialitiesResult?.data || []} />
      <Suspense fallback={<HeartbeatLoader size="md" text="Loading Doctors Table..." />}>
        <DoctorsTable
          doctors={doctorsResult.data}
          specialities={specialitiesResult?.data || []}
        />
        <TablePagination
          currentPage={doctorsResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminDoctorsManagementPage;