import git
import yaml
import os
import tomlkit
import argparse
import dotenv

# Constants
FOLDER_NAME = 'Bloguer'

account = None

def clone_project():
    # Clone bloguer repo
    os.system(f'rm -rf {FOLDER_NAME}')
    git.Repo.clone_from('https://github.com/RutaTang/Bloguer.git', FOLDER_NAME)


def deploy_backend():
    print("===Deploying backend...===")
    # Get private_key, public_key 
    global account
    if account is None:
        account = input("Please input your account: ")
    public_key = input("Please input your public_key: ")
    private_key = input("Please input your private_key: ")
    # Change private_key, publick_key, account in '{folder}/move/.aptos/config.yaml'
    data = None
    with open(f'{FOLDER_NAME}/move/.aptos/config.yaml', 'r',encoding='utf-8') as f:
        config = f.read()
        data = yaml.load(config,yaml.BaseLoader)
        default = data['profiles']['default']
        default['private_key'] = private_key
        default['public_key'] = public_key
        default['account'] = account

    with open(f'{FOLDER_NAME}/move/.aptos/config.yaml', 'w',encoding='utf-8') as f:
        yaml.dump(data,f)

    # Change bloguer_address in '{folder}/move/Move.toml'
    data = None
    with open(f'{FOLDER_NAME}/move/Move.toml', 'r',encoding='utf-8') as f:
        config = f.read()
        data = tomlkit.parse(config)
        data['addresses']['bloguer_address'] = account

    with open(f'{FOLDER_NAME}/move/Move.toml', 'w',encoding='utf-8') as f:
        f.write(tomlkit.dumps(data))
        
    # Compile and deploy Move module
    os.system(f'cd {FOLDER_NAME}/move && aptos move publish --bytecode-version 6')
    print("===Successfully deploy backend...===")


def deploy_frontend():
    print("===Deploying frontend...===")
    # remove dist folder in current folder 
    os.system('rm -rf dist')

    dotenv_path = f'{FOLDER_NAME}/client/.env'

    # Aptos info
    global account
    if account is None:
        account = input("Please input your account: ")
    dotenv.set_key(dotenv_path, "VITE_APTOS_MODULE_ADDRESS", account)

    # Basic user info
    author_name = input("Please input your author name: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_NAME" , author_name)

    author_introduction = input("Please input your author introduction: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_INTRODUCTION" , author_introduction)
    author_avatar = input("Please input your author avatar url: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_AVATAR" , author_avatar)

    # Contact info
    contact_email = input("Please input your email: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_EMAIL" , contact_email)
    contact_github = input("Please input your github url: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_GITHUB" , contact_github)
    contact_twitter = input("Please input your twitter url: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_TWITTER" , contact_twitter)
    contact_linkedin = input("Please input your linkedin url: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_LINKEDIN" , contact_linkedin)
    contact_youtube = input("Please input your youtube url: ")
    dotenv.set_key(dotenv_path, "VITE_AUTHOR_YOUTUBE" , contact_youtube)

    # build 
    os.system(f'cd {FOLDER_NAME}/client && npm install && npm run build')

    # copy build to current folder
    os.system(f'cp -r {FOLDER_NAME}/client/dist .')

    print("===Successfully deploy frontend...===")



if __name__ == '__main__':
    # Get deploy mode
    deploy_mode = input("Please choose to deploy 'backend', 'frontend', or 'all': ") # 'backend' or 'frontend' or 'all'
    if deploy_mode not in ['backend', 'frontend', 'all']:
        raise ValueError('Please choose to deploy "backend", "frontend", or "all"')

    print("Cloning project...")
    clone_project()
    print("Successfully clone project...")

    if deploy_mode == 'backend':
        deploy_backend()

    if deploy_mode == 'frontend':
        deploy_frontend()
        
    if deploy_mode == 'all':
        deploy_backend()
        deploy_frontend()

