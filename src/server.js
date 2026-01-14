import app from './app.js';
import connectDB from './config/config.js';

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
