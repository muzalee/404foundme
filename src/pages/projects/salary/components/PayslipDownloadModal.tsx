import { Button, Group, Box } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { salaryService } from "@/services/salary.service";
import { useNotification } from "@/hooks";
import type { Salary } from "@/types";

interface PayslipDownloadModalProps {
  salary: Salary;
  startLoading: () => void;
  stopLoading: () => void;
}

interface PayslipDownloadFormData {
  month: Date;
}

export function PayslipDownloadModal({
  salary,
  startLoading,
  stopLoading,
}: Readonly<PayslipDownloadModalProps>) {
  const { showError } = useNotification();

  const form = useForm<PayslipDownloadFormData>({
    initialValues: {
      month: new Date(),
    },
    validate: {
      month: (value) => (!value ? "Month is required" : null),
    },
  });

  const handleSubmit = async (values: PayslipDownloadFormData) => {
    try {
      startLoading();
      const date = new Date(values.month);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      await salaryService.downloadPayslip(salary.id, monthStr, salary.name);
      modals.closeAll();
    } catch (error) {
      showError({
        message:
          error instanceof Error ? error.message : "Failed to download payslip",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <Box className="px-4 py-2">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="space-y-4">
          <MonthPickerInput
            label="Select Month"
            placeholder="Pick a month"
            maxDate={new Date()}
            required
            {...form.getInputProps("month")}
          />
        </div>

        <Group justify="end" mt="xl">
          <Button variant="default" onClick={() => modals.closeAll()}>
            Cancel
          </Button>
          <Button type="submit">Download</Button>
        </Group>
      </form>
    </Box>
  );
}
