# ZPL Labelary Preview - VSCode Extension

## Overview
ZPL Labelary Preview is a VSCode extension designed to preview ZPL (Zebra Programming Language) labels using the [Labelary API](https://labelary.com/service.html). It allows users to view label renderings directly within VSCode, manipulate label dimensions and density, and download the labels in various formats such as ZPL, PNG, and PDF.

## Usage

![ZPL Labelary Preview - Usage](https://github.com/DmytroVasin/zpl-labelary-preview/blob/main/assets/preview_GIF.gif)

1. Open a text file in VSCode containing ZPL code.
2. Select the ZPL code or keep the whole document active.
3. Run the command **"View ZPL Label"** from the command palette (press `Ctrl+Shift+P` to open it).
4. A panel will appear displaying the ZPL label rendering.

## Features
- **Preview ZPL Labels**: Render and view your ZPL label designs within a VSCode panel.
- **Preview ZPL Code**: View ZPL code with syntax highlighting and prettified formatting in a separate panel.
- **Base64 Decoding**: Automatically decode ZPL labels encoded in Base64 format for rendering and preview.
- **Clipboard Copy**: Copy the raw ZPL code to the clipboard.
- **Label Size Adjustment**: Modify label dimensions dynamically (width, height).
- **Density Selection**: Change the print density (dpmm).
- **Multi-Page Support**: Navigate between multiple pages of label designs.
- **Download Options**: Save labels as ZPL, PNG, or PDF files.

## Contributing
Feel free to contribute to this project by opening issues or submitting pull requests. Contributions that add features, fix bugs, or improve the codebase are welcome.

## License
This project is licensed under the MIT License.
