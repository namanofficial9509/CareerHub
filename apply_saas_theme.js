import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target exactly the 7 pages and dashboard components
const TARGET_DIRS = [
    path.join(__dirname, 'src', 'pages', 'dashboard'),
    path.join(__dirname, 'src', 'components', 'dashboard')
];

const LIGHT_SAAS = {
    bg: 'bg-[#F8FAFC]',
    card: 'bg-white',
    cardBorder: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accent: 'bg-blue-600', // #2563EB
    accentHover: 'hover:bg-blue-700', // #1D4ED8
    accentLight: 'bg-blue-50', // #EFF6FF
    accentText: 'text-blue-600',
};

const DARK_SAAS = {
    bg: 'dark:bg-[#0B0F19]',
    card: 'dark:bg-slate-900',
    cardBorder: 'dark:border-slate-800',
    textPrimary: 'dark:text-slate-100',
    textSecondary: 'dark:text-slate-400',
    accentLight: 'dark:bg-blue-500/10',
    accentText: 'dark:text-blue-400',
};

const SHADOW = 'shadow-sm'; // Very strict minimal saas shadow

const replacements = [
    // --- 1. Destroying Glows, Gradients & Neon Shadows ---
    { regex: /shadow-\[[^\]]+\]/g, replacement: SHADOW }, // Kills huge arbitrary custom shadows
    { regex: /shadow-[a-z]+-[0-9]+\/[0-9]+/g, replacement: SHADOW }, // Kills colored shadows (shadow-indigo-500/50)
    { regex: /shadow-xl|shadow-2xl/g, replacement: SHADOW },
    { regex: /bg-gradient-to-[a-z]+ from-[^ ]+ to-[^ "]+/g, replacement: '' }, // Strips gradients
    { regex: /via-[^" ]+/g, replacement: '' }, // Strips via-gradient colors
    
    // --- 2. Neutral Backgrounds & Borders ---
    // Background Layouts (usually #f6f6f8 or gray-50) => #F8FAFC / #0B0F19
    { regex: /bg-gray-50(?!\/)/g, replacement: `${LIGHT_SAAS.bg}` },
    { regex: /dark:bg-gray-900(?=\s|")/g, replacement: DARK_SAAS.bg },
    // Cards
    { regex: /bg-white dark:bg-gray-800/g, replacement: `${LIGHT_SAAS.card} ${DARK_SAAS.card}` },
    { regex: /border-gray-100 dark:border-gray-700/g, replacement: `${LIGHT_SAAS.cardBorder} ${DARK_SAAS.cardBorder}` },
    
    // --- 3. Professional Blue Accent Core ---
    // Primary Button replacements (old Electric Blue to Blue-600)
    { regex: /bg-\[#5d46e2\]|bg-\[#2513ec\]|bg-primary/g, replacement: LIGHT_SAAS.accent },
    { regex: /hover:bg-indigo-700|hover:bg-\[#1a0db0\]/g, replacement: LIGHT_SAAS.accentHover },
    // Text Accents
    { regex: /text-\[#5d46e2\]|text-\[#2513ec\]|text-primary/g, replacement: LIGHT_SAAS.accentText },
    { regex: /dark:text-indigo-400/g, replacement: DARK_SAAS.accentText },
    // Subtle Accents (F0EFFF or indigo-50)
    { regex: /bg-\[#f0efff\]|bg-indigo-50(?!\/)/g, replacement: LIGHT_SAAS.accentLight },
    { regex: /dark:bg-indigo-900\/[0-9]+/g, replacement: DARK_SAAS.accentLight },
    { regex: /bg-indigo-50\/50/g, replacement: LIGHT_SAAS.accentLight },

    // --- 4. Typography Adjustments (SaaS Text colors, killing all uppercase tracked out styles) ---
    { regex: /text-gray-900 dark:text-white/g, replacement: `${LIGHT_SAAS.textPrimary} ${DARK_SAAS.textPrimary}` },
    { regex: /text-gray-[56]00 dark:text-gray-[34]00/g, replacement: `${LIGHT_SAAS.textSecondary} ${DARK_SAAS.textSecondary}` },
    { regex: /text-gray-400 dark:text-gray-500/g, replacement: `${LIGHT_SAAS.textSecondary} ${DARK_SAAS.textSecondary}` },

    // --- 5. Status Pill Standardization (Strict Colors) ---
    // Strengths / Success (Emerald -> SaaS Green)
    { regex: /bg-emerald-50\/80 dark:bg-emerald-900\/30 text-emerald-600 dark:text-emerald-400/g, replacement: `bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400` },
    // Missing / Error (Red -> SaaS Red)
    { regex: /bg-red-50\/80 dark:bg-red-900\/30 text-red-600 dark:text-red-400/g, replacement: `bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400` },
    // Orange/Warning (SaaS Amber)
    { regex: /bg-orange-50\/80 dark:bg-orange-900\/20 text-orange-500/g, replacement: `bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500` },

    // --- 6. General structural fixes ---
    { regex: /rounded-\[24px\]/g, replacement: 'rounded-xl' }, // Standardize heavy radiuses to crisp SaaS radiuses
    { regex: /rounded-\[32px\]/g, replacement: 'rounded-2xl' },
    { regex: /uppercase tracking-widest/g, replacement: 'font-medium' }, // Demote screaming text
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

// Ensure Inter Font is forced into standard index.css
const INDEX_CSS_PATH = path.join(__dirname, 'src', 'index.css');
if (fs.existsSync(INDEX_CSS_PATH)) {
    let css = fs.readFileSync(INDEX_CSS_PATH, 'utf8');
    if (!css.includes('@import url("https://fonts.googleapis.com/css2?family=Inter:')) {
        css = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');\n` + css;
        fs.writeFileSync(INDEX_CSS_PATH, css, 'utf8');
    }
}


let changedFiles = 0;

TARGET_DIRS.forEach(dir => {
    if(!fs.existsSync(dir)) return;
    
    const files = walk(dir);

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;

        replacements.forEach(({ regex, replacement }) => {
            newContent = newContent.replace(regex, replacement);
        });

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            changedFiles++;
            console.log(`Updated elements in: ${path.relative(__dirname, file)}`);
        }
    });
});

console.log(`\nFinished! Applied SaaS layout to ${changedFiles} files in Dashboard targets.`);
