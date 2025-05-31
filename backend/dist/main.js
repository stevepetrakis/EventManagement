"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    console.log('Starting NestJS application...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const port = 5000;
    await app.listen(port);
    console.log(`Server is running on: http://localhost:${port}`);
    console.log(`Test endpoint: http://localhost:${port}/test`);
}
bootstrap().catch(err => {
    console.error('Failed to start server:', err);
});
//# sourceMappingURL=main.js.map