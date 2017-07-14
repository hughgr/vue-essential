var path = require('path');
console.log(process.env.NODE_ENV);
var baseConfig = {
    entry:{
        index: './src/index.js'
    },
    output:{
        filename:'[name].js',
        path: path.resolve(__dirname,'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool:'source-map'
}

module.exports = baseConfig;
