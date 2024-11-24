echo "checking dependencies.."
nvm use
bun i

echo "building all packages.."
bun run build:all

echo "uploading assets.."
rm -Rf node_modules/.cache
huggingface-cli upload "jbilcke-hf/clapper" . . --repo-type=space 

