import Datastore from 'nedb';
import path from 'path';

import { remote } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

export default new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db'),
});
