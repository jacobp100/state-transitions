import { EventEmitter } from 'events';

const elementCommunicator = new EventEmitter();
elementCommunicator.setMaxListeners(101);

export default elementCommunicator;
