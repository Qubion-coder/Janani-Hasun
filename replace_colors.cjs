const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Color mapping (Green to Gold/White)
const colorMap = {
  '#2d5a27': '#8f7322', // Dark gold
  '#3f7a39': '#b5932f', // Gold
  '#61a85c': '#d4af37', // Light gold
  '#52b788': '#e6c555', // Lighter gold
  '#a2c5a0': '#f2df96', // Pale gold
  '#dcebe1': '#fdf8e6', // Very pale gold / off-white
  // drop-shadows with green rgba
  'rgba(45,90,39': 'rgba(143,115,34',
  'rgba(27,67,50': 'rgba(110,87,20',
};

for (const [green, gold] of Object.entries(colorMap)) {
  content = content.split(green).join(gold);
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("Colors replaced successfully.");
