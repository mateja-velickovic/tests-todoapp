# Backend Usage Guide

Go to backend folder:

```sh
npm run start
```

## DB connection

The backend use MongoDB database, if in *DEVELOPMENT* mode it will use an in memory MongoDB otherwise 
in *PRODUCTION* mode need to set a environment variable `DB_URL` to connect to a MongoDB server, 
example with Atlas cloud DB:

```sh
DB_URL="mongodb+srv://<user>:<pwd>@<db-url>/?retryWrites=true&w=majority&appName=<cluster-name>"
```

If you use an *.env* file in the `backend` folder then run the backend with:

```sh
npm run start:env
```