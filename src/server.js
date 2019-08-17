import setupApp from './app';

const port = process.env.PORT || 3000;

setupApp()
  .then(app =>
    app.listen(port, () => console.log(`App running on port ${port}!`))
  )
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
