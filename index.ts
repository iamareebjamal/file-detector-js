import mimecheck, { BinaryType, FileResult } from './mimecheck';

const uploads: FileResult[] = [];

const fileSelector = document.getElementById('file-selector');

const render = () => {
    const container = document.getElementById('files')

    const uploadedFiles = uploads.map(file => {
        return `<div class="box" style="margin-top: 1rem">
<strong>${file.name}</strong><br>
Filetype from file object: ${file.type}<br>
Filetype from binary: ${file.binaryType}<br>
Hex: <span class="tag"><em>${file.hex}</em></span><br>
Allowed: <span class="tag is-${file.isAllowed ? 'success' : 'danger'}">${file.isAllowed ? 'YES' : 'NO'}</span>
</div>`
    })

    container.innerHTML = uploadedFiles.join('')
}

fileSelector.addEventListener('change', event => {
    const files = event.target.files;
    for (let element of files) {
        console.time(element.name);
    }
    console.time('all');
    mimecheck.getFileTypes(files, result => {
        console.log(result);
        console.timeEnd(result.name);
        uploads.push(result);
    }, results => {
        render();
        console.log(results);
        console.timeEnd('all');
    });
});