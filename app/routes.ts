import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/traces", "routes/api.traces.ts"),
] satisfies RouteConfig;
