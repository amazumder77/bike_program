#!/usr/bin/env bash

spacename=$("$(dirname "$0")"/devspace-spacename.sh)

while getopts :c: flag; do
    case $flag in
        c) cluster=$OPTARG;;
        ?) exit 1;
    esac
done

if [ -z "$cluster" ]; then
  echo "You should provide cluster via -c flag"
  exit 1;
fi

# removed namespace if it exists
if devspace list spaces | grep "$spacename" | grep "$cluster " > /dev/null; then
  devspace delete space "$spacename" --cluster "$cluster" --wait
fi
