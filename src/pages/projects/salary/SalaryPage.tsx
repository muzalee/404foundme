import { useEffect, useState } from "react";
import { useLoading, useNotification } from "@/hooks";
import { ActionIcon, Menu, TextInput, Title } from "@mantine/core";
import { salaryService } from "@/services/salary.service";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import type { GetSalariesQuery, Salary } from "@/types";
import { CONSTANTS, ROUTES } from "@/constants";
import {
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconSearch,
} from "@tabler/icons-react";
import { PayslipDownloadModal } from "./components/PayslipDownloadModal";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router";

export default function SalaryPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [filter, setFilter] = useState<GetSalariesQuery>({
    page: 1,
    pageSize: CONSTANTS.DEFAULT_PAGE_SIZE,
    search: undefined as string | undefined,
    sortBy: "name",
    sortOrder: "asc" as "asc" | "desc",
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { isLoading, startLoading, stopLoading } = useLoading();
  const { showError } = useNotification();
  const navigate = useNavigate();

  const fetchSalaries = async () => {
    startLoading();
    await salaryService
      .getSalaries(filter)
      .then((response) => {
        setSalaries(response.data ?? []);
        setTotalPages(response.meta?.totalPages ?? 1);
        setTotalItems(response.meta?.total ?? 0);
      })
      .catch((error) => {
        showError({
          message: error.message,
        });
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    fetchSalaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setFilter((prev) => ({
        ...prev,
        search: event.currentTarget.value.trim(),
      }));
    }
  };

  const handleSort = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilter((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
    }));
  };

  const handleDownload = (salary: Salary) => {
    modals.open({
      title: "Download Payslip",
      size: "sm",
      centered: true,
      children: (
        <PayslipDownloadModal
          salary={salary}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      ),
    });
  };

  const columns: DataTableColumn<Salary>[] = [
    { key: "no", title: "No.", className: "pl-20" },
    {
      key: "name",
      title: "Name",
      className: "max-w-[300px] break-words",
      sortable: true,
    },
    { key: "icNumber", title: "IC Number" },
    { key: "jobTitle", title: "Job Title" },
    {
      key: "basicSalary",
      title: "Basic Salary",
      sortable: true,
      render: (salary) => `RM ${salary.basicSalary.toFixed(2)}`,
    },
    {
      key: "epfRate",
      title: "EPF Rate",
      render: (salary) => `${salary.epfRate}%`,
    },
    {
      key: "taxAmount",
      title: "Tax Amount",
      render: (salary) => `RM ${salary.taxAmount.toFixed(2)}`,
    },
    {
      key: "totalAllowances",
      title: "Total Allowances",
      render: (salary) =>
        `RM ${salary.allowances.reduce((sum, a) => sum + a.amount, 0).toFixed(2)}`,
    },
    {
      key: "actions",
      title: "Action",
      align: "end",
      render: (functionItem: Salary) => (
        <Menu shadow="md" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate(ROUTES.SALARY_EDIT(functionItem.id))}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={16} />}
              onClick={() => handleDownload(functionItem)}
            >
              Download Payslip
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Title order={3}>Salary Management</Title>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <DataTable
          data={salaries.map((s, index) => ({
            ...s,
            no: index + 1 + (filter.page - 1) * filter.pageSize,
          }))}
          columns={columns}
          pageConfig={{
            page: filter.page,
            pageSize: filter.pageSize,
            totalPages,
            totalItems,
            onPageChange: (page) => setFilter((prev) => ({ ...prev, page })),
            onPageSizeChange: (pageSize) =>
              setFilter((prev) => ({ ...prev, pageSize })),
          }}
          isLoading={isLoading}
          sortConfig={{
            sortBy: filter.sortBy || "",
            sortOrder: filter.sortOrder || "asc",
            onSort: handleSort,
          }}
          renderFilter={
            <div className="flex justify-start">
              <TextInput
                placeholder="Search..."
                rightSection={<IconSearch size={18} />}
                onKeyDown={handleSearch}
                className="w-full sm:w-[250px]"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}
