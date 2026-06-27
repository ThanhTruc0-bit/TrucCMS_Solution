const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "src");

const extensions = [".js", ".jsx", ".ts", ".tsx", ".css", ".html"];

function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
            continue;
        }

        const ext = path.extname(fullPath);

        if (!extensions.includes(ext)) continue;

        const oldText = fs.readFileSync(fullPath, "utf8");
        const newText = oldText.normalize("NFC");

        if (oldText !== newText) {
            fs.writeFileSync(fullPath, newText, "utf8");
            console.log("Fixed:", fullPath);
        }
    }
}

walk(ROOT);

console.log("Done normalize Vietnamese text.");