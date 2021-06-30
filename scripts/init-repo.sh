#!/usr/bin/env bash
# shellcheck disable=SC2001

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

qualified_name=$1
repo_name="$(basename "$(pwd)")"
# shellcheck disable=SC2001
title_case_name=$(echo "$qualified_name" | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
pascal_case_name=$(echo "$title_case_name" | sed 's/ //g')
camel_case_name="$(tr '[:upper:]' '[:lower:]' <<< "${pascal_case_name:0:1}")${pascal_case_name:1}"
kebab_case_name=$(echo "$camel_case_name" | sed 's/\(.\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')
snake_case_name=$(echo "$camel_case_name" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')
snake_case_upper=$(echo "$snake_case_name" | tr '[:lower]' '[:upper]')

# echo "qualified name:" $qualified_name
# echo "title case: " $title_case_name
# echo "pascal case: " $pascal_case_name
# echo "camel case: " $camel_case_name
# echo "kebab case: " $kebab_case_name
# echo "snake case: " $snake_case_name
# echo "snake case upper: " $snake_case_upper
# exit

mv helm/hello-nest helm/"$kebab_case_name"
perl -pi -e 's/hello_nest/'"$repo_name"'/g' .circleci/config.yml helm/"$kebab_case_name"/Chart.yaml
perl -pi -e 's/hello-nest/'"$kebab_case_name"'/g' \
 devspace.yaml package.json .circleci/config.yml .devcontainer/* \
 docs/* helm/"$kebab_case_name"/Chart.yaml helm/"$kebab_case_name"/values.yaml \
 scripts/devspace-deploy.sh scripts/devspace-params.sh \
 scripts/devspace-start.sh scripts/devspace-stop.sh \
 scripts/devspace-restart.sh scripts/devspace-spacename.sh
perl -pi -e 's/Hello Nest/'"$title_case_name"'/g' README.md docs/devspace.md src/main.ts
perl -pi -e 's/hello nest/'"$qualified_name"'/g' README.md docs/devspace.md
perl -pi -e 's/helloNest/'"$camel_case_name"'/g' helm/"$kebab_case_name"/templates/*
perl -pi -e 's/HELLO_NEST/'"$snake_case_upper"'/g' scripts/start-local.sh
