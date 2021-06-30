#!/usr/bin/env bash
# shellcheck disable=SC2034

while getopts :c:a:p: flag; do
    case $flag in
        a) account=$OPTARG;;
        c) cluster=$OPTARG;;
        p) profile=$OPTARG;;
        ?) exit 1;
    esac
done

if [ -z "$cluster" ] || [ -z "$account" ]; then
  echo "You should provide cluster '-c' and account '-a' flags"
  exit 1;
fi
