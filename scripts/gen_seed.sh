#!/bin/bash
# Creates a knex seed file with the timestamp prepended to the name
if [ -z "$1" ]
then
  echo "ERROR: Seed filename cannot be empty!."
else
  knex seed:make -x ts "$(date +"%Y%m%d%H%M%S")"_"$1"
fi
