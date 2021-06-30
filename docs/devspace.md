# DevSpace

DevSpace is a developer tool that offloads most of the docker stack onto a cloud service. At the moment (2020.06.15) the following containers run in DevSpace.

- hello-nest-redis
- An npm token (personal access token issued through GitHub > Settings > Developer Settings > Personal access tokens > Generate new token)

In the future it is possible Hello Nest will also offload.

# Setup

Prerequisites.
- Hello Nest must be setup.
- Infra (Optional but has a good view into Devspace related messaging)

1. Talk to TechOps and get an invitation to DevSpace. Use the invite to create an account on DevSpace.cloud. Signing in using your Github account is a frictionless way to do this. Create a passphrase and      add it to your account.
2. Install DevSpace

	```Brew install DevSpace```

3. **Note: Skip this step if service is already setup with an access token**. Add you npm token to ~/.npmrc

	```//npm.pkg.github.com/:_authToken=<Personal access token>```

4. Login to DevSpace. This should cause the web browser to redirect to Devspace.cloud where you can login using your Github account

	```DevSpace login```

5. Create a space. This should create a Devspace context where you will deploy the docker stack. **Note: if asked to enter your key, enter the passphrase you added to your DevSpace account.**

	```Devspace create space <my_space_name> --cluster hqo:development```

6. Remap the local ports to the cluster location

	```devspace -p local dev```

8. Start service

	```yarn start:dev```

   [Devspace Open](https://devspace.sh/cli/docs/configuration/development/open-links)

For more information visit the [Devspace Documentation](https://devspace.cloud/docs/cli/getting-started/installation)

# Troubleshooting

- Infra is a good for troubleshooting
- Use the following command to purge the docker stack occasionally. Otherwise it becomes cluttered.

	```devspace purge -p local```

- If you see &quot;error: ENVKEY invalid&quot; when mapping ports and starting the stack, try the following command. Then retry.

	```Devspace reset vars```

- If Hello Nest complains about missing npm package references, issue the following command. Then try starting Hello Nest again.

	```yarn install```

**Note: you may need to log npm into Github.**

	npm login --registry=https://npm.pcg.github.com

- If you receive an xcode related error when running ```yarn install``` issue the following commands. Then try again.

	`sudo rm -rf /Library/Developer/CommandLineTools`

	```xcode-select --install```

- You can remove your space with the following command.

	`devspace remove space <my_space_name>`
