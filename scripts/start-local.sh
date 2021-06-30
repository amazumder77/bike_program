#!/usr/bin/env bash

DIRNAME=$(dirname "$0")

while (( "$#" )); do
  case "$1" in
    -h|--help)
      echo "-h | --help see this help and exit"
      echo "-sr | --silence-req to run without request logger"
      echo "-so | --silence-out to run without outbound request logger"
      echo "'yarn start:local:silent' to run without both logers (with two previous flags enabled)"
      exit 0
      ;;
    -sr|--silence-req)
      export HELLO_NEST_SILENCE_REQUEST_LOGS=true
      shift
      ;;
    -so|--silence-out)
      export HELLO_NEST_SILENCE_OUTBOUND_LOGS=true
      shift
      ;;
    -*) # unsupported flags
      echo "Error: Unsupported flag $1, use -h to see usage" >&2
      exit 1
      ;;
  esac
done

# Exports for sub processes
export NODE_ENV

# If NODE_ENV is not set explicitly use development environment as the default one
if [[ -z $NODE_ENV ]]; then
  NODE_ENV=development
fi

# Fallback to the testing environment if there is no .env file for the selected environment
# This is important on Docker and CI as they have only testing environment available
if [[ ! -f "$DIRNAME/../$NODE_ENV.env" ]]; then
  echo "Warning: there is no '$NODE_ENV.env' file, falling back to testing environment" 1>&2
  NODE_ENV=testing
fi

# Use Istanbul if code coverage collecting is requested
if [[ $COLLECT_COVERAGE == true ]]; then
  COVERAGE_MIDDLEWARE="nyc --nycrc-path nyc.config.functional.js"
  if [[ $NODE_ENV != testing ]]; then
    echo "Warning: code coverage is only available for testing environment" 1>&2
  fi
else
  COVERAGE_MIDDLEWARE=""
fi

if [[ $NODE_ENV != testing ]]; then
  # Normally use ts-node-dev as it supports hot-reloading
  yarn run ts-node-dev --inspect --debug --no-deps --respawn --files src/main.ts
else
  # Otherwise, use ts-node to reduce resources footprint
  yarn run "$COVERAGE_MIDDLEWARE" ts-node --transpile-only src/main.ts
fi
