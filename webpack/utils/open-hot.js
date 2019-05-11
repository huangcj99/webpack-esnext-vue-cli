const hotScript = 'webpack-hot-middleware/client?reload=false'

const injectHotScript = (config) => {
    for (let key in config.entry) {
        if (Object.prototype.hasOwnProperty.call(config.entry, key)) {
            config.entry[key] = [
                config.entry[key],
                hotScript
            ]
        }
    }

    return config
}

module.exports = {
    injectHotScript
}