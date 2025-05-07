import {useCallback, useState} from "react";

export function useTable(initialPage = 0, initialRowsPerPage = 10) {
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [selected, setSelected] = useState<string[]>([]);

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        setSelected(checked ? newSelecteds : []);
    }, []);

    const onSelectRow = useCallback((inputValue: string) => {
        setSelected((prev) =>
            prev.includes(inputValue) ? prev.filter((v) => v !== inputValue) : [...prev, inputValue]
        );
    }, []);

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        rowsPerPage,
        selected,
        onSelectAllRows,
        onSelectRow,
        onChangePage,
        onChangeRowsPerPage,
        onResetPage,
    };
}
