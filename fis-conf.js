fis.match('*', {
   useHash: false, //是否启用文件md5后缀戳
   domain:'http://qcdn.letwx.com/app/touchtotouch-build'
});

fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js'),
      useHash:true
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css'),
      useHash:true,
    postprocessor : fis.plugin('autoprefixer', {
        //npm install -g fis-postprocessor-autoprefixer
        // detail config (https://github.com/postcss/autoprefixer#browsers)
        "browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
        "cascade": true
    })
});

fis.match('::image', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
   // optimizer: fis.plugin('png-compressor'),
    useHash:true
});

fis.match('*.html',{
    //npm install -g fis-optimizer-htmlmin
    optimizer:fis.plugin('htmlmin',{
        html: "htmlmin"
    })
});
