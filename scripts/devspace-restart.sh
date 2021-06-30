#!/usr/bin/env bash
# shellcheck disable=SC1090,SC2154

. "$(dirname "$0")/devspace-params.sh"

sh "$(dirname "$0")"/devspace-stop.sh -c "$cluster"
sh "$(dirname "$0")"/devspace-start.sh -p "$profile" -c "$cluster" -a "$account"
