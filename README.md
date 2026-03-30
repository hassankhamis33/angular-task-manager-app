# Angular Task Manager - Modern RxJS Application

A production-ready Angular application demonstrating clean architecture, RxJS patterns, and Docker containerization. This project serves as a comprehensive guide for building scalable Angular applications with reactive programming principles.

## 🎯 Features

### Architecture & Design Patterns
- **Clean Architecture**: Separation into core, shared, and feature modules
- **RxJS Patterns**: 
  - BehaviorSubject for state management
  - Observable/Subject composition
  - Operators: map, switchMap, tap, takeUntil
  - Proper subscription management with takeUntil
- **Reactive Forms**: Form validation and state management
- **HTTP Client**: Mock API integration with localStorage
- **Lazy Loading Ready**: Feature modules can be lazy loaded
- **Standalone Components**: Modern Angular 18+ standalone API support

### Features
✅ Task Management (Create, Read, Update, Delete)  
✅ Priority-based task filtering  
✅ Reactive forms with validation  
✅ Real-time state updates with RxJS  
✅ Responsive UI design  
✅ Error handling and loading states  
✅ Docker containerization  
✅ Production-ready build process  

## 📁 Folder Structure

```
angular-task-manager/
├── src/
│   ├── app/
│   │   ├── core/                          # Core singleton services
│   │   │   ├── models/
│   │   │   │   └── task.model.ts         # Task data models
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts        # HTTP requests & mock API
│   │   │   │   └── task-state.service.ts # RxJS state management
│   │   │   └── core.module.ts
│   │   │
│   │   ├── features/                      # Feature modules
│   │   │   └── task-manager/
│   │   │       ├── task-manager.component.ts      # Main component
│   │   │       ├── task-manager.component.css     # Styles
│   │   │       └── task-manager.module.ts
│   │   │
│   │   ├── shared/                        # Shared utilities
│   │   │   └── shared.module.ts           # Common imports
│   │   │
│   │   ├── app.component.ts               # Root component
│   │   └── app.module.ts
│   │
│   ├── main.ts                            # Application entry point
│   ├── index.html                         # HTML template
│   └── styles.css                         # Global styles
│
├── Dockerfile                             # Multi-stage build
├── docker-compose.yml                     # Container orchestration
├── nginx.conf                             # Nginx server config
├── nginx-default.conf                     # Nginx app config
├── angular.json                           # Angular CLI config
├── tsconfig.json                          # TypeScript config
├── package.json                           # Dependencies
├── DOCKER.md                              # Docker setup guide
└── README.md                              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 18+ (optional)
- Docker & Docker Compose (for containerized deployment)

### Development Server

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm start
# or
ng serve
```

3. **Navigate to Application**
```
http://localhost:4200
```

The application will automatically reload when you modify source files.

### 🐳 Docker Deployment

1. **Build and Run with Docker Compose**
```bash
docker-compose up --build -d
```

2. **Access Application**
```
http://localhost:4200
```

3. **View Logs**
```bash
docker-compose logs -f app
```

4. **Stop Application**
```bash
docker-compose down
```

## 📚 RxJS Concepts Explained

### 1. BehaviorSubject
State management with current value emission to new subscribers:
```typescript
private tasksSubject = new BehaviorSubject<Task[]>([]);
public tasks$ = this.tasksSubject.asObservable();
```

### 2. Observable/Subject Composition
Combining multiple observables:
```typescript
public tasks$ = this.tasks$;
public loading$ = this.loadingSubject.asObservable();
public error$ = this.errorSubject.asObservable();
```

### 3. Operators
- **map**: Transform observable data
- **switchMap**: Cancel previous request on new emission
- **tap**: Side effects without modifying data
- **takeUntil**: Unsubscribe when destroy signal emits

### 4. Memory Management
Proper cleanup with takeUntil pattern:
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.tasks$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## 🏗️ Architecture Highlights

### Core Module
- **Single responsibility**: Manages services
- **Singleton pattern**: Services instantiated once
- **API Service**: Abstracts HTTP logic
- **Task State Service**: RxJS-based state management

### Feature Modules
- **Task Manager**: Complete CRUD feature
- **Encapsulated logic**: Self-contained feature
- **Lazy loadable**: Can be loaded on demand

### Shared Module
- **Common imports**: ReactiveFormsModule, CommonModule
- **Reusable utilities**: Components, pipes, directives

## 🔧 Available Commands

```bash
# Development
npm start              # Run development server
npm run build         # Build for production
npm run watch         # Build in watch mode
npm test              # Run unit tests
npm run lint          # Lint code

# Docker
docker-compose up -d          # Start containers
docker-compose down           # Stop containers
docker-compose logs -f app    # View logs
docker-compose ps             # List containers
```

## 📦 Production Build

The multi-stage Docker build optimizes the final image:

1. **Stage 1 (Builder)**
   - Uses Node.js image
   - Installs dependencies
   - Builds Angular application
   - Creates optimized output

2. **Stage 2 (Production)**
   - Uses lightweight Nginx image
   - Copies built files from Stage 1
   - Configures for SPA routing
   - Includes security headers

**Final Image Size**: ~40-50MB (vs 600MB+ with Node.js)

## 🔒 Security Features

- **CORS Headers**: Prevents unauthorized cross-origin requests
- **CSP Headers**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Hidden Files Blocked**: No access to config files

## 🧪 Testing

Run unit tests with:
```bash
npm test
```

Tests use Karma and Jasmine frameworks included in Angular.

## 🐛 Troubleshooting

### Port Already in Use
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Use different port
```

### Build Fails
```bash
npm ci              # Clean install
rm -rf dist         # Remove old build
npm run build       # Rebuild
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📖 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices)
- [Docker Documentation](https://docs.docker.com)

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Angular 18+ latest features
- ✅ RxJS reactive programming
- ✅ Clean code architecture
- ✅ Responsive UI design
- ✅ Docker containerization
- ✅ Production best practices
- ✅ Memory leak prevention
- ✅ Error handling patterns

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Built with ❤️ using Angular, RxJS, and Docker**
