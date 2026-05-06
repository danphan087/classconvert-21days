import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.97.127.198', port=2018, username='root', password='nuEURF9rGH')
cmd = "cd /opt/goclaw && docker compose logs --tail 20 goclaw"
stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
ssh.close()
