import '../styles/global.css';
import { tableToCSV, tableToXLSX } from './convert';
import { getJsonFields, checkJson, accessDynamicField, fieldsToTitle } from './utils';


function buildTableHeader(fields: string[][]): HTMLTableSectionElement {
    const transformedFields = fields.map(fieldsToTitle)

    const thead = document.createElement("thead");

    thead.className = "bg-gray-100"

    thead.innerHTML = `
        <tr class="bg-gray-100">
            ${transformedFields.map((field) => `<th class='border border-gray-300 px-4 py-2 font-semibold'>${field}</th>`).join("")}
        </tr>
    `;

    return thead;
}

function buildTableBody(fields: string[][], data: Record<string, unknown>[]){
    const tbody = document.createElement("tbody");

    tbody.innerHTML = data.map((item) => `
            <tr class="hover:bg-gray-50">
                ${fields.map((path) => `<td class="border border-gray-300 px-4 py-2">${accessDynamicField(path, item)}</td>`).join("")}
            </tr>
        `).join("")
    return tbody;
}

function setupDownloadButtons(fields: string[][], data: Record<string, unknown>[]){
    const downloadCSV = document.querySelector("#download-csv")!;
    const downloadXLXS = document.querySelector("#download-xlsx")!;

    downloadCSV.addEventListener("click", () => tableToCSV(fields, data));
    downloadXLXS.addEventListener("click", () => tableToXLSX(fields, data));

}

function handleParseJson(json: Record<string, unknown>[]){
    const table = document.querySelector("#output-table")!;
    const buttons = document.querySelector("#download-buttons")!;

    buttons.classList.remove("hidden");
    buttons.classList.add("flex");


    table.innerHTML = "";

    const fields = getJsonFields(json[0]);

    setupDownloadButtons(fields, json);
    table.appendChild(buildTableHeader(fields));
    table.appendChild(buildTableBody(fields, json));
}

async function handlePaste(closeModal: () => void, errorElement: HTMLSpanElement){
    errorElement.innerText = "";

    const rawJson = await navigator.clipboard.readText();

    const [ valid, message, parsedJson ] = checkJson(rawJson);

    if (valid){
        closeModal();

        return handleParseJson(parsedJson)
    }

    errorElement.innerText = message;
}

async function handleFile(e: Event, closeModal: () => void, errorElement: HTMLSpanElement){
    const target = e.target as HTMLInputElement

    const files = target.files;

    if (files && files.length > 0) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target?.result;

            const [ valid, message, parsedJson ] = checkJson(content as string);

            if (valid){
                closeModal();

                return handleParseJson(parsedJson)
            }

            errorElement.innerText = message;
        };
        
        reader.readAsText(files[0]);
    }
}

function setupDialogButtons(closeModal: () => void){
    const pasteJSON = document.querySelector<HTMLButtonElement>("#paste-json");
    const fileJSON = document.querySelector<HTMLInputElement>("#json-file");
    const closeDialog = document.querySelector<HTMLInputElement>("#close-dialog");
    const errorElement = document.querySelector<HTMLSpanElement>("#error-json");

    pasteJSON?.addEventListener("click", () => handlePaste(closeModal,errorElement!))
    fileJSON?.addEventListener("change", (e) => handleFile(e, closeModal,errorElement!))
    closeDialog?.addEventListener("click", closeModal)
}

function main(){
    const selectJson = document.querySelector<HTMLButtonElement>("#select-json");
    const selectJsonDialog = document.querySelector<HTMLDialogElement>("#select-json-dialog");


    selectJson?.addEventListener("click", () => selectJsonDialog?.showModal());

    setupDialogButtons(() => selectJsonDialog?.close())
}


window.onload = main