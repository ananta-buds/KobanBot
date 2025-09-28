## Architecture Overview
This is a **modular Discord bot** built with Discord.js v14 for rules management and role assignment. The codebase follows a strict separation of concerns:

- **`src/config/`**: Centralized configuration with validation (singleton pattern)
- **`src/events/`**: Discord event handlers (ready, interactionCreate)
- **`src/services/`**: Business logic (RulesService for embed/button creation)
- **`src/utils/`**: Utilities (logger, validation, error handling)
- **`src/data/`**: Static content (rules text, messages)

## Key Patterns & Conventions

### Configuration Management
- All config accessed via `require('../config')` singleton
- Environment validation happens at startup in `Config.validateEnvironment()`
- Discord IDs validated as snowflakes using `ValidationUtils.isValidSnowflake()`
- Config provides both raw values (`token`) and computed properties (`isDevelopment`)

### Event-Driven Architecture
- Main bot class (`src/index.js`) sets up client and delegates to event handlers
- Event handlers in `src/events/` are pure functions that take `(client, ...args)`
- Services are instantiated per-event with client dependency injection

### Logging & Error Handling
- Custom logger with levels (error/warn/info/debug) based on `LOG_LEVEL` env var
- Global error handling setup via `setupErrorHandling()` in main
- Logger methods: `logger.error(message, meta)` where meta can be Error object
- All Discord client events (error, warn, debug) are logged appropriately

### Service Layer
- `RulesService` handles all rules-related Discord operations
- Methods follow pattern: `createX()` for builders, `findX()` for queries
- Services check for existing bot messages before creating duplicates
- Button interactions use `config.acceptButtonId` for consistency

## Development Workflow

### Essential Commands
```bash
npm run check      # Validates config, files, dependencies, syntax
npm run health     # Tests Discord connection (exits with status codes)
npm run dev        # Runs with NODE_ENV=development for debug logs
```

### Testing & Validation
- **`scripts/dev-check.js`**: Comprehensive setup validation (run before development)
- **`scripts/health-check.js`**: Discord connectivity test (useful for monitoring)
- Both scripts exit with proper status codes for CI/CD integration

### File Structure Requirements
The dev-check script validates these critical files exist:
- `.env` with required variables (DISCORD_TOKEN, CHANNEL_RULES_ID, ROLE_COMER_ID)
- All `src/` modules for syntax validation
- `.env.example` for new developer setup

## Discord-Specific Patterns

### Client Setup
- Uses specific intents: `Guilds`, `GuildMessages`, `MessageContent`, `GuildMembers`
- Partials for `Message`, `Channel`, `Reaction` to handle incomplete objects
- Debug logging only enabled in development environment

### Message Management
- Rules messages use embeds with specific title (`config.rulesEmbedTitle`)
- Bot searches recent messages to avoid duplicates (`config.messageLimit`)
- Interaction handling via `Events.InteractionCreate` with custom button IDs

### Role Assignment
- Uses snowflake ID validation for all Discord IDs
- Role assignment happens in interaction handlers, not message events
- Error handling for permission issues (bot role hierarchy)

## Integration Points

### Environment Variables
Required: `DISCORD_TOKEN`, `CHANNEL_RULES_ID`, `ROLE_COMER_ID`
Optional: `NODE_ENV`, `LOG_LEVEL`

### External Dependencies
- **discord.js v14**: Primary Discord API interface
- **dotenv**: Environment variable loading (called in config constructor)
- No database - stateless bot design

## Common Modifications

### Adding New Commands
1. Create handler in `src/events/interactionCreate.js`
2. Add business logic to appropriate service in `src/services/`
3. Update button/command IDs in `src/config/index.js`

### Modifying Rules Content
- Edit `src/data/messages.js` rules property
- Rules support Discord markdown (headers, mentions, formatting)

### Changing Configuration
- Add property to `Config` class with getter method
- Add validation in `validateEnvironment()` if required
- Update `.env.example` for new developers
