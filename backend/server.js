require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const leaveRoutes = require("./routes/leave");
const departmentRoutes = require("./routes/department");
const skillRoutes = require('./routes/skills');
const employeeRoutes = require('./routes/employees');
const assetRoutes = require('./routes/assets');
const notificationRoutes = require('./routes/notifications');




const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests!'
});
app.use('/api/', limiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/departments", departmentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));// app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/reports', require('./routes/reports'));// app.use('/api/reports', require('./routes/reports'));
app.use('/uploads', require('express').static('uploads'));
app.use('/api/assets', assetRoutes);
app.use('/api/notifications', notificationRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});