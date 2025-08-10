import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // '/'
  route("features", "routes/features.tsx"), // '/features'
  route("predictions", "routes/predictions.tsx"),       // '/predictions'
  route("predictions/heatmap", "routes/heatmap.tsx"), // '/predictions/area'
  route("data/list-data", "routes/list-data.tsx"), // '/data/list-data'
  route("data/new-data", "routes/new-data.tsx"),             // '/add-data'
  route("profile-importance", "routes/profile-importance.tsx"), // '/profile-importance'
  route("settings", "routes/settings.tsx"), // '/settings'
] satisfies RouteConfig;