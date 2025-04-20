const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Tell Metro: whenever someone `require("react-native/Libraries/Utilities/codegenNativeCommands")`,
  // serve our stub instead.
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    "react-native/Libraries/Utilities/codegenNativeCommands": path.resolve(__dirname, "codegenNativeCommandsStub.js"),
  };

  return config;
})();
