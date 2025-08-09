import { Select, Text, ActionIcon, TextInput } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems?: number;
  totalPages?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const ENTRIES_OPTIONS = [50, 100, 200];

export function Pagination({
  currentPage,
  totalItems,
  totalPages: externalTotalPages,
  itemsPerPage = 20,
  onPageChange,
  onItemsPerPageChange,
}: Readonly<PaginationProps>) {
  const totalPages = externalTotalPages
    ? Math.max(1, externalTotalPages)
    : Math.max(1, Math.ceil((totalItems ?? 0) / itemsPerPage));

  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    if (clamped !== currentPage) {
      onPageChange(clamped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsed = parseInt(inputPage, 10);
      if (!isNaN(parsed)) {
        const clamped = Math.max(1, Math.min(parsed, totalPages));
        goToPage(clamped);
        setInputPage(clamped.toString());
      } else {
        setInputPage(currentPage.toString());
      }
    } else if (e.key === "Escape") {
      setInputPage(currentPage.toString());
    }
  };

  return (
    <div className="flex flex-wrap justify-end items-end gap-4 text-sm w-full">
      {/* Items per Page */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <Text size="sm" className="text-gray-600">
            Entries per Page
          </Text>
          <Select
            data={ENTRIES_OPTIONS.map((num) => ({
              label: num.toString(),
              value: num.toString(),
            }))}
            value={itemsPerPage.toString()}
            onChange={(val) =>
              onItemsPerPageChange?.(
                parseInt(val ?? itemsPerPage.toString(), 10)
              )
            }
            size="xs"
            comboboxProps={{ width: "96px" }}
            className="w-16"
          />
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <ActionIcon
          variant="default"
          disabled={currentPage === 1}
          onClick={() => goToPage(1)}
        >
          <IconChevronsLeft size={16} />
        </ActionIcon>

        <ActionIcon
          variant="default"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          <IconChevronLeft size={16} />
        </ActionIcon>

        {/* Editable Page Number */}
        <TextInput
          size="xs"
          value={inputPage}
          onChange={(e) => {
            const val = e.currentTarget.value.replace(/\D/g, "");
            setInputPage(val);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setInputPage(currentPage.toString());
          }}
          styles={{
            input: {
              textAlign: "center",
              width: "48px",
              paddingLeft: "4px",
              paddingRight: "4px",
            },
          }}
        />

        <ActionIcon
          variant="default"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          <IconChevronRight size={16} />
        </ActionIcon>

        <ActionIcon
          variant="default"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(totalPages)}
        >
          <IconChevronsRight size={16} />
        </ActionIcon>

        {/* Total Pages */}
        <Text size="sm" className="text-gray-600">
          of {totalPages} pages
        </Text>
      </div>
    </div>
  );
}
