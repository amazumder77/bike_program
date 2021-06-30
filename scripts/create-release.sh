#!/bin/bash
JIRA_LOGIN=$1
JIRA_TOKEN=$2
JIRA_RELEASE_PROJECT=$3

JIRA_PROJECT_VERSION_URL=https://ventureapp.atlassian.net/rest/api/3/project/"$JIRA_RELEASE_PROJECT"/version/

LATEST_JIRA_RELEASE=$(
  curl \
  -s \
  -u "$JIRA_LOGIN":"$JIRA_TOKEN" \
  -X GET \
  -d 'status=released' \
  -d 'orderBy=-releaseDate' \
  -d 'query=-helix' \
  -G "$JIRA_PROJECT_VERSION_URL"
)

LAST_RELEASED_COMMIT_HASH=$(
  echo "$LATEST_JIRA_RELEASE" | jq -r '.values | sort_by(.id) | .[-1] | .description'
)

ISSUES=$(
  git log "$LAST_RELEASED_COMMIT_HASH"..HEAD | grep -Eo '([A-Z]{3,}-)([0-9]+)' | uniq
)

JIRA_RELEASE_DESCRIPTION=$(git rev-parse HEAD)
JIRA_RELEASE_DATE=$(date +%d/%b/%y)
JIRA_RELEASE_DATETIME=$(date +%d/%b/%y-%H:%M)
JIRA_APPLICATION_NAME="helix"
JIRA_RELEASE_NAME="$JIRA_RELEASE_DATETIME"-"$JIRA_APPLICATION_NAME"

RELEASE_CREATE_INFO=$(
  jq -n \
    --arg descr "$JIRA_RELEASE_DESCRIPTION" \
    --arg name "$JIRA_RELEASE_NAME" \
    --arg date "$JIRA_RELEASE_DATE" \
    --arg proj "$JIRA_RELEASE_PROJECT" \
    '{description:$descr,name:$name,userReleaseDate:$date,project:$proj,archived:false,released:true}'
)

ISSUE_UPDATE_INFO=$(
  jq -n \
    --arg name "$JIRA_RELEASE_NAME" \
    '{update:{fixVersions:[{add:{name:$name}}]}}'
)

curl \
  -i \
  -u "$JIRA_LOGIN":"$JIRA_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST \
  --data "$RELEASE_CREATE_INFO" \
  https://ventureapp.atlassian.net/rest/api/latest/version

for issue in ${ISSUES[*]}; do
  curl \
    -D- \
    -u "$JIRA_LOGIN":"$JIRA_TOKEN" \
    -X PUT \
    --data "$ISSUE_UPDATE_INFO" \
    -H "Content-Type: application/json" \
    https://ventureapp.atlassian.net/rest/api/latest/issue/"$issue"
done
