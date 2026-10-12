const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the class names
code = code.replace(/font-sans font-bold drop-shadow-sm tracking-wide/g, "font-english-title drop-shadow-sm tracking-wide");

// Add the font-english-title definition to the style block
const styleToAdd = `
            span.font-english-title {
              font-family: 'Cormorant Garamond', Georgia, serif !important;
              font-weight: 700 !important;
            }
`;

if (code.includes('span.font-nimsara {') && !code.includes('font-english-title')) {
    code = code.replace("span.font-nimsara {", styleToAdd + "\n            span.font-nimsara {");
}

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
