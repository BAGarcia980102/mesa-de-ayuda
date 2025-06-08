const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requestRoutes = require('./routes/requestRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', requestRoutes);

app.get('/', (req, res) => {
  res.send('API running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
