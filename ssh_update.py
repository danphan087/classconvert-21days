import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.97.127.198', port=2018, username='root', password='nuEURF9rGH')
commands = [
    "cd /opt/goclaw",
    "sed -i 's/nextlevelbuilder\/goclaw:latest/nextlevelbuilder\/goclaw:v3.11.3/' docker-compose.yml",
    "docker compose pull",
    "docker compose up -d"
]
for cmd in commands:
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode())
    print(stderr.read().decode())
ssh.close()
