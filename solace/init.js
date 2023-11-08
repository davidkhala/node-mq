import Solace from 'solclientjs' // logging supported

const {SolclientFactoryProperties, SolclientFactoryProfiles, SolclientFactory, LogLevel} = Solace.debug

// Initialize factory with the most recent API defaults
const factoryProps = new SolclientFactoryProperties();
factoryProps.profile = SolclientFactoryProfiles.version10_5;
SolclientFactory.init(factoryProps);

// enable logging to JavaScript console at WARN level

SolclientFactory.setLogLevel(LogLevel.WARN); // NOTICE: works only with ('solclientjs').debug

