import {
  Table,
  ScrollArea,
  UnstyledButton,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { Pagination } from "./Pagination";
import { useEffect, useRef, useCallback } from "react";
import { STYLES } from "@/constants";
import {
  IconArrowsUpDown,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

export interface DataTableColumn<T = unknown> {
  key: string;
  title: string;
  sortable?: boolean; // default is false
  hideable?: boolean; // default is true
  render?: (item: T) => React.ReactNode;
  className?: string; // default is "whitespace-nowrap"
  align?: "start" | "center" | "end"; // default is "start"
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageConfig?: {
    page?: number;
    pageSize?: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  emptyMessage?: string;
  isLoading?: boolean;
  sortConfig?: {
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  };
  onLoadMore?: () => void;
  renderFilter?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  pageConfig,
  emptyMessage = "No data found",
  isLoading = false,
  sortConfig,
  onLoadMore,
  renderFilter,
}: Readonly<DataTableProps<T>>) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const { colorScheme } = useMantineColorScheme();

  const handleScroll = useCallback(() => {
    if (
      !onLoadMore ||
      isLoading ||
      !scrollAreaRef.current ||
      loadingMoreRef.current
    )
      return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const bottomReached = scrollHeight - scrollTop - clientHeight < 50;

    if (bottomReached) {
      loadingMoreRef.current = true;
      onLoadMore();

      setTimeout(() => {
        loadingMoreRef.current = false;
      }, 300);
    }
  }, [onLoadMore, isLoading]);

  useEffect(() => {
    const scrollElement = scrollAreaRef.current;
    if (onLoadMore && scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, onLoadMore]);

  const handleSort = (key: string) => {
    const sortKey = key.split(".");
    const formattedKey = sortKey.length > 1 ? sortKey[1] : sortKey[0];
    const newSortOrder =
      sortConfig?.sortBy === formattedKey && sortConfig.sortOrder === "asc"
        ? "desc"
        : "asc";

    if (sortConfig?.onSort) {
      sortConfig.onSort(formattedKey, newSortOrder);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string): any => {
    if (!obj || !path) return undefined;

    const parts = path.split(".");
    let current = obj;

    for (const part of parts) {
      // Handle array notation, e.g. p[2], stations[0]
      const arrayMatch = RegExp(/^([a-zA-Z0-9_$]+)\[(\d+)\]$/).exec(part);
      if (arrayMatch) {
        const [, arrayName, idx] = arrayMatch;
        if (
          !current[arrayName] ||
          !Array.isArray(current[arrayName]) ||
          Number(idx) >= current[arrayName].length
        ) {
          return undefined;
        }
        current = current[arrayName][Number(idx)];
      } else {
        if (current === undefined || current === null) return undefined;
        current = current[part];
      }
    }
    return current;
  };

  const totalColSpan = columns.length;

  const renderTableBody = () => {
    if (isLoading && data.length === 0) {
      return (
        <Table.Tr>
          <Table.Td colSpan={totalColSpan} align="center">
            Loading...
          </Table.Td>
        </Table.Tr>
      );
    }

    if (data.length === 0) {
      return (
        <Table.Tr>
          <Table.Td colSpan={totalColSpan} align="center">
            {emptyMessage}
          </Table.Td>
        </Table.Tr>
      );
    }

    return data.map((item, index) => (
      <Table.Tr key={index}>
        {columns.map((column, colIdx) => (
          <Table.Td
            key={`${index}-${column.key}`}
            className={column.className || "whitespace-nowrap"}
            style={{
              ...(colIdx === 0 && { paddingLeft: "32px" }),
              ...(colIdx === columns.length - 1 && {
                paddingRight: "32px",
              }),
              textAlign:
                column.align === "center"
                  ? "center"
                  : column.align === "end"
                    ? "right"
                    : "left",
            }}
          >
            {column.render
              ? column.render(item)
              : (getNestedValue(item, column.key) ?? "-")}
          </Table.Td>
        ))}
      </Table.Tr>
    ));
  };

  const renderSortIcon = (columnKey: string, sortable?: boolean) => {
    if (!sortable) return null;
    const sortKey = columnKey.split(".");
    const formattedKey = sortKey.length > 1 ? sortKey[1] : sortKey[0];

    if (sortConfig?.sortBy === formattedKey) {
      return sortConfig.sortOrder === "asc" ? (
        <IconChevronUp size={16} />
      ) : (
        <IconChevronDown size={16} />
      );
    }

    return <IconArrowsUpDown size={16} />;
  };

  return (
    <div
      className={`flex flex-col border ${STYLES.BORDER_COLOR} shadow-sm rounded-lg overflow-hidden h-full flex-grow`}
      style={{ backgroundColor: "var(--mantine-color-body)" }}
    >
      {renderFilter && (
        <div
          className={`p-4 border-b ${STYLES.BORDER_COLOR} flex gap-2 justify-between items-start`}
        >
          <div className="flex-1">{renderFilter}</div>
        </div>
      )}
      <ScrollArea className="flex-grow" viewportRef={scrollAreaRef}>
        <Table highlightOnHover stickyHeader>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th
                  key={column.key}
                  className={`text-slate-600 dark:text-slate-200 whitespace-nowrap`}
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? "var(--color-slate-800)"
                        : "var(--color-slate-100)",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingLeft: column === columns[0] ? "32px" : undefined,
                    paddingRight:
                      column === columns[columns.length - 1]
                        ? "32px"
                        : undefined,
                    textAlign:
                      column.align === "center"
                        ? "center"
                        : column.align === "end"
                          ? "right"
                          : "left",
                  }}
                >
                  {column.sortable ? (
                    <UnstyledButton
                      className={`flex items-center gap-1 w-full text-sm font-medium ${
                        column.align === "end"
                          ? "justify-end"
                          : column.align === "center"
                            ? "justify-center"
                            : "justify-start"
                      }`}
                      onClick={() => handleSort(column.key)}
                    >
                      <span className="text-sm font-semibold">
                        {column.title}
                      </span>
                      {renderSortIcon(column.key, column.sortable)}
                    </UnstyledButton>
                  ) : (
                    <span className="text-sm font-semibold">
                      {column.title}
                    </span>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {renderTableBody()}
            {isLoading && data.length > 0 && (
              <Table.Tr>
                <Table.Td colSpan={totalColSpan} align="center">
                  Loading more...
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {pageConfig &&
        !onLoadMore &&
        (() => {
          const page = pageConfig.page ?? 1;
          const pageSize = pageConfig.pageSize ?? 20;
          const totalItems = pageConfig.totalItems ?? data.length;
          const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
          const end = Math.min(page * pageSize, totalItems);

          return (
            <div
              className={`px-4 py-3 border-t ${STYLES.BORDER_COLOR} mt-auto flex items-center justify-between gap-4`}
            >
              <Text size="sm" visibleFrom="md" className="whitespace-nowrap">
                Showing {start}-{end} of {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </Text>
              <Pagination
                currentPage={page}
                totalPages={pageConfig.totalPages ?? 1}
                itemsPerPage={pageSize}
                onPageChange={pageConfig.onPageChange ?? (() => {})}
                onItemsPerPageChange={pageConfig.onPageSizeChange}
              />
            </div>
          );
        })()}
    </div>
  );
}
