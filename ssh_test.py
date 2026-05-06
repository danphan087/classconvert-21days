import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.97.127.198', port=2018, username='root', password='nuEURF9rGH')
stdin, stdout, stderr = ssh.exec_command('ls /opt/goclaw && cat /opt/goclaw/docker-compose.yml')
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
