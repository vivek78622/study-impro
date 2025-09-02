@echo off
echo Deploying Firestore indexes...
firebase login
firebase deploy --only firestore:indexes --project study-improve
pause