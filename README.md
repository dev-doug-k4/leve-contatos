## Leve Contatos

Check out the [live-preview](https://main.dcj0rgv0wuk5j.amplifyapp.com/).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the packages, then run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.


## Test with Cypress

To test the application run:

```bash
npm run cypress
# or
yarn cypress
```

You can edit the login page tests by mofifying `cypress/intergation/login.spec.js`. 

## Connect your cloud backend to local frontend

To connect to this backend, install the Amplify CLI and run:

```bash
amplify pull --appId XXX --envName
```

## Deploy with AWS Amplify CI/CD tool

Simply `git push` your changes on main branch  and watch a build trigger in the Amplify console. 
