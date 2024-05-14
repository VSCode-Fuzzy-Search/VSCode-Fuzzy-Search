(function () {
    const vscode = acquireVsCodeApi();

    const btnfirst = document.querySelector('.btn-first');
    const btnsecond = document.querySelector('.btn-second');
    const txtbox = document.querySelector('.txt-box');
    const btnthird = document.querySelector('.btn-third');
    const btnfourth = document.querySelector('.btn-fourth');
    const btnfifth = document.querySelector('.btn-fifth');
    const btnsixth = document.querySelector('.btn-sixth');

    btnfirst.addEventListener('click', () => {
        vscode.postMessage({ type: 'btn-first', value: txtbox.value });
    });
    btnsecond.addEventListener('click', () => {
        vscode.postMessage({ type: 'btn-second', value: txtbox.value });
    });
    btnthird.addEventListener('click', () => {
        vscode.postMessage({ type: 'btn-third', value: txtbox.value });
    });
    btnfourth.addEventListener('click', () => {
        vscode.postMessage({ type: 'btn-fourth', value: txtbox.value });
    });
    btnfifth.addEventListener('click', () => {
        vscode.postMessage({ type: 'btn-fifth', value: txtbox.value });
    });
    btnsixth.addEventListener('click', () => {
        vscode.postMessage({ type: 'btn-sixth', value: txtbox.value });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'displayResults') {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = `<div>Output: </div>`;
            if (message.files.length > 0) {
                outputDiv.innerHTML += `<p> Found keyword in: </p>`;
                message.files.forEach(file => {
                    const p = document.createElement('p');
                    p.textContent = `${file}`;
                    outputDiv.appendChild(p);
                });
            } else {
                const p = document.createElement('p');
                p.textContent = 'No matching files found.';
                outputDiv.appendChild(p);
            }
        }
    });
}());
