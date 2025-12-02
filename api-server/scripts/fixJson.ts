
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(__dirname, '../data/10t2v_structured.json');

if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

// List of LaTeX commands that might be unescaped and cause issues
// We need to replace "\" + command with "\\" + command
// Note: We must be careful not to double escape if it's already escaped, 
// but since the error exists, we assume they are single backslashes.
// However, a simple replaceAll might replace already valid ones if we run it multiple times.
// But here we are fixing a broken file.

const replacements = [
    'vec', 'frac', 'sqrt', 'begin', 'end', 'left', 'right',
    'text', 'cdot', 'quad', 'circ', 'in', 'neq', 'le', 'ge',
    'cos', 'sin', 'tan', 'cot', 'approx', 'cup', 'mathbb',
    'Leftrightarrow', 'widehat', 'dots'
];

// Also handle single char escapes that are invalid in JSON but common in LaTeX
// e.g. \( \) \[ \] \{ \}
// \{ and \} are NOT valid JSON escapes (only \" \\ \/ \b \f \n \r \t)
// So \{ should be \\{
const singleCharReplacements = [
    '(', ')', '[', ']', '{', '}'
];

// Helper to replace unescaped commands
// We look for \command that is NOT preceded by \
// But in JS regex, \\ matches a literal backslash.
// So we want to match a backslash that is NOT preceded by a backslash.
// But wait, the file content we read has literal backslashes.
// If the file has "\vec", content string has '\' followed by 'v'.
// If the file has "\\vec", content string has '\' '\' 'v'.

replacements.forEach(cmd => {
    // Regex: literal backslash followed by command, NOT preceded by literal backslash
    // We use a negative lookbehind if supported, or just replace all and then fix double escapes?
    // Simpler: Replace all `\cmd` with `\\cmd`.
    // But we need to be careful about `\\cmd`.
    // If we have `\\vec`, we don't want `\\\\vec`.

    // Regex to match \cmd but not \\cmd
    // Since JS regex lookbehind support varies, we can match (not backslash)(\cmd)
    // But that misses start of string.

    // Let's try a simpler approach: 
    // 1. Replace all `\\cmd` with `\cmd` (temporary placeholder to normalize) - No, that's dangerous.

    // Better: Match `\` followed by `cmd`. Check if preceded by `\`.
    const regex = new RegExp(`(?<!\\\\)\\\\${cmd}`, 'g');
    content = content.replace(regex, `\\\\${cmd}`);
});

// Fix invalid single char escapes
singleCharReplacements.forEach(char => {
    // Escape special regex chars in the char
    const escapedChar = '\\' + char;
    const regex = new RegExp(`(?<!\\\\)\\\\${escapedChar}`, 'g');
    content = content.replace(regex, `\\\\${char}`);
});

// Also fix `\ ` (escaped space) which is common in LaTeX
content = content.replace(/(?<!\\)\\\s/g, '\\\\ ');

// Fix `\;` `\,` `\:`
content = content.replace(/(?<!\\)\\[;,:]/g, (match) => '\\' + match);

fs.writeFileSync(filePath, content);
console.log('Fixed JSON file.');
