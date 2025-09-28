# KobanBot

A modular Discord bot designed for server rules management and role assignment. Built with security, modularity, and maintainability in mind.

## Features

- ✅ **Server Rules Management**: Automatically posts server rules with acceptance buttons
- 🛡️ **Role Assignment**: Assigns roles to users who accept the rules
- 🏗️ **Modular Architecture**: Clean separation of concerns for easy maintenance
- 🔒 **Security**: Proper environment variable handling and input validation
- 📝 **Comprehensive Logging**: Structured logging with different levels
- ⚡ **Performance**: Efficient message handling and caching
- 🔧 **Configuration**: Centralized configuration management
- 🚨 **Error Handling**: Robust error handling and recovery

## Architecture

```
src/
├── config/           # Configuration management
├── events/           # Discord event handlers
├── services/         # Business logic services
├── utils/           # Utility functions
├── data/            # Static data (messages, etc.)
└── index.js         # Main application entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ananta-buds/KobanBot.git
   cd KobanBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit the `.env` file with your Discord bot credentials:**
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CHANNEL_RULES_ID=your_channel_id_here
   ROLE_COMER_ID=your_role_id_here
   NODE_ENV=development
   LOG_LEVEL=info
   ```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your Discord bot token | ✅ |
| `CHANNEL_RULES_ID` | Channel ID where rules will be posted | ✅ |
| `ROLE_COMER_ID` | Role ID to assign when users accept rules | ✅ |
| `NODE_ENV` | Environment (development/production) | ❌ |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | ❌ |

### Getting Discord IDs

1. **Bot Token**: Create a bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. **Channel ID**: Enable Developer Mode in Discord, right-click channel → Copy ID
3. **Role ID**: Right-click role in Server Settings → Copy ID

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Development Tools

#### Configuration Check
Verify your setup and configuration:
```bash
npm run check
```

#### Health Check
Check if the bot can connect to Discord (useful for monitoring):
```bash
npm run health
```

## Project Structure

### Core Components

- **`src/config/`**: Centralized configuration with validation
- **`src/events/`**: Discord event handlers (ready, interactions)
- **`src/services/`**: Business logic (rules management, role assignment)
- **`src/utils/`**: Utility functions (logging, error handling)
- **`src/data/`**: Static data and message templates

### Key Features

#### Configuration Management
- Environment variable validation
- Type checking for Discord IDs
- Centralized configuration access

#### Logging System
- Multiple log levels (error, warn, info, debug)
- Structured logging with metadata
- Environment-based log level control

#### Error Handling
- Global error handling for uncaught exceptions
- Graceful error recovery
- Detailed error logging

#### Security
- Environment variables not committed to repository
- Input validation for all Discord IDs
- Secure token handling

## Customization

### Adding New Rules
Edit `src/data/messages.js` to modify the rules content.

### Adding New Commands
1. Create handler in `src/events/`
2. Add service logic in `src/services/`
3. Update event listeners in `src/index.js`

### Modifying Configuration
Update `src/config/index.js` for new configuration options.

## Security Considerations

- ✅ Environment variables are not committed to git
- ✅ Input validation for all user inputs
- ✅ Proper error handling prevents information leakage
- ✅ Token validation ensures proper Discord API usage
- ✅ Role and permission checks before operations

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check bot token validity
   - Verify bot permissions in Discord server
   - Check console logs for errors

2. **Rules message not appearing**
   - Verify channel ID is correct
   - Check bot permissions in target channel
   - Review logs for specific error messages

3. **Role assignment failing**
   - Verify role ID is correct
   - Check bot has permission to manage roles
   - Ensure bot role is higher than target role

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review logs for error details
