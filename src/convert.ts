import { accessDynamicField, downloadBlob, fieldsToTitle } from "./utils";
import XLSX from "xlsx";

function prepareJson(fields: string[][], json: Record<string, unknown>[]): any[][] {
    const data: any[] = [fields.map(fieldsToTitle)];

    for (const item of json){
        const itemData = fields.map((path) => accessDynamicField(path, item));

        data.push(itemData);
    }

    return data
}

export function tableToCSV(fields: string[][], json: Record<string, unknown>[] ){
    const data: any[] = prepareJson(fields, json);

    const binary = new TextEncoder().encode(data.map((line) => line.join(",")).join("\n"))

    downloadBlob(binary, "text/csv", "table.csv");
}

export function tableToXLSX(fields: string[][], json: Record<string, unknown>[]) {
    const data: any[] = prepareJson(fields, json);

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Dados");

    XLSX.writeFile(wb, "data.xlsx");
}