const fs = require('fs').promises;

const directory = 'bin';

fs.rmdir(directory, { recursive: true })
  .then(() => console.log('directory removed!'))