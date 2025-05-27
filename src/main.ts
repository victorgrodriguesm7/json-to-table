import { tableToCSV, tableToXLSX } from './convert';
import { getJsonFields, checkJson, accessDynamicField, fieldsToTitle } from './utils';


function buildTableHeader(fields: string[][]): HTMLTableSectionElement {
    const transformedFields = fields.map(fieldsToTitle)

    const thead = document.createElement("thead");

    thead.className = "bg-gray-100"

    thead.innerHTML = `
        <tr class="bg-gray-100">
            ${transformedFields.map((field) => `<th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors'>${field}</th>`).join("")}
        </tr>
    `;

    return thead;
}

function buildTableBody(fields: string[][], data: Record<string, unknown>[]){
    const tbody = document.createElement("tbody");

    tbody.innerHTML = data.map((item) => `
            <tr class="hover:bg-gray-50">
                ${fields.map((path) => `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${accessDynamicField(path, item)}</td>`).join("")}
            </tr>
        `).join("")
    return tbody;
}

function setupDownloadButtons(fields: string[][], data: Record<string, unknown>[]){
    const downloadCSV = document.querySelector<HTMLButtonElement>("#download-csv")!;
    const downloadXLXS = document.querySelector<HTMLButtonElement>("#download-xlsx")!;

    downloadCSV.onclick = () => tableToCSV(fields, data);
    downloadXLXS.onclick = () => tableToXLSX(fields, data);
}

function handleParseJson(json: Record<string, unknown>[]){
    const table = document.querySelector("#output-table")!;
    const buttons = document.querySelector("#download-buttons")!;
    const overlay = document.querySelector("#overlay")!;

    overlay.classList.add("hidden");
    buttons.classList.remove("hidden");
    buttons.classList.add("flex");


    table.innerHTML = "";

    const fields = getJsonFields(json[0]);

    setupDownloadButtons(fields, json);
    table.appendChild(buildTableHeader(fields));
    table.appendChild(buildTableBody(fields, json));
}

async function handlePaste(errorElement: HTMLSpanElement){
    errorElement.innerText = "";

    const rawJson = await navigator.clipboard.readText();

    const [ valid, message, parsedJson ] = checkJson(rawJson);

    if (valid){
        return handleParseJson(parsedJson)
    }

    errorElement.innerText = message;
}

async function handleFile(e: Event, errorElement: HTMLSpanElement){
    const target = e.target as HTMLInputElement

    const files = target.files;

    if (files && files.length > 0) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target?.result;

            const [ valid, message, parsedJson ] = checkJson(content as string);

            if (valid){
                return handleParseJson(parsedJson)
            }

            errorElement.innerText = message;
        };
        
        reader.readAsText(files[0]);
    }
}

function main(){
    const pasteJSON = document.querySelector<HTMLButtonElement>("#paste-json");
    const fileJSON = document.querySelector<HTMLInputElement>("#json-file");
    const errorElement = document.querySelector<HTMLSpanElement>("#error-json");

    pasteJSON?.addEventListener("click", () => handlePaste(errorElement!))
    fileJSON?.addEventListener("change", (e) => handleFile(e,errorElement!))
}


window.onload = main