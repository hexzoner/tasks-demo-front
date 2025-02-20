
import React, { FC } from 'react';
import { getTasksQuery } from '../../api/tasks';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel,
    PaginationState
} from '@tanstack/react-table'

import { Pagination } from '../../components/Tables';
import { Task } from '../../api/tasks';
import { formatDateShort, truncateText } from '../../utils/dateUtils';
import { Filter } from '../../components/Tables';

const centerScreenStyle = "flex justify-center items-center h-screen";

export const Page: FC = () => {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { data, isLoading, isError: isGetTasksError } = getTasksQuery(pagination);
    // const { isPending, submittedAt, variables, mutate, isError: isAddTaskError } = addTaskMutation();

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    if (isGetTasksError) return <div className={centerScreenStyle}>Error fetching tasks...</div>

    // useEffect(() => {
    //     if (data) {
    //         // console.log("setting tasks")
    //         // setTasks(data.docs)
    //         // console.log(data)
    //     }
    // }, [data])


    const columns = React.useMemo<ColumnDef<Task>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                cell: info => info.getValue(),
                header: () => <span>ID</span>,
                sortDescFirst: true, //first sort order will be descending
            },
            {
                accessorFn: row => row.title,
                id: 'title',
                cell: info => truncateText(info.getValue() as string, 150),
                header: () => <span>Title</span>,
                sortUndefined: 'last', //force undefined values to the end
                sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
            },
            {
                accessorFn: row => row.description,
                id: 'description',
                cell: info => truncateText(info.getValue() as string, 50),
                header: () => <span>Description</span>,
                sortUndefined: 'last', //force undefined values to the end
                sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
            },

            {
                accessorKey: 'dueDate',
                header: 'Due Date',
                cell: info => formatDateShort(info.getValue() as string),
                // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
            },
            {
                accessorKey: 'status',
                header: 'Status',
                // sortingFn: sortStatusFn, //use our custom sorting function for this enum column
                meta: {
                    filterVariant: 'select',
                }
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: info => formatDateShort(info.getValue() as string),
                // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
            },
        ],
        []
    )

    const table = useReactTable({
        columns,
        data: data?.docs ?? [],
        filterFns: {},
        debugTable: false,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), //client-side sorting
        onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
        // sortingFns: {
        //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
        // }, 
        state: {
            sorting,
            columnFilters,
            pagination
        },
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: data?.totalPages,
        rowCount: data?.limit,

        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
        // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
        // enableSorting: false, // - default on/true
        // enableSortingRemoval: false, //Don't allow - default on/true
        // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
        // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    })

    //access sorting state from the table instance
    // console.log(table.getState().sorting)

    return <div className='min-h-screen max-w-5xl mx-auto '>
        <p className='text-2xl text-center mt-8'>Dashboard</p>
        <div className='flex justify-center items-center gap-4 mt-2 text-lg'>
            {isLoading ? <p className=''>Loading tasks...</p> : <p className=''>Total Tasks: {data?.totalDocs}</p>}
        </div>
        <section className='mt-4 w-full '>
            <table className='w-full bg-[#18202f] text-gray-300 font-light'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className=''>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    className={header.column.getCanSort() ? 'cursor-pointer select-none py-2 px-4' : ''}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    title={header.column.getCanSort() ? header.column.getNextSortingOrder() === 'asc'
                                                        ? 'Sort ascending'
                                                        : header.column.getNextSortingOrder() === 'desc'
                                                            ? 'Sort descending'
                                                            : 'Clear sort'
                                                        : undefined
                                                    }>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td className='p-3 text-center' key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className='mt-3 mb-12'>
                <Pagination table={table} />
            </div>

            {/* <div className='mt-8'>{table.getRowModel().rows.length.toLocaleString()} Rows</div> */}
        </section>
    </div>
};

export default Page;






