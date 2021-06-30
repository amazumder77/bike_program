#!/usr/bin/env bash
# shellcheck disable=SC2154,SC1090

spacename=$("$(dirname "$0")"/devspace-spacename.sh)

. "$(dirname "$0")/devspace-params.sh"

# create the namespace if it does exist
until devspace list spaces | grep "$spacename" | grep "$cluster " > /dev/null
do
  devspace create space "$spacename" --account "$account" --cluster "$cluster"
done

context=loft_"$spacename"_"$cluster"

# purge the environment
devspace purge -p "$profile" -n "$spacename" --kube-context "$context" --silent

# start environment
devspace deploy -p "$profile" -n "$spacename" --kube-context "$context" --no-warn --wait --timeout 300
