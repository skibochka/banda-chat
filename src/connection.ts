import * as dotenv from 'dotenv';
import mongoose = require('mongoose');

dotenv.config();

class Connection {
    private readonly MONGO_URI: string = process.env.MONGO_URI;

    private readonly connectOptions: mongoose.ConnectionOptions = {
      // automatically try to reconnect when it loses connection
      autoReconnect: true,
      // reconnect every reconnectInterval milliseconds
      // for reconnectTries times
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      // flag to allow users to fall back to the old
      // parser if they find a bug in the new parse
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    };

    run(): mongoose.Connection {
      return mongoose.createConnection(this.MONGO_URI, this.connectOptions);
    }
}

const connection = new Connection().run();
export { connection };
