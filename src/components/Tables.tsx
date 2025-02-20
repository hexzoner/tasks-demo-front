import { Column, Table } from '@tanstack/react-table'
import { Task } from '../api/tasks';
import React from 'react'

interface ColumnMeta {
    filterVariant?: 'range' | 'select' | 'text';
}

export function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = (column.columnDef.meta as ColumnMeta) ?? {};

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded-none"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded rounded-none"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            {/* See faceted column filters example for dynamic select options */}
            <option value="">All</option>
            <option value="complicated">complicated</option>
            <option value="relationship">relationship</option>
            <option value="single">single</option>
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border border-gray-700 border-opacity-25 border-solid shadow px-2 py-1 text-sm font-light"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
        // See faceted column filters example for datalist search suggestions
    )
}

const buttonStyle = 'border rounded p-1 cursor-pointer'
export function Pagination({ table }: { table: Table<Task> }) {
    return <div className="flex items-center gap-2 justify-center">
        <button
            className={buttonStyle}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
        >
            {'<<'}
        </button>
        <button
            className={buttonStyle}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            {'<'}
        </button>
        <button
            className={buttonStyle}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            {'>'}
        </button>
        <button
            className={buttonStyle}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
        >
            {'>>'}
        </button>
        <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
            </strong>
        </span>
        <span className="flex items-center gap-1">
            | Go to page:
            <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                }}
                className="border p-1 rounded w-16"
            />
        </span>
        <select className='bg-[#18202f] p-2 cursor-pointer'
            value={table.getState().pagination.pageSize}
            onChange={e => {
                table.setPageSize(Number(e.target.value))
            }}
        >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                </option>
            ))}
        </select>
    </div>
}


// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}