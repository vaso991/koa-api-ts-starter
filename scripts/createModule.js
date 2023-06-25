const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

const toPascalCase = (str) =>
  (str.match(/[a-zA-Z0-9]+/g) || []).map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('');

const moduleName = toPascalCase(args[0]);
const modulesPath = path.join(__dirname, '..', 'src', 'modules');
const modulePath = path.join(modulesPath, moduleName);

if (fs.existsSync(modulePath)) {
  throw new Error(`Directory ${modulePath} exitst`);
}

fs.mkdirSync(modulePath);

const ROUTER_TEMPLATE = `import Router from 'koa-router';
import { %CONTROLLER_NAME% } from './%CONTROLLER_FILENAME%';
import { ZodValidator } from 'koa-router-zod-swagger';
import { z } from 'zod';

const router = new Router({
  prefix: '/%MODULE_NAME%',
});

export { router as %ROUTER_NAME% };
`
  .replace('%CONTROLLER_NAME%', `${moduleName}Controller`)
  .replace('%CONTROLLER_FILENAME%', `${moduleName}.Controller`)
  .replace('%MODULE_NAME%', moduleName)
  .replace('%ROUTER_NAME%', `${moduleName}Router`);

const CONTROLLER_TEMPLATE = `import { AppContext } from '@/utils/App.Context';
import { %SERVICE_NAME% } from './%SERVICE_FILENAME%';

export class %CONTROLLER_NAME% {
  
}
`
  .replace('%SERVICE_NAME%', `${moduleName}Service`)
  .replace('%SERVICE_FILENAME%', `${moduleName}.Service`)
  .replace('%CONTROLLER_NAME%', `${moduleName}Controller`);

const SERVICE_TEMPLATE = `export class %SERVICE_NAME% {
  
}
`.replace('%SERVICE_NAME%', `${moduleName}Service`);

fs.writeFileSync(path.join(modulePath, `${moduleName}.Router.ts`), ROUTER_TEMPLATE);
fs.writeFileSync(path.join(modulePath, `${moduleName}.Controller.ts`), CONTROLLER_TEMPLATE);
fs.writeFileSync(path.join(modulePath, `${moduleName}.Service.ts`), SERVICE_TEMPLATE);

console.log(`Module ${moduleName} created successfully`);
