const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

const moduleName = args[0];
const modulesPath = path.join(__dirname, '..', 'src', 'modules');
const modulePath = path.join(modulesPath, moduleName);

if (fs.existsSync(modulePath)) {
  throw new Error(`Directory ${modulePath} exitst`);
}

const capitalize = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
fs.mkdirSync(modulePath);

const moduleCapitalizedName = capitalize(moduleName);

const ROUTER_TEMPLATE = `import Router from 'koa-router';
import { %CONTROLLER_NAME% } from './%CONTROLLER_FILENAME%';
import { ZodValidator } from 'koa-router-zod-swagger';
import { z } from 'zod';

const router = new Router({
  prefix: '/%MODULE_NAME%',
});

export { router as %ROUTER_NAME% };
`
  .replace('%CONTROLLER_NAME%', `${moduleCapitalizedName}Controller`)
  .replace('%CONTROLLER_FILENAME%', `${moduleCapitalizedName}.Controller`)
  .replace('%MODULE_NAME%', moduleName)
  .replace('%ROUTER_NAME%', `${moduleCapitalizedName}Router`);

const CONTROLLER_TEMPLATE = `import { AppContext } from '@/utils/App.Context';
import { %SERVICE_NAME% } from './%SERVICE_FILENAME%';

export class %CONTROLLER_NAME% {
  
}
`
  .replace('%SERVICE_NAME%', `${moduleCapitalizedName}Service`)
  .replace('%SERVICE_FILENAME%', `${moduleCapitalizedName}.Service`)
  .replace('%CONTROLLER_NAME%', `${moduleCapitalizedName}Controller`);

const SERVICE_TEMPLATE = `export class %SERVICE_NAME% {
  
}
`.replace('%SERVICE_NAME%', `${moduleCapitalizedName}Service`);

fs.writeFileSync(path.join(modulePath, `${moduleCapitalizedName}.Router.ts`), ROUTER_TEMPLATE);
fs.writeFileSync(path.join(modulePath, `${moduleCapitalizedName}.Controller.ts`), CONTROLLER_TEMPLATE);
fs.writeFileSync(path.join(modulePath, `${moduleCapitalizedName}.Service.ts`), SERVICE_TEMPLATE);

console.log(`Module ${moduleName} created successfully`);
