import os
import requests

LATEST_COMMIT_FILE = '.latest_commit'

GITHUB_API = 'https://api.github.com/repos/chelavik/waterdroplet_backend/commits?per_page=1'
headers = {
    'Authorization': 'token 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',
    'User-Agent': 'chelavik'}


def check_for_updates():
    response = requests.get(GITHUB_API, headers=headers)
    print(response)
    if response.status_code == 200:
        latest_commit = response.json()[0]['sha']
        if not os.path.exists(LATEST_COMMIT_FILE):
            with open(LATEST_COMMIT_FILE, 'w') as file:
                file.write('')
        with open('.latest_commit', 'r+') as file:
            previous_commit = file.read().strip()
            if latest_commit != previous_commit:
                print('New commit found! Updating local repository...')
                os.system('systemctl stop Backend')
                os.system('git fetch https://chelavik:github_pat_11AZPLWXQ0nzEcIR60nKkC_eGmakwvzMGdv1YzeyOnFlZly6NNzDoP'
                          'gLWae7PWEOjw4F4LJ5KU1spTmG3B@github.com/chelavik/waterdroplet_backend.git master:master '
                          '--update-head-ok')
                os.system('git reset --hard master')
                os.system('git pull https://chelavik:github_pat_11AZPLWXQ0nzEcIR60nKkC_eGmakwvzMGdv1YzeyOnFlZly6NNzDoPg'
                          'LWae7PWEOjw4F4LJ5KU1spTmG3B@github.com/chelavik/waterdroplet_backend.git master:master')
                os.system('systemctl start Backend')
                file.seek(0)
                file.write(latest_commit)
                file.truncate()
                print('Update completed successfully.')
            else:
                print('All is up to date.')
    else:
        print('Failed to fetch data from GitHub API.')


check_for_updates()
