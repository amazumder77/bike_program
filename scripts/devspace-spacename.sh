#!/usr/bin/env bash

username=$(git config --get user.name | tr '[:upper:] ' '[:lower:]-')
projectname=$(basename -s .git "$(git config --get remote.origin.url)")
spacename="${username}-${projectname}"

echo "${spacename}" | cut -c -55
