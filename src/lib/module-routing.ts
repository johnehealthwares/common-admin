import { ModuleId, modules } from '@/features/shared/module-data';

export type RouteModuleMapping = Record<string, ModuleId[]>;

const routeModuleMap: RouteModuleMapping = {};

for (const mod of modules) {
  for (const route of mod.routes) {
    routeModuleMap[route] = [mod.id, 'admin'];
  }
}

routeModuleMap['/'] = ['rxsoft', 'conversation', 'communication', 'admin'];
routeModuleMap['/dashboard'] = ['rxsoft', 'conversation', 'communication', 'admin'];

export { routeModuleMap };

export function isRouteAllowedForModule(pathname: string, moduleId: ModuleId): boolean {
  if (moduleId === 'admin') {
    return true;
  }

  if (routeModuleMap[pathname]) {
    return routeModuleMap[pathname].includes(moduleId);
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length > 1) {
    const parentRoute = '/' + pathSegments[0];
    if (routeModuleMap[parentRoute]) {
      return routeModuleMap[parentRoute].includes(moduleId);
    }
  }

  return true;
}

export function getModuleDashboard(moduleId: ModuleId): string {
  const mod = modules.find((m) => m.id === moduleId);
  return mod?.root ?? '/';
}
