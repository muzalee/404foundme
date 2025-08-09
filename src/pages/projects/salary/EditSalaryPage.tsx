import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  Text,
  TextInput,
  NumberInput,
  Title,
  Group,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLoading, useNotification } from "@/hooks";
import { salaryService } from "@/services/salary.service";
import { ROUTES } from "@/constants";
import type { UpdateSalaryRequest } from "@/types";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function EditSalaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { showSuccess, showError } = useNotification();

  const form = useForm<UpdateSalaryRequest>({
    initialValues: {
      name: "",
      icNumber: "",
      jobTitle: "",
      basicSalary: 0,
      epfRate: 11,
      taxAmount: 0,
      allowances: [],
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      icNumber: (value) => (!value ? "IC Number is required" : null),
      jobTitle: (value) => (!value ? "Job Title is required" : null),
      basicSalary: (value) =>
        (value ?? 0) <= 0 ? "Basic Salary must be greater than 0" : null,
      epfRate: (value) =>
        (value ?? 0) < 0 || (value ?? 0) > 100
          ? "EPF Rate must be between 0 and 100"
          : null,
    },
  });

  useEffect(() => {
    const fetchSalary = async () => {
      if (!id) return;

      startLoading();
      salaryService
        .getSalaryById(id)
        .then((response) => {
          form.setValues(response.data!);
        })
        .catch((error) => {
          showError({
            message: error,
          });
        })
        .finally(() => {
          stopLoading();
        });
    };

    fetchSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values: UpdateSalaryRequest) => {
    if (!id) return;

    try {
      startLoading();
      await salaryService.updateSalary(id, values);
      showSuccess({ message: "Salary updated successfully" });
      navigate(ROUTES.SALARY);
    } catch (error) {
      showError({
        message:
          error instanceof Error ? error.message : "Failed to update salary",
      });
    } finally {
      stopLoading();
    }
  };

  const handleAddAllowance = () => {
    const currentAllowances = form.values.allowances || [];
    form.setFieldValue("allowances", [
      ...currentAllowances,
      { name: "", amount: 0 },
    ]);
  };

  const handleRemoveAllowance = (index: number) => {
    const currentAllowances = [...(form.values.allowances || [])];
    currentAllowances.splice(index, 1);
    form.setFieldValue("allowances", currentAllowances);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title order={3}>Edit Salary</Title>
      </div>

      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            className="flex-1"
            label="Name"
            placeholder="Enter name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            className="flex-1"
            label="IC Number"
            placeholder="Enter IC number"
            required
            {...form.getInputProps("icNumber")}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            className="flex-1"
            label="Job Title"
            placeholder="Enter job title"
            required
            {...form.getInputProps("jobTitle")}
          />
          <NumberInput
            className="flex-1"
            label="Basic Salary"
            placeholder="Enter basic salary"
            required
            min={0}
            {...form.getInputProps("basicSalary")}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <NumberInput
            className="flex-1"
            label="EPF Rate (%)"
            placeholder="Enter EPF rate"
            required
            min={0}
            max={100}
            {...form.getInputProps("epfRate")}
          />
          <NumberInput
            className="flex-1"
            label="Tax Amount"
            placeholder="Enter tax amount"
            required
            min={0}
            {...form.getInputProps("taxAmount")}
          />
        </div>

        <Stack mt="xl">
          <div className="flex justify-between items-center">
            <Text fw={500}>Allowances</Text>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="light"
              onClick={handleAddAllowance}
              type="button"
            >
              Add Allowance
            </Button>
          </div>

          {form.values.allowances?.map((_, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 ">
              <div className="flex items-center">
                <Text>{index + 1}.</Text>
              </div>
              <TextInput
                className="flex-1"
                label="Allowance Name"
                placeholder="Enter allowance name"
                required
                {...form.getInputProps(`allowances.${index}.name`)}
              />
              <NumberInput
                className="flex-1"
                label="Amount"
                placeholder="Enter amount"
                required
                min={0}
                {...form.getInputProps(`allowances.${index}.amount`)}
              />
              <div className="flex sm:items-end justify-end sm:justify-start">
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleRemoveAllowance(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </div>
            </div>
          ))}
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() => navigate(ROUTES.SALARY)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Update
          </Button>
        </Group>
      </form>
    </div>
  );
}
