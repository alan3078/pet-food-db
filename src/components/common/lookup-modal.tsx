'use client';

import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PaginationControl } from '@/components/common/pagination-control';
import { useEffect, useMemo, useState } from 'react';

export interface LookupItem {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LookupColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface LookupModalProps<T extends LookupItem> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: T[];
  columns: LookupColumn<T>[];
  onSelect: (item: T) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  selectedId?: string | number;
  emptyMessage?: string;
}

export function LookupModal<T extends LookupItem>({
  open,
  onOpenChange,
  title,
  items,
  columns,
  onSelect,
  isLoading = false,
  searchPlaceholder = 'Search...',
  selectedId,
  emptyMessage = 'No results found.',
}: LookupModalProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedId, setTempSelectedId] = useState<string | number | undefined>(selectedId);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset temp selection when modal opens or selectedId changes
  useEffect(() => {
    if (open) {
      setTempSelectedId(selectedId);
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [open, selectedId]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter((item) => {
      // Basic search across all string properties
      return Object.values(item).some(
        (val) => typeof val === 'string' && val.toLowerCase().includes(lowerQuery),
      );
    });
  }, [items, searchQuery]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleConfirm = () => {
    if (tempSelectedId !== undefined) {
      const selectedItem = items.find((item) => item.id === tempSelectedId);
      if (selectedItem) {
        onSelect(selectedItem);
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh]'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='p-4 border-b bg-slate-50'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9 bg-white'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto min-h-[300px]'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-full py-12 text-muted-foreground'>
              <Loader2 className='h-8 w-8 animate-spin mb-2' />
              <p>Loading...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full py-12 text-muted-foreground'>
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <Table>
              <TableHeader className='bg-slate-50 sticky top-0 z-10'>
                <TableRow>
                  <TableHead className='w-[50px]'></TableHead>
                  {columns.map((col, index) => (
                    <TableHead
                      key={index}
                      className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className='cursor-pointer hover:bg-slate-50'
                    onClick={() => setTempSelectedId(item.id)}>
                    <TableCell className='w-[50px]'>
                      <div className='flex items-center justify-center'>
                        <div
                          className={cn(
                            'h-4 w-4 rounded-full border border-primary ring-offset-background',
                            item.id === tempSelectedId
                              ? 'bg-primary text-primary-foreground'
                              : 'border-slate-400',
                          )}>
                          {item.id === tempSelectedId && (
                            <div className='flex items-center justify-center h-full w-full'>
                              <div className='h-2 w-2 rounded-full bg-white' />
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {columns.map((col, index) => (
                      <TableCell
                        key={index}
                        className={col.className}>
                        {col.cell ? col.cell(item) : col.accessorKey ? item[col.accessorKey] : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className='py-2 border-t bg-slate-50'>
          <PaginationControl
            currentPage={currentPage}
            totalPages={Math.ceil(filteredItems.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            totalItems={filteredItems.length}
          />
        </div>

        <DialogFooter className='p-4 border-t bg-slate-50'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={tempSelectedId === undefined}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
