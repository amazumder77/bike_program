# Hello Nest Service

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Setup Environment

Before you can begin you will need to set a few things up

```bash
# setting up npm authentication
$ npm config set always-auth true
# log into github pacakges
$ npm login --registry=https://npm.pkg.github.com --userconfig ./.npmrc
> Username: GITHUB_USERNAME
> Password: GITHUB_PERSONAL_TOKEN
# log into artifactory
$ npm login --registry=https://hqo.jfrog.io/artifactory/api/npm/npm/ --userconfig ./.npmrc
> Username: FIRST_NAME.LAST_NAME
> Password: API_KEY from artifactory
> Email: PUBLIC_EMAIL_ADDRESS

# install devspace tools
$ yarn devspace:install
```

## Configure EnvKey

NOTE: EnvKey will be replaced in short order by Vault, but until then...

Firstly, an EnvKey admin will need to create an EnvKey app for your project and grant you access to it. You can place any environment variables here and they will be read into the environment during app startup.

You will need to grab the development envKey token from: https://github.com/HqOapp/[YOUR_SERVICE_NAME]/blob/master/helm/hello-nest/values.yaml#L5

Once you have the envkey token, place it in a file titled `.env` at the root level of the project directory.

Note: This is temporary until Vault is ready to use

## Running the app

While in VScode shell

```bash
# start backend
$ yarn devspace:start

# development
$ yarn run start
# or
$ yarn start:local

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

# setup your .env file
$ yarn genenv:local
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

In order to configure your new microservice to be ready for deployment, there are a few things that you must do. These will be outlined here:

## 1. Init new repo

Rename all relevant "hello nest" files, folders, and values to your new service's name by running the following init-repo script:

```bash
# Run script that replaces all containing hello-nest with qualified name
# Note: Don't use specific characters like: ', `, #, $, !, ?, etc.
# Example:
$ yarn init-repo "MiniApp Proxy"
```

## 2. Setup CircleCI

Once you've initialized your repository and pushed your changes to the remote origin, you'll need to do a small amount of configuration in CircleCI itself to enable the project.
Navigate to [CircleCI](https://app.circleci.com/projects/project-dashboard/github/HqOapp/)'s Project page and find your new project in the list. Press the "Set up Project" button and follow the prompts. You don't need to configure a config.yaml file in the UI because your git repository already contains one, so just begin building your project.

You will, however, need to add one environment variable to your project.

- Naviate to the Project page, and press Project Settings in the top right.
- Navigate to "Environment Variables"
- Add a new variable titled: `CC_TEST_REPORTER_ID`
- The value will be the test reporter ID from CodeClimate, which you can retrieve in the next step...

## 3. Configure CodeClimate

Navigate to the [CodeClimate](https://codeclimate.com/accounts/5df7e74f36bb0f009b0046dc/add_vcs_repo/new) dashboard to add a new repository and find yours in the list. You'll need access to CodeClimate, of course, so if you don't have it reach out to an administrator.

Once there, you can enable Test Coverage and grab the TEST REPORTER ID value. Use this value for the CircleCI environment variable in the previous step (`CC_TEST_REPORTER_ID`).

## 4. Add jobs/values/charts to the `infrastructure` repository

In the [Infrastructure Repo](https://github.com/HqOapp/infrastructure), you will need to add some jobs and values for each environment to configure deployments.

- /jobs

  - DeployToLoad
  - DeployToPreProd
  - DeployToProd

- /values
  - load.groovy
  - pre-production.groovy
  - production.groovy
  - staging.groovy

In /infrastructure/deployment/SetOfCharts, the charts for the new microservice should be added.

## 5. Setup new repo to be able to pull updates from template

If changes or updates are made to this template repository, you may want to pull them into your new repository. To do this, follow these steps:

```bash
# First, add the template repo as a remote
git remote add template https://github.com/HqOapp/hello_nest.git

# Then, run git fetch to grab all updates
git fetch --all

# Next, merge a template branch into your current branch
git merge template/[branch to merge] --allow-unrelated-histories
```

## 6. Knex migration

### Generate migration and seed files.

```bash
# Generate migration file
$ yarn migrate:make FILE_NAME

# Generate seed file
$ yarn seed:make FILE_NAME
```

### Rollback

```bash
# Rollback migration
$ yarn migrate:rollback
```

### Run migration and seed

```bash
# Apply latest migrations
$ yarn migrate

# Apply seed files
$ yarn seed
```

### Different Environments

```bash
# Run migration with db info from env.test.ci file
$ yarn test:db:migrate:ci

# Run migration with db info from env.test file
$ yarn test:db:migrate

# Apply seed files with db info from env.test.ci file
$ yarn test:db:seed:ci

# Apply seed files with db info from env.test file
$ yarn test:db:seed

# Run migration and applying seed files with db info from env.test.ci file
$ yarn test:db:prepare:ci
```

## i18n and i10n

Support has been implemented by Node-config library.

- Default/env values are added to the 'src/config/data/default.ts' file and can be overridden for each environment. To do this, add values to the appropriate environment files (development.ts, load.ts, pre-prod.ts, production.ts, testing.ts).

- Languages values are located in default.json files in the appropriate subfolders (languages/de_DE, languages/en_CA, ...).
  These values can be overridden for each environment. There is an example of implementation in languages/en_US.

## Pre-commit

This repo uses [pre-commit](https://pre-commit.com) for all it's githook needs. You will first need to install it:

using homebrew:

```bash
brew install pre-commit
```

## Intalling pre-commit hooks

you will need to install the hooks by the following command

```bash
pre-commit install --install-hooks --allow-missing-config -t pre-commit -t prepare-commit-msg
```
