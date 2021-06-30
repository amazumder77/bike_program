# Releasing Builds To Production
## Create A Pre-Production Account
    1. Install the HqO app on your phone and open it.
    2. Change to Pre-Production.
        A. Type !FARM in the Email box.
        B. Select "Temp Pre-Prod" in the drop down list.
        C. Click "Select".
    3. Create an account.
## Get Changes Into The Pipeline
    1. Merge the latest changes from Master into your feature branch. Then push
       the updates to Github. Verify you do not have branch conflicts. Resolve
       them if you do.
    2. Set your Jira task's status to "Tech Review".
    3. Monitor the build status and wait for all the gated changes to pass. It
       may take a few tries to get all the checks to pass.
    4. Once all checks pass, create a pull request and assign at reviewers and
       wait for the pull request to get approved.
    5. When all the gated checks pass for the pull request and at least two
       reviewers sign off, click "Squash and Merge" at the bottom of the pull request.
    6. Monitor the #production-deploy in Slack.  Wait for your build to appear.
       You can match your build the message in #production-deploy using the commit hash
       from your branch. When the status says your build was pushed to Pre-Prodiction,
       login to the HqO app on your phone in #production-deploy. Verify you are in
       Pre-Production inside the HqO app.
    7. Test your changes.
    8. Once you verify Pre-Production works, click the "Approve" button next to
       "Service production delivery is wating for approval". Take extra care to
       make sure you approve your build and not someone else's.
