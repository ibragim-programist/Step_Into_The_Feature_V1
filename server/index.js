import express from 'express';
import cors from 'cors';
import routes from './utility/__getRoutes.js';

const PORT = 7523;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});