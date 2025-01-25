import '../styles/global.css';
import { capitalize, getJsonFields, checkJson, accessDynamicField } from './utils';


function buildTableHeader(fields: string[][]): HTMLTableSectionElement {
    const transformedFields = fields.map((field) => field.map((n, i) => i == 0 ? n.toLowerCase() : capitalize(n.toLowerCase())).join(""));

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

function handleParseJson(json: Record<string, unknown>[]){
    const table = document.querySelector("#output-table")!;

    table.innerHTML = "";

    const fields = getJsonFields(json[0]);

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

function setupDialogButtons(closeModal: () => void){
    const pasteJSON = document.querySelector<HTMLButtonElement>("#paste-json");
    const errorElement = document.querySelector<HTMLSpanElement>("#error-json");

    pasteJSON?.addEventListener("click", () => handlePaste(closeModal,errorElement!))
}

function main(){
    const selectJson = document.querySelector<HTMLButtonElement>("#select-json");
    const selectJsonDialog = document.querySelector<HTMLDialogElement>("#select-json-dialog");


    selectJson?.addEventListener("click", () => selectJsonDialog?.showModal());

    setupDialogButtons(() => selectJsonDialog?.close())
}


window.onload = main