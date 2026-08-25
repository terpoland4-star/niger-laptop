module.exports = {
  apps: [
    {
      name: "niger-laptops-api",
      script: "./dist/index.js",
      cwd: "/home/nigerlaptops/niger-laptop",
      interpreter: "node",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
