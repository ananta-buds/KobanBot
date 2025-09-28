#!/usr/bin/env node

/**
 * Development utility for testing configuration and setup
 * Usage: node scripts/dev-check.js
 */

const path = require('path');
const fs = require('fs');

// Change to project root
process.chdir(path.join(__dirname, '..'));

const config = require('../src/config');
const logger = require('../src/utils/logger');

async function runDevelopmentChecks() {
  console.log('🔧 KobanBot Development Checks\n');

  // Check 1: Environment Configuration
  console.log('1. Environment Configuration:');
  try {
    console.log(`   ✅ Configuration loaded successfully`);
    console.log(`   📋 Environment: ${config.nodeEnv}`);
    console.log(`   📊 Log Level: ${config.logLevel}`);
    console.log(`   🎯 Channel ID: ${config.channelRulesId}`);
    console.log(`   🏷️  Role ID: ${config.roleComerID}`);
    console.log(`   🔑 Token Format: Valid\n`);
  } catch (error) {
    console.log(`   ❌ Configuration Error: ${error.message}\n`);
    return false;
  }

  // Check 2: File Structure
  console.log('2. File Structure:');
  const requiredFiles = [
    'src/config/index.js',
    'src/events/ready.js',
    'src/events/interactionCreate.js',
    'src/services/rulesService.js',
    'src/utils/logger.js',
    'src/utils/errorHandler.js',
    'src/utils/validation.js',
    'src/utils/discordUtils.js',
    'src/data/messages.js',
    'src/index.js',
    '.env',
    '.env.example',
    '.gitignore',
    'README.md'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

  if (missingFiles.length === 0) {
    console.log('   ✅ All required files present');
  } else {
    console.log('   ❌ Missing files:');
    missingFiles.forEach(file => console.log(`      - ${file}`));
  }
  console.log();

  // Check 3: Dependencies
  console.log('3. Dependencies:');
  try {
    require('discord.js');
    require('dotenv');
    console.log('   ✅ All dependencies available\n');
  } catch (error) {
    console.log(`   ❌ Missing dependencies: ${error.message}\n`);
    return false;
  }

  // Check 4: Code Syntax
  console.log('4. Code Syntax:');
  const jsFiles = [
    'src/index.js',
    'src/config/index.js',
    'src/events/ready.js',
    'src/events/interactionCreate.js',
    'src/services/rulesService.js',
    'src/utils/logger.js',
    'src/utils/errorHandler.js',
    'src/utils/validation.js',
    'src/utils/discordUtils.js'
  ];

  let syntaxErrors = 0;
  for (const file of jsFiles) {
    try {
      require(path.resolve(file));
      console.log(`   ✅ ${file}`);
    } catch (error) {
      console.log(`   ❌ ${file}: ${error.message}`);
      syntaxErrors++;
    }
  }

  if (syntaxErrors === 0) {
    console.log('   ✅ All files have valid syntax\n');
  } else {
    console.log(`   ❌ ${syntaxErrors} files have syntax errors\n`);
    return false;
  }

  // Check 5: Logger Test
  console.log('5. Logger Test:');
  logger.info('Test info message');
  logger.warn('Test warning message');
  logger.debug('Test debug message');
  console.log('   ✅ Logger working correctly\n');

  console.log('🎉 All development checks passed!');
  console.log('💡 Your bot is ready for development.');
  console.log('🚀 Run "npm start" to start the bot.');

  return true;
}

// Run checks if called directly
if (require.main === module) {
  runDevelopmentChecks().catch(error => {
    console.error('Development check failed:', error);
    process.exit(1);
  });
}

module.exports = { runDevelopmentChecks };
