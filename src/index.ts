import app from './app';
import { PORT } from './internal';

const port = PORT ?? 8000;

app.listen(port, () => { 
  console.log(`App is working on port ${port}`); 
});
