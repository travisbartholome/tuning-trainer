module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      options: {
        livereload: true /*{
          host: "localhost",
          port: (process.env.PORT || 5000)
        }*/
      },
      src: {
        files: ["**/*", "!**/node_modules/**"],
        tasks: []
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["watch"]);
};
