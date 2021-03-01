import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { tanksRouter } from './tanks/tanks.router';


if (!config.server.PORT) {
    process.exit();
}

const PORT: number = parseInt(config.server.PORT as string, 10);

const app = express();

app.use("/api/tanks/", tanksRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});