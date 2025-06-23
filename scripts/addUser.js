const bcrypt = require('bcrypt');
bcrypt.hash('admin', 10).then(console.log);