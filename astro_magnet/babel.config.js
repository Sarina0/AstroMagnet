module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "nativewind/babel",
      [require.resolve("babel-plugin-module-resolver"), 
      {                                                                                                                                                
        root: ["./src/"],                                                                                                                              
        alias: {                                                                                                                                       
          // define aliases to shorten the import paths                                                                                                
          "@app": "./src"                                                                                                               
        },                                                                                                                                             
        extensions: [".js", ".jsx", ".tsx", ".ios.js", ".android.js"],                                                                                        
      },] 
    ]
  };
};
