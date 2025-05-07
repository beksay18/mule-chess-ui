import { useCallback, useState } from "react";

export function useTable(initialPage = 0, initialRowsPerPage = 10) {
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [selected, setSelected] = useState<string[]>([]);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        console.log("onChangePage (from hook) setting page to:", newPage);
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        },
        []
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        setSelected(checked ? newSelecteds : []);
    }, []);

    const onSelectRow = useCallback((inputValue: string) => {
        setSelected((prev) =>
            prev.includes(inputValue)
                ? prev.filter((v) => v !== inputValue)
                : [...prev, inputValue]
        );
    }, []);

    return {
        page,
        rowsPerPage,
        selected,
        onChangePage,
        onChangeRowsPerPage,
        onResetPage,
        onSelectAllRows,
        onSelectRow,
    };
}
