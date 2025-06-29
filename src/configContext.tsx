export interface AppConfig {
  API_BASE_URL: string;
  // Add other config fields as needed
}

let config: AppConfig | null = null;
let loading = true;
let error: Error | null = null;
let promise: Promise<void> | null = null;

export function loadConfig(): Promise<void> {
  if (promise) return promise;

  promise = fetch('/config.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load config: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data: AppConfig) => {
      config = data;
      loading = false;
    })
    .catch((err) => {
      error = err;
      loading = false;
      throw err;
    });

  return promise;
}

export function getConfig(): AppConfig {
  console.log('loading:', loading, 'config:', config);
  if (loading) {
    throw new Error('Config not loaded yet.');
  }
  if (error) {
    throw error;
  }
  if (!config) {
    throw new Error('Config is null.');
  }
  return config;
}
