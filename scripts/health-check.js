#!/usr/bin/env node

/**
 * Health check utility for monitoring bot status
 * Usage: node scripts/health-check.js
 * Exit codes: 0 = healthy, 1 = unhealthy
 */

const { Client, GatewayIntentBits } = require('discord.js');
const config = require('../src/config');
const logger = require('../src/utils/logger');

async function healthCheck() {
  console.log('🏥 KuroukaiBot Health Check');
  
  let client;
  try {
    // Create minimal client for health check
    client = new Client({
      intents: [GatewayIntentBits.Guilds]
    });

    // Set timeout for health check
    const timeout = setTimeout(() => {
      console.log('❌ Health check timeout');
      process.exit(1);
    }, 10000);

    // Login and check readiness
    await client.login(config.token);
    
    await new Promise((resolve, reject) => {
      client.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });
      
      client.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    console.log('✅ Bot is online and healthy');
    console.log(`📋 Bot User: ${client.user.tag}`);
    console.log(`🏠 Servers: ${client.guilds.cache.size}`);
    
    await client.destroy();
    process.exit(0);
    
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    
    if (client) {
      try {
        await client.destroy();
      } catch (destroyError) {
        // Ignore destroy errors
      }
    }
    
    process.exit(1);
  }
}

// Run health check if called directly
if (require.main === module) {
  healthCheck();
}

module.exports = { healthCheck };