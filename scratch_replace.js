const fs = require('fs');
const path = 'src/app/admin/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors and themes
content = content.replace(/bg-black/g, 'bg-background');
content = content.replace(/text-white/g, 'text-foreground');
content = content.replace(/text-green-400/g, 'text-accent');
content = content.replace(/bg-green-400/g, 'bg-accent');
content = content.replace(/border-green-400/g, 'border-accent');
content = content.replace(/text-green-500/g, 'text-accent');

// Semi-transparent colors using Tailwind arbitrary values
content = content.replace(/bg-white\//g, 'bg-foreground/');
content = content.replace(/border-white\//g, 'border-foreground/');
content = content.replace(/text-white\//g, 'text-foreground/');

content = content.replace(/bg-green-400\//g, 'bg-accent/');
content = content.replace(/border-green-400\//g, 'border-accent/');
content = content.replace(/text-green-400\//g, 'text-accent/');

// Specific hex replacements if they exist
content = content.replace(/bg-\[\#0a0a0c\]/g, 'bg-card');
content = content.replace(/border-\[\#1a1a1c\]/g, 'border-border');

fs.writeFileSync(path, content);
console.log('Replacements completed.');
