# MindVaultIP Backend

A comprehensive backend system for patent registration, AI-powered verification, and blockchain certification.

## Features

- **State Machine Workflow**: Automated submission processing with configurable states
- **AI Services**: Duplicate detection, patentability scoring, and council decision-making
- **Blockchain Integration**: Certificate generation and registration on Base network
- **Rewards System**: Automated IDN token distribution based on quality scores
- **Queue Management**: BullMQ-based job processing with retry mechanisms
- **Audit Trail**: Comprehensive logging of all actions and decisions
- **Expert Review**: Human expert integration for complex cases

## Architecture

### State Machine Flow

```
UPLOADED → AI_DUPLICATE_CHECK → AI_PATENTABILITY_REVIEW → AI_COUNCIL_DELIBERATION
    ↓
FINALIZED_APPROVED → REWARDED (for non-inventions)
    ↓
PENDING_EXPERT_REVIEW → EXPERT_APPROVED/REJECTED → FINALIZED_APPROVED/REJECTED → REWARDED
    ↓
FINALIZED_REJECTED (for rejected submissions)
```

### Services

- **SubmissionOrchestrator**: Manages state transitions and workflow
- **AIMatcherService**: Vector similarity search and duplicate detection
- **AIScorerService**: Patentability scoring using AI ensemble
- **AICouncilService**: Rule-based + LLM decision making
- **CertificationService**: Certificate generation and blockchain registration
- **RewardsService**: Token distribution and treasury management
- **QueueService**: Job queue management with BullMQ

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- OpenAI API key
- Base network RPC access

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Setup database**:
   ```bash
   # Create database
   createdb mindvaultip
   
   # Run migrations
   npm run migrate
   ```

4. **Start Redis**:
   ```bash
   redis-server
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Public Endpoints

- `POST /v1/submissions` - Create new submission
- `GET /v1/submissions/:id` - Get submission details
- `GET /v1/submissions/:id/certificate` - Get certificate

### Internal Endpoints

- `POST /int/ai/match/:id` - AI duplicate check results
- `POST /int/ai/score/:id` - AI scoring results
- `POST /int/ai/council/:id` - AI council decision
- `POST /int/expert/decision/:id` - Expert decision
- `POST /int/certify/:id` - Certificate generation
- `POST /int/reward/:id` - Reward distribution

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_NAME` | PostgreSQL database name | `mindvaultip` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `REDIS_HOST` | Redis host | `localhost` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `BASE_RPC_URL` | Base network RPC URL | `https://mainnet.base.org` |

### Decision Rules

- **Duplicate Risk**: >0.75 = Reject, 0.4-0.75 = Expert Review, <0.4 = Continue
- **Quality Score**: <60 = Reject, 60-79 = Expert Review (inventions), ≥80 = Approve
- **Submission Types**: Only "invention" requires expert review; others can be finalized by AI

## Development

### Project Structure

```
src/
├── config/          # Database and app configuration
├── models/          # Sequelize models
├── routes/          # Express routes
├── services/        # Business logic services
├── middleware/      # Express middleware
└── app.ts          # Main application file
```

### Database Models

- **Submission**: Main submission entity with status tracking
- **Review**: AI and expert review records
- **AuditLog**: Immutable action log
- **SubmissionVectors**: Vector embeddings for similarity search

### Job Queues

- `upload_pipeline` - File processing and indexing
- `ai_duplicate_check` - Duplicate detection
- `ai_patentability_review` - Quality scoring
- `ai_council` - Council decision making
- `expert_dispatch` - Expert assignment
- `finalize` - Status finalization
- `certify` - Certificate generation
- `reward` - Token distribution

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup

1. **Database**: Ensure PostgreSQL is running with pgvector extension
2. **Redis**: Configure Redis for job queues
3. **Blockchain**: Deploy contracts and configure addresses
4. **Storage**: Setup S3 or IPFS for file storage
5. **Monitoring**: Configure logging and error tracking

## Security Considerations

- **File Upload**: Virus scanning and type validation
- **Authentication**: JWT-based with role-based access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **Audit Trail**: Immutable logging of all actions
- **Private Keys**: Secure storage of blockchain private keys

## Monitoring

- **Health Checks**: `/health` endpoint for service monitoring
- **Queue Monitoring**: BullMQ dashboard for job monitoring
- **Database Monitoring**: Connection pooling and query performance
- **Error Tracking**: Comprehensive error logging and alerting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
