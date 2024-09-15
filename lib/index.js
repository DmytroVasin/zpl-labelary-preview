(function () {
  const vscode = acquireVsCodeApi();

  // DENCITY
  document.querySelector('#select-density').addEventListener('change', (e) => {
    vscode.postMessage({
      type: 'densityChanged',
      value: e.target.value,
    });
  });

  // LABEL SIZE
  document.querySelector('#refresh').addEventListener('click', (e) => {
    const width = document.querySelector('#label_size__width').value
    const height = document.querySelector('#label_size__height').value

    vscode.postMessage({
      type: 'refreshLabelSize',
      value: { width: width, height: height },
    });
  });

  // ROTATION
  this.position = 0;
  document.querySelector('#rotate').addEventListener('click', () => {
    this.position += 1

    const clases = ['deg0', 'deg90', 'deg180', 'deg270']
    const currentClass = clases[this.position % clases.length];

    const labelImage = document.querySelector('#label');
    labelImage.classList.remove(...clases)
    labelImage.classList.add(currentClass)
  });

  // PAGINATION
  document.querySelectorAll('.pagination-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      vscode.postMessage({
        type: 'changePage',
        value: e.target.getAttribute('value'),
      });
    });
  });

  // DOWNLOAD
  document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      vscode.postMessage({
        type: 'download',
        value: event.target.getAttribute('value'),
      });
    });
  });

  // COPY TO CLIPBOARD
  document.querySelector('#copy-to-clipboard').addEventListener('click', () => {
    vscode.postMessage({
      type: 'copyToClipboard',
      value: null,
    })
  });
})();
