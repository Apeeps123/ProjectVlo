const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public/images')));

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

const agentRoutes = require('./routes/agent');
app.use('/agent', agentRoutes);

const rolesRoutes = require('./routes/roles');
app.use('/roles', rolesRoutes);

const weaponRoutes = require('./routes/weapon');
app.use('/weapon', weaponRoutes);

const skinRoutes = require('./routes/skin');
app.use('/skin', skinRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
