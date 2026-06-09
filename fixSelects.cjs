const fs = require('fs');

const fixSelects = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let regex = /<select([^>]*)>([\s\S]*?)<\/select>/g;
  let matches = 0;
  content = content.replace(regex, (match, selectProps, optionsStr) => {
    let optionRegex = /<option\s+selected\s*>([\s\S]*?)<\/option>/g;
    let selectedText = null;
    let newOptionsStr = optionsStr.replace(optionRegex, (optMatch, text) => {
      selectedText = text;
      return '<option>' + text + '</option>';
    });
    
    if (selectedText) {
       matches++;
       // extract existing className and other props
       if (selectProps.includes('defaultValue=')) {
          return match; // already has defaultValue
       }
       return '<select defaultValue=\"' + selectedText + '\"' + selectProps + '>' + newOptionsStr + '</select>';
    }
    return match;
  });
  
  if (matches > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + matches + ' selects in ' + filePath);
  }
};

const klawSync = require('child_process').execSync;
const files = klawSync('find src -type f -name "*.tsx"').toString().trim().split('\n');
files.forEach(f => {
  if(f) fixSelects(f);
})
