module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Find and remove CSS Minimizer Plugin
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          (plugin) => plugin.constructor.name !== "CssMinimizerPlugin"
        );
        return webpackConfig;
      },
    },
  };
  