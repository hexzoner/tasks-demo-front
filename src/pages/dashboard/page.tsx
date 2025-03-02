
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
    PaginationState,
    FilterFn
} from '@tanstack/react-table'

import { Pagination } from '../../components/Tables';
import { Task, TaskStatus } from '../../api/tasks';
import { formatDateShort, truncateText } from '../../utils/dateUtils';
import { Filter } from '../../components/Tables';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { centerScreenStyle, mainColorBg } from '../../styles/styles';
import { useAuth } from '../../context';
import LoadingSpinner from '../../components/LoadingSpinner';
// import { useMutationState } from '@tanstack/react-query';
// import { NewTask } from '../../api/tasks';


export const Page: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Get initial state from URL
    const initialSorting: SortingState = searchParams.get('sort')
        ? [{ id: searchParams.get('sort')!, desc: searchParams.get('order') === 'desc' }]
        : [];

    const initialFilters: ColumnFiltersState = searchParams.getAll('filter').map(f => {
        const [id, value] = f.split(':');
        return { id, value };
    });

    const initialPagination: PaginationState = {
        pageIndex: Number(searchParams.get('page') ?? 1) - 1,
        pageSize: Number(searchParams.get('limit') ?? 10),
    };

    const [pagination, setPagination] = React.useState<PaginationState>(initialPagination)

    const { data, isLoading, isError: isGetTasksError } = getTasksQuery(pagination, user.id);

    if (isGetTasksError) return <div className={centerScreenStyle}>Error fetching tasks...</div>

    const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFilters)

    React.useEffect(() => {
        const params = new URLSearchParams();

        if (sorting.length) {
            params.set('sort', sorting[0].id);
            params.set('order', sorting[0].desc ? 'desc' : 'asc');
        }

        columnFilters.forEach(filter => {
            if (filter.value) {
                params.append('filter', `${filter.id}:${filter.value}`);
            }
        });

        params.set('page', (pagination.pageIndex + 1).toString());
        params.set('limit', pagination.pageSize.toString());

        navigate({ search: params.toString() }, { replace: true });

    }, [sorting, columnFilters, pagination, navigate]);

    // React.useEffect(() => {
    //     if (data) console.log(data)
    // }, [data])

    const filterByFormattedDate: FilterFn<Task> = (row, columnId, filterValue) => {
        const formattedDate = formatDateShort(row.getValue(columnId));
        return formattedDate.includes(filterValue);
    };

    const columns = React.useMemo<ColumnDef<Task>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                cell: info => info.getValue(),
                header: () => <span>ID</span>,
                sortDescFirst: true, //first sort order will be descending
                filterFn: 'includesString', // Ensures string filtering even if ID is a number
            },
            {
                accessorFn: row => row.title,
                id: 'title',
                cell: info => truncateText(info.getValue() as string, 100),
                header: () => <span>Title</span>,
                sortUndefined: 'last', //force undefined values to the end
                sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
            },
            {
                accessorKey: 'createdBy',
                header: 'Created By',
                cell: info => {
                    const user = info.row.original.createdBy; // Get full User object from the row data
                    if (!user) return 'Unknown';
                    return `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''} ${user.firstName || user.lastName ? `(${user.email})` : user.email}`
                },
                filterFn: 'includesString',
                accessorFn: row => `${row.createdBy.firstName} ${row.createdBy.lastName} (${row.createdBy.email})`.trim(), //convert user object to string for filtering
            },
            {
                accessorKey: 'assignee',
                header: 'Assignee',
                cell: info => {
                    const user = info.row.original.assignee; // Get full User object from the row data
                    return `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''} ${user.firstName || user.lastName ? `(${user.email})` : user.email}`
                },
                filterFn: 'includesString',
                accessorFn: row => `${row.assignee.firstName} ${row.assignee.lastName} (${row.assignee.email})`.trim(), //convert user object to string for filtering
            },
            {
                accessorKey: 'status',
                header: 'Status',
                // sortingFn: sortStatusFn, //use our custom sorting function for this enum column
                meta: {
                    filterVariant: 'select',
                },
                //convert enum to string for display
                cell: info => TaskStatus[info.getValue() as keyof typeof TaskStatus],
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: info => formatDateShort(info.row.original.createdAt),
                sortingFn: 'datetime',
                accessorFn: row => row.dueDate,
                filterFn: filterByFormattedDate
            },
            {
                accessorKey: 'dueDate',
                header: 'Due Date',
                cell: info => formatDateShort(info.row.original.dueDate),
                sortingFn: 'datetime', //make sure table knows this is a datetime column (usually can detect if no null values)
                accessorFn: row => row.dueDate,
                filterFn: filterByFormattedDate,
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

    // access variables somewhere else
    // const variables = useMutationState<NewTask>({
    //     filters: { mutationKey: ['addTask'], status: 'pending' },
    //     select: (mutation) => mutation.state.variables as NewTask,
    // })
    // console.log(variables)

    if (isLoading) return <LoadingSpinner />
    return <div className='min-h-screen max-w-7xl mx-auto '>
        <p className='text-2xl text-center mt-8'>Dashboard</p>
        <div className='flex justify-center items-center gap-4 mt-2 text-lg'>
            <p className=''>Total Tasks: {data?.totalDocs}</p>
        </div>
        <section className='mt-4 w-full'>
            <table className={`w-full text-gray-300 font-light ${mainColorBg}`}>
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
                            <tr
                                onClick={() => navigate(`/edit-task/${row.original.id}`)}
                                key={row.id} className='cursor-pointer hover:bg-gray-700'>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td className='p-3 text-center ' key={cell.id}>
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
    </div >
};

export default Page;






