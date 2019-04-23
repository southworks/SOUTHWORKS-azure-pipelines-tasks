import { runTest } from './testRunner';

runTest(__filename.slice(__dirname.length + 1, -3) + '.json');

