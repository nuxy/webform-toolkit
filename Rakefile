desc "Check code quality"
task :jshint do
  test_file = File.expand_path('webform-toolkit.js')
  system("jshint file://#{test_file}")
end

desc "Run test suite"
task :qunit do
  test_file = File.expand_path('test.html')
  system("phantomjs --ignore-ssl-errors=yes --local-to-remote-url-access=yes test/run-qunit.js file://#{test_file}")
end

task :default => [:jshint, :qunit]
