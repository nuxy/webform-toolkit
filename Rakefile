desc "Check code quality"
task :jshint do
  system("npm run jshint") or exit!(1)
end

desc "Run test suite"
task :qunit do
  system("npm run phantomjs") or exit!(1)
end
  
task :default => [:jshint, :qunit]
