export default ({ env }) => ({
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 12,
      amountLimit: 100,
      apolloServer: {
        tracing: true,
        introspection: true,
      },
    },
  },
});
