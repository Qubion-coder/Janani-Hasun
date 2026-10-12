const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/fontFamily: "'Noto Sans Sinhala', 'Abhaya Libre', serif"/g, "fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? \"'Cormorant Garamond'\" : \"'Abhaya Libre'\"}, serif`");
code = code.replace(/fontFamily: "'Abhaya Libre', serif"/g, "fontFamily: `${lang === 'en' ? \"'Cormorant Garamond'\" : \"'Abhaya Libre'\"}, serif`");

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated');
