// Test setup - load env
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/arvind-sylva-test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_minimum_64_characters_for_testing_purposes_only';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_minimum_64_characters_for_testing_purposes_only';
process.env.JWT_ACCESS_EXPIRY = '15m';
process.env.JWT_REFRESH_EXPIRY = '7d';
process.env.COOKIE_SECRET = 'test_cookie_secret_32chars_min';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.PORT = '5001';
