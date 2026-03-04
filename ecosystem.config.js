module.exports = {

  apps: [

    {
      name: "nextjs-app",
      script: "npm",
      args: "start"
    },

    {
      name: "order-worker",
      script: "./workers/orderWorker.js"
    }

  ]

}